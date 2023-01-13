import {type ReactNode} from 'react';

export function Link({
  icon,
  url,
  children,
}: {
  icon?: string;
  url: string;
  children: ReactNode;
}) {
  return (
    <a
      href={url}
      className="decoration-none inline-flex flex-row items-center gap-2 text-sky-500"
    >
      {icon && <div className={icon} />}
      <div>{children}</div>
    </a>
  );
}
