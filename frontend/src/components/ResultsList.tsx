import { FC } from 'react';
import { SearchResult } from '@/services/star-wars';

interface ResultsListProps {
  results: SearchResult[];
  loading: boolean;
}

const ResultsList: FC<ResultsListProps> = ({ results, loading }) => (
  <div className="w-full bg-white p-6 rounded-lg shadow">
    <div className="mb-8">
      <h2 className="text-xl font-bold text-dark-grey mb-4">Results</h2>
      <hr className="border-gray-300 mb-8" />
    </div>

    {loading && (
      <div className="flex justify-center items-center min-h-[300px]">
        <p className="font-semibold text-pinkish-grey">Searching...</p>
      </div>
    )}

    {results.length === 0 && !loading && (
      <div className="flex flex-col justify-center items-center min-h-[300px] text-center">
        <p className="font-semibold text-pinkish-grey">There are zero matches.</p>
        <p className="font-semibold text-pinkish-grey">Use the form to search for People or Movies.</p>
      </div>
    )}

    {results.length > 0 && (
      <ul className="space-y-3">
        {results.map((item) => (
          <li key={item.uid} className="border-b border-gray-200 py-3">
            <span className="text-dark-grey font-medium">{item.name}</span>
          </li>
        ))}
      </ul>
    )}
  </div>
);

export default ResultsList;
