import Window from "@/Components/Window";

export default function About({ bio }) {
    return (
        <div
            className="mt-3"
            style={{
                whiteSpace: "pre-wrap",
                width: "100%",
            }}
        >
            <Window title="About" colour="var(--quaternary-colour)">
                {bio}
            </Window>
        </div>
    );
}
