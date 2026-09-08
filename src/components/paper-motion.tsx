"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * Motion means physics, not decoration.
 *
 * Two behaviours, both gated on `prefers-reduced-motion` and both opt-in from
 * here rather than from CSS alone — the page has to be correct when this never
 * runs, so nothing is hidden or displaced until we know we can put it back.
 *
 *   --lag   Things resting on the page lag it. Ground is fixed, sheets and
 *           text move exactly with the document, and notes — which are written
 *           on top of the canvas, not set into it — trail by a few pixels and
 *           settle. Three depths, three behaviours.
 *
 *   ink     Handwriting has a direction and a duration, so a note strokes on
 *           once as it comes into view rather than fading in like type.
 *
 *   --ptr   Objects on a desk shift as you lean over them. Normalised pointer
 *           position, -1 to 1, which the collage pieces scale by their own
 *           depth. Written only while a stage is on the page.
 *
 * One rAF loop and one custom property on the root for the whole page, so the
 * per-frame cost is a single style write no matter how many notes are up.
 */
/* Survives the remounts that route changes cause, so the header's entrance
   plays once per document and not once per navigation. */
let laid = false;

/* The pile opens once per document. Survives the effect re-running — on
   navigation, and twice over under Strict Mode — so the reader never has to
   watch it assemble a second time. */
let unfurled = false;

