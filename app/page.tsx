import { verifyCredentials } from "./db/users";

export default function Page() {
  return (
    <div className="flex justify-center py-6">
      <div className="w-[768px] max-w-[95%]">
        <h1 className="text-xl pb-2">Log In</h1>

        <div className="bg-default-neutral p-4">
          <form action={verifyCredentials}>
            <div className="flex flex-col pb-4">
              <label htmlFor="nickname">Nickname</label>
              <input
                type="text"
                name="nickname"
                id="nickname"
                className="bg-default-light text-default-dark p-1 px-2 outline-none opacity-90 hover:opacity-100 focus:opacity-100"
              />
            </div>
            <div className="flex flex-col pb-4">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                name="password"
                id="password"
                className="bg-default-light text-default-dark p-1 px-2 outline-none opacity-90 hover:opacity-100 focus:opacity-100"
              />
            </div>
            <button
              type="submit"
              className="text-default-dark bg-default-primary p-3 px-8 text-lg"
            >
              Log In
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
