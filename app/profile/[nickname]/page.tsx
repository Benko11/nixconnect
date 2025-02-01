import { getDeltaTime, handleNewLines } from "@/app/(protected)/feed/page";
import NarrowLayout from "@/components/layouts/NarrowLayout";
import Post from "@/components/Post";
import { createClient } from "@/utils/supabase/server";
import { retrievePronouns } from "@/utils/utils";
import { Divide } from "lucide-react";
import { notFound } from "next/navigation";

export default async function Page({
  params,
}: {
  params: Promise<{ nickname: string }>;
}) {
  const { nickname } = await params;

  if (!nickname.startsWith("~")) {
    return notFound();
  }

  const supabase = await createClient();
  const { data: userDetails } = await supabase
    .from("users")
    .select("*")
    .eq("nickname", nickname.substring(1))
    .maybeSingle();

  if (userDetails == null) {
    return notFound();
  }

  const { data: pronounIds } = await supabase
    .from("user_pronouns")
    .select("pronoun_id")
    .eq("user_id", userDetails.id);

  if (pronounIds == null || pronounIds.length < 1)
    return <div>Invalid profile</div>;

  const pronounIdArray = pronounIds.map((p) => p.pronoun_id);
  const { data: pronouns } = await supabase
    .from("pronouns")
    .select("word")
    .in("id", pronounIdArray);
  if (pronouns == null) return;

  const pronounArray = pronouns.map((p) => p.word);
  if (pronounArray == null) return;

  const { data: gender } = await supabase
    .from("genders")
    .select("name")
    .eq("id", userDetails.gender_id)
    .maybeSingle();

  const { data: posts } = await supabase
    .from("posts")
    .select("*")
    .eq("author_id", userDetails.id)
    .order("updated_at", { ascending: false });
  if (posts == null) return;

  const postsArray = await Promise.all(
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

  return (
    <>
      <NarrowLayout>
        <div className="flex gap-2">
          {userDetails.avatar_url && (
            <img
              src={userDetails.avatar_url}
              alt={`${userDetails.nickname}'s profile picture`}
              className="aspect-square max-w-48"
            />
          )}
          <div>
            <h2 className="">
              ~{userDetails.nickname} ({await retrievePronouns(pronounArray)})
            </h2>
            <div>
              Contact email:{" "}
              <a
                href={`mailto:${userDetails.email}`}
                className="text-default-primary"
              >
                {userDetails.email}
              </a>
            </div>
            {gender && <div>Gender: {gender.name}</div>}
          </div>
        </div>

        {postsArray.length > 0 ? (
          <>
            <h3 className="text-xl pt-8 pb-4">Latest</h3>
            <div className="pb-8 flex flex-col gap-6">
              {postsArray.map(
                ({ author, content, createdAt, id, timestamp }) => (
                  <Post
                    key={id}
                    author={author}
                    createdAt={createdAt}
                    timestamp={timestamp}
                  >
                    {content}
                  </Post>
                )
              )}
            </div>
          </>
        ) : (
          <div>No posts from this user so far, what a lazy fellow.</div>
        )}
      </NarrowLayout>
    </>
  );
}
