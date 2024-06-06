import GrindForm from '../components/forms/GrindForm';
import { DEFAULT_GRIND } from '../models/constants/grinds';
import { DEFAULT_STANCE } from '../models/constants/stances';
import { DIRECTIONS } from '../models/constants/flatgroundTricks';
import { getDateString } from '../lib/commonUtils';

export const newGrindObj = {
  name: DEFAULT_GRIND,
  stance: DEFAULT_STANCE,
  direction: DIRECTIONS.frontside,
  landed: true,
  landedAt: getDateString(),
};

export default function NewGrind() {
  return <GrindForm grind={newGrindObj} />;
}
