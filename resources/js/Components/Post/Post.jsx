import PostContainer from "@/Styles/PostContainer";

export default function Post({ id, checked, children, style }) {
    return (
        <PostContainer style={style} className="post">
            <input
                type="radio"
                name="posts"
                value={id}
                checked={checked}
                readOnly
            />

            {children}
        </PostContainer>
    );
}
