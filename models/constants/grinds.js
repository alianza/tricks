const GRINDS = {
  fifty_fifty: '50-50',
  five_o: '5-0',
  nose_grind: 'Nose Grind',
  tail_slide: 'Tail Slide',
  nose_slide: 'Nose Slide',
  blunt: 'Blunt',
  nose_blunt: 'Nose Blunt',
  suski: 'Suski',
  salad: 'Salad',
};

const GRINDS_ENUM = Object.values(GRINDS);

const DEFAULT_GRIND = GRINDS.fifty_fifty;

export { GRINDS_ENUM, GRINDS, DEFAULT_GRIND };
export default GRINDS;
