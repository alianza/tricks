import { useState } from 'react';
import { useAsyncEffect } from '../../lib/clientUtils';
import { apiCall } from '../../lib/commonUtils';
import { toast } from 'react-toastify';
import Loader from '../common/loader/loader';

export default function Stats({ statsDefinition, title, description }) {
  const [stats, setStats] = useState(Object.entries(statsDefinition).map(([label, { value }]) => [label, value]));
  const [isLoading, setIsLoading] = useState(true);

  useAsyncEffect(async () => {
    try {
      const response = await Promise.all(
        Object.values(statsDefinition).map(({ endpoint }) => apiCall(`stats/${endpoint}`, { method: 'GET' }))
      );

      setStats(Object.entries(statsDefinition).map(([label], index) => [label, response[index].data.count]));
    } catch (error) {
      toast.error(`Failed to fetch stats: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  }, []);

  if (isLoading) return <Loader className="mx-auto my-16"></Loader>;

  return (
    <section className="mb-8 rounded-lg bg-neutral-50 p-8 shadow-lg dark:bg-neutral-800">
      <h1 className="mb-4 text-4xl font-bold">{title}</h1>
      <p className="my-4">{description}</p>
      <div className="grid grid-cols-1 gap-8 rounded-lg bg-neutral-200 px-4 py-6 dark:bg-neutral-700 sm:grid-cols-2">
        {stats.map(([key, value]) => (
          <div key={key} className="flex flex-col gap-2 sm:last:odd:col-span-2">
            <h2 className="text-center text-2xl font-bold">{key}</h2>
            <p className="text-center text-4xl font-bold">{value}</p>
          </div>
        ))}
      </div>
    </section>
  );
}