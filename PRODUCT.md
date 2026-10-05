# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Families buying their first home with credit, owners selling or renting a house, department or lot, and small local investors in Uruapan, Michoacán. They are afraid of making a mistake with the family's patrimony and distrust sales pressure. They arrive to find the right property or to sell or rent theirs without legal risk, and leave by contacting an advisor (WhatsApp, form or visit scheduler).

## Product Purpose

Website for Arraigo, a fictional real-estate agency in Uruapan, built as a LumikaStudio portfolio demo from a redesign proposal for Grupo Milkasa. It has a property catalog (list and map), a detail page with a credit calculator, an advisor and a visit scheduler, plus services, sell, advisors, guides, neighborhoods and contact pages. Success: the visitor finds a property or asks for a valuation and contacts an advisor.

## Positioning

The agency accompanies the client from search or valuation to the notary. It filters before presenting and reviews documents. The first consultation is free; commission is charged only when the deal closes.

## Operating Context

- Catalog with filters persisted in the URL.
- List and map views.
- Comparison and favorites stored in the browser.
- Content comes from a Sanity CMS, with demo data as fallback.
- Contact is by WhatsApp, form and visit scheduling.

## Capabilities and Constraints

- Next.js (webpack build) with CSS modules. Deployed on Vercel. Sanity is the content source.
- Demo mode: noindex, LumikaStudio footer credit, fictitious advisors and phone numbers.
- Language: Mexican Spanish, informal "tú".
- Must stay fast on mobile data.

## Brand Commitments

- Name: Arraigo.
- **Keep both brand colors, gold and wine**, now on a light base with some dark sections (user decision, 2026-10-05).
- **Tone: notarial and clear.** Trust through transparency, not luxury. No Uruapan folklore required.
- **Light and dark modes.**
- **Interaction quality:** Framer-template level, focused on micro-interactions, page transitions (catalog → detail) and scroll storytelling. It must stay optimized and intuitive.
- **References:** Compass and Framer real-estate templates.
- **Words to avoid:** "tu hogar soñado", "oportunidad única", "lujo" without data, superlatives, urgency pressure.

## Evidence on Hand

Property, advisor, testimonial and price data are demo content, documented in `lib/` and `.agents/product-marketing.md`. Photos are stock, and several do not match their listing; that is a known issue, out of scope for the identity pass. Testimonials are examples.

## Product Principles

1. Transparency over persuasion: show price, price per m², costs and documents plainly.
2. Calm confidence: nothing pushes or rushes the visitor.
3. Every interaction answers a question the visitor has at that moment.
4. Fast and clear on a phone first.
