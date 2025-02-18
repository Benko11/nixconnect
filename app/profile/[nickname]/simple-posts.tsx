"use client";

import Post from "@/components/Post";
import { useSignedIn } from "@/hooks/useSignedIn";
import { Post as PostType } from "@/types/Post";
import React from "react";
import Markdown from "react-markdown";

function renderSinglePost(post: PostType, id: string, isSignedIn: boolean) {
  return (
    <Post
      key={id}
      id={id}
      isSignedIn={isSignedIn}
      author={post.author}
      avatarUrl={post.avatarUrl}
      createdAt={post.createdAt}
      timestamp={post.timestamp}
      raw={post.content}
    >
      <Markdown className="markdown-block">{post.content}</Markdown>
    </Post>
  );
}

export default function SimplePosts({ posts }: { posts: PostType[] }) {
  const isSignedIn = useSignedIn();

  const renderPosts = () => {
    return (
      <React.Fragment>
        {posts.map((post) => renderSinglePost(post, post.id, isSignedIn))}
      </React.Fragment>
    );
  };

  return (
    <>
      <div className="pb-4 flex flex-col gap-6">{renderPosts()}</div>
    </>
  );
}
