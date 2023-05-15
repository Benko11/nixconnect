import { Link } from "@inertiajs/inertia-react";

export default function PublicView() {
    return (
        <div className="mt-2 error">
            You are viewing your profile as it would be seen by public <br />
            <Link href={route("profile.indexMe")}>Exit public view</Link>
        </div>
    );
}
