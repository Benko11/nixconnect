import { getAllGenders } from "@/app/actions";

export default async function Genders() {
  const genders = await getAllGenders();
  if (genders == null || genders.length < 1) return <p>No genders found.</p>;

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
