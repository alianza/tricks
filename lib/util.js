import mongoose from 'mongoose';
import { nanoid } from 'nanoid';

export default async function findAndSerializeDoc(model, operation, query, options = {}) {
  const result = await operation.bind(model)(query, options).lean();
  return JSON.parse(JSON.stringify(result));
}

export const capitalize = (string) => string.charAt(0).toUpperCase() + string.slice(1);

/**
 * Get the name of a variable
 * @param varObj
 * @returns {string}
 */
export const VN = (varObj) => Object.keys(varObj)[0];

export const setupDb = async (databaseName) => {
  if (databaseName === undefined) {
    databaseName = nanoid();
  }

  const mongoUrl = `${globalThis.__MONGO_URI__}/${databaseName}`;

  try {
    return await mongoose.connect(mongoUrl, {});
  } catch (e) {
    console.error(`Failed to connect to mongodb at ${mongoUrl}: `, e);
    // exit test runner process
    process.exit(1);
  }
};

export const teardownDb = async () => {
  await mongoose.connection.close();
};
