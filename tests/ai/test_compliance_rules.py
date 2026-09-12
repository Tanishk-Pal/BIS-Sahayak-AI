# Placeholder tests for ai_engine/reasoning/compliance_rules.py (Phase 7).
# Uses fake/demo fixture data only - never assert real BIS regulatory facts
# in tests unless sourced from knowledge_base/metadata/.
import pytest


FAKE_PRODUCT_CONTEXT = {
    "product_name": "Demo Storage Water Heater",
    "capacity_litres": 25,
    "type": "electric_storage",
}


@pytest.mark.skip(reason="ai_engine/reasoning/compliance_rules.py not implemented yet (Phase 7)")
def test_compliance_gap_classifies_missing_requirement():
    from ai_engine.reasoning.compliance_rules import assess_requirements

    result = assess_requirements(
        product_context=FAKE_PRODUCT_CONTEXT,
        provided_documents=[]  # no docs uploaded -> everything should be "missing"
    )
    assert all(r["status"] == "missing" for r in result["requirements"])


@pytest.mark.skip(reason="ai_engine/reasoning/compliance_rules.py not implemented yet (Phase 7)")
def test_compliance_gap_never_asserts_certification_pass():
    from ai_engine.reasoning.compliance_rules import assess_requirements

    result = assess_requirements(product_context=FAKE_PRODUCT_CONTEXT, provided_documents=[])
    summary_text = result.get("summary", "").lower()
    assert "will pass" not in summary_text
    assert "guaranteed" not in summary_text
