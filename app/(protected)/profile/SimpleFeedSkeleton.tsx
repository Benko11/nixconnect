export default function SimpleFeedSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      <div className="bg-default-neutral w-full h-48 skeleton-loading"></div>
      <div className="bg-default-neutral w-full h-24 skeleton-loading"></div>
      <div className="bg-default-neutral w-full h-32 skeleton-loading"></div>
      <div className="bg-default-neutral w-full h-28 skeleton-loading"></div>
      <div className="bg-default-neutral w-full h-40 skeleton-loading"></div>
    </div>
  );
}
