export function getPostContentColumn(postType) {
    switch (postType) {
        case "code":
            return "description";
        case "article":
            return "title";
    }

    return "contents";
}
