import Header from '@/components/Header';
import { ProductDetailSkeleton } from '@/components/Skeletons';

export default function Loading() {
  return (
    <>
      <Header />
      <ProductDetailSkeleton />
    </>
  );
}