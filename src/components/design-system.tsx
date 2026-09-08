import Image from "next/image";
import { MarginNote } from "@/components/margin-note";

/**
 * A living style guide: everything below is rendered with the site's own
 * tokens, faces and components, so it drifts only if the system drifts.
 */

const NEUTRALS = [
  {
    token: "--background",
    value: "#faf7ef",
    note: "The ground. Everything sits on it; nothing else is a surface. Near-white and warm — it should read as a solid colour and only just fail to.",
  },
  {
    token: "--ground-dust",
    value: "SVG turbulence",
    note: "Sparse speckle over the ground, discrete alpha so it lands as specks rather than haze. The only applied grain in the system, and the one knob for how used the page looks.",
  },
  {
    token: "--foreground",
    value: "#414141",
    note: "Ink. Soft black — never #000, which reads as screen rather than print.",
  },
  {
    token: "sheet",
    value: "#f7f7f6",
    note: "Torn sheet white. Only ever paper laid on top of paper.",
  },
];

const ACCENTS = [
  {
    token: "--accent-green",
    value: "#424c32",
    note: "Deep green, sits darker than the ink. For emphasis that should feel considered rather than urgent.",
  },
  {
    token: "--accent-green-wash",
    value: "#909e7b",
    note: "Same hue at wash weight. Grounds, rules, quiet fills.",
  },
  {
    token: "--accent-amber",
    value: "#b87e30",
    note: "Warm yellow. Reads at small sizes without shouting.",
  },
  {
    token: "--accent-amber-wash",
    value: "#e6b067",
    note: "Highlighter weight. The pen you'd actually pick up.",
  },
  {
    token: "--accent-orange",
    value: "#a86225",
    note: "Between amber and rust, for when amber is too sweet.",
  },
];

const VOICES = [
  {
    face: "Martina Plantijn",
    role: "The published voice",
    detail:
      "Variable, 300–900, roman and italic. Carries everything considered: display statements, headings, body copy, navigation. Light italic for labels and nav, roman for reading, Black for titles and numerals.",
    sample: "Make beauty from chaos.",
    className: "ds__spec ds__spec--serif",
  },
  {
    face: "The Blank Weirdos",
    role: "The hand",
    detail:
      "Four static cuts (the base has 518 glyphs, Alt 1–3 are 392-glyph alternates). Annotations, marginalia, notes-to-self. Never body copy, never navigation, never load-bearing.",
    sample: "Pull this... nobody wants to see the process...unless?",
    className: "ds__spec ds__spec--hand",
  },
  {
    face: "Cutive Mono",
    role: "The seam",
    detail:
      "Not a filing system — a deliberate glitch. Where metadata appears it is written as the source that would have produced the interface, left unrendered, as though the component failed to style. On an archive entry that is the client, set as a half-closed tag — <class=&quot;company&quot;&gt;ITV&gt; — sitting directly above the tag block, so an entry's metadata reads as one fragment that never got rendered. It anchors a paper metaphor to the fact that this is product design for screens. Rare by design: something extra for whoever can read it, invisible to whoever cannot.",
    sample: "--- tags:\n - viewport/mobile\n - audience/education",
    className: "ds__spec ds__spec--mono",
  },
];

const TAGS_SPECIMEN = `---
tags:
 - viewport/mobile
 - audience/education
 - behavior/interactive`;

const PUBLISHED_SCALE = [
  {
    role: "Display",
    token: "--text-display",
    px: "96px",
    wght: 600,
    italic: false,
  },
  {
    role: "Page title",
    token: "--text-title",
    px: "86px",
    wght: 600,
    italic: false,
  },
  {
    role: "Entry title",
    token: "--text-heading",
    px: "36px",
    wght: 400,
    italic: true,
  },
  {
    role: "Standfirst",
    token: "--text-aside",
    px: "32px",
    wght: 400,
    italic: true,
  },
  { role: "Lead", token: "--text-lead", px: "23px", wght: 400, italic: false },
  {
    role: "Subhead",
    token: "--text-subhead",
    px: "22px",
    wght: 400,
    italic: true,
  },
  {
    role: "Shelf mark",
    token: "--text-mark",
    px: "19px",
    wght: 700,
    italic: false,
  },
  { role: "Body", token: "--text-body", px: "19px", wght: 400, italic: false },
  { role: "Label", token: "--text-label", px: "14px", wght: 300, italic: true },
];

const WEIGHTS = [
  { token: "--wght-label", value: "300", use: "Labels, navigation, eyebrows" },
  {
    token: "--wght-body",
    value: "400",
    use: "Reading copy, and every italic heading",
  },
  { token: "--wght-display", value: "600", use: "Display and page titles" },
  {
    token: "--wght-numeral",
    value: "700",
    use: "Hanging numerals, metric figures, emphasis",
  },
  {
    token: "— reserved —",
    value: "900",
    use: "The wordmark's hover, and nothing else",
  },
];

