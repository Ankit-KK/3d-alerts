import { Suspense } from 'react';
import { AlertOverlay } from './AlertOverlay';

export default function Page() {
  return (
    <Suspense fallback={null}>
      <AlertOverlay />
    </Suspense>
  );
}
