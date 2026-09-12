# Tests

Mirrors the project's three runtimes, since they need different test runners.

| Folder | Runner | Covers |
|---|---|---|
| `backend/` | `pytest` (Python) | FastAPI routes in `backend/app/api/routes/`, services, DB layer |
| `ai/` | `pytest` (Python) | `ai_engine/` — RAG pipeline, agents, reasoning, document_ai |
| `frontend/` | `vitest` (JS/React) | Components, hooks, and pages in `frontend/src/` |

## Running backend + AI tests

```bash
cd backend
pip install -r requirements.txt
pip install pytest pytest-asyncio httpx
pytest ../tests/backend ../tests/ai
```

## Running frontend tests

Frontend tests use Vitest, which is separate from the Python test runner
and not yet added to `frontend/package.json` (add `vitest` and
`@testing-library/react` as dev dependencies when Phase 3/10 frontend
components stabilize enough to be worth testing).

```bash
cd frontend
npm install --save-dev vitest @testing-library/react @testing-library/jest-dom jsdom
npm run test   # once a "test" script is added to package.json
```

## Principle

Per the project's coding rules, tests should never assert BIS regulatory
facts as ground truth (e.g. "IS 2082:2018 is mandatory") unless that fact
is sourced from `knowledge_base/metadata/`. Use clearly fake/demo fixture
data for standards, QCOs, and compliance rules in tests.
