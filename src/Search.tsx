import {useState} from 'react';
import {useDebouncedCallback} from 'use-debounce';

export function Search({onSearch}: {onSearch: (value: string) => void}) {
  const [searchString, setSearchString] = useState<string>('');

  const debouncedSetSearchString = useDebouncedCallback(onSearch, 500);

  return (
    <div className="bg-gradient-link p-[2px] rounded-lg flex flex-grow-1 flex-shrink-1 ">
      <input
        className="text-background rounded-lg p2 bg-black text-primary flex-grow-1 flex-shrink-1 outline-none focus:bg-white focus:text-background"
        type="text"
        value={searchString}
        onChange={(event) => {
          setSearchString(event.target.value);
          debouncedSetSearchString(event.target.value);
        }}
        placeholder="Search (powered by Lyra)"
      />
    </div>
  );
}
