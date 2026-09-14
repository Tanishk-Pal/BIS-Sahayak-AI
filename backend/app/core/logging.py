import logging
import sys


def setup_logging() -> None:
    """Called once from main.py at startup. Keeps log format consistent
    across the whole app instead of every module configuring its own."""
    logging.basicConfig(
        level=logging.INFO,
        format="%(asctime)s | %(levelname)-8s | %(name)s | %(message)s",
        handlers=[logging.StreamHandler(sys.stdout)],
    )
