import {type Updater} from '@tanstack/react-table';
import {type ReactNode} from 'react';
import {type GlobalFilterFn} from './TalkList';

export function ToggleFilter({
  filterUpdater,
  filter,
  children,
}: {
  filterUpdater: (updater: Updater<any>) => void;
  filter: GlobalFilterFn;
  children: ReactNode;
}) {
  return (
    <label className="flex-grow-1">
      <input
        type="checkbox"
        onChange={(event) => {
          const checked = event.target.checked;
          filterUpdater((old: Set<GlobalFilterFn>) => {
            console.log('update filters');
            const filters = new Set(old);
            if (checked) {
              filters.add(filter);
            } else {
              filters.delete(filter);
            }

            return filters;
          });
        }}
        className="hidden children:sibling:checked:bg-transparent sibling:checked:text-background"
      />
      <div className="rounded-lg p-[2px] bg-gradient-link text-center">
        <div className="px-4 py-2 bg-background rounded-lg">{children}</div>
      </div>
    </label>
  );
}
