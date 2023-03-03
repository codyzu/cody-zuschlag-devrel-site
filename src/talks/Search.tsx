import {useState} from 'react';
import {useDebouncedCallback} from 'use-debounce';

export function Search({onSearch}: {onSearch: (value: string) => void}) {
  const [searchString, setSearchString] = useState<string>('');

  const debouncedSetSearchString = useDebouncedCallback(onSearch, 500);

  return (
    <form
      className="bg-gradient-link p-[2px] rounded-lg flex flex-grow-1 flex-shrink-1"
      onSubmit={(event) => {
        debouncedSetSearchString.cancel();
        event.preventDefault();
        onSearch(searchString);
      }}
    >
      <input
        className="text-background rounded-l-lg p2 bg-black text-primary flex-grow-1 flex-shrink-1 outline-none focus:bg-white focus:text-background"
        type="text"
        value={searchString}
        onChange={(event) => {
          setSearchString(event.target.value);
          debouncedSetSearchString(event.target.value);
        }}
        placeholder="Search (powered by Lyra)"
      />
      <button
        type="submit"
        className="px-3 outline-none rounded-r-lg focus:outline-white"
      >
        <div className="i-lucide-search w-[2rem] h-[2rem]" />
      </button>
    </form>
  );
}
