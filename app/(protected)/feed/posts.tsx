"use client";

import Post from "@/components/Post/Post";
import { Post as PostType } from "@/types/Post";
import React from "react";
import Markdown from "react-markdown";
import rehypeRaw from "rehype-raw";

const EnhancedMarkdown = ({ content }: { content: string }) => {
  let processedContent = content.replace(
    /#(\w+)/g,
    (match, hashtag) => `[${match}](/search/?q=%23${hashtag})`
  );

  processedContent = processedContent.replace(
    /~(\w+)/g,
    (match, username) => `[${match}](/profile/~${username})`
  );

  return (
    <Markdown className="markdown-block" rehypePlugins={[rehypeRaw]}>
      {processedContent}
    </Markdown>
  );
};

export function renderSinglePost(post: PostType, refetch: () => unknown) {
  return (
    <Post key={post.id} post={post} refetch={refetch}>
      <EnhancedMarkdown content={post.content} />
    </Post>
  );
}

export default function Posts({
  posts,
  refetch,
}: {
  posts: PostType[];
  refetch: () => unknown;
}) {
  const renderSmallPosts = () => {
    return (
      <React.Fragment>
        {posts.map((post) => renderSinglePost(post, refetch))}
      </React.Fragment>
    );
  };

  const renderMediumPosts = () => {
    const col1Posts: PostType[] = [];
    const col2Posts: PostType[] = [];
    posts.map((post, index) => {
      if (index % 2 === 0) col1Posts.push(post);
      if (index % 2 === 1) col2Posts.push(post);
    });

    return (
      <React.Fragment>
        <div className="flex flex-col gap-4">
          {col1Posts.map((post) => renderSinglePost(post, refetch))}
        </div>
        <div className="flex flex-col gap-4">
          {col2Posts.map((post) => renderSinglePost(post, refetch))}
        </div>
      </React.Fragment>
    );
  };

  const renderLargePosts = () => {
    const col1Posts: PostType[] = [];
    const col2Posts: PostType[] = [];
    const col3Posts: PostType[] = [];

    posts.forEach((post, index) => {
      if (index % 3 === 0) col1Posts.push(post);
      if (index % 3 === 1) col2Posts.push(post);
      if (index % 3 === 2) col3Posts.push(post);
    });

    return (
      <React.Fragment>
        <div className="flex flex-col gap-4">
          {col1Posts.map((post) => renderSinglePost(post, refetch))}
        </div>
        <div className="flex flex-col gap-4">
          {col2Posts.map((post) => renderSinglePost(post, refetch))}
        </div>
        <div className="flex flex-col gap-4">
          {col3Posts.map((post) => renderSinglePost(post, refetch))}
        </div>
      </React.Fragment>
    );
  };

  return (
    <>
      <div className="hidden lg:grid grid-cols-3 gap-4">
        {renderLargePosts()}
      </div>
      <div className="hidden lg:hidden md:grid grid-cols-2 gap-4">
        {renderMediumPosts()}
      </div>
      <div className="md:hidden flex flex-col gap-4">{renderSmallPosts()}</div>
    </>
  );
}
