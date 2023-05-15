import {
    useState,
    createContext,
    useContext,
    Fragment,
    useEffect,
} from "react";
import { Link } from "@inertiajs/inertia-react";
import { Transition } from "@headlessui/react";
import NavigationDropdown from "@/Styles/NavigationDropdown";

const DropDownContext = createContext();

const Dropdown = ({ className, children }) => {
    const [open, setOpen] = useState(false);

    const toggleOpen = () => {
        setOpen((previousState) => !previousState);
    };

    const close = () => {
        setOpen(false);
    };

    return (
        <DropDownContext.Provider value={{ open, setOpen, toggleOpen, close }}>
            <div className={className} style={{ zIndex: "9999" }}>
                {children}
            </div>
        </DropDownContext.Provider>
    );
};

const Trigger = ({ children }) => {
    const { open, setOpen, toggleOpen, close } = useContext(DropDownContext);

    useEffect(() => {
        const removeNavigation = (e) => {
            const classes = e.target.classList;

            if (
                !classes.contains("select-link") &&
                !classes.contains("user-nickname")
            ) {
                close();
            }
        };
        document.addEventListener("click", removeNavigation, { capture: true });

        return () => {
            document.removeEventListener("click", removeNavigation);
        };
    }, []);

    return (
        <>
            <div onClick={toggleOpen}>{children}</div>

            {open && <div onClick={() => setOpen(false)}></div>}
        </>
    );
};

const Content = ({ align = "right", width = "48", children }) => {
    const { open, setOpen } = useContext(DropDownContext);

    let alignmentClasses = "origin-top";

    if (align === "left") {
        alignmentClasses = "origin-top-left left-0";
    } else if (align === "right") {
        alignmentClasses = "origin-top-right right-0";
    }

    let widthClasses = "";

    if (width === "48") {
        widthClasses = "w-48";
    }

    return (
        <>
            <Transition
                as={Fragment}
                show={open}
                enter="transition ease-out duration-200"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
            >
                <NavigationDropdown onClick={() => setOpen(false)}>
                    <div>{children}</div>
                </NavigationDropdown>
            </Transition>
        </>
    );
};

const DropdownLink = ({ href, method, as, children, onClick }) => {
    return (
        <Link
            href={href}
            method={method}
            as={as}
            className="link-button"
            onClick={onClick}
        >
            <div className="select-link" style={{ padding: ".75rem 1.25rem" }}>
                {children}
            </div>
        </Link>
    );
};

Dropdown.Trigger = Trigger;
Dropdown.Content = Content;
Dropdown.Link = DropdownLink;

export default Dropdown;
