import FlatgroundTrick from '../models/FlatgroundTrick.js';
import { setupDb, teardownDb } from '../lib/util.js';

beforeAll(async () => await setupDb());
afterAll(async () => await teardownDb());

describe('insert', () => {
  it('should insert a doc into collection', async () => {
    const trick = await FlatgroundTrick.create({
      name: 'Kickflip',
    });

    const insertedTrick = await FlatgroundTrick.findOne({ _id: trick._id });

    console.log(`insertedTrick`, insertedTrick);
  });
});
