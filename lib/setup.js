import { GenericContainer, Wait } from 'testcontainers';

async function startMongoServer() {
  const defaultMongoPort = 27017;

  const container = await new GenericContainer('mongo:5')
    .withDefaultLogDriver()
    .withExposedPorts(defaultMongoPort)
    .withReuse()
    .withWaitStrategy(Wait.forLogMessage('done building'))
    .start();

  process.env.__API__MONGO_URL__ = `mongodb://${container.getHost()}:${container.getMappedPort(defaultMongoPort)}`;

  // store the mongo container instance so that we can tear it down properly in the globalTeardown
  globalThis.__API_MONGODB_CONTAINER__ = container;
}

export default async function (_globalConfig, _projectConfig) {
  await startMongoServer();
}
