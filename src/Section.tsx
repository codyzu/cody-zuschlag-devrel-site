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
      className="flex flex-col mb-5 p-5 mx-3 rounded shadow-light-900 shadow-xl"
    >
      {children}
    </div>
  );
}
