/**
 * A page opens with its title set on the paper itself.
 *
 * This used to lay a torn sheet behind the title. It was removed: the site
 * header is already a torn band, so a second one directly beneath it read as
 * two stacked bands with a seam between them rather than as layered paper.
 */
export function PageMasthead({
  eyebrow,
  title,
  standfirst,
  frame = "Title",
}: {
  eyebrow?: string;
  title: string;
  standfirst?: string;
  /* Names this block as a frame for the microfilm transport. It is an
     attribute on an element that already exists rather than a wrapper,
     because the prose becomes `display: contents` on a phone and the plates
     interleave through it by `order` — a new element in that flow would
     break the weaving. */
  frame?: string;
}) {
  return (
    <>
      <header className="masthead" data-frame={frame}>
        {eyebrow ? <p className="masthead__eyebrow">{eyebrow}</p> : null}
        <h1 className="masthead__title">{title}</h1>
      </header>
      {standfirst ? <p className="masthead__standfirst">{standfirst}</p> : null}
    </>
  );
}
