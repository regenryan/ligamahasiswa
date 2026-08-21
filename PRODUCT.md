# Liga Mahasiswa Website - Product Context

## Who we are
Liga Mahasiswa Malaysia is a national student movement ("persatuan pelajar", est. 2024) with
chapters at Malaysian public universities: Universiti Malaya (UM), UTM, USM, UniSZA, and
SPARC at UTeM. Public presence today is Instagram + press statements. This website is the
first official home.

## Why we are building this
- Public awareness: what Liga Mahasiswa is, what AUKU does, why we fight
- Recruitment: anyone can register; committees approve official members, who get a Member ID
  and digital membership card (the selling point)
- Live content: campaigns, events, statements, and galleries are updated from our social
  media posts and related news, not from an offline archive
- Commerce: merch shop with online order + preorder via a payment gateway supporting
  DuitNow, TnG, and FPX
- PRK (Pilihan Raya Kampus): public form to nominate a friend or self-nominate as a
  Liga candidate, with a per-campus pick

## Users
- Public visitors: browse, order merch, pledge, sign up (instant account, no approval)
- Registered users: order history, RSVPs, volunteer signups, PRK application, can apply to
  become an official member
- Official members: Member ID + digital card, constitution access, member-exclusive shop
  items, zine posting
- Campus committees: edit their own chapter content, approve members, review PRK for their
  campus, manage own orders and shop items
- Malaysia committees: everything above across all chapters, approve zines and PRK, manage
  national content and shop
- Admin (developer): full database access, role assignment, chapter lifecycle, payment
  gateway config, content override. Independent of committee roles (survives cabinet changes)

## Voice and language
- English primary, rojak Malay. Campaign names stay as published ("Mansuh AUKU").
- No em dashes, no en dashes anywhere in copy.
- Counter-culture tone: youth energy, not corporate. Image-led, not type-only.

## Design phase (current)
Five candidate directions (A-E) rendered per page behind a prototype picker. User chooses
a direction per page or one global direction. Backend, auth, orders, and payment are
out of scope until designs are approved.

## Phase: 10-direction dark theme (2026-08)

User decisions: all-new 10 design directions (v1 five variants archived at git tag v1-five-variants).
Dark theme on all pages. English-first UI copy; Malay only for official names and campaign
titles (e.g. Mansuh AUKU). Strategic layout = balanced join + act: register/member card is
the number one CTA; every campaign gets donate/volunteer one tap away. Polished client-side
interactions: filters, likes, tabs, accordion, form validation UX, cart drawer mock, scroll
reveals, animated tickers and countdowns.

Directions (keyboard 1-0 in picker):
1 Brutalism (raw concrete, mono accents) 2 Neo-Brutalism (offset shadows, hi-yellow)
3 Maximalism (layered collage, marquees) 4 Editorial (masthead, serif pull quotes)
5 Terminal (all-mono system.log) 6 Riso Noir (misregistration, pink overprint)
7 Swiss (strict grid, numbered sections) 8 Broadsheet (front page, scoreboard)
9 Club Flyer (ticket stubs, barcode, cyan glow) 10 Agitprop (stars, poster heritage)

Tokens (dark): paper #0a0a0a, ink #f4efe6, cream #141416, midnight #050505, line #2a2a2e,
brand #e11d2e (fills, text on fills must be white), brand-text #ff6b5e (red text on dark),
hi #ffe500, term #00ff9c, pink #ff2e88, cyan #00e5ff.

## Phase: typography and layout per direction (2026-08)

User directive: no shared font families across themes, and each element gets its own
structure per theme ("drastic variations and changes"). Every direction now pairs its own
display + body (sometimes mono) font, loaded via next/font/google as module-scope consts
(21 families total: Anton, Archivo, Archivo Black, Bebas Neue, Bungee, Courier Prime,
Gabarito, IBM Plex Mono, IBM Plex Sans, Instrument Sans, Instrument Serif, JetBrains Mono,
Newsreader, Old Standard TT, Oswald, Playfair Display, Rubik Spray Paint, Space Mono,
Spectral, Syne, Unbounded). Banned: Inter, Roboto, Fraunces, Geist, Plus Jakarta Sans,
Space Grotesk.

