import Image from "next/image";
import type { Entry } from "@/content/work";

/**
 * A pile of plates that unfurls down the open lane beside a case study.
 *
 * Two phases, both driven from `PaperMotion`:
 *
 *   forming   Each plate fades in where it lands, staggered, so the pile
 *             assembles rather than appearing. Photographs of a thing get
 *             put down one at a time.
 *
 *   unfurling Scroll position spreads the pile out down the lane, each plate
 *             peeling off in turn and settling to its own resting angle. It
 *             scrubs — scroll back up and the pile gathers again — because a
 *             pile is a reversible state in a way a tear is not.
 *
 * The spread layout is the DOM's own: plates sit in normal flow with their
 * resting rotations in CSS. The pile is a transform *away* from that toward a
 * common point, so no JavaScript means a plain, readable column of plates
 * rather than a heap in the corner.
 */
export function PlatePile({ plates }: { plates: Entry["plates"] }) {
  if (!plates.length) return null;

  return (
    <aside className="plate-pile" aria-label="Screens from the work">
      {plates.map((plate, i) => (
        <figure
          className="plate-pile__item"
          key={plate.src}
          /* A plate much taller than it is wide takes less of the lane. At the
             standard width the key art alone would render over 1000px high and
             dwarf the rest of the cascade. */
          data-tall={plate.height / plate.width > 1.4 ? "" : undefined}
          /* The stack order of a real pile: first put down is furthest
             under. Carried as a custom property rather than as `z-index`
             itself, because an inline z-index outranks any rule and hovering
             a plate has to be able to bring it to the front. */
          style={{ "--plate-z": plates.length - i } as React.CSSProperties}
        >
          <Image
            className="plate-pile__img"
            src={plate.src}
            alt={plate.alt}
            width={plate.width}
            height={plate.height}
            sizes="(max-width: 1080px) 90vw, 32vw"
            /* Not lazy. Lazy-loading decides from an element's *layout*
               position, and the pile deliberately transforms plates far from
               theirs — so whether a given plate ever loaded came down to
               chance. Measured: layout tops 0/393/829/1264/1987 all sitting
               on screen at ~1540, and one plate silently never decoding. */
            loading="eager"
          />
        </figure>
      ))}
    </aside>
  );
}
