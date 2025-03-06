import SimpleFeedSkeleton from "../profile/SimpleFeedSkeleton";

export default function SearchResultSkeleton() {
  return (
    <div className="pt-4">
      <div className="w-24 h-8 bg-default-neutral skeleton-loading my-2"></div>
      <div className="grid grid-cols-3 gap-x-4 gap-y-4">
        <div className="bg-default-neutral w-full h-20 skeleton-loading"></div>
        <div className="bg-default-neutral w-full h-20 skeleton-loading"></div>
        <div className="bg-default-neutral w-full h-20 skeleton-loading"></div>
      </div>
      <div className="w-24 h-8 bg-default-neutral skeleton-loading my-2"></div>
      <SimpleFeedSkeleton />
    </div>
  );
}
