"""
Alle game-data: skill tree, shop items, avatar-opties.

Leerdoel 07.09.01 — Software bewerken:
  "De leerlingen bewerken software om een specifiek product te maken
   of om een probleem op te lossen."
"""

# ──────────────────────────────────────────────
#  Skill Tree
# ──────────────────────────────────────────────

SKILL_TREE = [
    {
        "id": 1,
        "level": "Niveau 1 — Basis",
        "color": "#6C63FF",
        "skills": [
            {
                "id": "s1-1",
                "name": "Wat is software?",
                "xp": 50,
                "desc": "Verschil tussen systeem- en toepassingssoftware.",
            },
            {
                "id": "s1-2",
                "name": "Soorten software",
                "xp": 50,
                "desc": "Open source vs. proprietary, besturingssystemen.",
            },
            {
                "id": "s1-3",
                "name": "Instellingen wijzigen",
                "xp": 75,
                "desc": "Parameters en configuratiebestanden aanpassen.",
            },
        ],
    },
    {
        "id": 2,
        "level": "Niveau 2 — Toepassen",
        "color": "#00C9A7",
        "skills": [
            {
                "id": "s2-1",
                "name": "Code lezen & begrijpen",
                "xp": 100,
                "desc": "Variabelen, loops, functies herkennen.",
            },
            {
                "id": "s2-2",
                "name": "Kleine aanpassingen",
                "xp": 125,
                "desc": "Bestaande code wijzigen om output te veranderen.",
            },
            {
                "id": "s2-3",
                "name": "Software installeren & configureren",
                "xp": 100,
                "desc": "Software aanpassen aan verschillende omgevingen.",
            },
        ],
    },
    {
        "id": 3,
        "level": "Niveau 3 — Creëren",
        "color": "#FF6B6B",
        "skills": [
            {
                "id": "s3-1",
                "name": "Probleem analyseren",
                "xp": 150,
                "desc": "Een probleem vertalen naar een softwareoplossing.",
            },
            {
                "id": "s3-2",
                "name": "Eigen aanpassingen schrijven",
                "xp": 200,
                "desc": "Zelf code schrijven om software te bewerken.",
            },
            {
                "id": "s3-3",
                "name": "Product opleveren",
                "xp": 250,
                "desc": "Een werkend eindproduct maken en presenteren.",
            },
        ],
    },
]


# ──────────────────────────────────────────────
#  Shop Items
# ──────────────────────────────────────────────

SHOP_ITEMS = [
    # Avatar cosmetics
    {
        "id": "avatar-hair",
        "name": "🎨 Nieuwe haarkleur",
        "cost": 100,
        "type": "avatar",
    },
    {
        "id": "avatar-pet",
        "name": "🧢 Pet",
        "cost": 150,
        "type": "avatar",
    },
    {
        "id": "avatar-fire",
        "name": "🔥 Vuureffect",
        "cost": 300,
        "type": "avatar",
    },
    # Level unlocks
    {
        "id": "unlock-lvl2",
        "name": "⬆️ Level-up Niveau 2",
        "cost": 500,
        "type": "unlock",
        "unlocks_level": 2,
    },
    {
        "id": "unlock-lvl3",
        "name": "⬆️ Level-up Niveau 3",
        "cost": 1000,
        "type": "unlock",
        "unlocks_level": 3,
    },
    # Boosts
    {
        "id": "boost-hints",
        "name": "💡 Hint token (x3)",
        "cost": 75,
        "type": "boost",
    },
]


# ──────────────────────────────────────────────
#  Avatar Opties
# ──────────────────────────────────────────────

AVATAR_OPTIONS = {
    "hair": ["default", "blauw", "rood", "groen", "goud"],
    "outfit": ["hoodie", "pak", "sportief", "casual"],
    "badge": ["beginner", "gevorderd", "expert", "meester"],
}
