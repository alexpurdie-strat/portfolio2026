import type { MDXComponents } from "mdx/types";
import { Aside } from "@/components/aside";
import { Challenge } from "@/components/challenge";
import { Figure } from "@/components/figure";
import { Metrics } from "@/components/metrics";
import { Slot } from "@/components/slot";
import { Todo } from "@/components/todo";

/*
 * The components MDX content can reach for.
 *
 * Deliberately small. The brief spends its whole novelty budget on named ideas
 * and the AI-in-the-loop notes, so the only bespoke thing a case study can
 * place in its own prose is an <Aside>. Everything else is ordinary markup.
 */
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return { Aside, Challenge, Figure, Metrics, Slot, Todo, ...components };
}
