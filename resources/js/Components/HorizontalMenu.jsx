export default function HorizontalMenu({ children, className }) {
    return (
        <div
            className={className}
            style={{
                background: "var(--quaternary-colour)",
                padding: "4px",
                maxWidth: "100%",
                display: "flex",
                flexWrap: "wrap",
                gap: "4px",
            }}
        >
            {children}
        </div>
    );
}
