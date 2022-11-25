export default async function findAndSerializeMongoDoc(model, operation, query, options = {}) {
  const result = await operation.bind(model)(query, options).lean();
  return JSON.parse(JSON.stringify(result));
}