Typography matrix: 1 Brutalism = Archivo Black / IBM Plex Sans / IBM Plex Mono.
2 Neo-Brutalism = Anton / Archivo. 3 Maximalism = Bungee / Gabarito (Bungee as mono).
4 Editorial = Playfair Display / Spectral. 5 Terminal = JetBrains Mono everywhere.
6 Riso Noir = Bebas Neue / Work Sans / Courier Prime. 7 Swiss = Archivo / Instrument Sans /
Space Mono. 8 Broadsheet = Old Standard TT / Newsreader / JetBrains Mono.
9 Club Flyer = Unbounded / Syne. 10 Agitprop = Rubik Spray Paint / Oswald.

Layout matrix (per section, distinct structure per direction): hero (index table /
chunky offset / collage / magazine / terminal boot / riso cover / swiss grid / broadsheet
front page / club flyer / protest poster), countdown, page head, section head, evidence
strip, member teaser + card visual, campaign section, shop strip, story strip, join band,
newsletter band, nav header, footer. Cards exported per direction (CampaignCard, ShopCard,
ZineCard, MediaCard, MemberCard, EventCard) used across all routes. Sections module split
into src/components/sections/ (head, hero, cards, cart, strips, index) so each file stays
small enough to write and review reliably.

## Phase: 4-direction system (2026-08)

User directive: after the 22- and 28-direction experiments, curate the list down to the
four styles the user likes: Brutalism, Swiss International, Swiss Poster, Swiss Metro.
The picker and all routes now render only these four; legacy ids 3-25 and 28 stay
supported in component branches but are no longer selectable.

Directions (final order, keyboard 1-4 then arrows cycle in picker):
1 Brutalism, 2 Swiss International, 26 Swiss Poster, 27 Swiss Metro.

Palette accents for the kept directions (globals.css `.dir-N` blocks):
1 red/hi-yellow/term-green, 2 red, 26 red on white, 27 orange on white.

Typography matrix for the kept directions (display / body / mono):
1 Archivo Black / IBM Plex Sans / IBM Plex Mono. 2 Archivo / Instrument Sans / Space Mono.
26 Archivo (tight) / Instrument Sans / Space Mono. 27 Archivo 800 / Instrument Sans / Space Mono (tabular).
Banned: Inter, Roboto, Fraunces, Geist, Plus Jakarta Sans, Space Grotesk.

Kept-direction identity + signature elements:
1 Brutalism: raw grid, heavy borders, tape/red-x, press buttons. 2 Swiss International:
hairline rules, red accents, objective type grid. 26 Swiss Poster: colophon strip
(Vol. 55), baseline-underlined links, red square motif, giant poster headlines.
27 Swiss Metro: departure boards, P1/P2 platform badges, NOW BOARDING header,
tabular numerals.

Re-key map (old archetype number -> new direction numbers): 1->1, 2->19, 3->12, 4->9,
5->15, 6->8, 7->2/7/16, 8->18, 9->13, 10->11. Applied in shells (TopStrip, Logo, NavCta,
Nav header families, Footer variants), interactive (newsletter/join forms), strips,
dashboard/card, shop marquee, chapters, campaign pages, and the home marquee (3->12).

Subpage note: all eight routes (/, /shop, /zine, /media, /dashboard/card, /chapters/[slug],
/chapters/[slug]/team, /chapters/[slug]/campaigns/[campaign]) build their VariantFrame
children from directions.map((d) => <Variant dir={d.id} />), so the curated direction
list appears in the picker everywhere and the ids (1, 2, 26, 27) always match the
direction content being rendered.

Style persistence: VariantFrame stores the active direction in localStorage (liga-variant)
and mirrors it in the URL (?v=N); keyboard 1-4 then arrows switch directions, R replays
animations; the picker is a dropdown (trigger + listbox menu) with roving-focus keyboard
navigation. CSS classes `dir-N` scope every palette, font, and interaction (press states,
reveals via [data-reveal], tilt/glow/blink cursors, fog override for the picker label) to
the active direction. Client-rendered pages (dashboard/card, shop, chapters, campaigns)
render the active variant after hydration; the home page is server-rendered.
