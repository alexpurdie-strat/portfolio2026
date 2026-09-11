import { asset } from "@/lib/asset";
import Image from "next/image";

/**
 * The two Figma states read as one interaction: at rest the three cutouts are
 * piled up and rotated — chaos — and the headline reads `Make <???> from
 * chaos.` On hover the pile resolves into an evenly spaced, square-on row, the
 * annotations that mark each piece fade in, and `<???>` resolves to `<beauty>`.
 * The page demonstrates its own tagline.
 *
 * Geometry is taken from the 1440-wide frames. Each cutout is placed at its
 * resolved position and carries the scattered state as a transform, so moving
 * between states is transform-and-opacity only.
 */

const PIECES = [
  {
    key: "tablet",
    src: "/collage-tablet.png",
    width: 528,
    height: 621,
    alt: "A torn-out photograph of a laptop showing a “Design the future” web page.",
  },
  {
    key: "portrait",
    src: "/collage-portrait.png",
    width: 634,
    height: 550,
    alt: "A torn-out collage of a webcam above an old master portrait in a ruffed collar.",
  },
  {
    key: "macbook",
    src: "/collage-macbook.png",
    width: 779,
    height: 718,
    alt: "A torn-out photograph of hands working at a laptop showing a dense data table.",
  },
] as const;

export function HomeHero() {
  return (
    <div className="chaos">
      <div className="collage">
        <div className="collage__stage">
          {PIECES.map((p) => (
            <Image
              key={p.key}
              className={`collage__piece collage__piece--${p.key}`}
              src={asset(p.src)}
              alt={p.alt}
              width={p.width}
              height={p.height}
              sizes="(max-width: 1440px) 40vw, 580px"
              priority
            />
          ))}

          <p className="note note--refine">Refine.</p>
          <p className="note note--inspiration">Opportunity for inspiration?</p>
          <p className="note note--explore">Explore this one more.</p>
          <p className="note note--dig">Dig deeper here!</p>
        </div>
      </div>

      <h1 className="headline">
        Make{" "}
        <span className="headline__slot">
          <span className="headline__word headline__word--chaos">
            {"<???>"}
          </span>
          <span className="headline__word headline__word--resolved">
            {"<beauty>"}
          </span>
        </span>{" "}
        from chaos.
      </h1>
    </div>
  );
}
