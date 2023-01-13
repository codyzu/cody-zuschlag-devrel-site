import {lazy, Suspense} from 'react';
import Section from './Section';
import SectionTitle from './SectionTitle';

const Map = lazy(async () => import('./Map'));

export default function Location() {
  return (
    <Section>
      <div className="grid grid-cols-1 lg:grid-cols-2">
        <div className="mb-3 lg:mb-0">
          <div className="w-full" style={{height: '315px'}}>
            <Suspense>
              <Map />
            </Suspense>
          </div>
        </div>
        <div className="lg:-order-1 flex flex-col">
          <SectionTitle title="Based from" subtitle="Annecy, France" />
        </div>
      </div>
    </Section>
  );
}
