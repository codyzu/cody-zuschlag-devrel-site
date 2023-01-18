import {type ReactNode} from 'react';

export default function Section({
  id,
  children,
}: {
  id?: string;
  children: ReactNode;
}) {
  const props = id ? {id} : {};
  return (
    <div
      {...props}
      className="flex flex-col mb-8 px-4 sm:px-12 py-12 mx-3 rounded-xl section-shadow"
    >
      {children}
    </div>
  );
}
