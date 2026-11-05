import Header from "@/components/layout/Header";
import { HomeSkeleton } from "@/components/common/Skeletons";

export default function Loading() {
  return (
    <>
      <Header />
      <HomeSkeleton />
    </>
  );
}
