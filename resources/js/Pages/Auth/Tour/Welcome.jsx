import { usePage } from "@inertiajs/inertia-react";

export default function Welcome() {
    const global = usePage();

    return (
        <div>
            Welcome to {global.props.appName}! A whole new dimension of retro
            nerding out awaits you. Let's set up a couple of things and learn
            our way around here before we fully plunge into the abyss.
        </div>
    );
}
