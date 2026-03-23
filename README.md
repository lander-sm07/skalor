# 🎮 CodeQuest — Gamified Leerplatform

> *Studeren hoeft niet alleen te zijn.*

CodeQuest is een gamified leerplatform voor middelbare scholieren dat hen helpt hun **studiedoelen** te bereiken door middel van een skill tree, currency systeem, en AI-coaching.

**Leerdoel:** Software bewerken (07.09.01) — De leerlingen bewerken software om een specifiek product te maken of om een probleem op te lossen.

---

## 📸 Features

| Feature | Beschrijving |
|---------|-------------|
| 🌳 **Skill Tree** | 3 niveaus (Basis → Toepassen → Creëren) met elk 3 vaardigheden |
| 🪙 **Currency** | Verdien coins door opdrachten af te ronden, besteed ze in de shop |
| 👤 **Avatar** | Personaliseerbaar profiel dat meegroeit met je voortgang |
| 🤖 **AI Coach** | Slimme begeleiding die zich aanpast aan jouw niveau |
| 🛒 **Shop** | Koop level-ups, avatar-upgrades en boosts |

---

## 🚀 Installatie

### Vereisten
- Python 3.10 of hoger
- pip

### Stappen

```bash
# 1. Clone de repository
git clone https://github.com/<jouw-username>/codequest.git
cd codequest

# 2. Maak een virtual environment
python -m venv venv

# 3. Activeer de virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# 4. Installeer dependencies
pip install -r requirements.txt

# 5. Start de app
python app.py
```

Open vervolgens **http://localhost:5000** in je browser.

---

## 📁 Projectstructuur

```
codequest/
├── app.py                  # Flask applicatie (routes & API)
├── requirements.txt        # Python dependencies
├── .gitignore              # Git ignore regels
├── README.md               # Dit bestand
│
├── utils/
│   ├── __init__.py
│   └── data.py             # Game data (skill tree, shop, avatar)
│
├── templates/
│   └── index.html          # Hoofd HTML template
│
└── static/
    ├── css/
    │   └── style.css       # Alle styling
    ├── js/
    │   └── app.js          # Client-side interactie
    └── img/                # Afbeeldingen (voeg hier toe)
```

---

## 🛠️ Hoe bijdragen?

1. **Fork** deze repository
2. Maak een nieuwe **branch**: `git checkout -b feature/mijn-feature`
3. **Commit** je wijzigingen: `git commit -m "feat: beschrijving"`
4. **Push** naar je branch: `git push origin feature/mijn-feature`
5. Maak een **Pull Request**

### Commit conventie

Gebruik deze prefixes voor duidelijke commits:

| Prefix | Betekenis |
|--------|-----------|
| `feat:` | Nieuwe feature |
| `fix:` | Bug fix |
| `style:` | CSS/UI aanpassingen |
| `docs:` | Documentatie |
| `refactor:` | Code opschonen |

---

## 👥 Team

| Naam | Rol |
|------|-----|
| — | — |
| — | — |
| — | — |

---

## 📝 Licentie

Dit project is gemaakt als schoolopdracht voor Thomas More hogeschool.
