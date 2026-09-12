"""
Applies the index definitions in database/indexes/index_definitions.json
to the MongoDB collections used by the backend.

Usage:
    python database/indexes/mongo_indexes.py

Requires MONGODB_URI and MONGODB_DB_NAME to be set (see backend/.env.example).
Uses pymongo directly rather than backend/app/database/connection.py so this
script can run standalone during setup/CI, without booting the FastAPI app.
"""

import json
import os
from pathlib import Path

from pymongo import MongoClient

INDEX_DEFINITIONS_PATH = Path(__file__).parent / "index_definitions.json"


def load_index_definitions() -> dict:
    with open(INDEX_DEFINITIONS_PATH, "r", encoding="utf-8") as f:
        data = json.load(f)
    data.pop("_comment", None)
    return data


def apply_indexes(db) -> None:
    definitions = load_index_definitions()

    for collection_name, indexes in definitions.items():
        collection = db[collection_name]
        for index in indexes:
            keys = list(index["keys"].items())
            options = index.get("options", {})
            collection.create_index(keys, **options)
            print(f"  [ok] {collection_name}.{options.get('name', keys)}")


def main() -> None:
    mongo_uri = os.getenv("MONGODB_URI", "mongodb://localhost:27017")
    db_name = os.getenv("MONGODB_DB_NAME", "bis_sahayak_ai")

    print(f"Connecting to {mongo_uri} / db '{db_name}'")
    client = MongoClient(mongo_uri)
    db = client[db_name]

    print("Applying indexes...")
    apply_indexes(db)
    print("Done.")


if __name__ == "__main__":
    main()
