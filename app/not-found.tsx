import NarrowLayout from "@/components/layouts/NarrowLayout";

export default function NotFound() {
  return (
    <NarrowLayout>
      <h2 className="text-2xl">Something happened</h2>
      <div>
        We could not find the resource you were looking for. Please double check
        the spelling in your URL. If you believe it to be an error, you are free
        to report it.
      </div>
    </NarrowLayout>
  );
}
