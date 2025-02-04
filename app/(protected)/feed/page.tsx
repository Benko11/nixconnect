import Post from "@/components/Post";
import { createClient } from "@/utils/supabase/server";
import UltraWideLayout from "@/components/layouts/UltraWideLayout";
import React from "react";
import { handleNewLines } from "./handleNewLines";
import { getDeltaTime } from "./getDeltaTime";
import Form from "./form";

export default async function Page() {
  // await protectRoute();
  // await requireBasicInfo();

  const supabase = await createClient();
  const userId = (await supabase.auth.getUser()).data.user?.id;
  const isSignedIn = userId != null;

  const { data: posts } = await supabase
    .from("posts")
    .select("*")
    .order("updated_at", { ascending: false });
  if (posts == null) return;
  const postsArray = await Promise.all(
    posts.map(async (row) => {
      const { data: authorData } = await supabase
        .from("users")
        .select("nickname")
        .eq("id", row.author_id)
        .single();

      const author = authorData?.nickname ?? null;

      return {
        id: row.id,
        author,
        content: handleNewLines(row.content),
        timestamp: getDeltaTime(row.created_at) + " ago",
        createdAt: row.created_at,
      };
    })
  );

  function renderPosts() {
    const column1Posts: React.ReactNode[] = [];
    const column2Posts: React.ReactNode[] = [];
    const column3Posts: React.ReactNode[] = [];

    if (posts == null) return;

    postsArray.forEach(
      ({ id, author, content, timestamp, createdAt }, index) => {
        const post = (
          <Post
            key={id}
            author={author}
            createdAt={createdAt}
            timestamp={timestamp}
          >
            {content}
          </Post>
        );

        if (index % 3 === 0) {
          column1Posts.push(post);
        } else if (index % 3 === 1) {
          column2Posts.push(post);
        } else if (index % 3 === 2) {
          column3Posts.push(post);
        }
      }
    );

    return (
      <React.Fragment>
        <div className="flex flex-col gap-4">{column1Posts.map((p) => p)}</div>
        <div className="flex flex-col gap-4">{column2Posts.map((p) => p)}</div>
        <div className="flex flex-col gap-4">{column3Posts.map((p) => p)}</div>
      </React.Fragment>
    );
  }

  return (
    <UltraWideLayout>
      {isSignedIn && (
        <div className="flex flex-col items-center">
          <Form />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 grid-rows-1 gap-4">
        {renderPosts()}
      </div>
    </UltraWideLayout>
  );
}
