import { getGenderById } from "@/actions/get-gender";
import { getPosts } from "@/actions/get-posts";
import getPronounsForUser from "@/actions/get-pronouns";
import { getUserByNickname } from "@/actions/get-user";
import Breadcrumbs from "@/components/Breadcrumbs";
import NarrowLayout from "@/components/layouts/NarrowLayout";
import Post from "@/components/Post";
import { notFound } from "next/navigation";
import Markdown from "react-markdown";

export default async function Page({
  params,
}: {
  params: Promise<{ nickname: string }>;
}) {
  const { nickname } = await params;

  if (!nickname.startsWith("~")) return notFound();

  const user = await getUserByNickname(nickname);
  if (user == null) return notFound();

  const pronouns = await getPronounsForUser(user.id);
  if (pronouns == null || pronouns.length < 1)
    return <div>Invalid profile</div>;

  const gender = await getGenderById(user.gender_id);

  const posts = await getPosts(true, user.id);
  if (posts == null) return <div>No posts found for {nickname}</div>;

  function renderPosts() {
    return posts && posts.length > 0 ? (
      <>
        <h3 className="text-xl pt-8 pb-4">Latest</h3>
        <div className="pb-8 flex flex-col gap-6">
          {posts.map(
            ({ author, content, createdAt, id, timestamp, avatarUrl }) => (
              <Post
                id={id}
                key={id}
                author={author}
                raw={content}
                createdAt={createdAt}
                avatarUrl={avatarUrl}
                timestamp={timestamp}
              >
                <Markdown className="markdown-block">{content}</Markdown>
              </Post>
            )
          )}
        </div>
      </>
    ) : (
      <div>No posts from this user so far, what a lazy fellow.</div>
    );
  }

  return (
    <>
      <NarrowLayout>
        <Breadcrumbs
          currentTitle="User profile"
          hierachy={[{ title: "Home", href: "/" }]}
          classes="pb-4"
        />
        <div className="flex gap-2">
          {user.avatar_url && (
            <img
              src={user.avatar_url}
              alt={`${user.nickname}'s profile picture`}
              className="aspect-square max-w-48"
            />
          )}
          <div>
            <h2 className="text-2xl">~{user.nickname}</h2>
            <div>({pronouns.join("/")})</div>
            <div>{gender}</div>
          </div>
        </div>

        {renderPosts()}
      </NarrowLayout>
    </>
  );
}
