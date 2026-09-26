# Design notes — "Correspondance"

Read this before touching the UI. It exists so new pages don't drift back to
generic defaults.

## Idea

Fostier Consulting is a French advisor in Hong Kong: a relationship carried
between two cities. The visual language borrows from French airmail —
the *par avion* envelope, postage stamps, postmarks — printed in the flag's
blue, white and red. Use these details sparingly and only where they mean
something (the contact block is an envelope, the advisor portrait is a stamp).

## Type

- **Newsreader** (Production Type, Paris) — headings and pull quotes. Weight
  400–500, tight tracking at large sizes. No italic accent words in headlines.
- **Bricolage Grotesque** (Mathieu Triay) — body copy and UI.
- Noto Serif SC / Noto Sans SC as CJK fallbacks.
- Labels are sentence case. No all-caps tracked "eyebrows" above headings.

## Colour

| Token     | Hex       | Use                                 |
| --------- | --------- | ----------------------------------- |
| `bleu` (`navy`) | `#002395` | brand, primary buttons, big blocks  |
| `nuit`    | `#0A1650` | globe panel, dark surfaces          |
| `rouge` (`fred`) | `#ED2939` | flag red: stripes, icons, large type |
| `fred-700` | `#C81C2B` | red for small text or under white text (AA) |
| `ink`     | `#141A38` | headings                            |
| `slate`   | `#353B5C` | body copy                           |
| `muted`   | `#5A6082` | secondary text (≥ 5.4:1 on white and mist) |
| `line`    | `#D9DCE8` | hairline rules                      |
| `mist`    | `#EEF1F8` | alternate section background        |

Neutrals are tinted towards the brand blue. Never use Tailwind's stock grays,
purple/indigo, or blue→purple gradients. No cream/beige backgrounds.

## Shape and depth

- Corners: 2px (`rounded-sm`) on buttons and panels. No `rounded-2xl` cards.
- Separate things with hairline rules and colour blocks, not drop shadows.
  Shadows are reserved for floating layers (modal, tooltip).
- No glassmorphism, no blurred glow blobs.

## Signature details

- `.par-avion` — the airmail stripe. Header top edge, envelope border,
  panel edges. Can drift slowly (`.par-avion-drift`).
- `Stamp` — perforated frame for the advisor portrait.
- `Postmark` — rotating circular cancellation, red ink.
- `DualClock` — live Paris / Hong Kong time.
- Service rows wipe to solid colour on hover (blue for Hong Kong finance,
  red for France–China services).

## Motion

Purposeful, not a fade-up on every block: the hero headline rises line by
line, rules draw in, rows wipe colour, the globe arc flies Paris → Hong Kong
as an airmail dash. Everything honours `prefers-reduced-motion`.

## Layout

Left-aligned, editorial. Avoid the stock sequence (badge → centred hero →
logo cloud → three icon cards → stats → CTA). Lists of services are ruled
indexes, not card grids. Every page ends with a clear way to get in touch.
