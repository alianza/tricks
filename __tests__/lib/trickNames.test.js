import { getFullTrickName } from '../../lib/commonUtils';

describe('Should resolve trick names correctly', () => {
  describe('Flatground Tricks', () => {
    it.each`
      trick                                                                              | expected
      ${{ stance: 'regular', direction: 'none', rotation: '0', name: 'ollie' }}          | ${'Ollie'}
      ${{ stance: 'switch', direction: 'none', rotation: '0', name: 'ollie' }}           | ${'Switch Ollie'}
      ${{ stance: 'regular', direction: 'none', rotation: '0', name: 'kickflip' }}       | ${'Kickflip'}
      ${{ stance: 'fakie', direction: 'none', rotation: '0', name: 'kickflip' }}         | ${'Fakie Kickflip'}
      ${{ stance: 'regular', direction: 'backside', rotation: '360', name: 'kickflip' }} | ${'Backside 360 Kickflip'}
    `('should resolve trick name correctly: $expected', ({ trick, expected }) => {
      expect(getFullTrickName(trick)).toBe(expected);
    });
  });
});
