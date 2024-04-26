import { capitalize } from '../../lib/commonUtils';

describe('capitalize', () => {
  it('should be able to capitalize one word', () => {
    expect(capitalize('ollie')).toBe('Ollie');
  });
  it('should be able to capitalize multiple words PascalCase style', () => {
    expect(capitalize('ollie Kickflip treflip', true)).toBe('Ollie Kickflip Treflip');
  });
});
