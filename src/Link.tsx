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
      className="link decoration-none inline-flex flex-row items-center gap-2"
    >
      {icon && <div className={icon} />}
      <div>{children}</div>
    </a>
  );
}
