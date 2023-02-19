import Form from '../components/forms/flatgroundTrick/form';
import FLATGROUND_TRICKS from '../models/constants/flatgroundTricks';

const NewFlatFlatGroundTrick = () => {
  const flatgroundTrickForm = {
    name: FLATGROUND_TRICKS.ollie,
    preferred_stance: 'regular',
    stance: 'regular',
    direction: 'none',
    rotation: 0,
    date: new Date().toISOString().substring(0, 10),
    link: '',
    image_url: '',
  };

  return <Form flatgroundTrickForm={flatgroundTrickForm} />;
};

export default NewFlatFlatGroundTrick;
