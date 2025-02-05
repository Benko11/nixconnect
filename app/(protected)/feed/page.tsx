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

  return (
    <UltraWideLayout>
      {(await isSignedIn()) && (
        <div className="flex flex-col items-center">
          <Form />
        </div>
      )}

      {posts != null && <Posts posts={posts} />}
    </UltraWideLayout>
  );
}
