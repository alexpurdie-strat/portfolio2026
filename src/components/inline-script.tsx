/*
 * An inline script that runs during HTML parsing, before first paint.
 *
 * The type swap is the point: `text/javascript` on the server so the browser
 * executes it while parsing, `text/plain` on the client so React does not warn
 * about rendering a script tag it can never execute. Scripts inserted by a DOM
 * update never run, so on a soft navigation this is inert by design — whatever
 * the script would have fixed has to be handled in React for that case.
 *
 * Straight from the Next guide at
 * node_modules/next/dist/docs/01-app/02-guides/preventing-flash-before-hydration.md
 */
export function InlineScript({ html }: { html: string }) {
  return (
    <script
      type={typeof window === "undefined" ? "text/javascript" : "text/plain"}
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
