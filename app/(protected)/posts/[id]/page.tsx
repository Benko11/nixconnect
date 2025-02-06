import { getPostById } from "@/actions/get-posts";
import Breadcrumbs from "@/components/Breadcrumbs";
import NarrowLayout from "@/components/layouts/NarrowLayout";
import Post from "@/components/Post";
import { notFound } from "next/navigation";
import Markdown from "react-markdown";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = await getPostById(id);
  if (post == null) {
    return notFound();
  }

  console.log(post);
  return (
    <NarrowLayout>
      <Breadcrumbs
        hierachy={[{ href: "/feed", title: "Home" }]}
        currentTitle={`Post from ~${post.author}`}
      />
      <Post
        id={id}
        author={post.author}
        createdAt={post.createdAt}
        timestamp={post.timestamp}
        raw={post.content}
      >
        <Markdown className="markdown-block">{post.content}</Markdown>
      </Post>
    </NarrowLayout>
  );
}
