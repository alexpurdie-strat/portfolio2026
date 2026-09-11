import Image from "next/image";
import { asset } from "@/lib/asset";

/*
 * An image with a caption that states a decision.
 *
 * The caption is required, not optional. The framework's test is whether a
 * reader can get the rationale from captions alone — so a caption that only
 * labels what is in the picture is a failed caption, and there is nowhere in
 * this component to put one.
 */
export function Figure({
  src,
  alt,
  caption,
  width,
  height,
  wide = false,
}: {
  src: string;
  /** Describes the design decision shown, not the file contents. */
  alt: string;
  caption: string;
  width: number;
  height: number;
  /** Breaks out of the reading column, for anything showing context. */
  wide?: boolean;
}) {
  return (
    <figure className="figure" data-wide={wide || undefined}>
      <Image src={asset(src)} alt={alt} width={width} height={height} sizes={wide ? "(max-width: 900px) 100vw, 900px" : "(max-width: 600px) 100vw, 600px"} />
      <figcaption>{caption}</figcaption>
    </figure>
  );
}
