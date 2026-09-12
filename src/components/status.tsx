import { SITE } from "@/content/site";

/* The dot and the line beside it. Figma: a 7px mark, 12px from the text. */
export function Status({ className }: { className?: string }) {
  return (
    <p className={`status ui ${className ?? ""}`}>
      <span className="status__dot" aria-hidden />
      {SITE.status}
    </p>
  );
}
