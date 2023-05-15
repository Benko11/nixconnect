import AuthenticatedLayout from "./AuthenticatedLayout";

export default function AuthWrapper(props) {
    return (
        <AuthenticatedLayout auth={props.auth} errors={props.errors}>
            {props.children}
        </AuthenticatedLayout>
    );
}
