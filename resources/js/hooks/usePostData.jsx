export default function usePostData(post) {
    const data = {
        title: null,
        contents: null,
        media: [],
        code: null,
        language: null,
    };

    if (post.postable_type === "text") {
        data.contents = post.postable.contents;
    }

    if (post.postable_type === "gallery") {
        data.contents = post.postable.contents;
        data.media = post.postable.images;
    }

    if (post.postable_type === "code") {
        data.contents = post.postable.description;
        data.code = post.postable.code;
        data.language = post.postable.language.slug;
    }

    if (post.postable_type === "article") {
        data.title = post.postable.title;
        data.contents = post.postable.body;
    }

    return data;
}
