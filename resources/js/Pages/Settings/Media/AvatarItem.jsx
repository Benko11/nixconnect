import SliderItem from "../../../Styles/SliderItem";

export default function AvatarItem({ avatar, onSelect, avatarSelections }) {
    return (
        <SliderItem key={avatar.name} style={{ cursor: "pointer" }}>
            <input
                type="radio"
                name="avatar"
                value={avatar.id}
                onChange={() => onSelect(avatar.id)}
                checked={avatarSelections[avatar.id]}
                style={{ display: "none" }}
            />
            <div
                style={{
                    width: "120px",
                    height: "120px",
                    backgroundImage: `url(/storage/avatars/${avatar.name})`,
                    backgroundSize: "cover",
                    backgroundPosition: "50% 50%",
                }}
                onClick={() => onSelect(avatar.id)}
            >
                <div> </div>
            </div>
        </SliderItem>
    );
}
