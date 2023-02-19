import { capitalize } from '../lib/util';

describe('Capitalization', () => {
  it.each([
    ['kak', 'Kak'],
    ['lea', 'Lea'],
    ['trick', 'Trick'],
  ])('should capitalize %s', function (value, expected) {
    expect(capitalize(value)).toBe(expected);
  });
});
