import Post from "@/app/components/Post";
import Hashtag from "@/app/components/Hashtag";

export default function Page() {
  return (
    <div className="flex justify-center py-6">
      <div className="w-[1100px] max-w-[95%]">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 grid-rows-1 gap-4">
          <div className="flex flex-col gap-4">
            <Post author="benko11" timestamp="26 minutes ago">
              I like gay sex and that is very important to know about me and
              fucking everyooooone! aAAAAAAA
            </Post>
            <Post author="horny_benson" timestamp="41 minutes ago">
              <img
                src="https://www.skwigly.co.uk/wp-content/uploads/2020/09/Regular-show-A1-poster-au-e1447099261159-1280x902-1-e1600348321444.jpg"
                alt="Regular Sex"
              />
              When are they going to have sex together?
            </Post>
            <Post author="chaucer666" timestamp="8 days ago">
              <div>And smale foweles maken melodye,</div>
              <div>That slepen al the nyght with open ye</div>
              <div>(So priketh hem Nature in hir corages),</div>
              <div>Thanne longen folk to goon on pilgrimages,</div>
            </Post>
            <Post author="benko11" timestamp="4 days ago">
              <div className="text-2xl">
                We are accidents waiting to happen.
              </div>
            </Post>
          </div>

          <div className="flex flex-col gap-4">
            <Post author="horny_benson" timestamp="3 hours ago">
              <div>
                Fucking hell, when is Benson going to have sex with Mordecai,
                um, CANONNICALLY? I CANNOT BEAR IT NOT EXISTING
              </div>
              <div>
                I am so sad about this shit not happening yet, like what the
                fuck is this shit even?!
              </div>
            </Post>

            <Post author="chaucer666" timestamp="5 hours ago">
              <div>Whan Zephirus eek with his sweete breeth</div>
              <div>Inspired hath in every holt and heeth</div>
              <div>The tendre croppes, and the yonge sonne</div>
              <div>Hath in the Ram his half cours yronne,</div>
            </Post>

            <Post author="benko11" timestamp="9 days ago">
              <img
                src="https://static.tvtropes.org/pmwiki/pub/images/regularshowhq.jpg"
                alt="Skips be dripping"
              />
              <div>
                I also lift weights like <Hashtag name="Skips" /> does!
              </div>
            </Post>
          </div>

          <div className="flex flex-col gap-4">
            <Post author="chaucer666" timestamp="2 days ago">
              <div>Whan that Aprill with his shoures soote</div>
              <div>The droghte of March hath perced to the roote,</div>
              <div>And bathed every veyne in swich licour</div>
              <div>Of which vertu engendred is the flour;</div>
            </Post>
            <Post author="benko11" timestamp="6 days ago">
              <div>
                When is JG Quintel releasing new episodes of{" "}
                <Hashtag name="RegularShow" />
                ?????
              </div>
            </Post>
            <Post author="hambone_king" timestamp="7 days ago">
              <img
                src="https://play-images-prod-ctf.tech.tvnz.co.nz/api/v1/web/image/7gPbWAUxEKJdEQt3SfRtZF/82408d005424c415c7db335b4f2361d6/RegularShow_showtile.png.82408d005424c415c7db335b4f2361d6.jpg?width=1200&height=630"
                alt="Regular Show"
              />
              <div>Me and Mordecai mowing the lawn, haha</div>
            </Post>
          </div>
        </div>
      </div>
    </div>
  );
}
