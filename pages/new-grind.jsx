import GrindForm from '../components/forms/GrindForm';
import { DEFAULT_GRIND } from '../models/constants/grinds';
import { DEFAULT_PREFFERED_STANCE, DEFAULT_STANCE } from '../models/constants/stances';
import { DIRECTIONS } from '../models/constants/flatgroundTricks';
import { getDate } from '../lib/commonUtils';

export const newGrindObj = {
  name: DEFAULT_GRIND,
  preferred_stance: DEFAULT_PREFFERED_STANCE,
  stance: DEFAULT_STANCE,
  direction: DIRECTIONS.frontside,
  landed: true,
  landedAt: getDate(),
};

export default function NewGrind() {
  return <GrindForm grind={newGrindObj} />;
}
