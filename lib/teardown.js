// https://jestjs.io/docs/configuration#globalteardown-string
export default async function (_globalConfig, _projectConfig) {
  await globalThis.__API_MONGODB_CONTAINER__.stop();
}
