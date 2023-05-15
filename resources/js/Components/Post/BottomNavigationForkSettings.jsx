import BottomNavigation from "@/Styles/BottomNavigation";

export default function BottomNavigationSettings({
    selection,
    isTilde,
    onCopy,
    onDelete,
}) {
    if (selection < 0) return null;

    return (
        <BottomNavigation style={{ position: "fixed", bottom: 0 }}>
            <div
                className="ml-auto"
                style={{
                    display: "flex",
                    gap: ".75rem",
                }}
            >
                <div onClick={onCopy} style={{ margin: "1px 2px" }}>
                    Copy
                </div>

                {!isTilde() && (
                    <>
                        <div onClick={onDelete} style={{ margin: "1px 2px" }}>
                            Delete
                        </div>
                    </>
                )}
            </div>
        </BottomNavigation>
    );
}
