import Post from "@/components/Post";
import Hashtag from "@/components/Hashtag";
import { protectRoute, requireBasicInfo, retrieveClient } from "@/utils/utils";
import { createClient } from "@/utils/supabase/server";
import UltraWideLayout from "@/components/layouts/UltraWideLayout";
import { makePost } from "@/app/actions";

export default async function Page() {
  await protectRoute();
  await requireBasicInfo();

  // const posts = [
  //   {
  //     author: "benko11",
  //     timestamp: "26 minutes ago",
  //     content: (
  //       <>
  //         I like gay sex and that is very important to know about me and fucking
  //         everyooooone! aAAAAAAA
  //       </>
  //     ),
  //   },
  //   {
  //     author: "horny_benson",
  //     timestamp: "3 hours ago",
  //     content: (
  //       <>
  //         <div>
  //           Fucking hell, when is Benson going to have sex with Mordecai, um,
  //           CANONNICALLY? I CANNOT BEAR IT NOT EXISTING
  //         </div>
  //         <div>
  //           {" "}
  //           I am so sad about this shit not happening yet, like what the fuck is
  //           this shit even?!
  //         </div>
  //       </>
  //     ),
  //   },
  //   {
  //     author: "chaucer666",
  //     timestamp: "2 days ago",
  //     content: (
  //       <>
  //         Whan Zephirus eek with his sweete breeth\n Inspired hath in every holt
  //         and heeth\n The tendre croppes, and the yonge sonne\n Hath in the Ram
  //         his half cours yronne,
  //       </>
  //     ),
  //   },
  //   {
  //     author: "horny_benson",
  //     timestamp: "41 minutes ago",
  //     content: (
  //       <>
  //         <img
  //           src="https://www.skwigly.co.uk/wp-content/uploads/2020/09/Regular-show-A1-poster-au-e1447099261159-1280x902-1-e1600348321444.jpg"
  //           alt="Regular Sex"
  //         />
  //         When are they going to have sex together?
  //       </>
  //     ),
  //   },
  //   {
  //     author: "chaucer666",
  //     timestamp: "5 hours ago",
  //     content: (
  //       <>
  //         <div>Whan Zephirus eek with his sweete breeth</div>
  //         <div>Inspired hath in every holt and heeth</div>
  //         <div>The tendre croppes, and the yonge sonne</div>
  //         <div>Hath in the Ram his half cours yronne,</div>
  //       </>
  //     ),
  //   },
  //   {
  //     author: "benko11",
  //     timestamp: "6 days ago",
  //     content: (
  //       <>
  //         When is JG Quintel releasing new episodes of{" "}
  //         <Hashtag name="RegularShow" />
  //         ?????
  //       </>
  //     ),
  //   },
  //   {
  //     author: "chaucer666",
  //     timestamp: "8 days ago",
  //     content: (
  //       <>
  //         <div>And smale foweles maken melodye,</div>
  //         <div>That slepen al the nyght with open ye</div>
  //         <div>(So priketh hem Nature in hir corages),</div>
  //         <div>Thanne longen folk to goon on pilgrimages,</div>
  //       </>
  //     ),
  //   },
  //   {
  //     author: "benko11",
  //     timestamp: "9 days ago",
  //     content: (
  //       <>
  //         <img
  //           src="https://static.tvtropes.org/pmwiki/pub/images/regularshowhq.jpg"
  //           alt="Skips be dripping"
  //         />
  //         <div>
  //           I also lift weights like <Hashtag name="Skips" /> does!
  //         </div>
  //       </>
  //     ),
  //   },
  //   {
  //     author: "hambone_king",
  //     timestamp: "7 days ago",
  //     content: (
  //       <>
  //         <img
  //           src="https://play-images-prod-ctf.tech.tvnz.co.nz/api/v1/web/image/7gPbWAUxEKJdEQt3SfRtZF/82408d005424c415c7db335b4f2361d6/RegularShow_showtile.png.82408d005424c415c7db335b4f2361d6.jpg?width=1200&height=630"
  //           alt="Regular Show"
  //         />
  //         <div>Me and Mordecai mowing the lawn, haha</div>
  //       </>
  //     ),
  //   },
  // ];

  const supabase = await createClient();
  const userId = (await supabase.auth.getUser()).data.user?.id;

  const { data } = await supabase.from("posts").select("*").order("updated_at");

  const posts = await Promise.all(
    // @ts-ignore
    data.map(async (row) => {
      const { data: authorData, error } = await supabase
        .from("user_details")
        .select("nickname")
        .eq("id", row.author_id)
        .single();

      const author = authorData?.nickname ?? null;

      return {
        id: row.id,
        author,
        content: row.content,
        timestamp: row.created_at,
      };
    })
  );

  function renderPosts() {
    const column1Posts: React.ReactNode[] = [];
    const column2Posts: React.ReactNode[] = [];
    const column3Posts: React.ReactNode[] = [];

    if (posts == null) return;

    posts.forEach(({ id, author, content, timestamp }, index) => {
      const post = (
        <Post author={author} timestamp={timestamp}>
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
    });

    return (
      <>
        <div className="flex flex-col gap-4">{column1Posts.map((p) => p)}</div>
        <div className="flex flex-col gap-4">{column2Posts.map((p) => p)}</div>
        <div className="flex flex-col gap-4">{column3Posts.map((p) => p)}</div>
      </>
    );
  }

  return (
    <UltraWideLayout>
      <div className="flex flex-col items-center">
        <form className="pb-8 w-[60%]" action={makePost}>
          <textarea
            name="post"
            id="post"
            placeholder="Share something interesting..."
            className="resize-none aspect-[9/2] bg-default-light text-default-dark p-1 px-2 outline-none opacity-90 hover:opacity-95 focus:opacity-95 w-full"
          ></textarea>
          <button className="bg-default-primary text-default-dark py-2 w-full -mt-2">
            Post
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 grid-rows-1 gap-4">
        {renderPosts()}
      </div>
    </UltraWideLayout>
  );
}
