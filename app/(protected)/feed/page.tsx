import Post from "@/components/Post";
import Hashtag from "@/components/Hashtag";
import { protectRoute, requireBasicInfo, retrieveClient } from "@/utils/utils";
import { createClient } from "@/utils/supabase/server";
import UltraWideLayout from "@/components/layouts/UltraWideLayout";
import { makePost } from "@/app/actions";
import React from "react";
import { handleNewLines } from "./handleNewLines";
import { getDeltaTime } from "./getDeltaTime";

export default async function Page() {
  // await protectRoute();
  // await requireBasicInfo();

  function renderPlaceholder() {
    const words = [
      "interesting",
      "inspiring",
      "amazing",
      "gay",
      "captivating",
      "wholesome",
      "honest",
      "unique",
      "marvellous",
      "cute",
    ];

    const randomIndex = Math.floor(Math.random() * words.length);
    return `Share something ${words[randomIndex]}...`;
  }

  const supabase = await createClient();
  const userId = (await supabase.auth.getUser()).data.user?.id;
  const isSignedIn = userId != null;

  const { data: posts } = await supabase
    .from("posts")
    .select("*")
    .order("updated_at", { ascending: false });

  const postsArray = await Promise.all(
    // @ts-ignore
    posts.map(async (row) => {
      const { data: authorData, error } = await supabase
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
          <form className="pb-8 w-[60%]" action={makePost}>
            <textarea
              name="post"
              id="post"
              placeholder={renderPlaceholder()}
              className="resize-none aspect-[9/2] bg-default-light text-default-dark p-1 px-2 outline-none opacity-90 hover:opacity-95 focus:opacity-95 w-full"
            ></textarea>
            <button className="bg-default-primary text-default-dark py-2 w-full -mt-2">
              Post
            </button>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 grid-rows-1 gap-4">
        {renderPosts()}
      </div>
    </UltraWideLayout>
  );
}
