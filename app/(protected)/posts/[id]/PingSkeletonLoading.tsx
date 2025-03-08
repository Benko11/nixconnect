export default function PingSkeletonLoading() {
  return (
    <div className="flex flex-col mt-4 gap-2">
      <div className="bg-default-neutral h-8 w-24 skeleton-loading"></div>
      <div className="bg-default-neutral h-24 skeleton-loading"></div>
    </div>
  );
}
