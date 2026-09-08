"use client";

import dynamic from "next/dynamic";

/**
 * Visual feedback toolbar — development only.
 *
 * Click the toolbar to activate, then click any element (or drag a region) and
 * leave a note. Agentation captures the selector, class names and bounding
 * box, so "this is too tight" arrives attached to `.register__body` rather
 * than as a description that has to be guessed at.
 *
 * The import is dynamic on purpose. A static one keeps the package in the
 * module graph even when the render is guarded by NODE_ENV, and it shipped to
 * the production bundle; this way it is its own async chunk that is only ever
 * fetched when the toolbar actually renders.
 *
 * `endpoint` points at the local Agent Sync server, so annotations are posted
 * there and can be read back directly. Without it the toolbar still works and
 * copies structured markdown to the clipboard instead.
 */
const Agentation = dynamic(
  () => import("agentation").then((m) => m.Agentation),
  { ssr: false },
);

export function AgentationToolbar() {
  return <Agentation endpoint="http://localhost:4747" />;
}
