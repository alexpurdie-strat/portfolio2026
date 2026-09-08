import { HomeHero } from "@/components/home-hero";
import { SiteHeader } from "@/components/site-header";

/**
 * The hero sits on the ground. Everything after it is a torn sheet laid over
 * the last, which is what the design system means by "layers, not sections" —
 * and what gives the tear-on-arrival gesture somewhere to live.
 *
 * The three sheets below the intro are placeholders. Copy is scaffolding.
 */
export default function Home() {
  return (
    <>
      <SiteHeader />
      <main id="main" className="site-main">
        <HomeHero />

        <section className="sheet">
          <span className="sheet__paper" aria-hidden />
          <div className="sheet__inner">
            <div className="intro">
              <div className="intro__col">
                <h2 className="intro__label">What I do</h2>
                <p className="intro__body">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et
                  massa mi. Aliquam in hendrerit urna. Pellentesque sit amet
                  sapien fringilla, mattis ligula consectetur, ultrices mauris.
                  Maecenas vitae mattis tellus. Nullam quis imperdiet augue.
                </p>
              </div>
              <div className="intro__col">
                <h2 className="intro__label">Why</h2>
                <p className="intro__body">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et
                  massa mi. Aliquam in hendrerit urna. Pellentesque sit amet
                  sapien fringilla, mattis ligula consectetur, ultrices mauris.
                  Maecenas vitae mattis tellus. Nullam quis imperdiet augue.
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="sheet">
          <span className="sheet__paper" aria-hidden />
          <div className="sheet__inner">
            <div className="intro">
              <div className="intro__col">
                <h2 className="intro__label">Selected work</h2>
                <p className="intro__body">
                  Placeholder. Three or four entries pulled from the archive,
                  led by the ones that carry numbers — Enterprise first.
                </p>
              </div>
              <div className="intro__col">
                <h2 className="intro__label">What it moved</h2>
                <p className="intro__body">
                  Placeholder. The figures, without the write-ups: tasks a
                  month, hours saved, processes streamlined, stores affected.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="sheet">
          <span className="sheet__paper" aria-hidden />
          <div className="sheet__inner">
            <div className="intro">
              <div className="intro__col">
                <h2 className="intro__label">How I work</h2>
                <p className="intro__body">
                  Placeholder. The claims from Approach, condensed to whichever
                  three survive being said out loud.
                </p>
              </div>
              <div className="intro__col">
                <h2 className="intro__label">Ask</h2>
                <p className="intro__body">
                  Placeholder. One line and one link, pointing at the page where
                  the light comes through the tear.
                </p>
              </div>
            </div>
            <p className="aside">
              *Emphasize this, really sell that people are the core of it all.
            </p>
          </div>
        </section>
      </main>
    </>
  );
}
