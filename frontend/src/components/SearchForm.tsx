import { FC, useCallback, useMemo } from 'react';
import Input from './ui/Input';
import Button from './ui/Button';
import RadioGroup from './ui/RadioGroup';
import { SearchType } from '@/services/star-wars';

const searchOptions = [
  { value: 'people', label: 'People' },
  { value: 'movies', label: 'Movies' }
];

interface SearchFormProps {
  query: string;
  setQuery: (value: string) => void;
  onSearch: () => void;
  loading: boolean;
  error: string | null;
  searchType: SearchType;
  setSearchType: (value: SearchType) => void;
}

const SearchForm: FC<SearchFormProps> = ({
  query,
  setQuery,
  onSearch,
  loading,
  error,
  searchType,
  setSearchType
}) => {

  const memoizedPlaceholder = useMemo(() => {
    return searchType === 'people'
      ? 'e.g. Chewbacca, Yoda, Boba Fett'
      : 'e.g. A New Hope, Empire Strikes Back';
  }, [searchType]);

  const handleSearchTypeChange = useCallback(
    (value: string) => {
      setSearchType(value as SearchType);
      setQuery('');
    },
    [setSearchType, setQuery],
  );

  return (
    <div className="w-full bg-white p-5 rounded-lg shadow">
      <h2 className="text-md font-semibold mb-3 text-dark-grey">
        What are you searching for?
      </h2>

      <RadioGroup
        options={searchOptions}
        value={searchType}
        onChange={handleSearchTypeChange}
        name="searchType"
        className="mb-3"
      />

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-3">
          {error}
        </div>
      )}

      <Input
        type="text"
        placeholder={memoizedPlaceholder}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="mb-3"
      />

      <Button
        onClick={onSearch}
        disabled={loading || !query}
        className="mt-3"
      >
        {loading ? 'SEARCHING...' : 'SEARCH'}
      </Button>
    </div>
  );
};

export default SearchForm;
