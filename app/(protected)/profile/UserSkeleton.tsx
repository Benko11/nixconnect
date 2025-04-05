export default function UserSkeleton() {
  return (
    <div className="flex gap-2">
      <div className="w-48 aspect-square bg-neutral skeleton-loading"></div>
      <div className="flex flex-col gap-1">
        <div className="inline-block w-40 h-10 bg-neutral skeleton-loading"></div>
        <div className="inline-block w-32 h-6 bg-neutral skeleton-loading"></div>
        <div className="inline-block w-36 h-6 bg-neutral skeleton-loading"></div>
      </div>
    </div>
  );
}
