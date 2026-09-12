/*
 * AI in the loop.
 *
 * One of exactly two places this site spends its novelty budget. It carries a
 * short note on where AI helped, where it didn't, and what was checked —
 * placed beside the decision it refers to, not collected in a section at the
 * end, because the point is that it was part of the work rather than a
 * postscript about it.
 *
 * Set in the sans face while the prose is serif, so it reads as annotation on
 * the work rather than more of the work.
 */
import { Children, isValidElement } from "react";
import { Todo, TODOS_VISIBLE } from "@/components/todo";

export function Aside({
  kind = "helped",
  children,
}: {
  /** helped · didn't · checked — the three things the brief asks each note to cover. */
  kind?: "helped" | "limit" | "checked";
  children: React.ReactNode;
}) {
  /*
   * An aside whose only content is a hidden note has nothing left to say, and
   * would render as a label standing over an empty box. Drop the whole thing.
   */
  if (!TODOS_VISIBLE) {
    const substantive = Children.toArray(children).filter((c) => {
      if (isValidElement(c) && c.type === Todo) return false;
      return typeof c === "string" ? c.trim().length > 0 : true;
    });
    if (substantive.length === 0) return null;
  }

  const label = {
    helped: "AI in the loop",
    limit: "Where AI fell short",
    checked: "What I checked",
  }[kind];

  return (
    <aside className="aside" data-kind={kind}>
      <p className="label aside__label">{label}</p>
      <div className="aside__body">{children}</div>
    </aside>
  );
}
