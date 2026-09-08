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
}: {
  eyebrow?: string;
  title: string;
  standfirst?: string;
}) {
  return (
    <>
      <header className="masthead">
        {eyebrow ? <p className="masthead__eyebrow">{eyebrow}</p> : null}
        <h1 className="masthead__title">{title}</h1>
      </header>
      {standfirst ? <p className="masthead__standfirst">{standfirst}</p> : null}
    </>
  );
}