export function PaperMotion() {
  const pathname = usePathname();

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduced.matches) return;

    const root = document.documentElement;
    /* tells the stylesheet the masks are safe to apply, because something is
       now guaranteed to take them off again */
    root.setAttribute("data-motion", "");

    if (!laid) {
      laid = true;
      /* The unfurl is held until the torn paper has actually decoded — on a
         throttled connection it was finishing while the image was still
         `naturalWidth: 0`, so the site's one deliberate entrance played on an
         empty box. `data-laid` is then set from `animationend` rather than a
         guessed delay, with a timeout only as a backstop for the case where
         the animation never runs at all. */
      const texture = document.querySelector<HTMLElement>(
        ".site-header__texture",
      );
      const paper = texture?.querySelector("img");

      const arrived = () => {
        root.setAttribute("data-paper", "");
        texture?.addEventListener(
          "animationend",
          () => root.setAttribute("data-laid", ""),
          { once: true },
        );
        window.setTimeout(() => root.setAttribute("data-laid", ""), 2600);
      };

      if (paper && !paper.complete) {
        paper.addEventListener("load", arrived, { once: true });
        paper.addEventListener("error", arrived, { once: true });
      } else {
        arrived();
      }
    }

    /* ── 2: the cutouts arrive rather than appear ──────────────────────────
       Staggered 60ms apart, inside the 30-80ms band a group entrance wants.
       The stagger is per-image and fires off its own load, so a piece that
       decodes late still gets its own soft arrival instead of popping. */
    document
      .querySelectorAll<HTMLImageElement>(".collage__piece")
      .forEach((piece, i) => {
        const show = () =>
          window.setTimeout(
            () => piece.setAttribute("data-loaded", ""),
            i * 60,
          );
        /* async path only — see the plates above */
        const showAndWake = () => {
          show();
          kick();
        };
        if (piece.complete) show();
        else {
          piece.addEventListener("load", showAndWake, { once: true });
          piece.addEventListener("error", showAndWake, { once: true });
        }
      });

    /* ── the figures count up ──────────────────────────────────────────────
       Against my own recommendation, on request. Built to answer the
       objection rather than ignore it: the true value is what the server
       renders and what the DOM ends on, the run is short, and it happens once.
       A reader who arrives mid-count sees a wrong number for at most 700ms;
       one who arrives after sees only the truth.

       Values carry prefixes and suffixes — "25,000+", "£400k", "20+" — so the
       number is parsed out and the surrounding characters preserved verbatim,
       and the original string is restored exactly at the end rather than
       reformatted from the number. */
    type Counter = {
      el: HTMLElement;
      original: string;
      prefix: string;
      suffix: string;
      target: number;
      grouped: boolean;
    };

    const counters: Counter[] = [];
    document.querySelectorAll<HTMLElement>(".metrics__value").forEach((el) => {
      /* From the attribute, never from textContent. This effect re-runs — on
           navigation, and twice over under Strict Mode — and the first pass
           zeroes the text. Reading the DOM back would then parse "0+", hit the
           `target <= 0` guard, and silently leave every figure at zero. */
      const original = el.dataset.value ?? el.textContent ?? "";
      const parts = original.match(/^([^\d]*)([\d,.]+)(.*)$/);
      if (!parts) return;
      const target = Number(parts[2].replace(/,/g, ""));
      if (!Number.isFinite(target) || target <= 0) return;
      counters.push({
        el,
        original,
        prefix: parts[1],
        suffix: parts[3],
        target,
        grouped: parts[2].includes(","),
      });
    });

    const runCount = (c: Counter) => {
      const started = performance.now();
      const DURATION = 700;
      const frame = () => {
        const t = Math.min(1, (performance.now() - started) / DURATION);
        /* ease-out cubic: the figure slows into its real value */
        const eased = 1 - Math.pow(1 - t, 3);
        if (t < 1) {
          const n = Math.round(c.target * eased);
          c.el.textContent =
            c.prefix +
            (c.grouped ? n.toLocaleString(undefined) : String(n)) +
            c.suffix;
          requestAnimationFrame(frame);
        } else {
          /* restore the authored string, never a reformatted number */
          c.el.textContent = c.original;
        }
      };
      requestAnimationFrame(frame);
    };

    /* --- notes write themselves, once each ------------------------------

       Deliberately not an IntersectionObserver. A jump scroll — the End key, a
       hash link, a fast wheel — can carry a note from below the viewport to
       above it between frames, and the observer never sees it intersect, so it
       never fires and the note stays masked and invisible for good. Checking
       position in the loop cannot skip anything: once a note's top is past the
       threshold it is written, whether it got there gradually or instantly.

       The cost is a handful of reads on the few notes still pending, every
       sixth frame, and it stops entirely once the last one is written. */
    /* Below the lane the notes are in the flow, so the depth trail and the
       pile both stop making sense — there is nothing for them to be beside. */
    const wideLane = window.matchMedia("(min-width: 1081px)").matches;

    let pending = Array.from(
      document.querySelectorAll<HTMLElement>(".mnote__inner"),
    );

    const write = () => {
      if (!pending.length) return;
      const line = window.innerHeight * 0.88;
      const still: HTMLElement[] = [];
      for (const note of pending) {
        if (note.getBoundingClientRect().top < line) {
          note.setAttribute("data-written", "");
        } else {
          still.push(note);
        }
      }
      pending = still;
    };
    write();

    /* ── the plate pile: piled on load, opened once on first scroll ──────
       Not a scrub. Scrubbing meant the reader had to keep scrolling to hold
       it open and re-did the whole gesture on the way back up; the pile now
       falls open the moment they start moving and stays open for the life of
       the document.

       Which makes it predetermined motion, so it belongs in CSS: the pile is
       set as inline `translate`/`rotate`/`scale`, and opening it is a
       transition back to identity with a per-plate delay. No rAF involvement
       at all — the loop no longer knows the pile exists. */
    const pile = document.querySelector<HTMLElement>(".plate-pile");
    const plates = pile
      ? Array.from(pile.querySelectorAll<HTMLElement>(".plate-pile__item"))
      : [];

    /* Per-plate character, so no two land the same way. Modelled on the home
       collage, whose drama comes from travel and a scale-down: pieces are
       larger and heavily overlapped when piled, and settle smaller and apart. */
    const PILE_ROT = [-8, 6.5, -4.5, 9, -7, 3.5];
    const PILE_X = [-9, 16, -5, 19, -12, 8];
    const PILE_SCALE = 0.16;

    plates.forEach((plate, i) => {
      const img = plate.querySelector("img");
      const show = () =>
        window.setTimeout(() => plate.setAttribute("data-loaded", ""), i * 80);
      /* A decode reflows the page, which can carry a note or a figure into
         view with no scroll to notice it — so a late arrival wakes the
         position checks. Only the async path does this: a cached image runs
         `show` synchronously during setup, before `kick` exists, and calling
         it there threw a TDZ error on every page with imagery. */
      const showAndWake = () => {
        show();
        kick();
      };
      if (!img || img.complete) show();
      else {
        img.addEventListener("load", showAndWake, { once: true });
        img.addEventListener("error", showAndWake, { once: true });
        /* Backstop. These plates are hidden by a rule only this script can
           lift, so no path may leave one invisible. Late is fine; never is
           not. */
        window.setTimeout(show, 2200);
      }
    });

    /* Gather everything onto the top plate. `offsetTop` is layout-based and so
       unaffected by the transforms we apply, which makes it a stable read of
       where each plate belongs. */
    const gather = () => {
      if (unfurled || !wideLane) return;
      plates.forEach((plate, i) => {
        plate.style.transitionProperty = "none";
        /* 6px of stack per plate: enough to read as several sheets, not
           enough to look like a staircase */
        plate.style.translate = `${PILE_X[i % PILE_X.length]}px ${
          i * 6 - plate.offsetTop
        }px`;
        plate.style.rotate = `${PILE_ROT[i % PILE_ROT.length]}deg`;
        plate.style.scale = String(1 + PILE_SCALE);
      });
    };

    const open = () => {
      if (unfurled || !wideLane) return;
      unfurled = true;
      plates.forEach((plate, i) => {
        plate.style.transitionProperty = "translate, rotate, scale";
        plate.style.transitionDuration = "900ms";
        plate.style.transitionTimingFunction =
          "cubic-bezier(0.22, 0.61, 0.36, 1)";
        plate.style.transitionDelay = `${i * 85}ms`;
        plate.style.translate = "0px 0px";
        plate.style.rotate = "0deg";
        plate.style.scale = "1";
      });
    };

    gather();
    /* `once` is the whole point: the first flick of the wheel opens it and the
       listener is gone. Scrolling back up leaves it open. */
    window.addEventListener("scroll", open, { once: true, passive: true });
    /* until it opens, a resize changes where the plates belong */
    window.addEventListener("resize", gather, { passive: true });

    /* ── the cursor shoves the plates about ───────────────────────────────
       A finger run across a desk pushes the paper piled on it aside. Each
       plate is displaced away from the pointer, strongest close to and fading
       out over PUSH_REACH.

       The plate the cursor is actually over is exempt — it gets no push at
       all. That is both the physical reading (it is the sheet under your
       finger, not one being nudged past) and the thing that keeps hovering
       possible: a plate that fled the pointer would be a plate you could
       never land on, and the hover reveal above depends on landing.

       Written to --push-x/--push-y on each plate, which the stylesheet
       composes into `transform` — `translate`/`rotate`/`scale` belong to the
       unfurl and must not be touched here. */
    const PUSH_MAX = 15;
    const PUSH_REACH = 215;
    const pushX = new Map<HTMLElement, number>();
    const pushY = new Map<HTMLElement, number>();
    let mx = -1;
    let my = -1;
    let pushWritten = "";

    /* A coarse pointer has no hover and no meaningful position, and a tap
       would shove the pile once and leave it shoved. */
    const finePointer = window.matchMedia(
      "(hover: hover) and (pointer: fine)",
    ).matches;

    const onPilePointer = (event: PointerEvent) => {
      mx = event.clientX;
      my = event.clientY;
      kick();
    };
    const onPileLeave = () => {
      mx = -1;
      my = -1;
      kick();
    };
    if (plates.length && finePointer) {
      window.addEventListener("pointermove", onPilePointer, { passive: true });
      document.addEventListener("pointerleave", onPileLeave);
    }

    /* Keep a plate above its neighbours for a beat after the cursor leaves,
       so it is flat again before it drops back into the stack. Without this it
       falls behind while still visibly raised, which flickers when the cursor
       crosses between two plates.

       Done here rather than in CSS because `transition: z-index` does not run
       in this engine at all — an isolated test reports zero animations for it. */
    const lingerTimers = new Map<HTMLElement, number>();
    const onPileOut = (event: PointerEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const fig = target.closest<HTMLElement>(".plate-pile__item");
      if (!fig) return;
      window.clearTimeout(lingerTimers.get(fig));
      fig.setAttribute("data-recent", "");
      lingerTimers.set(
        fig,
        window.setTimeout(() => fig.removeAttribute("data-recent"), 260),
      );
    };
    if (pile && finePointer) {
      pile.addEventListener("pointerout", onPileOut);
    }

    const shove = () => {
      if (!plates.length || !finePointer) return false;
      let moving = false;

      for (const plate of plates) {
        let tx = 0;
        let ty = 0;

        if (mx >= 0) {
          const b = plate.getBoundingClientRect();
          /* distance from the pointer to the plate's box — zero when inside */
          const dx = Math.max(b.left - mx, 0, mx - b.right);
          const dy = Math.max(b.top - my, 0, my - b.bottom);
          const d = Math.hypot(dx, dy);

          if (d > 0 && d < PUSH_REACH) {
            const cx = (b.left + b.right) / 2;
            const cy = (b.top + b.bottom) / 2;
            const vx = cx - mx;
            const vy = cy - my;
            const len = Math.hypot(vx, vy) || 1;
            /* squared falloff: barely anything at the edge of reach, a firm
               shove up close */
            const f = (1 - d / PUSH_REACH) ** 2;
            tx = (vx / len) * PUSH_MAX * f;
            ty = (vy / len) * PUSH_MAX * f;
          }
        }

        /* eased in JS rather than in CSS, so the paper has weight without the
           pointer feeling like it is dragging a rubber band */
        const cx0 = pushX.get(plate) ?? 0;
        const cy0 = pushY.get(plate) ?? 0;
        const nx = cx0 + (tx - cx0) * 0.18;
        const ny = cy0 + (ty - cy0) * 0.18;
        /* Snap the residue to zero, and judge "still moving" on the snapped
           value. Testing the raw one meant a leftover 0.001 counted as motion
           and held the animation loop awake for the life of the tab. */
        const sx = Math.abs(nx) < 0.02 ? 0 : nx;
        const sy = Math.abs(ny) < 0.02 ? 0 : ny;
        pushX.set(plate, sx);
        pushY.set(plate, sy);
        if (sx !== 0 || sy !== 0 || tx !== 0 || ty !== 0) moving = true;
      }

      const stamp = plates
        .map(
          (p) =>
            `${(pushX.get(p) ?? 0).toFixed(2)},${(pushY.get(p) ?? 0).toFixed(2)}`,
        )
        .join("|");
      if (stamp !== pushWritten) {
        for (const plate of plates) {
          plate.style.setProperty(
            "--push-x",
            `${(pushX.get(plate) ?? 0).toFixed(2)}px`,
          );
          plate.style.setProperty(
            "--push-y",
            `${(pushY.get(plate) ?? 0).toFixed(2)}px`,
          );
        }
        pushWritten = stamp;
      }
      return moving;
    };

    /* Register rows arrive on the same trigger as everything else. The
       stagger is applied only across rows that cross in the same pass — a row
       reached on its own should not sit waiting out an index-based delay. */
    let arriving = Array.from(
      document.querySelectorAll<HTMLElement>(".register"),
    );
    const arrive = () => {
      if (!arriving.length) return;
      const line = window.innerHeight * 0.9;
      const still: HTMLElement[] = [];
      let batch = 0;
      for (const row of arriving) {
        if (row.getBoundingClientRect().top < line) {
          row.style.transitionDelay = `${batch * 60}ms`;
          batch += 1;
          row.setAttribute("data-arrived", "");
        } else {
          still.push(row);
        }
      }
      arriving = still;
    };
    arrive();

    /* Same trigger as the notes, for the same reason: a jump scroll must not
       be able to skip a figure and leave it counting from nothing. */
    let counting = counters;
    const countVisible = () => {
      if (!counting.length) return;
      const line = window.innerHeight * 0.9;
      const still: Counter[] = [];
      for (const c of counting) {
        if (c.el.getBoundingClientRect().top < line) runCount(c);
        else still.push(c);
      }
      counting = still;
    };
    /* Zeroed up front, not at the moment each one starts. A figure below the
       fold that kept its real value until it scrolled into view would be seen
       dropping to zero and climbing back — worse than never showing it. */
    for (const c of counters) {
      c.el.textContent = `${c.prefix}0${c.suffix}`;
    }
    countVisible();

    /* --- sheets tear open as you scroll them in --------------------------

       Scroll-driven rather than fired-and-forgotten, so the tear unfurls
       under the reader's own hand and at their own speed — a gesture you can
       watch, and stop halfway, rather than one that has usually finished by
       the time you have noticed it.

       Monotonic on purpose: paper tears, it does not un-tear, so scrolling
       back up leaves the sheet torn. And a sheet parked at the foot of the
       document can never be scrolled far enough to finish on its own, so
       hitting the bottom completes whatever is left. */
    let ripping = Array.from(
      document.querySelectorAll<HTMLElement>(".sheet__paper"),
    );
    const ripped = new WeakMap<HTMLElement, number>();

    /* The elements that actually read --lag and --ptr-*. Writing to these
       instead of to <html> is the whole point of scoping: a custom property
       set on the root invalidates the computed style of every element in the
       document, every frame it changes. */
    const lagging = Array.from(
      document.querySelectorAll<HTMLElement>(".mnote__inner"),
    );
    const pieces = Array.from(
      document.querySelectorAll<HTMLElement>(".collage__piece"),
    );

    const rip = () => {
      if (!ripping.length) return;
      const vh = window.innerHeight;
      /* the tear starts just inside the lower edge and finishes around the
         middle, so roughly 40% of a screen of scrolling is spent on it */
      const from = vh * 0.95;
      const to = vh * 0.5;
      const atBottom =
        window.scrollY + vh >= document.documentElement.scrollHeight - 4;

      const still: HTMLElement[] = [];
      for (const sheet of ripping) {
        const top = sheet.getBoundingClientRect().top;
        const t = atBottom
          ? 1
          : Math.max(0, Math.min(1, (from - top) / (from - to)));
        if (t > (ripped.get(sheet) ?? 0)) {
          ripped.set(sheet, t);
          sheet.style.setProperty("--rip", `${(t * 112).toFixed(1)}%`);
        }
        if ((ripped.get(sheet) ?? 0) < 1) still.push(sheet);
      }
      ripping = still;
    };
    rip();

    /* --- objects shift as you lean over them ----------------------------- */
    const stage = document.querySelector(".collage__stage");
    let ptrX = 0;
    let ptrY = 0;
    let ptrTargetX = 0;
    let ptrTargetY = 0;
    let ptrWritten = "";

    const onPointer = (event: PointerEvent) => {
      const box = stage!.getBoundingClientRect();
      /* -1 to 1 from the stage's own centre, so the deflection is about the
         collage rather than about the window */
      ptrTargetX = Math.max(
        -1,
        Math.min(
          1,
          (event.clientX - (box.left + box.width / 2)) / (box.width / 2),
        ),
      );
      ptrTargetY = Math.max(
        -1,
        Math.min(
          1,
          (event.clientY - (box.top + box.height / 2)) / (box.height / 2),
        ),
      );
      kick();
    };
    const onLeave = () => {
      ptrTargetX = 0;
      ptrTargetY = 0;
      kick();
    };
    if (stage) {
      window.addEventListener("pointermove", onPointer, { passive: true });
      document.addEventListener("pointerleave", onLeave);
    }

    /* --- what rests on the page trails it -------------------------------- */
    const MAX = 9;
    let raf = 0;
    let running = false;
    let last = window.scrollY;
    let velocity = 0;
    let lag = 0;
    let written = "";

    const tick = () => {
      const y = window.scrollY;
      const delta = y - last;
      last = y;

      /* velocity is smoothed so a trackpad's jitter does not shake the notes,
         and lag chases it and settles rather than snapping back */
      velocity = velocity * 0.82 + delta * 0.18;
      const target = Math.max(-MAX, Math.min(MAX, -velocity * 1.6));
      lag += (target - lag) * 0.12;
      if (Math.abs(lag) < 0.01) lag = 0;

      /* Every frame, not every sixth. The throttle counted frames inside a
         condition tied to `pending`, so the moment the notes were all written
         the counter froze and the figure and row checks stopped firing
         altogether. Each of these returns immediately once its list is empty,
         and while the loop is awake at all we are already scrolling. */
      write();
      countVisible();
      arrive();
      const shoving = shove();
      rip();

      if (stage) {
        ptrX += (ptrTargetX - ptrX) * 0.14;
        ptrY += (ptrTargetY - ptrY) * 0.14;
        const ptr = `${ptrX.toFixed(3)}|${ptrY.toFixed(3)}`;
        if (ptr !== ptrWritten) {
          for (const piece of pieces) {
            piece.style.setProperty("--ptr-x", ptrX.toFixed(3));
            piece.style.setProperty("--ptr-y", ptrY.toFixed(3));
          }
          ptrWritten = ptr;
        }
      }

      const next = `${lag.toFixed(2)}px`;
      if (wideLane && next !== written) {
        for (const note of lagging) {
          note.style.setProperty("--lag", next);
        }
        written = next;
      }

      /* Park when there is nothing left to compute. Without this the loop
         wakes the main thread ~60 times a second for the life of the tab,
         integrating zeros — measured at 61 wakeups/sec with every note
         written, every sheet torn and the page at rest. */
      /* Only motion in progress keeps this awake. The position checks —
         notes, figures, rows — are all scroll-triggered, and scroll kicks the
         loop, so waiting on them here just spins.

         That mattered as soon as the margin note moved to the foot of the
         page: `pending` stayed non-empty until the reader scrolled that far,
         which held the loop at 30 wakeups a second for the whole visit. */
      const busy =
        shoving ||
        lag !== 0 ||
        Math.abs(velocity) > 0.01 ||
        (stage !== null && (ptrX !== ptrTargetX || ptrY !== ptrTargetY));

      if (busy) {
        raf = requestAnimationFrame(tick);
      } else {
        running = false;
      }
    };

    /* Anything that can create work restarts the loop. `last` is re-seeded on
       the way in, or the scroll delta accumulated while parked would land as
       one enormous velocity spike and throw the notes. */
    const kick = () => {
      /* Check straight away as well as on the next frame. The loop parks when
         nothing is animating, so a jump scroll — End, a hash link — must not
         depend on it happening to be awake. */
      write();
      countVisible();
      arrive();
      if (running) return;
      running = true;
      last = window.scrollY;
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("scroll", kick, { passive: true });
    window.addEventListener("resize", kick, { passive: true });
    kick();

    return () => {
      cancelAnimationFrame(raf);
      running = false;
      window.removeEventListener("pointermove", onPilePointer);
      document.removeEventListener("pointerleave", onPileLeave);
      pile?.removeEventListener("pointerout", onPileOut);
      for (const timer of lingerTimers.values()) window.clearTimeout(timer);
      for (const plate of plates) plate.removeAttribute("data-recent");
      window.removeEventListener("scroll", open);
      window.removeEventListener("resize", gather);
      window.removeEventListener("scroll", kick);
      window.removeEventListener("resize", kick);
      window.removeEventListener("pointermove", onPointer);
      document.removeEventListener("pointerleave", onLeave);
      root.removeAttribute("data-motion");
      /* A torn-down run must not leave zeroes on screen — text is not
         CSS-gated, so it has to be put back by hand.

         Rows deliberately are NOT revealed here. Removing data-motion above
         already un-hides every one of them, and marking them arrived instead
         meant that under Strict Mode's immediate teardown the whole list was
         revealed before the second run could animate anything. */
      for (const c of counters) c.el.textContent = c.original;
      /* transforms are ours, not the stylesheet's, so they must be handed
         back — the CSS resting rotation takes over again */
      for (const plate of plates) {
        plate.style.removeProperty("translate");
        plate.style.removeProperty("rotate");
        plate.style.removeProperty("scale");
        plate.style.removeProperty("transition-property");
        plate.style.removeProperty("transition-duration");
        plate.style.removeProperty("transition-timing-function");
        plate.style.removeProperty("transition-delay");
        plate.style.removeProperty("--push-x");
        plate.style.removeProperty("--push-y");
      }
      for (const note of lagging) note.style.removeProperty("--lag");
      for (const piece of pieces) {
        piece.style.removeProperty("--ptr-x");
        piece.style.removeProperty("--ptr-y");
      }
    };
  }, [pathname]);

  return null;
}
