import { useEffect, useState } from 'react';
import { formatDate } from '../../lib/commonUtils';

function RenderSafeDate({ date, options = {} }) {
  const [dateToRender, setDateToRender] = useState(null);

  useEffect(() => {
    setDateToRender(formatDate(date, options));
  }, []);

  if (!dateToRender) return null;

  return <time>{dateToRender}</time>;
}

export default RenderSafeDate;
