import GuestLayout from "@/Layouts/GuestLayout";
import { Head, Link, usePage } from "@inertiajs/inertia-react";
import Content from "@/Components/Content";

export default function Legal() {
    const global = usePage();

    return (
        <GuestLayout>
            <Head title="Legal stuff" />
            <Content size="800px">
                <div className="mt-2">
                    <h1>Legal Stuff</h1>
                    <p>
                        Here are some documents provided for your convenience to
                        inform you about important aspects of{" "}
                        {global.props.appName}:
                    </p>

                    <div className="mb-2">
                        <ul>
                            <li>
                                <Link href={route("legal.privacy-policy")}>
                                    Privacy Policy
                                </Link>
                            </li>
                            <li>
                                <Link href={route("legal.code-of-conduct")}>
                                    Code of Conduct
                                </Link>
                            </li>
                            <li>
                                <Link href={route("legal.licence")}>
                                    Distribution Licence
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <p>
                        As a user of the application, the first two documents
                        are the most important.
                    </p>
                </div>
            </Content>
        </GuestLayout>
    );
}
