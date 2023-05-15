import { Link } from "@inertiajs/inertia-react";
import BottomNavigationList from "../Styles/BottomNavigationList";

export default function DefaultNavigation() {
    return (
        <BottomNavigationList className="ml-auto">
            <li>
                <Link href="/legal" className="fake-link ml-auto">
                    <div>Legal</div>
                </Link>
            </li>
            <li>
                <Link href="/about" className="fake-link ml-auto">
                    <div>About</div>
                </Link>
            </li>
        </BottomNavigationList>
    );
}
