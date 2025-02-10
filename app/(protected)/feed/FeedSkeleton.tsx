export default function FeedSkeleton() {
  return (
    <div className="overflow-hidden">
      <div className="hidden lg:grid grid-cols-3 gap-4">
        <div className="flex flex-col gap-4">
          <div className="bg-default-neutral w-full h-20 skeleton-loading"></div>
          <div className="bg-default-neutral w-full h-40 skeleton-loading"></div>
          <div className="bg-default-neutral w-full h-32 skeleton-loading"></div>
          <div className="bg-default-neutral w-full h-24 skeleton-loading"></div>
        </div>
        <div className="flex flex-col gap-4">
          <div className="bg-default-neutral w-full h-52 skeleton-loading"></div>
          <div className="bg-default-neutral w-full h-24 skeleton-loading"></div>
          <div className="bg-default-neutral w-full h-48 skeleton-loading"></div>
        </div>
        <div className="flex flex-col gap-4">
          <div className="bg-default-neutral w-full h-48 skeleton-loading"></div>
          <div className="bg-default-neutral w-full h-60 skeleton-loading"></div>
          <div className="bg-default-neutral w-full h-24 skeleton-loading"></div>
        </div>
      </div>
      <div className="hidden lg:hidden md:grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-4">
          <div className="bg-default-neutral w-full h-40 skeleton-loading"></div>
          <div className="bg-default-neutral w-full h-32 skeleton-loading"></div>
          <div className="bg-default-neutral w-full h-48 skeleton-loading"></div>
          <div className="bg-default-neutral w-full h-24 skeleton-loading"></div>
        </div>
        <div className="flex flex-col gap-4">
          <div className="bg-default-neutral w-full h-20"></div>
          <div className="bg-default-neutral w-full h-52"></div>
          <div className="bg-default-neutral w-full h-64"></div>
          <div className="bg-default-neutral w-full h-24"></div>
        </div>
      </div>
      <div className="md:hidden flex flex-col gap-4">
        <div className="bg-default-neutral w-full h-48"></div>
        <div className="bg-default-neutral w-full h-24"></div>
        <div className="bg-default-neutral w-full h-32"></div>
        <div className="bg-default-neutral w-full h-28"></div>
        <div className="bg-default-neutral w-full h-40"></div>
      </div>
    </div>
  );
}
