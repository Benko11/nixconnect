import Container from "@/Styles/Container";

export default function Content({ size, children, className }) {
    return (
        <Container className={className}>
            <div style={{ width: size, maxWidth: "98%" }}>{children}</div>
        </Container>
    );
}
