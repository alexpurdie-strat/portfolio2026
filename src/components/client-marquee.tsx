import { asset } from "@/lib/asset";

/*
 * A slow column of client marks down the left gutter.
 *
 * Watermark, not content: it sits behind the page at low opacity, announces
 * nothing to a screen reader, and takes no pointer events. The case study grid
 * leaves columns one and two empty and this is what goes in them — the reading
 * column is unmoved and unaware.
 *
 * Ordered so that marks a reader will recognise fastest arrive first, and so
 * that two versions of the same brand are never adjacent.
 */
const MARKS = [
  ["THD", "The Home Depot"],
  ["BBC", "BBC"],
  ["LEGO", "LEGO"],
  ["NHS", "NHS"],
  ["ITVS", "ITV Studios"],
  ["MS", "M&S"],
  ["TED", "TED"],
  ["JA", "Junior Achievement"],
  ["CFA", "Chick-fil-A"],
  ["LEGO1", "LEGO Foundation"],
  ["MB", "Ministry Brands"],
  ["ITV", "ITV"],
  ["EDSN", "Edisen"],
  ["OSL", "OSL"],
  ["patTED", "play@TED"],
  ["TS", "TaxSlayer"],
  ["SS", "Self Space"],
  ["YM", "Your Move"],
  ["I360", "I360"],
  ["100S", "100 Shapes"],
] as const;

export function ClientMarquee() {
  return (
    <div className="marks" aria-hidden>
      {/* Listed twice so the loop closes on itself: the track travels exactly
          one copy's height and lands where it started. */}
      <div className="marks__track">
        {[0, 1].map((pass) =>
          MARKS.map(([key, name]) => (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              key={`${pass}-${key}`}
              className="marks__mark"
              src={asset(`/logos/${key}.svg`)}
              alt=""
              width={200}
              height={200}
              loading="lazy"
              data-name={name}
            />
          )),
        )}
      </div>
    </div>
  );
}
