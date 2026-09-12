# Knowledge Base

This folder holds the raw and structured source material that `ai_engine/rag/`
ingests, chunks, embeds, and retrieves from. It is the foundation of the
"no important BIS answer without evidence" principle — every regulatory
answer BIS Sahayak AI gives should be traceable back to a file in here.

## Structure

| Folder | Contents |
|---|---|
| `standards/` | Indian Standards (IS numbers), full text or extracted sections, where legally and technically appropriate to store |
| `qcos/` | Quality Control Orders — mandatory certification notifications |
| `certification/` | Product Certification Scheme documentation, conformity assessment routes |
| `product_manuals/` | BIS product manuals used for specific product categories |
| `laboratories/` | Testing laboratory information (BIS-recognized labs, scope, contact/location) |
| `metadata/` | Structured metadata describing every document in the folders above (see `metadata/schema_example.json`) |

## Rules for this folder (per project coding rules)

1. **Never invent content.** Only store material sourced from official BIS
   publications/portals, or clearly marked as a "demo/sample" fixture used
   for the SIH prototype (e.g. the IS 2082:2018 water heater case study).
2. Every real document added here should have a matching metadata entry
   in `metadata/` recording: source URL, retrieval date, standard/QCO
   number, status (active/superseded/draft), and any known amendments.
3. If a standard's current mandatory/QCO status is uncertain or likely to
   change, mark it explicitly as `"status": "verify"` in metadata rather
   than asserting it.
4. This folder is ingested by `scripts/ingest_documents.py` and
   `scripts/build_embeddings.py` (Phase 5). Until those scripts exist,
   treat this as a staging area, not a live knowledge base.

## What NOT to put here

- Personal/user-uploaded documents (those go in `documents/uploads/`)
- Anything not attributable to an official BIS source or clearly labeled demo data
