import Image from "next/image";
import { asset } from "@/lib/asset";

/*
 * A reserved place for an image that does not exist yet.
 *
 * Not a broken image and not an empty div: it holds the real aspect ratio so
 * the page reads at its true length, and it states what belongs there and why.
 * An image slot with no brief attached is how a portfolio ends up with a
 * screenshot that proves nothing, so the brief is a required prop.
 *
 * The hygiene gate fails the production build while any of these remain, which
 * is the only version of a placeholder that cannot quietly ship.
 */
export function Slot({
  ratio = "16/10",
  wide = false,
  brief,
  caption,
}: {
  /** Aspect ratio of the intended image, so layout is honest before it lands. */
  ratio?: string;
  /** Breaks the reading column — for anything showing physical context. */
  wide?: boolean;
  /** What image goes here. Specific enough to go and find it. */
  brief: string;
  /** The caption this image will carry. Captions state a decision, not a label. */
  caption?: string;
}) {
  return (
    <figure className="slot" data-wide={wide || undefined}>
      <div className="slot__frame" style={{ aspectRatio: ratio }}>
        <Image
          src={asset("/placeholder.svg")}
          alt=""
          fill
          sizes={wide ? "(max-width: 900px) 100vw, 900px" : "(max-width: 600px) 100vw, 600px"}
          aria-hidden
        />
        <div className="slot__brief">
          <p className="label slot__tag">Image needed · {ratio}</p>
          <p className="slot__text">{brief}</p>
        </div>
      </div>
      {caption ? (
        <figcaption className="slot__caption">
          <span className="label">Caption</span> {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}
