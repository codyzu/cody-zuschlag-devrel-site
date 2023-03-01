import {useState} from 'react';
import {useDebouncedCallback} from 'use-debounce';

export function Search({onSearch}: {onSearch: (value: string) => void}) {
  const [searchString, setSearchString] = useState<string>('');

  const debouncedSetSearchString = useDebouncedCallback(onSearch, 500);

  return (
    <input
      className="text-background rounded-lg p2 bg-black text-primary outline-none flex-grow-1 flex-shrink-1"
      type="text"
      value={searchString}
      onChange={(event) => {
        setSearchString(event.target.value);
        debouncedSetSearchString(event.target.value);
      }}
      placeholder="Search (powered by Lyra)"
    />
  );
}
