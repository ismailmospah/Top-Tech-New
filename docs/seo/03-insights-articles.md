# Phase 3 — Insights articles

Internal working document (never deployed — see `.vercelignore`).

## What was added

An Insights index plus **twelve articles**, each in both languages — 26 new
pages. The sitemap now carries **44 URLs**.

| Slug | Topic |
| --- | --- |
| `digital-marketing-agency-cost-saudi-arabia` | agency pricing |
| `social-media-management-cost-saudi-arabia` | social management pricing |
| `video-production-cost-saudi-arabia` | video pricing |
| `how-to-choose-a-marketing-agency` | choosing an agency |
| `agency-vs-freelancer` | agency vs freelancer |
| `when-you-need-a-full-service-agency` | when a full-service agency fits |
| `is-your-paid-advertising-working` | judging paid advertising |
| `common-marketing-mistakes` | why budgets get wasted |
| `what-is-motion-graphics` | motion graphics explained |
| `branding-vs-marketing` | branding vs marketing |
| `startup-marketing-strategy` | strategy for startups |
| `real-estate-marketing-saudi-arabia` | real estate lead quality |

Every article the brief listed is now written, plus two the brief implied.
Topics lead with commercial intent — the questions a business asks immediately
before hiring someone — rather than search volume alone.

Total rendered article body across both languages: **~20,600 words**. Arabic
runs 639–895 words per article, English 900–1,100; Arabic is naturally more
compact, so the lower count is not less content.

## The pricing problem, and how it was handled

The brief asks for cost articles but forbids fake statistics. Those pull against
each other: people searching *كم تكلفة* want numbers, and we have no licensed
market data to quote.

The resolution: **the only figures published are Top Tech's own.** The budget
bands in `contact.js` — SAR 5k–15k / 15k–50k / 50k+ and EGP 30k–75k / 75k–200k /
200k+ — are what the site's own enquiry form already offers, so they are true by
construction. They are presented explicitly as *the bands we work in*, never as
market averages, and the articles say plainly that we will not invent averages we
have no data for.

Everything else in those articles is mechanism rather than numbers: the six
factors that move price, the three pricing models, why quotes differ, and the
questions that make two quotes comparable. That is more useful than a fabricated
range and it is defensible.

## Article structure

Each article carries one `h1`, a lead that answers the search intent in the first
paragraph, a numbered table of contents, `h2` sections with stable `id`s, `h3`
subheadings inside process and card blocks, an FAQ, related services, related
reading, and a closing CTA.

Rendered article body: 900–1,100 words in English, 639–895 in Arabic.

Section `id`s are validated to be identical across languages, so an `#anchor`
survives a language switch — someone can send a link to a specific section and it
resolves in either language.

## Structured data

Per article: `Organization`, `WebSite`, `Article`, `WebPage`, `BreadcrumbList`,
and `FAQPage` where an FAQ exists. The `Article` node carries `datePublished`,
`dateModified`, `inLanguage`, and `mainEntityOfPage`.

**The byline is the organisation, not a person.** No individual author was
invented; `author` points at the Top Tech `Organization` node, which is truthful
and keeps the entity graph consistent.

## Internal linking

The linking graph is now closed in both directions:

- Homepage → services → service pages → articles
- Articles → the services they discuss → contact
- Articles → related articles
- Every page's header → Insights (a new `nav_insights` key was added to `lang.js`
  and the item added to both the hand-written homepage nav and the generated one)

Service pages gained a "Related reading" block that pulls in any article naming
that service, so the two content types reinforce each other automatically as more
articles are added.

## Verification

- `check-links.mjs`: **44 pages, 884 internal links, 46 unique targets** — no
  404s, no internal redirects, no relative links, exactly one `h1` per page, every
  canonical self-referenced in its own hreflang set.
- Chromium: no JS errors, nothing left invisible on load, correct `lang`/`dir`,
  Arabic RTL clean on desktop and at 390×844.
- All four generators re-run produce byte-identical output.

## Editorial rules held throughout

No invented statistics, no fabricated sources, no claimed results. Where an
article would normally reach for market data we do not have, it says so plainly
and gives mechanism instead — what moves the price, how to tell two quotes
apart, which metric actually indicates progress. The only figures anywhere are
Top Tech's own published budget bands.

Several articles argue against hiring us where that is the honest answer:
`agency-vs-freelancer` and `when-you-need-a-full-service-agency` both list the
situations where the smaller, cheaper option is correct. That is deliberate —
it is also what makes the rest credible.

## Not done

- **Case studies still blocked.** The file of real project material has not
  arrived — no attachment reached the session. Nothing was invented in its
  absence, so service pages still link to related services and articles rather
  than to work.
