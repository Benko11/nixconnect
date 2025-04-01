"use client";

import Post from "@/components/Post/Post";
import { Post as PostType } from "@/types/Post";
import React from "react";
import Markdown from "react-markdown";

function renderSinglePost(post: PostType, id: string) {
  return (
    <Post
      key={id}
      id={id}
      author={post.author}
      createdAt={post.createdAt}
      timestamp={post.timestamp}
      raw={post.content}
      pings={post.pings}
      comments={post.comments}
      refetch={() => {}}
    >
      <Markdown className="markdown-block">{post.content}</Markdown>
    </Post>
  );
}

export default function SimplePosts({ posts }: { posts: PostType[] }) {
  const renderPosts = () => {
    return (
      <React.Fragment>
        {posts.map((post) => renderSinglePost(post, post.id))}
      </React.Fragment>
    );
  };

  return (
    <>
      <div className="pb-4 flex flex-col gap-6">{renderPosts()}</div>
    </>
  );
}
