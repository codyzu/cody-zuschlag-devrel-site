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
      className="flex flex-col mb-8 p-4 sm:p-12 mx-3 rounded section-shadow"
    >
      {children}
    </div>
  );
}
