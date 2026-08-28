from ..models.standard import Standard

SAMPLE_STANDARDS = [
    {"code": "IS 456", "title": "Plain and Reinforced Concrete - Code of Practice", "category": "Civil Engineering", "year": "2000", "description": "Standard for design and construction of plain and reinforced concrete structures."},
    {"code": "IS 1786", "title": "High Strength Deformed Steel Bars and Wires for Concrete Reinforcement", "category": "Metallurgy", "year": "2008", "description": "Covers TMT bars grades Fe415, Fe500, Fe550, Fe600 used in reinforced concrete."},
    {"code": "IS 3025", "title": "Methods of Sampling and Test for Water and Wastewater", "category": "Water", "year": "1987", "description": "Laboratory methods for physical and chemical testing of water."},
    {"code": "IS 9873", "title": "Safety Requirements for Toys", "category": "Toys", "year": "2021", "description": "Safety aspects of toys for children under the Toys (Quality Control) Order."},
    {"code": "IS 16046", "title": "Self-ballasted LED Lamps for General Lighting Services", "category": "Electronics", "year": "2018", "description": "Safety requirements for LED lamps under CRS scheme."},
    {"code": "IS 15546", "title": "Polyethylene Pipes for Water Supply", "category": "Plastics", "year": "2007", "description": "Requirements for PE pipes used in water supply systems."},
    {"code": "IS 411", "title": "Fine Grained Steel, Medium and High Tensile Structural Steel", "category": "Metallurgy", "year": "2013", "description": "Structural steel requirements for general construction."},
    {"code": "IS 10500", "title": "Drinking Water - Specification", "category": "Water", "year": "2012", "description": "Acceptable limits for drinking water quality parameters."},
    {"code": "IS 4985", "title": "Unplasticized PVC Pipes for Potable Water Supplies", "category": "Plastics", "year": "2000", "description": "Specification for uPVC pipes with rubber seals for potable water."},
    {"code": "IS 15656", "title": "Safety of Household and Similar Electrical Appliances - General Requirements", "category": "Electronics", "year": "2006", "description": "General safety requirements for household electrical appliances under ISI mark scheme."},
]


def seed_standards(db):
    if db.query(Standard).count() > 0:
        return
    for item in SAMPLE_STANDARDS:
        db.add(Standard(**item))
    db.commit()
