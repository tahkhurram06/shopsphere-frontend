import Header from "@/components/layout/Header";
import { ProductDetailSkeleton } from "@/components/common/Skeletons";

export default function Loading() {
  return (
    <>
      <Header />
      <ProductDetailSkeleton />
    </>
  );
}
