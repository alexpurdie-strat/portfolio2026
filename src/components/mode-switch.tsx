"use client";

import { useMode } from "@/lib/mode";

/*
 * The only machined object on a paper desk.
 *
 * In Studio Mode this is a small steel toggle resting on the page — quiet, but
 * physically out of place enough to suggest the paper is not the only way to
 * read this. It is the whole invitation to the other mode, so it has to look
 * like it does something mechanical rather than like a setting.
 *
 * Its *appearance* comes from CSS reading html[data-mode], never from React
 * state. That is what keeps it correct before hydration: the pre-paint script
 * has already set the attribute, so the rocker is on the right side in the
 * first painted frame.
 */
export function ModeSwitch() {
  const { mode, toggle } = useMode();
  const on = mode === "microfilm";

  return (
    <div className="mode-switch">
      <button
        type="button"
        className="mode-switch__body"
        role="switch"
        aria-checked={on}
        onClick={toggle}
      >
        {/* Stays the same in both modes on purpose. A switch's name should
            not change with its state — role="switch" plus aria-checked is
            what announces on/off, and a name that changed text between server
            and client was also a hydration mismatch. */}
        <span className="sr-only">Microfilm reader</span>

        <span className="mode-switch__plate" aria-hidden>
          <span className="mode-switch__legend mode-switch__legend--studio">
            Studio
          </span>
          <span className="mode-switch__well">
            <span className="mode-switch__rocker" />
          </span>
          <span className="mode-switch__legend mode-switch__legend--film">
            Microfilm
          </span>
        </span>

        {/* Lit only when the machine is running. */}
        <span className="mode-switch__lamp" aria-hidden />
      </button>
    </div>
  );
}
