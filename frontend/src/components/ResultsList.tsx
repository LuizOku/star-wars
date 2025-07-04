import { FC } from 'react';
import { useRouter } from 'next/navigation';
import { SearchResult } from '@/services/star-wars';
import Button from './ui/Button';

interface ResultsListProps {
  results: SearchResult[];
  loading: boolean;
  searchType: 'people' | 'movies';
}

const ResultsList: FC<ResultsListProps> = ({ results, loading, searchType }) => {
  const router = useRouter();

  const handleSeeDetails = (uid: string) => {
    const basePath = searchType === 'people' ? 'people' : 'movies';
    router.push(`/${basePath}/${uid}`);
  };

  return (
    <div className="w-full bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-bold text-dark-grey mb-4">Results</h2>
      <hr className="border-pinkish-grey mb-2" />

      {loading && (
        <div className="flex justify-center items-center min-h-72">
          <p className="font-semibold text-pinkish-grey">Searching...</p>
        </div>
      )}

      {results.length === 0 && !loading && (
        <div className="flex flex-col justify-center items-center min-h-72 text-center">
          <p className="font-semibold text-pinkish-grey">There are zero matches.</p>
          <p className="font-semibold text-pinkish-grey">Use the form to search for People or Movies.</p>
        </div>
      )}

      {results.length > 0 && !loading && (
        <ul className="space-y-2">
          {results.map((item) => (
            <li key={item.uid} className="flex justify-between items-center border-b border-pinkish-grey py-2">
              <span className="text-dark-grey font-semibold text-lg">{item.name}</span>
              <Button
                onClick={() => handleSeeDetails(item.uid)}
              >
                SEE DETAILS
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ResultsList;
