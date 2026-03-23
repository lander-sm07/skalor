"""
CodeQuest — Gamified leerplatform voor middelbare scholieren.
Leerdoel: Software bewerken (07.09.01)
"""

from flask import Flask, render_template, jsonify, request, session
from utils.data import SKILL_TREE, SHOP_ITEMS, AVATAR_OPTIONS
import os

app = Flask(__name__)
app.secret_key = os.environ.get("SECRET_KEY", "codequest-dev-key-change-me")


# ──────────────────────────────────────────────
#  Helpers
# ──────────────────────────────────────────────

def get_player():
    """Haal spelerdata op uit de sessie (of maak een nieuw profiel)."""
    if "player" not in session:
        session["player"] = {
            "username": "Leerling",
            "xp": 325,
            "coins": 750,
            "level": 3,
            "unlocked_levels": [1],
            "completed_skills": [],
            "avatar": {
                "hair": "default",
                "outfit": "hoodie",
                "badge": "beginner",
                "effects": [],
            },
            "inventory": [],
        }
    return session["player"]


def save_player(player):
    """Sla spelerdata op in de sessie."""
    session["player"] = player
    session.modified = True


# ──────────────────────────────────────────────
#  Routes — Pages
# ──────────────────────────────────────────────

@app.route("/")
def index():
    """Hoofdpagina met skill tree, shop, avatar en concept."""
    player = get_player()
    return render_template(
        "index.html",
        player=player,
        skill_tree=SKILL_TREE,
        shop_items=SHOP_ITEMS,
        avatar_options=AVATAR_OPTIONS,
    )


# ──────────────────────────────────────────────
#  Routes — API
# ──────────────────────────────────────────────

@app.route("/api/player", methods=["GET"])
def api_get_player():
    """Geeft huidige spelerdata terug."""
    return jsonify(get_player())


@app.route("/api/complete-skill", methods=["POST"])
def api_complete_skill():
    """Markeer een skill als voltooid en ken XP + coins toe."""
    player = get_player()
    data = request.get_json()
    skill_id = data.get("skill_id")

    if skill_id in player["completed_skills"]:
        return jsonify({"error": "Skill al voltooid"}), 400

    # Zoek de skill in de tree
    for level in SKILL_TREE:
        for skill in level["skills"]:
            if skill["id"] == skill_id:
                # Check of het level unlocked is
                if level["id"] not in player["unlocked_levels"]:
                    return jsonify({"error": "Level nog niet ontgrendeld"}), 403

                player["xp"] += skill["xp"]
                player["coins"] += int(skill["xp"] * 0.8)
                player["completed_skills"].append(skill_id)

                # Level-up check
                player["level"] = 1 + player["xp"] // 500

                save_player(player)
                return jsonify({
                    "success": True,
                    "player": player,
                    "earned_xp": skill["xp"],
                    "earned_coins": int(skill["xp"] * 0.8),
                })

    return jsonify({"error": "Skill niet gevonden"}), 404


@app.route("/api/buy-item", methods=["POST"])
def api_buy_item():
    """Koop een item uit de shop."""
    player = get_player()
    data = request.get_json()
    item_id = data.get("item_id")

    for item in SHOP_ITEMS:
        if item["id"] == item_id:
            if player["coins"] < item["cost"]:
                return jsonify({"error": "Niet genoeg coins"}), 400

            if item_id in player["inventory"]:
                return jsonify({"error": "Item al gekocht"}), 400

            player["coins"] -= item["cost"]
            player["inventory"].append(item_id)

            # Unlock levels als het een level-up is
            if item["type"] == "unlock":
                unlock_level = item.get("unlocks_level")
                if unlock_level and unlock_level not in player["unlocked_levels"]:
                    player["unlocked_levels"].append(unlock_level)

            save_player(player)
            return jsonify({"success": True, "player": player})

    return jsonify({"error": "Item niet gevonden"}), 404


@app.route("/api/reset", methods=["POST"])
def api_reset():
    """Reset spelerdata (voor testing)."""
    session.pop("player", None)
    return jsonify({"success": True, "player": get_player()})


# ──────────────────────────────────────────────
#  Run
# ──────────────────────────────────────────────

if __name__ == "__main__":
    app.run(debug=True, port=5000)
