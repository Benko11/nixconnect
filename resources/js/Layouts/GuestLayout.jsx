import React from "react";
import { Link, usePage } from "@inertiajs/inertia-react";
import Navigation from "../Styles/Navigation";
import NavigationMenu from "../Styles/NavigationMenu";
import BottomNavigation from "@/Styles/BottomNavigation";
import BottomNavigationList from "../Styles/BottomNavigationList";
import DefaultNavigation from "../Components/DefaultNavigation";

export default function Guest(props) {
    const global = usePage();

    return (
        <>
            <Navigation>
                <Link href="/">{global.props.appName}</Link>

                <NavigationMenu>
                    <li>
                        <Link href="/login">Log In</Link>
                    </li>
                    <li>
                        <Link href="/register">Sign Up</Link>
                    </li>
                </NavigationMenu>
            </Navigation>
            <>{props.children}</>

            <BottomNavigation style={{ position: "fixed", bottom: 0 }}>
                <DefaultNavigation />
            </BottomNavigation>
        </>
    );
}
