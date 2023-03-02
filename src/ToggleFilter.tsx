import {type Updater} from '@tanstack/react-table';
import {useEffect, useState, type ReactNode} from 'react';
import cx from 'clsx';
import {type GlobalFilterFn} from './TalkList';

export function ToggleFilter({
  onCheckChanged,
  children,
}: {
  onCheckChanged: (checked: boolean) => void;
  children: ReactNode;
}) {
  const [checked, setChecked] = useState<boolean>(false);
  useEffect(() => {
    onCheckChanged(checked);
  }, [checked]);

  return (
    <button
      className="rounded-lg p-[2px] bg-gradient-link text-center flex-grow-1"
      aria-pressed={checked}
      onClick={() => {
        setChecked((old) => !old);
      }}
    >
      <div
        className={cx(
          'px-4 py-2 rounded-lg',
          checked
            ? 'bg-transparent text-background'
            : 'bg-background text-primary',
        )}
      >
        {children}
      </div>
    </button>
  );
}
