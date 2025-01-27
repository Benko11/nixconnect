import Login from "../ui/forms/login";

export default function Page() {
  return (
    <div className="flex justify-center py-6">
      <div className="w-[768px] max-w-[95%]">
        <h1 className="text-xl pb-2">Log In</h1>

        <div className="bg-default-neutral p-4">
          <Login />
        </div>
      </div>
    </div>
  );
}
