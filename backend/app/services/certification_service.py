SCHEMES = {
    "electronics": {
        "scheme": "CRS (Compulsory Registration Scheme)",
        "authority": "MeitY + BIS",
        "applies_to": "Electronics & IT goods (LED lamps, mobile phones, power banks, adapters, laptops, smart watches)",
    },
    "default": {
        "scheme": "ISI Mark (Product Certification Scheme)",
        "authority": "BIS",
        "applies_to": "Cement, steel, toys, water bottles, LPG cylinders, electrical appliances, and 350+ other products",
    },
}

STEPS_ISI = [
    {"step": 1, "title": "Identify applicable IS standard", "detail": "Find the IS code for your product via BIS product manual or this assistant's search."},
    {"step": 2, "title": "Factory setup & in-house testing", "detail": "Set up production with required testing equipment as per the IS standard's testing clauses."},
    {"step": 3, "title": "Apply on BIS portal", "detail": "File application at manakonline.in with factory details, raw material sources, and test reports."},
    {"step": 4, "title": "BIS factory inspection", "detail": "BIS officer audits your factory, verifies testing capability, and draws independent samples."},
    {"step": 5, "title": "Sample testing", "detail": "Samples are tested in BIS-recognized labs; you pay testing charges."},
    {"step": 6, "title": "License grant", "detail": "On conformity, a licence (CM/L number) is issued; pay marking fee and start using ISI mark."},
    {"step": 7, "title": "Surveillance", "detail": "Periodic inspections and market samples ensure continued conformity."},
]

STEPS_CRS = [
    {"step": 1, "title": "Identify applicable IS standard", "detail": "Match your electronics product to its mandatory IS standard under CRS."},
    {"step": 2, "title": "Test in BIS-recognized lab", "detail": "Get product tested at any MeitY/BIS-recognized lab as per IS standard test methods."},
    {"step": 3, "title": "Online registration", "detail": "Apply on manakonline.in with test report, brand trademark proof, and factory details."},
    {"step": 4, "title": "Registration grant", "detail": "Receive R-number registration letter; affix the Standard Mark with R-number on product."},
]

DOCUMENTS_REQUIRED = [
    "Business registration proof (Company/GST/MSME Udyam)",
    "Factory layout plan and machinery list",
    "Raw material source details / supplier certificates",
    "In-house test equipment list and calibration records",
    "Internal test reports of product samples",
    "Trademark certificate (if brand is used)",
    "Test report from BIS-recognized lab (for CRS)",
]

FEES = [
    {"item": "Application fee (ISI)", "amount": "\u20b92,000 per application"},
    {"item": "Inspection charges (ISI)", "amount": "~\u20b97,000 + travel"},
    {"item": "License fee (ISI)", "amount": "\u20b91,000/year minimum"},
    {"item": "Marking fee (ISI)", "amount": "Varies by production volume"},
    {"item": "Registration fee (CRS)", "amount": "~\u20b943,000 per product (incl. processing)"},
]


class CertificationService:
    def guidance(self, product: str = "", industry: str = "") -> dict:
        text = f"{product} {industry}".lower()
        electronics_keywords = ["led", "mobile", "phone", "laptop", "charger", "adapter", "power bank", "electronic", "smart watch", "battery", "tv"]
        scheme_key = "electronics" if any(k in text for k in electronics_keywords) else "default"
        scheme = SCHEMES[scheme_key]
        steps = STEPS_CRS if scheme_key == "electronics" else STEPS_ISI
        return {
            "product": product or "(not specified)",
            **scheme,
            "steps": steps,
            "documents_required": DOCUMENTS_REQUIRED,
            "fees": FEES,
            "typical_timeline": "2\u20136 months (ISI), 4\u20138 weeks (CRS) after complete application",
            "official_portals": ["https://www.bis.gov.in", "https://www.manakonline.in"],
            "disclaimer": "Guidance only. Verify current requirements, fees, and QCO lists on bis.gov.in before applying.",
        }


def get_certification_service() -> CertificationService:
    return CertificationService()
