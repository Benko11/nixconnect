export default function Introduction() {
    return (
        <div>
            <div>
                If you want to interact with a post, such as pinging it (similar
                to 'liking'), forking it (similar to 'sharing') or doing
                anything else, you need to select the post and then the option
                from the bottom menu:
            </div>

            <div className="mb-2 mt-1">
                <img src="/Assets/post1.png" />
            </div>

            <div>
                <img src="/Assets/post2.png" />
            </div>

            <div className="mt-2">
                Likewise, you can copy a code snippet from a post by simply
                clicking on it.
            </div>

            <div className="mt-2">
                To follow users or search for them, you can use the 'Search'
                from the bottom left.
            </div>
        </div>
    );
}
