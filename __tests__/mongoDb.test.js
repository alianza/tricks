import { MongoClient } from 'mongodb';
import FlatgroundTrick from '../models/FlatgroundTrick.js';

describe('insert', () => {
  let connection;
  let db;

  beforeAll(async () => {
    connection = await MongoClient.connect(globalThis.__MONGO_URI__, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    db = await connection.db(globalThis.__MONGO_DB_NAME__);
  });

  afterAll(async () => {
    await connection.close();
  });

  it('should insert a doc into collection', async () => {
    const users = db.collection('users');

    const mockUser = { _id: 'some-user-id', name: 'John' };
    await users.insertOne(mockUser);

    const insertedUser = await users.findOne({ _id: 'some-user-id' });
    expect(insertedUser).toEqual(mockUser);
  });
  it('should insert a trick into collection', async () => {
    const tricks = db.collection('flatgroundtricks');

    const flatgroundTrick = new FlatgroundTrick({
      name: 'kickflip',
      preferred_stance: 'regular',
      stance: 'regular',
      direction: 'none',
      rotation: 0,
    });

    await tricks.insertOne(flatgroundTrick);

    await FlatgroundTrick.create({
      name: 'kickflip',
      preferred_stance: 'regular',
      stance: 'regular',
      direction: 'none',
      rotation: 0,
    });

    const insertedTrick = await tricks.findOne({ _id: flatgroundTrick._id });

    console.log(`insertedTrick`, insertedTrick);
  });
});
