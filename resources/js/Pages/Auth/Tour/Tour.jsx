import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import Content from "@/Components/Content";
import { Head, useForm } from "@inertiajs/inertia-react";
import Guide from "../../../Components/Guide";
import Welcome from "./Welcome";
import Avatar from "./Avatar";
import Banner from "./Banner";
import Window from "@/Components/Window";
import { useEffect, useState } from "react";
import Finish from "./Finish";
import Biography from "./Biography";
import Privacy from "./Privacy";
import Theme from "./Theme";
import Introduction from "./Introduction";

export default function Tour(props) {
    const [activeStage, setActiveStage] = useState(0);

    const handlePrevStage = () => {
        setActiveStage((prev) => --prev);
    };

    const handleNextStage = () => {
        setActiveStage((prev) => ++prev);
    };

    const { post } = useForm();
    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("tour.finish"));
    };

    const [title, setTitle] = useState("");

    useEffect(() => {
        if (activeStage === 0) setTitle("Welcome");
        if (activeStage === 1) setTitle("Avatar");
        if (activeStage === 2) setTitle("Banner");
        if (activeStage === 3) setTitle("Biography");
        if (activeStage === 4) setTitle("Privacy");
        if (activeStage === 5) setTitle("Visuals");
        if (activeStage === 6) setTitle("Getting around");
        if (activeStage === 7) setTitle("All done!");
    }, [activeStage, title]);

    return (
        <AuthenticatedLayout auth={props.auth} errors={props.errors}>
            <Head title="Welcome!" />
            <Content size="800px" className="mt-2">
                <Window colour="var(--tertiary-colour)" title={title}>
                    <Guide
                        stages={[
                            <Welcome />,
                            <Avatar />,
                            <Banner />,
                            <Biography />,
                            <Privacy />,
                            <Theme />,
                            <Introduction />,
                            <Finish />,
                        ]}
                        onNext={handleNextStage}
                        onPrev={handlePrevStage}
                        onFinish={handleSubmit}
                        activeStage={activeStage}
                    />
                </Window>

                <div className="fake-link-primary mt-2 " onClick={handleSubmit}>
                    Skip
                </div>
            </Content>
        </AuthenticatedLayout>
    );
}
