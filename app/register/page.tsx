import Link from "next/link";
import Pronouns from "../components/Pronouns";
import { getAllGenders } from "../db/genders";
import { getAllPronouns } from "../db/pronouns";
import { createUserAccount } from "../db/users";
import { Gender } from "../types/gender";

export default async function Page() {
  const genders: Gender[] = await getAllGenders();
  const pronouns = await getAllPronouns();

  function displayGenders() {
    if (genders.length < 1) return <p>No genders found.</p>;

    return (
      <div className="py-2 pb-4">
        <h3>Gender</h3>
        {genders.map(({ id, name, description }) => (
          <div key={id}>
            <label htmlFor={`gender-${id}`}>
              <div className="flex items-center gap-4">
                <div className="bg-default-dark p-4 py-6">
                  <input
                    type="radio"
                    name="gender"
                    value={name}
                    id={`gender-${id}`}
                  />
                </div>
                <div>
                  <div className="font-bold">{name}</div>
                  <div className="text-sm">{description}</div>
                </div>
              </div>
            </label>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex justify-center py-6">
      <div className="w-[990px] max-w-[95%]">
        <h2 className="text-2xl">
          <Link href="#" className="text-default-primary">
            Home
          </Link>{" "}
          / Create account
        </h2>
        <div className="bg-default-neutral p-4">
          <form action={createUserAccount}>
            <div className="flex flex-col pb-4">
              <label htmlFor="nickname">
                Nickname <span className="text-default-error">*</span>
              </label>
              <input
                type="text"
                name="nickname"
                id="nickname"
                className="bg-default-light text-default-dark p-1 px-2 outline-none opacity-90 hover:opacity-100 focus:opacity-100"
              />
            </div>

            <div className="flex flex-col pb-4">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                name="email"
                id="email"
                className="bg-default-light text-default-dark p-1 px-2 outline-none opacity-90 hover:opacity-100 focus:opacity-100"
              />
            </div>

            <div className="grid grid-cols-2 pb-4 gap-x-4">
              <div className="flex flex-col">
                <label htmlFor="password">
                  Password <span className="text-default-error">*</span>
                </label>

                <input
                  type="password"
                  name="password"
                  id="password"
                  className="bg-default-light text-default-dark p-1 px-2 outline-none opacity-90 hover:opacity-100 focus:opacity-100"
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="password_again">
                  Password again <span className="text-default-error">*</span>
                </label>

                <input
                  type="password"
                  name="password_again"
                  id="password_again"
                  className="bg-default-light text-default-dark p-1 px-2 outline-none opacity-90 hover:opacity-100 focus:opacity-100"
                />
              </div>
            </div>

            {displayGenders()}

            <Pronouns pronouns={pronouns} />

            <div className="pt-4">
              <button
                type="submit"
                className="text-default-dark bg-default-primary p-3 px-8 text-lg"
              >
                Sign up
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
