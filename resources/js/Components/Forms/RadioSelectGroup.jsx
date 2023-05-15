export default function RadioSelectGroup({ children }) {
    return (
        <div style={{ display: "flex", flexWrap: "wrap", gap: ".5rem" }}>
            {children}
        </div>
    );
}