const PRINCIPLES = [
  {
    n: "01",
    title: "The page is a surface, not a screen",
    body: "The ground is a near-solid warm field, and what little sits on it divides by behaviour: the light is fixed to the viewport because light belongs to the room, and the dust scrolls because it sits on the page. Nothing reads as a backdrop sliding beneath the content, which is the one thing that would break the illusion the site depends on.",
  },
  {
    n: "02",
    title: "Layers, not sections",
    body: "Divisions are torn edges revealing the sheet underneath. Where two regions meet they overlap on continuous paper — never a rule, a border, a card, or a gap showing the background between them.",
  },
  {
    n: "03",
    title: "Leave the hand in",
    body: "Annotations, corrections and second thoughts stay visible. The working notes are not decoration; they are the argument that the thinking is real. They are also never load-bearing — remove every one and no information is lost.",
  },
  {
    n: "04",
    title: "Order is earned, not assumed",
    body: "The home page opens in disarray and resolves on hover: scattered cutouts square up, annotations arrive, and <???> becomes <beauty>. The interaction is the thesis, not an effect applied to it.",
  },
  {
    n: "05",
    title: "Colour stays out of the way",
    body: "Two neutrals and one ink carry the page. Accents are drawn from the photography rather than chosen against it, so introducing them keeps the page and the pictures the same material.",
  },
  {
    n: "06",
    title: "Let the seam show",
    body: "This is a physical metaphor for a screen-based practice, and once in a while the metaphor should fail on purpose. Tags are not pills; they are the source that would have produced pills, left unstyled — a component that didn't render. Sparingly, and only where it rewards someone who can read it.",
  },
];

const TEXTURE = [
  [
    "Three depths, and only three",
    "The ground is the reproduction itself — near-solid, optical rather than material, and it casts nothing. Sheets are opaque white paper laid on it with torn edges; they are what divides a page. Objects are photographs torn out and placed. Nothing in the system is a fourth thing.",
  ],
  [
    "Nothing is blurred",
    "The ground used to carry 1.5px to soften a tile that no longer exists. Now everything is sharp: no frosted glass, no backdrop filter, no depth-of-field. The single exception is the rubbed-out note, where blur is doing the work of an eraser rather than describing distance.",
  ],
  [
    "Shadows are evidence of lift",
    "Sheets cast long and soft along the tear. Objects cast short and tight against their silhouette. Nothing else casts at all: no buttons, no text, no interface. A shadow on this site means a physical thing is above another physical thing.",
  ],
  [
    "Grain is inherent — with one exception, on purpose",
    "Texture lives in the assets. No noise overlays, no filter passes, and if a plate looks too clean the fix is a better photograph rather than an effect. The ground is the deliberate exception: its dust is applied, because it is not depicting a material at all. It is depicting the copy.",
  ],
  [
    "Tears are real",
    "Every torn edge is alpha from a photographed torn sheet. Never a clip-path zig-zag, never an SVG approximation. The irregularity is the point and it cannot be faked convincingly at this scale.",
  ],
  [
    "The second machine",
    "There are two ways to read this site and only one set of content. Studio Mode is the paper desk. Microfilm Mode is a reader-printer: a lamp shining up through physical film, through a lens, onto ground glass. The mode is an attribute on the root element and CSS does the rest \u2014 the same components emit the same DOM in both, so parity is structural rather than promised, and switching cannot lose your place because nothing unmounts. A microform reader is an *optical* device, which is the whole reason the mode is allowed to exist: there is no phosphor, no scanline, no electron beam, so \u201cthe page is a surface, not a screen\u201d survives intact. Ground glass is a surface. The rules that follow are what that machine imposes.",
  ],
  [
    "Silver, not sepia",
    "The second mode is neutral grey and every accent desaturates to a density. A warm tint over the paper palette reads instantly as a filter laid on a colour site; a neutral one reads as a photograph of it. Imagery is greyscaled for the same reason \u2014 a colour screenshot sitting in the gate gives the fiction away in one glance. The paper\u2019s own whiteness compresses too: film holds far less range than paper, so a sheet that is near-white on the desk becomes the brightest *density* on the negative, not a blown-out white.",
  ],
  [
    "Film has no light greys",
    "The paper world separates secondary text by lightening it \u2014 an eyebrow at 0.55 opacity reads as quiet on bright paper. Under a lamp the same value lands on a panel the falloff has already darkened and the two converge; one eyebrow measured 3.5:1 against a 4.5 floor. So in the second mode quiet text stays a density and earns its quietness from size, tracking and letterform instead. Hierarchy by lightness is a luxury of reflected light.",
  ],
  [
    "Light falls off, and multiplies",
    "The lamp\u2019s hotspot and falloff is the one thing that makes the panel read as projected rather than tinted, and it has to be painted *above* the content, because the page lays down its own opaque sheets and anything behind them is invisible. It is safe there only because it multiplies: multiply scales text and ground by the same factor, so for dark-on-light the contrast ratio is preserved rather than eroded. Measured across six routes, the worst text on the panel sits at 7.9:1 against a 4.5 floor. Nothing else is ever allowed above the reading area except the glass sheen, at an opacity that measures as no change at all.",
  ],
  [
    "One number moves the film",
    "Scroll position is the only state the transport has. The sprocket strips travel from it, the crank rotates from it, and the frame counter reads it \u2014 so drag, swipe, scroll and the arrow keys are four inputs to one number rather than four states that can disagree. Frames are even slices of the document, not semantic blocks: real frames are evenly spaced exposures, and slicing needs no content structure, so the counter is correct on a case study, a specimen page and a 404 alike. It counts off reachable travel, never document height \u2014 a counter you cannot crank to the end of is a counter that lies.",
  ],
  [
    "The one permitted blur",
    "Loading a reel brings the lens to focus, and that is the single place on this site where anything is blurred. The rule against it is a rule about paper, and paper has no focus knob. It is brief, it happens to the panel rather than the words, and reduced motion keeps the settle and drops the defocus.",
  ],
  [
    "What survives a phone",
    "Below 1080px there is no right-hand lane, so the three things that lived in it are translated rather than dropped. A margin note becomes an interjection: still the hand, still tilted, sitting in the flow where it falls in the DOM and breaking a little out of the measure so it can never be mistaken for body copy \u2014 it used to be display:none, which meant a phone got none of the handwriting, and the handwriting is the voice. Case-study plates interleave with the paragraphs rather than queueing up after them, so evidence still arrives beside the claim it supports; both wrappers become display:contents and order does the weaving. And below 700px the hero is recomposed, not scaled: one cutout, one annotation, a larger headline, because the wide canvas places its annotations by percentage and they land near 8px when squeezed. The depth trail and the plate pile stay behind on the wide lane \u2014 there is nothing for them to be beside.",
  ],
  [
    "A division is a torn edge",
    "Sections are sheets. Each lays its torn top edge over the one above, full bleed to both page edges, and the fill beneath the tear is rgba(252,252,252,.965) because that is what the asset's paper measures — a flat white would be denser than the photograph and leave a seam. A sheet inset from the page edges is a card, which the system does not have. Consecutive dividers mirror, so no two tears down a page are the same silhouette. Currently on Home; the archive still divides with a hairline seam and is the last place the system contradicts itself.",
  ],
  [
    "The hand sits over everything",
    "A margin note is written on top of the canvas, so it is never bound by the layout it sits beside and never displaced by it. It carries z-index 3 and anything it might overlap must contain its own stacking context beneath that — the plate pile learned this the hard way, its plates stacking 5, 4, 3\u2026 straight through the note until the pile was given a context of its own. Imagery must not be positioned to avoid the hand either: clearance enough for the ordinary case, and z-order settles the rest.",
  ],
  [
    "Light through a tear, once",
    "A torn edge normally reveals another sheet. Exactly one route — Ask, the page where something is meant to open — has warm light under the tear instead. It is the sheet's own alpha masking an amber gradient, dropped a few pixels and blurred, so the rim of light is the shape of the real photographed tear rather than a second silhouette to keep in register. The sheet's cast shadow is softened wherever this is on, because an edge with light beneath it cannot also cast at full strength. It does not animate, and it stays rare: a second instance would make it decoration.",
  ],
  [
    "Vignette marks scale",
    "Large imagery is vignetted, masked to the plate so only the photograph darkens and never the paper around it — light falling on a picture, not a filter over a page. Small plates stay flat; a vignette at thumbnail size just looks like dirt.",
  ],
  [
    "Wear is placed, not generated",
    "A note can be smudged or rubbed out, but never automatically and never at random. A mark that appears on one build and not the next is a glitch rather than a mark — the ink either ran or it did not. So both are variants chosen for a particular note, and both are rare because the page should reward noticing rather than announce itself.",
  ],
];

