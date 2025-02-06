import { getPostById } from "@/actions/get-posts";
import { getPingsForPost } from "@/actions/ping";
import Breadcrumbs from "@/components/Breadcrumbs";
import NarrowLayout from "@/components/layouts/NarrowLayout";
import Post from "@/components/Post";
import { isSignedIn } from "@/utils/utils";
import Link from "next/link";
import { notFound } from "next/navigation";
import Markdown from "react-markdown";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const pings = await getPingsForPost(id);
  const post = await getPostById(id);
  if (post == null) {
    return notFound();
  }

  function renderPings() {
    if (pings == null || pings.length < 1) return;

    return (
      <div className="bg-default-neutral p-4 mt-4">
        <div>
          {pings.length} ping{pings.length > 1 && "s"}
        </div>
        {pings.map((ping) => (
          <div key={ping.timestamp} className="flex items-center mt-2 gap-2">
            {ping.author.avatarUrl && (
              <img
                src={ping.author.avatarUrl}
                alt={ping.author.name}
                className="w-14"
              />
            )}
            <Link
              href={`/profile/~${ping.author}`}
              className="text-default-primary"
            >
              ~{ping.author.name}
            </Link>
          </div>
        ))}
      </div>
    );
  }

  return (
    <NarrowLayout>
      <Breadcrumbs
        hierachy={[{ href: "/feed", title: "Home" }]}
        currentTitle={`Post from ~${post.author}`}
      />
      <Post
        id={id}
        author={post.author}
        isSignedIn={await isSignedIn()}
        createdAt={post.createdAt}
        timestamp={post.timestamp}
        raw={post.content}
      >
        <Markdown className="markdown-block">{post.content}</Markdown>
      </Post>

      {renderPings()}
    </NarrowLayout>
  );
}
