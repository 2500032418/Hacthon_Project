import re

LICENSE_PATTERNS = [
    {"type": "ISI Licence (CM/L)", "regex": r"^CM/L-\d{7,10}$", "example": "CM/L-8700123456"},
    {"type": "ISI Licence (legacy L-)", "regex": r"^L-\d{6}$", "example": "L-123456"},
    {"type": "CRS Registration (R-number)", "regex": r"^R-\d{6,10}$", "example": "R-61001234"},
    {"type": "Hallmark Unique ID (HUID)", "regex": r"^[A-Z0-9]{6}$", "example": "H9X2AB"},
    {"type": "FMCS Licence (foreign manufacturer)", "regex": r"^FML-\d{6,10}$", "example": "FML-1234567890"},
]

KNOWN_INVALID_HINTS = ["00000000", "12345678"]


class VerificationService:
    def verify_license(self, license_no: str) -> dict:
        raw = license_no.strip()
        normalized = re.sub(r"\s+", "", raw).upper()
        result = {
            "license_no": raw,
            "valid_format": False,
            "scheme_type": None,
            "status": "unknown",
            "next_steps": [],
            "official_check": "https://www.bis.gov.in/biscon/verifyLicence",
            "disclaimer": "Format check only. Definitive validity requires the official BIS portal or BIS API integration.",
        }
        if not normalized:
            result["message"] = "Please enter a licence number."
            return result

        for pattern in LICENSE_PATTERNS:
            if re.match(pattern["regex"], normalized):
                result["valid_format"] = True
                result["scheme_type"] = pattern["type"]
                break

        if not result["valid_format"]:
            examples = ", ".join(p["example"] for p in LICENSE_PATTERNS)
            result["message"] = f"Unrecognized format. Expected one of: {examples}"
            return result

        digits = re.sub(r"\D", "", normalized)
        if any(hint in digits for hint in KNOWN_INVALID_HINTS):
            result["status"] = "suspicious"
            result["message"] = "Number matches the correct pattern but looks like a placeholder. Verify on BIS portal."
            result["next_steps"] = ["Cross-check on manakonline.in licence verification page"]
            return result

        result["status"] = "format_valid"
        result["message"] = f"Valid {result['scheme_type']} number format."
        result["next_steps"] = [
            "Confirm holder name & product scope on the official BIS verification portal",
            "Check licence status (active/suspended/cancelled) and validity period",
        ]
        return result


def get_verification_service() -> VerificationService:
    return VerificationService()
