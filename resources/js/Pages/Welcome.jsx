import React, { useEffect, useState } from "react";
import GuestLayout from "@/Layouts/GuestLayout";
import Container from "../Styles/Container";
import { Head, Link, usePage } from "@inertiajs/inertia-react";
import ButtonLarge from "../Styles/ButtonLarge";
import Content from "@/Components/Content";

export default function Welcome(props) {
    const global = usePage();

    const [inclusiveText, setInclusiveText] = useState([]);

    useEffect(() => {
        setInclusiveText(() =>
            "Inclusive at the core"
                .split("")
                .map((item, index) => <span key={index}>{item}</span>)
        );
    }, []);
    return (
        <GuestLayout>
            <Head></Head>
            <Content size="990px">
                <h1 className="my-2">
                    All computers are glorified terminals. Relive this age with
                    us.
                </h1>

                <p>
                    Welcome to {global.props.appName}, yet another kind of
                    social media platform. Bet you haven't had enough of those,
                    now, have you?
                </p>

                <p>
                    Design and websites have developed a lot over the years with
                    new design trends being set every now and then, and
                    sometimes you might think that all you want of a design is
                    to be just like it used to be in yesteryear with simple
                    colour schemes and retro fonts.
                </p>

                <p>
                    Maybe you would like to have a more native BBS-like
                    experience, something that SCREAMS UNIX computing from
                    several decades ago? Or are you missing the times when
                    MS-DOS was the cutting-edge technology?{" "}
                    {global.props.appName} has all the modern features you
                    except a social platform while wearing a retro coat.
                </p>

                <h2 className="my-2">Small and open source</h2>
                <p>
                    {global.props.appName} isn't meant to be big. But that's a
                    good thing, right? Do you really want to worry about yet
                    another data breach or privacy violation from a large
                    corporation? What if social media was once again about ...
                    socializing? Meeting new people? Doing things? Not just
                    being a product? Anyone remember guestbooks?
                </p>
                <p>
                    The source code of {global.props.appName} is public and open
                    to everyone, so that it is verifiable by anyone having
                    doubts.
                </p>
                <h2 className="my-2">Customizable and extensible</h2>
                <p>
                    {global.props.appName} is meant to be customizable for
                    everyone, when it comes to customizing your colour palettes
                    or fonts in use, while offering a unique retro aesthetic and
                    feature set.
                </p>
                <p>
                    The project is meant to be as extensible as I can make it to
                    be, so that new features can be added with ease. Is this on
                    levels of Mastodon? I don't know! Why not find out and see
                    for yourself?
                </p>

                <h2 className="my-2">Inspired by pubNixes</h2>
                <p>
                    Isn't it nice when small numbers of people get together to
                    make something and have a safe space for their own niches
                    and interests?
                </p>
                <p>
                    {global.props.appName} is merely an attempt at a
                    continuation of the tradition of pubNixes, which I believe
                    is a really intriguing idea.
                </p>

                <h2 className="my-2 inclusive">{inclusiveText}</h2>
                <p>
                    {global.props.appName} is designed to be as easy to use as
                    possible for all groups of people by following the web
                    accessibility standards and guidelines, while its community
                    is also meant to harness inclusive spirit, a place where
                    everyone of good morals is welcome.
                </p>
                <p>
                    No discrimination is allowed.{" "}
                    <strong>Such things will not stand here.</strong> You can
                    learn more about our values in{" "}
                    <Link href={route("legal.code-of-conduct")}>
                        Code of Conduct
                    </Link>
                    .
                </p>

                <div style={{ textAlign: "center" }} className="my-6">
                    <Link href="/register">
                        <ButtonLarge>Create free account</ButtonLarge>
                    </Link>
                </div>
            </Content>
        </GuestLayout>
    );
}
