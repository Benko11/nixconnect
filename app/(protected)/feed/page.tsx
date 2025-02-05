import Post from "@/components/Post";
import UltraWideLayout from "@/components/layouts/UltraWideLayout";
import React from "react";
import Form from "./form";
import { getPosts } from "@/actions/get-posts";
import { isSignedIn } from "@/utils/utils";
import Posts from "./posts";

export default async function Page() {
  // await protectRoute();
  // await requireBasicInfo();
  const posts = await getPosts();

  function renderPosts() {
    const column1Posts: React.ReactNode[] = [];
    const column2Posts: React.ReactNode[] = [];
    const column3Posts: React.ReactNode[] = [];

    if (posts == null) return;

    posts.forEach(({ id, author, content, timestamp, createdAt }, index) => {
      const post = (
        <Post
          key={id}
          author={author}
          createdAt={createdAt}
          timestamp={timestamp}
        >
          <div dangerouslySetInnerHTML={content} className="markdown-block" />
        </Post>
      );

      if (index % 3 === 0) {
        column1Posts.push(post);
      } else if (index % 3 === 1) {
        column2Posts.push(post);
      } else if (index % 3 === 2) {
        column3Posts.push(post);
      }
    });

    return (
      <React.Fragment>
        {/* <div className="flex flex-col gap-4">{column1Posts.map((p) => p)}</div>
        <div className="flex flex-col gap-4">{column2Posts.map((p) => p)}</div>
        <div className="flex flex-col gap-4">{column3Posts.map((p) => p)}</div> */}
      </React.Fragment>
    );
  }

  return (
    <UltraWideLayout>
      {(await isSignedIn()) && (
        <div className="flex flex-col items-center">
          <Form />
        </div>
      )}

      {posts != null && <Posts posts={posts} />}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 grid-rows-1 gap-4">
        {renderPosts()}
      </div>
    </UltraWideLayout>
  );
}
