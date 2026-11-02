import Header from '@/components/Header';
import { HomeSkeleton } from '@/components/Skeletons';

export default function Loading() {
  return (
    <>
      <Header />
      <HomeSkeleton />
    </>
  );
}