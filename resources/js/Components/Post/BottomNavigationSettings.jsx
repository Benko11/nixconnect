import BottomNavigation from "@/Styles/BottomNavigation";
import BottomNavigationList from "../../Styles/BottomNavigationList";

export default function BottomNavigationSettings({
    selection,
    isTilde,
    onLike,
    onShare,
    onCopy,
    onStash,
    onEdit,
    onDelete,
    isPinged,
    isStashed,
    pingCount,
    isFork,
}) {
    if (selection < 0) return null;

    return (
        <BottomNavigation style={{ position: "fixed", zIndex: 2 }}>
            <div style={{ padding: "1px 2px" }}>{pingCount} pings</div>
            <BottomNavigationList className="ml-auto">
                {!isFork && (
                    <li onClick={onLike} className="fake-link">
                        <div>{isPinged ? "Unping" : "Ping"}</div>
                    </li>
                )}
                {!isFork && (
                    <li onClick={onShare} className="fake-link">
                        <div>Fork</div>
                    </li>
                )}
                <li onClick={onCopy} className="fake-link">
                    <div>Copy</div>
                </li>
                <li onClick={onStash} className="fake-link">
                    <div>{isStashed ? "Unstash" : "Stash"}</div>
                </li>

                {!isTilde() && (
                    <>
                        <li className="fake-link" onClick={onEdit}>
                            <div>Edit</div>
                        </li>
                        <li className="fake-link" onClick={onDelete}>
                            <div>Delete</div>
                        </li>
                    </>
                )}
            </BottomNavigationList>
        </BottomNavigation>
    );
}
