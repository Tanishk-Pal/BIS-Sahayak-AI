# Documents

Holds files users upload for Document AI analysis (Phase 8: BOMs, test
reports, product specs, existing certificates, manuals). This is user data,
not BIS reference data — see `knowledge_base/` for official BIS material.

## Lifecycle

```
User uploads file
      ↓
documents/uploads/        ← raw file, as received
      ↓
ai_engine/document_ai/ parses it (pdf_parser.py, document_analyzer.py)
      ↓
documents/processed/      ← extracted text / structured output, linked back
                             to the original via a shared document_id
      ↓
documents/temporary/      ← short-lived intermediate files (e.g. OCR scratch
                             output, chunking intermediates) safe to purge
                             on a schedule or on server restart
```

## Rules (per project security section)

1. **Never commit real user-uploaded documents to git.** `uploads/`,
   `processed/`, and `temporary/` should all be gitignored except for
   `.gitkeep` — see the `.gitignore` additions below.
2. `temporary/` is disposable. Nothing here should be treated as the
   system of record — if it's needed long-term, it belongs in
   `processed/` with a database reference, not left as a loose file.
3. Every file placed here should be traceable to a `document_id` referenced
   in MongoDB (`compliance_assessments` / a `documents` collection), not
   just a bare filename — bare filenames make gap-analysis auditing
   impossible once there's more than a handful of files.
4. Access to files in this folder must go through the backend
   (`backend/app/api/routes/documents.py`), never served as static files
   directly — uploaded documents may contain sensitive manufacturer data.

## Add to `.gitignore` (root)

```
# User-uploaded documents - never commit real user data
documents/uploads/*
documents/processed/*
documents/temporary/*
!documents/uploads/.gitkeep
!documents/processed/.gitkeep
!documents/temporary/.gitkeep
```
