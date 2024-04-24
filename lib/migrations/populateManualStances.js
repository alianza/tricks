import './envSetup.js';
import dbConnect, { dbDisconnect } from '../dbConnect.js';
import Manual from '../../models/Manual.js';

// Set "type": module" in package.json to run this script

const run = async () => {
  await dbConnect();

  const manuals = Manual.find({});
  let count = 0;

  for await (const manual of manuals) {
    await manual.save(); // This will trigger the pre-save hook
    count++;
  }

  await dbDisconnect();

  console.info(`Populated ${count} manual stances`);
};

run()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
