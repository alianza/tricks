import { useEffect, useState } from 'react';
import { formatDate } from '../../lib/commonUtils';

function RenderSafeDate({ date, options = {} }) {
  const formattedDate = formatDate(date, options);
  const [dateToRender, setDateToRender] = useState(formattedDate);

  useEffect(() => {
    setDateToRender(formattedDate);
  }, []);

  if (!dateToRender) return null;

  return <time>{dateToRender}</time>;
}

export default RenderSafeDate;
