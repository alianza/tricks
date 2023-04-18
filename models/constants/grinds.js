const GRINDS = {
  fifty_fifty: '50-50',
  five_o: '5-0',
  board_slide: 'Boardslide',
  nose_grind: 'Nose-Grind',
  smith_grind: 'Smith',
  feeble_grind: 'Feeble',
  tail_slide: 'Tail Slide',
  nose_slide: 'Nose Slide',
  blunt_slide: 'Blunt Slide',
  nose_blunt_slide: 'Nose-Blunt Slide',
  crooked_grind: 'Crooked Grind',
  suski: 'Suski',
  salad: 'Salad',
};

const GRINDS_ENUM = Object.values(GRINDS);

const DEFAULT_GRIND = GRINDS.fifty_fifty;

export { GRINDS_ENUM, GRINDS, DEFAULT_GRIND };

export default GRINDS;
