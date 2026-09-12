# Database

Supports the MongoDB layer (`backend/app/database/`). This folder does not
contain a live database — it contains the *inputs* used to initialize one:
seed data for local/demo development, and index definitions for collections
defined in `backend/app/models/`.

## Structure

| Folder | Purpose |
|---|---|
| `seed/` | Demo/fixture JSON data, loaded by `scripts/seed_database.py` into a local MongoDB for development and the SIH demo |
| `indexes/` | Declarative index definitions per collection, applied by `database/indexes/mongo_indexes.py` |

## Rules

1. **Nothing in `seed/` is real regulatory data.** Every seed file is
   explicitly demo/fixture content (see the `_comment` field in each file).
   Real BIS content belongs in `knowledge_base/`, not here.
2. Seed data should be realistic enough to drive the MVP demo flow
   (Section 13 of the project brief — the water heater journey) without
   asserting unverified regulatory facts as true.
3. Index definitions here are the single source of truth — don't create
   indexes ad hoc elsewhere in the codebase.
4. This folder is never a substitute for real MongoDB backups. It's dev/demo
   tooling only.