const LAYOUT = [
  [
    "The Canvas",
    "Fixed ratio, everything absolutely placed, the whole thing scaling as one unit. For pages where the composition is the message — Home and Archive. Geometry scales freely so the collage keeps filling the viewport and bleeding off both edges; reading type is clamped separately so it never follows the canvas down to 13px or up to 32px.",
  ],
  [
    "The Column",
    "Ordinary document flow with the measure capped around 66 characters. For anything that is genuinely read: prose, this document, future case-study writing. Section numerals stay sticky beside the text so you always know where you are in the argument.",
  ],
  [
    "The Margin",
    "The space outside the column, where the hand lives. Annotations, reminders and marks belong here and nowhere else. The rule that keeps it safe: the margin never carries information, only attitude.",
  ],
  [
    "The Register",
    "A shelf mark hanging beside a block of content. This is the site's list primitive, and the mark is Dewey-ish: the class is the section — 01 Approach, 02 Archive, 00 this document — and the three digits after the point are the item. A case study keeps the mark of its archive entry, so 02.002 means the same thing on the index, on the page, and in its front matter.",
  ],
];

const MOTION = [
  [
    "Collage resolve",
    "620ms",
    "--ease-settle · cubic-bezier(.22,.61,.36,1)",
    "Transform only — pieces are placed where they land and carry the scattered state.",
  ],
  [
    "Paper arriving",
    "380ms",
    "--ease-settle",
    "Photographs fade up on their own load event rather than appearing the instant they decode — the header sheet, and the three cutouts staggered 60ms apart. Opacity only: a scale would fight the collage\u2019s tuned transforms, and a blur placeholder would show as a rectangle behind an alpha-masked tear.",
  ],
  [
    "Figures counting",
    "700ms",
    "ease-out cubic, in JS",
    "Metric figures count from zero once, as they come into view. Against the usual rule that data being read should not move — allowed here deliberately, and built so the authored string is what the server renders, what the DOM ends on, and what reduced motion shows throughout. The number is parsed out of the attribute, never the rendered text, so re-running the effect cannot strand a figure at zero.",
  ],
  [
    "Register arrival",
    "380ms",
    "--ease-settle",
    "Rows come in from the right, 14px of travel, sequenced by the scroll itself with a 60ms stagger applied only across rows that cross in the same pass. Deliberately the one gesture that runs against the grain — the note stroke-on and the sheet tear both sweep left to right — justified by arriving from the margin where the annotations live. The travel is small on purpose: a row is a region of one continuous sheet, not a card, so it must read as ink settling rather than paper sliding.",
  ],
  [
    "Arrow nudge",
    "160ms",
    "--ease-press · cubic-bezier(.23,1,.32,1)",
    "3px right on hover and on focus. The only part of a register row allowed to move, because it points at where the click goes rather than pretending the paper lifts.",
  ],
  [
    "Pile forming",
    "380ms, 80ms apart",
    "--ease-settle",
    "Case-study plates fade in where they land, so the pile assembles rather than appears. Their images are deliberately not lazy: lazy-loading decides from an element\u2019s layout position, and the pile transforms plates far from theirs, so whether one ever loaded came down to chance. A 4s backstop reveals any plate whose bitmap has not arrived — late is fine, never is not.",
  ],
  [
    "Pile unfurling",
    "900ms, 85ms apart",
    "--ease-settle",
    "One shot, on the first flick of the wheel \u2014 not a scrub. Scrubbing made the reader hold the gesture open and re-do it on the way back up; the pile now falls open the moment they start moving and stays open for the life of the document. That makes it predetermined motion, so it is a CSS transition from the piled inline values back to identity, with a per-plate delay; the animation loop no longer knows the pile exists. Proportioned on the home collage: 16% larger and gathered to within a few pixels when piled, the last plate travelling over 1400px. Written to translate/rotate/scale, never transform \u2014 the stylesheet owns the resting offset and angle, so no JavaScript leaves the cascade intact.",
  ],
  [
    "Cursor shove",
    "continuous",
    "eased in JS, 0.18 per frame",
    "A finger run across a desk pushes the paper piled on it aside. Case-study plates are displaced up to 11px away from the pointer, fading out over 190px of reach with a squared falloff. The plate the cursor is actually over gets no push at all \u2014 it is the sheet under your finger rather than one being nudged past, and a plate that fled the pointer would be one you could never land on, which the hover reveal depends on. Rides in --push-x/--push-y, composed into transform, because translate/rotate/scale belong to the unfurl. Fine pointers only: a tap would shove the pile once and leave it shoved.",
  ],
  [
    "Plate reveal",
    "180ms",
    "--ease-settle",
    "Hovering a plate lifts it out of the stack \u2014 z-index to the front, 1.02 scale and a longer cast. The cascade overlaps by about a third, so this is the only way to see a covered plate whole; it uncovers content rather than decorating it, which is why reduced motion keeps the raise and drops only the easing. The lift lives on the image, not the figure, so its transition cannot smear the per-frame shove.",
  ],
  [
    "Press",
    "160ms",
    "--ease-press · cubic-bezier(.23,1,.32,1)",
    "scale(0.97) on :active for anything pressable. The one gesture deliberately not gated behind (hover: hover) — a press is the primary feedback on touch, which is where it matters most. Text buttons are inline-block so the transform applies at all.",
  ],
  [
    "Inked underline",
    "180ms",
    "--ease-stroke · cubic-bezier(.33,.1,.25,1)",
    "clip-path wipe from the left, so the stroke draws rather than fades.",
  ],
  [
    "Weight ride",
    "160ms",
    "--ease-settle · cubic-bezier(.22,.61,.36,1)",
    "font-variation-settings 400 → 900, continuous along the axis. The wordmark, the shelf marks and the metric figures. The only gesture that changes a glyph rather than moving it.",
  ],
  [
    "Annotations",
    "380ms",
    "ease, --delay-annotation",
    "Opacity only, arriving after the pieces have started moving.",
  ],
  [
    "Note stroking on",
    "520ms",
    "--ease-ink · cubic-bezier(.4,0,.2,1)",
    "An angled mask sweep, once per note as it comes into view. Handwriting arrives written, never faded.",
  ],
  [
    "Depth lag",
    "continuous",
    "damped, settles to rest",
    "Notes trail the scroll by up to 9px and settle. Ground fixed, sheets exact, notes trailing — three depths, three behaviours.",
  ],
  [
    "Object lift",
    "240ms",
    "--ease-settle · cubic-bezier(.22,.61,.36,1)",
    "Objects rise 4px on hover and cast further. Objects only: a register row is the paper, not a thing resting on it.",
  ],
  [
    "Sheet laid down",
    "860ms",
    "--ease-unfurl · cubic-bezier(.5,.02,.25,1)",
    "Held until the torn paper has actually decoded — ungated it finished while the image was still naturalWidth: 0, spending the site\u2019s one entrance on an empty box. The header hinges on its top edge, held short and tilted 8°, and unfurls downward so the torn end lands last — then past flat and back, because a sheet let go of does not stop dead. Slow off the mark on purpose: an eased-out curve put the whole swing in two frames and read as a drop. Once per load, pure CSS.",
  ],
  [
    "Object parallax",
    "continuous",
    "JS interpolation, single stage",
    "Cutouts deflect up to 4px toward the pointer, each by its own depth, eased in JS at 0.14 per frame. Carries no CSS transition: a curve on top of the interpolation is a second damping stage that makes the cutouts lag the pointer.",
  ],
  [
    "Sheet tearing in",
    "scroll-driven",
    "none — position, not time",
    "A sheet tears across as it is scrolled in, over roughly 390px of scroll, so the unfurl happens at the reader's speed and holds wherever they stop. A straight wipe along the tear's axis uncovers the real edge frame by frame, so the propagation is the photograph's own irregularity. Monotonic: paper tears, it does not un-tear. Paper only — the content on it is never masked.",
  ],
];

