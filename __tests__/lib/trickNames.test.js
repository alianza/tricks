import { getFullTrickName } from '../../lib/commonUtils';
import { FLATGROUND_TRICKS, DIRECTIONS } from '../../models/constants/flatgroundTricks';
import STANCES from '../../models/constants/stances';

const {
  ollie,
  shove_it,
  kickflip,
  heelflip,
  varial_kickflip,
  varial_heelflip,
  hardflip,
  inward_heelflip,
  tre_flip,
  lazer_flip,
} = FLATGROUND_TRICKS;
const { regular, fakie, switch: switchStance, nollie } = STANCES;
const { none, frontside, backside } = DIRECTIONS;

describe('Should resolve trick names correctly', () => {
  describe('Flatground Tricks', () => {
    it.each`
      trick                                                                                | expected
      ${{ stance: regular, direction: none, rotation: '0', name: ollie }}                  | ${'Ollie'}
      ${{ stance: switchStance, direction: none, rotation: '0', name: ollie }}             | ${'Switch Ollie'}
      ${{ stance: regular, direction: none, rotation: '0', name: tre_flip }}               | ${'360 Flip'}
      ${{ stance: nollie, direction: none, rotation: '0', name: inward_heelflip }}         | ${'Nollie Inward Heelflip'}
      ${{ stance: regular, direction: none, rotation: '0', name: kickflip }}               | ${'Kickflip'}
      ${{ stance: fakie, direction: none, rotation: '0', name: heelflip }}                 | ${'Fakie Heelflip'}
      ${{ stance: regular, direction: backside, rotation: '360', name: kickflip }}         | ${'Backside 360 Kickflip'}
      ${{ stance: regular, direction: backside, rotation: '180', name: shove_it }}         | ${'Bigspin'}
      ${{ stance: regular, direction: backside, rotation: '180', name: shove_it }}         | ${'Bigspin'}
      ${{ stance: regular, direction: frontside, rotation: '360', name: shove_it }}        | ${'Biggerspin'}
      ${{ stance: regular, direction: backside, rotation: '180', name: varial_kickflip }}  | ${'Bigspin Kickflip'}
      ${{ stance: regular, direction: backside, rotation: '360', name: varial_kickflip }}  | ${'Biggerflip'}
      ${{ stance: regular, direction: frontside, rotation: '180', name: varial_heelflip }} | ${'Bigspin Heelflip'}
      ${{ stance: regular, direction: frontside, rotation: '180', name: varial_heelflip }} | ${'Bigspin Heelflip'}
      ${{ stance: nollie, direction: backside, rotation: '180', name: varial_heelflip }}   | ${'Nollie Bigspin Heelflip'}
      ${{ stance: fakie, direction: backside, rotation: '180', name: varial_kickflip }}    | ${'Fakie Bigspin Kickflip'}
      ${{ stance: nollie, direction: frontside, rotation: '180', name: varial_kickflip }}  | ${'Nollie Bigspin Kickflip'}
    `('should resolve trick name correctly: $expected', ({ trick, expected }) => {
      expect(getFullTrickName(trick)).toBe(expected);
    });
  });
});
