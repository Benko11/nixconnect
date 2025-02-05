"use client";

import Post from "@/components/Post";
import { Post as PostType } from "@/types/Post";
import React from "react";
import Markdown from "react-markdown";

function renderSinglePost(post: PostType, id: string) {
  return (
    <Post
      key={id}
      author={post.author}
      createdAt={post.createdAt}
      timestamp={post.timestamp}
    >
      <Markdown className="markdown-block">{post.content}</Markdown>
    </Post>
  );
}

export default function Posts({ posts }: { posts: PostType[] }) {
  const renderSmallPosts = () => {
    return (
      <React.Fragment>
        {posts.map((post) => renderSinglePost(post, post.id))}
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
          {col1Posts.map((c) => renderSinglePost(c, c.id))}
        </div>
        <div className="flex flex-col gap-4">
          {col2Posts.map((c) => renderSinglePost(c, c.id))}
        </div>
      </React.Fragment>
    );
  };

  const renderLargePosts = () => {
    const col1Posts: PostType[] = [];
    const col2Posts: PostType[] = [];
    const col3Posts: PostType[] = [];

    posts.map((post, index) => {
      if (index % 3 === 0) col1Posts.push(post);
      if (index % 3 === 1) col2Posts.push(post);
      if (index % 3 === 2) col3Posts.push(post);
    });

    return (
      <React.Fragment>
        <div className="flex flex-col gap-4">
          {col1Posts.map((c) => renderSinglePost(c, c.id))}
        </div>
        <div className="flex flex-col gap-4">
          {col2Posts.map((c) => renderSinglePost(c, c.id))}
        </div>
        <div className="flex flex-col gap-4">
          {col3Posts.map((c) => renderSinglePost(c, c.id))}
        </div>
      </React.Fragment>
    );
  };

  return (
    <>
      <div className="hidden lg:grid grid-cols-3  gap-4">
        {renderLargePosts()}
      </div>
      <div className="hidden lg:hidden md:grid grid-cols-2 gap-4">
        {renderMediumPosts()}
      </div>
      <div className="md:hidden flex flex-col gap-4">{renderSmallPosts()}</div>
    </>
  );
}
