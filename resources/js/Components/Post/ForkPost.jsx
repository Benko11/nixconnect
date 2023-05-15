import Post from "./Post";

export default function ForkPost({ className, checked, onSelect, text, id }) {
    return (
        <Post id={id} checked={checked}>
            <div onClick={onSelect} className="selection p-2">
                {text}
            </div>
        </Post>
    );
}