export function DesignSystem() {
  return (
    <main id="main" className="ds">
      <header className="ds__masthead">
        <h1 className="ds__title">Design system.</h1>
        <p className="ds__thesis">
          A desk, photographed. Everything on this site has been torn out of
          something else and laid down by hand — and the working notes were left
          in on purpose.
        </p>
      </header>

      <Section n="00.001" title="Intent">
        <p className="ds__lede">
          The site argues that good work is made, not delivered: that the mess
          is part of the evidence. So the interface is not a document about the
          work, it is a surface the work has been laid out on — paper you could
          put a coffee cup down on, with photographs torn from their sources,
          pinned in place, and annotated in the margin by someone still
          thinking.
        </p>
        <p>
          Evidence-based and archival, but never closed. Every page reads as a
          working file: tagged, annotated, open to revision. That is the
          argument for the method — iteration and refinement, shown rather than
          claimed.
        </p>
        <h3 className="ds__subhead">The feeling to aim for</h3>
        <p>
          True and reliable, but approachable, warm, and a privilege to see. The
          register is a friend turning a screen towards you and saying{" "}
          <em>&ldquo;it&rsquo;s really not there 100% yet&rdquo;</em> while
          you&rsquo;re already thinking it&rsquo;s remarkable. The charm lives
          in that gap — in being shown something mid-thought rather than
          presented something finished. Confidence without polish-anxiety.
          Unfinished on purpose, never careless.
        </p>
      </Section>

      <Section n="00.002" title="Principles">
        <ol className="ds__principles">
          {PRINCIPLES.map((p) => (
            <li key={p.n} className="ds__principle">
              <span className="ds__principleNum">{p.n}</span>
              <div>
                <h3 className="ds__principleTitle">{p.title}</h3>
                <p>{p.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </Section>

      <Section n="00.003" title="Surface &amp; colour">
        <p>
          Four neutrals carry the page, and two of them are the same paper at
          different strengths. The restraint is deliberate: the page has to
          survive being almost entirely empty.
        </p>
        <Swatches items={NEUTRALS} />

        <h3 className="ds__subhead">Accents — staged, not yet applied</h3>
        <p>
          A deeper green and a warm yellow, with an orange between. The hues are
          taken from the photography rather than chosen against it: the pinned
          green board reads at 85°, the amber card at 35°, and only saturation
          and value were set to make them work as ink on paper. That derivation
          matters — it is why they will feel native rather than added.
        </p>
        <Swatches items={ACCENTS} />

        <h3 className="ds__subhead">Under review</h3>
        <ul className="ds__swatches">
          <li className="ds__swatch">
            <span
              className="ds__chip"
              style={{ background: "#e93636" }}
              aria-hidden
            />
            <div>
              <code className="ds__code">--mark-red</code>
              <code className="ds__code ds__code--dim">#e93636</code>
              <p className="ds__swatchNote">
                Currently only the archive&rsquo;s correcting marks. Likely a
                step too far — it introduces urgency the rest of the system
                deliberately avoids, and the green/amber pair covers emphasis
                without it. Retained for now, expected to be pulled.
              </p>
            </div>
          </li>
        </ul>
      </Section>

      <Section n="00.004" title="Type">
        <p>
          Three faces, three jobs, no overlap. The test for any new piece of
          text is which of these is speaking — if the answer is unclear, the
          text probably should not exist.
        </p>
        <ul className="ds__voices">
          {VOICES.map((v) => (
            <li key={v.face} className="ds__voice">
              <div className="ds__voiceHead">
                <h3 className="ds__voiceRole">{v.role}</h3>
                <code className="ds__code ds__code--dim">{v.face}</code>
              </div>
              <p className={v.className}>{v.sample}</p>
              <p className="ds__voiceDetail">{v.detail}</p>
            </li>
          ))}
        </ul>

        <h3 className="ds__subhead">The published scale</h3>
        <p>
          Only the published voice needs a scale, because only it is variable
          and only it has to work at nine different jobs. A perfect fifth (1.5)
          anchored on 19px body copy sets the ends; the steps between are the
          sizes the pages actually reach for. Every one is a token and every one
          is fluid between a floor and a ceiling, so nothing collapses on a
          laptop or swells on a 27-inch monitor. Leading tightens as type grows:{" "}
          <code className="ds__code">1.55</code> for reading,{" "}
          <code className="ds__code">0.95</code> for display.
        </p>
        <p className="ds__aside">
          Each line below is set with the token it names, not with a copy of its
          value — so this is the scale itself rather than a picture of it, and
          it cannot drift. Sizes shown are what the tokens resolve to at a 1440
          viewport; the top two clip because a display line is longer than a
          column.
        </p>
        <ol className="ruler">
          {PUBLISHED_SCALE.map((r) => (
            <li className="ruler__row" key={r.role}>
              <span className="ruler__meta">
                <span className="ruler__px">{r.px}</span>
                <span className="ruler__wght">
                  {r.wght} · {r.italic ? "italic" : "roman"}
                </span>
              </span>
              <span
                className="ruler__spec"
                style={{
                  fontSize: `var(${r.token})`,
                  fontStyle: r.italic ? "italic" : "normal",
                  fontVariationSettings: `"wght" ${r.wght}`,
                }}
              >
                Make beauty from chaos.
              </span>
              <span className="ruler__role">{r.role}</span>
            </li>
          ))}
        </ol>
        <p className="ds__aside">
          Measure is capped at 66 characters. Where a design hands over a wider
          column, the column stays and the text stops.
        </p>

        <h3 className="ds__subhead">Weight</h3>
        <p>
          The axis runs 300–900. Black is absent from the table below on
          purpose: it belongs to the wordmark&rsquo;s hover, so the heaviest
          weight on the site reads as a gesture rather than as a resting state.
          Headings sit at 600, which carries a page without shouting at it — and
          it means the hover has somewhere to go.
        </p>
        <div className="ds__tableWrap">
          <table className="ds__table">
            <thead>
              <tr>
                <th>Token</th>
                <th>wght</th>
                <th>Used for</th>
              </tr>
            </thead>
            <tbody>
              {WEIGHTS.map((w) => (
                <tr key={w.token}>
                  <td>
                    <code className="ds__code">{w.token}</code>
                  </td>
                  <td>{w.value}</td>
                  <td>{w.use}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h3 className="ds__subhead">The other two do not get one</h3>
        <p>
          Neither the seam nor the hand is variable, so weight is not a
          dimension for either, and both sit at essentially fixed sizes. Cutive
          Mono appears at 14–16px and nowhere else: metadata is metadata at any
          scale, and enlarging it would turn a wink into a statement. The hand
          runs 20–38px — a marginal note at the smaller end, an annotation on
          artwork at the larger — and each is set once rather than laddered.
        </p>
      </Section>

      <Section n="00.005" title="Texture">
        <p>
          If the paper metaphor is going to hold, it has to obey physics
          consistently. These are the rules that keep it reading as photographed
          things on a lit surface rather than a texture pack.
        </p>
        <dl className="ds__rules">
          {TEXTURE.map(([t, d]) => (
            <div key={t} className="ds__rule">
              <dt>{t}</dt>
              <dd>{d}</dd>
            </div>
          ))}
        </dl>

        <h3 className="ds__subhead">Vignette, demonstrated</h3>
        <p>
          Left is flat, right is lit. The falloff is masked to the plate&rsquo;s
          own alpha, so the paper around it stays untouched.
        </p>
        <div className="ds__plate ds__plate--pair">
          <span className="plate">
            <Image src="/archive/stack.png" alt="" width={653} height={1237} />
          </span>
          <span
            className="plate plate--lit"
            style={
              {
                "--plate-src": 'url("/archive/stack.png")',
              } as React.CSSProperties
            }
          >
            <Image src="/archive/stack.png" alt="" width={653} height={1237} />
          </span>
        </div>
      </Section>

      <Section n="00.006" title="Layout">
        <p>
          Four modes, chosen by what the page is for. Mixing them within one
          page is the usual cause of things feeling wrong.
        </p>
        <dl className="ds__rules">
          {LAYOUT.map(([t, d]) => (
            <div key={t} className="ds__rule">
              <dt>{t}</dt>
              <dd>{d}</dd>
            </div>
          ))}
        </dl>
        <h3 className="ds__subhead">Gutters and bleed</h3>
        <p>
          Text sits inside a gutter; imagery runs off the edge. The page should
          always read as a crop of something larger rather than a contained
          rectangle — which is why the collages are allowed to be cut by the
          viewport and why nothing is ever centred in a box.
        </p>
      </Section>

      <Section n="00.007" title="Components">
        <p>
          Deliberately small. Every one of these is a physical object or a mark;
          none of them is a container. Each specimen below is the live
          component, so if one breaks it breaks here first.
        </p>

        <Component
          name="Torn plate"
          note="A photograph removed from something and laid down. Deckle edge mandatory, silhouette shadow mandatory. Scattered means raw material; squared means curated; the two states are what the home page moves between."
        >
          <span className="ds__demoLabel">.plate — scattered / squared</span>
          <div className="ds__plates">
            <div className="ds__plateSet">
              <div className="ds__plateGroup ds__plateGroup--scattered">
                <span className="plate">
                  <Image
                    src="/collage-portrait.png"
                    alt=""
                    width={634}
                    height={550}
                  />
                </span>
                <span className="plate">
                  <Image
                    src="/collage-tablet.png"
                    alt=""
                    width={528}
                    height={621}
                  />
                </span>
              </div>
              <span>scattered</span>
            </div>
            <div className="ds__plateSet">
              <div className="ds__plateGroup ds__plateGroup--squared">
                <span className="plate">
                  <Image
                    src="/collage-portrait.png"
                    alt=""
                    width={634}
                    height={550}
                  />
                </span>
                <span className="plate">
                  <Image
                    src="/collage-tablet.png"
                    alt=""
                    width={528}
                    height={621}
                  />
                </span>
              </div>
              <span>squared</span>
            </div>
          </div>
        </Component>

        <Component
          name="Sheet"
          note="An opaque layer of paper laid over the ground with at least one torn edge. The only legitimate way to make a section. Two sheets always overlap; they never abut, and the background never shows between them."
        >
          <span className="ds__demoLabel">.ds__sheet</span>
          <div className="ds__sheet">
            <Image
              src="/header-texture.png"
              alt=""
              width={4096}
              height={720}
              /* Demonstration copies of the masthead's own asset. They
                 need `sizes`, or Next requests a 4096-wide variant for a
                 band a few hundred pixels tall, and `eager` because one
                 of them gets picked as this page's LCP element. The
                 header has already fetched this file with `priority`, so
                 both come from cache. */
              sizes="100vw"
              loading="eager"
            />
            <p className="ds__sheetText">Paper, laid on paper.</p>
          </div>
        </Component>

        <Component
          name="Masthead band"
          note="A torn strip carrying either navigation or a page title. Pages may stack two — Archive does — but they must overlap on continuous paper."
        >
          <span className="ds__demoLabel">.ds__band</span>
          <div className="ds__band">
            <Image
              src="/header-texture.png"
              alt=""
              width={4096}
              height={720}
              /* Demonstration copies of the masthead's own asset. They
                 need `sizes`, or Next requests a 4096-wide variant for a
                 band a few hundred pixels tall, and `eager` because one
                 of them gets picked as this page's LCP element. The
                 header has already fetched this file with `priority`, so
                 both come from cache. */
              sizes="100vw"
              loading="eager"
            />
            <div className="ds__bandRow">
              <p className="ds__bandMark">Alexpurdie.co</p>
              <nav className="ds__bandNav" aria-label="Band specimen">
                <a className="text-button" href="#">
                  Approach
                </a>
                <a className="text-button" href="#">
                  Archive
                </a>
              </nav>
            </div>
          </div>
        </Component>

        <Component
          name="Text button"
          note="A link whose underline is inked on hover rather than ruled. Eight gestures cycle by position so a run of links reads as separate marks rather than one shape repeated."
        >
          <span className="ds__demoLabel">.text-button — hover</span>
          <nav className="ds__demoRow" aria-label="Text button specimen">
            <a className="text-button" href="#">
              Approach
            </a>
            <a className="text-button" href="#">
              Archive
            </a>
            <a className="text-button" href="#">
              About
            </a>
            <a className="text-button" href="#">
              Ask
            </a>
          </nav>
        </Component>

        <Component
          name="Source block"
          note="Metadata written as the code that would have produced the interface, left unrendered — the seam. Used wherever a conventional design would reach for pills or chips. Rare by design."
        >
          <span className="ds__demoLabel">.source</span>
          <pre className="source">{TAGS_SPECIMEN}</pre>
        </Component>

        <Component
          name="Marginal note"
          note="Handwriting laid on the page beside the column, never in it: out of flow, rotated a degree or two, aligned to nothing, and carrying attitude rather than information. Two surfaces — the canvas itself, or a torn scrap laid on top. The scrap is one bitmap stretched to the note, so it is for a line or two at most; more than that and the torn edge smears. On top of either, two optional marks of wear. Smudged reads normally until the last word, which loses its definition and drags off to the right — the pen was still wet and the hand caught it. Rubbed out breaks the whole note up, as if someone went at it with an eraser — canvas only, because a torn scrap is a thing you would bin and rewrite rather than rub out, and the types refuse the combination. Both are off by default and applied per note. Shown here in flow — floating is covered under Layout."
        >
          <span className="ds__demoLabel">.mnote — surface: canvas</span>
          <MarginNote demo surface="canvas" tilt={-2.4}>
            Structure is the kindest thing you can give a designer who&rsquo;s
            stuck.
          </MarginNote>

          <span className="ds__demoLabel ds__demoLabel--gap">
            .mnote — surface: sheet
          </span>
          <MarginNote demo surface="sheet" tilt={1.8}>
            The kids were so excited :)
          </MarginNote>

          <span className="ds__demoLabel ds__demoLabel--gap">
            .mnote[smudge] — variant
          </span>
          <MarginNote demo smudge tilt={-1.6}>
            The pen was still wet when the hand went past
          </MarginNote>

          <span className="ds__demoLabel ds__demoLabel--gap">
            .mnote[rubbed] — variant, canvas only
          </span>
          <MarginNote demo rubbed tilt={-2.1}>
            Reminder: S. has dance class Monday @ 5
          </MarginNote>
        </Component>

        <Component
          name="Numbered entry"
          note="A shelf mark hanging beside a block of content — the register, applied. The mark is a reference rather than a counter: it comes from the content, so it identifies the item wherever it is cited instead of shifting when the list is reordered. Anything enumerable uses this rather than bullets, cards or a grid."
        >
          <span className="ds__demoLabel">.ds__entry</span>
          <div className="ds__entry">
            <span className="ds__entryNum">02.001</span>
            <div>
              <h4 className="ds__entryTitle">
                Democratized and gamified economic equipping
              </h4>
              <p className="ds__entryBody">
                A short standfirst sets the claim, the source block files it,
                and the link is the only affordance in the whole component.
              </p>
              <a className="ds__more text-button" href="#">
                View details →
              </a>
            </div>
          </div>
        </Component>

        <Component
          name="Reveal pair"
          note="Two states of one composition resolved by a single hover: transform and opacity only, and both states must be legible on their own. This is the home page's central mechanism in miniature."
        >
          <span className="ds__demoLabel">.ds__reveal — hover</span>
          <div className="ds__reveal">
            <div className="ds__revealStage">
              <span className="plate">
                <Image
                  src="/collage-portrait.png"
                  alt=""
                  width={634}
                  height={550}
                />
              </span>
              <span className="plate">
                <Image
                  src="/collage-tablet.png"
                  alt=""
                  width={528}
                  height={621}
                />
              </span>
            </div>
            <p className="ds__revealLine">
              Make{" "}
              <span className="ds__revealSlot">
                <span className="ds__revealA">{"<???>"}</span>
                <span className="ds__revealB">{"<beauty>"}</span>
              </span>{" "}
              from chaos.
            </p>
          </div>
        </Component>

        <p className="ds__aside">
          Nothing in the kit has a border, a corner radius, or a fill. If a new
          component needs one of those, it probably belongs to a different
          design system.
        </p>
      </Section>

      <Section n="00.008" title="Motion &amp; interaction">
        <p>
          Motion is physics, never decoration. It means one thing consistently —
          that this is paper, and paper has weight — so the test for any new
          gesture is whether it makes the material easier to read rather than
          whether it looks alive. Nothing repeats unprompted, and nothing moves
          merely to signal that it is interactive.
        </p>
        <div className="ds__tableWrap">
          <table className="ds__table">
            <thead>
              <tr>
                <th>Gesture</th>
                <th>Duration</th>
                <th>Easing</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              {MOTION.map((m) => (
                <tr key={m[0]}>
                  <td>{m[0]}</td>
                  <td>{m[1]}</td>
                  <td>
                    <code className="ds__code">{m[2]}</code>
                  </td>
                  <td>{m[3]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h3 className="ds__subhead">Text buttons — hover them</h3>
        <p>
          The underline is inked, not ruled. Eight gestures cycle by position,
          each with its own pressure profile and overshoot. They are shallow on
          purpose: a deep sag is not how a pen travels.
        </p>
        <nav className="ds__demoRow" aria-label="Underline specimens">
          {[
            "Approach",
            "Archive",
            "About",
            "Ask",
            "Writing",
            "Index",
            "Notes",
            "Colophon",
          ].map((l) => (
            <a key={l} className="text-button" href="#">
              {l}
            </a>
          ))}
        </nav>

        <h3 className="ds__subhead">The wordmark — hover it</h3>
        <p>
          Martina Plantijn&rsquo;s weight axis runs 300–900. The wordmark rides
          it to Black rather than snapping between named instances.
        </p>
        <p className="ds__demoMark">Alexpurdie.co</p>

        <p className="ds__aside">
          Every transition above is disabled under{" "}
          <code className="ds__code">prefers-reduced-motion</code>, and every
          hover state is mirrored on{" "}
          <code className="ds__code">:focus-visible</code>. Hover motion is
          additionally gated behind{" "}
          <code className="ds__code">(hover: hover) and (pointer: fine)</code> —
          a tap on a touch screen fires a hover that then sticks — while{" "}
          <code className="ds__code">:focus-within</code> stays ungated, because
          focus is never that false positive. Anything that hides content in
          order to animate it in must be applied by the same script that takes
          it away again — a note is only ever masked once something is
          guaranteed to unmask it, so no JavaScript, a thrown error or a
          reduced-motion preference all leave the writing simply present.
        </p>
      </Section>

      <Section n="00.009" title="Voice">
        <div className="ds__registers">
          <div className="ds__register">
            <h3 className="ds__subhead">Published</h3>
            <p className="ds__quote ds__quote--serif">
              Make beauty from chaos.
            </p>
            <p>
              Short, declarative, unhedged. No qualifiers, no &ldquo;we
              believe&rdquo;, no trailing softeners. Sentence case with a full
              stop, because a full stop is a decision. It should read as though
              it has been said out loud and settled.
            </p>
          </div>
          <div className="ds__register">
            <h3 className="ds__subhead">Working</h3>
            <p className="ds__quote ds__quote--hand">
              *Emphasize this, really sell that people are the core of it all.
            </p>
            <p>
              Unfinished, self-addressed, thinking aloud. Ellipses, asterisks
              and stray questions are correct here. It is never instructional
              and never speaks to the reader — the reader is overhearing. If a
              note starts explaining the site to someone, it has become copy and
              needs rewriting or removing.
            </p>
          </div>
        </div>
        <p className="ds__aside">
          The rule that keeps this honest: delete every handwritten note and the
          site must still make complete sense.
        </p>
      </Section>

      <Section n="00.010" title="Open questions">
        <ol className="ds__open">
          <li>
            <strong>Narrow layouts.</strong> Home and Archive are both
            fixed-canvas collages that scale as a unit. They stay faithful but
            get small below roughly 1000px, and a collage cannot reflow into a
            phone layout automatically. Both need designing, not deriving.
          </li>
          <li>
            <strong>Are the annotations real content?</strong> The current notes
            are mockup comments about the design. They set the working register
            perfectly but they are about the making of the site rather than the
            work. They need rewriting as notes a visitor is meant to overhear.
          </li>
          <li>
            <strong>Where the accents actually land.</strong> Green and amber
            are derived and staged but unassigned. Worth deciding whether they
            are for emphasis, for wayfinding, or reserved entirely for the seam.
          </li>
          <li>
            <strong>How often the seam shows.</strong> The glitch works because
            it is rare. Needs a stated budget — perhaps once per page — before
            it becomes a motif and stops being a wink.
          </li>
          <li>
            <strong>Dark mode is gone.</strong> Removed deliberately: a torn
            white sheet on a dark ground is a different design, not a theme.
            Confirm that is permanent.
          </li>
          <li>
            <strong>Link states past hover.</strong> Visited, active and
            current-page are all undefined.
          </li>
          <li>
            <strong>Placeholder copy.</strong> Lorem throughout the archive, and{" "}
            <code className="ds__code">#</code> on every &ldquo;View
            details&rdquo;.
          </li>
        </ol>
      </Section>
    </main>
  );
}

function Component({
  name,
  note,
  children,
}: {
  name: string;
  note: string;
  children: React.ReactNode;
}) {
  return (
    <div className="ds__component">
      <div className="ds__componentHead">
        <h3 className="ds__componentName">{name}</h3>
      </div>
      <p className="ds__componentNote">{note}</p>
      <div className="ds__demo">{children}</div>
    </div>
  );
}

function Swatches({
  items,
}: {
  items: { token: string; value: string; note: string }[];
}) {
  return (
    <ul className="ds__swatches">
      {items.map((s) => (
        <li key={s.token} className="ds__swatch">
          <span
            className="ds__chip"
            style={{ background: s.value }}
            aria-hidden
          />
          <div>
            <code className="ds__code">{s.token}</code>
            <code className="ds__code ds__code--dim">{s.value}</code>
            <p className="ds__swatchNote">{s.note}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}

function Section({
  n,
  title,
  children,
}: {
  n: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="ds__section">
      <div className="ds__sectionHead">
        <span className="ds__sectionNum">{n}</span>
        <h2 className="ds__sectionTitle">{title}</h2>
      </div>
      <div className="ds__sectionBody">{children}</div>
    </section>
  );
}
