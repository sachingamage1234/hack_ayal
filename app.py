import os
import re
import sqlite3
from contextlib import closing

from flask import Flask, abort, jsonify, render_template, request

from data import EVENT, FAQ, JOURNEY, PRIZES, TRACKS

app = Flask(__name__, instance_relative_config=True)
os.makedirs(app.instance_path, exist_ok=True)
app.config["DATABASE"] = os.path.join(app.instance_path, "olympus.db")
app.config["ADMIN_KEY"] = os.environ.get("ADMIN_KEY", "")

EMAIL_RE = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")
LEVELS = {"beginner", "intermediate", "advanced"}
TRACK_SLUGS = {t["slug"] for t in TRACKS}


def db():
    conn = sqlite3.connect(app.config["DATABASE"])
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    with closing(db()) as conn:
        conn.execute(
            """CREATE TABLE IF NOT EXISTS registrations (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                email TEXT NOT NULL UNIQUE,
                team TEXT,
                track TEXT NOT NULL,
                level TEXT NOT NULL,
                note TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )"""
        )
        conn.commit()


def zeus_image():
    """Return the URL of the hero image if one has been dropped into static/img."""
    for ext in ("jpg", "jpeg", "webp", "png"):
        if os.path.exists(os.path.join(app.static_folder, "img", f"zeus.{ext}")):
            return f"/static/img/zeus.{ext}"
    return None


@app.context_processor
def inject_globals():
    return {"event": EVENT, "tracks": TRACKS}


@app.route("/")
def index():
    return render_template(
        "index.html", journey=JOURNEY, prizes=PRIZES, faq=FAQ, zeus_url=zeus_image()
    )


@app.route("/tracks/<slug>")
def track(slug):
    current = next((t for t in TRACKS if t["slug"] == slug), None)
    if current is None:
        abort(404)
    return render_template("track.html", t=current)


@app.post("/register")
def register():
    data = request.get_json(silent=True) or request.form
    if data.get("website"):  # honeypot, bots fill this in
        return jsonify(ok=True, message="Welcome to Olympus.")

    name = (data.get("name") or "").strip()
    email = (data.get("email") or "").strip().lower()
    team = (data.get("team") or "").strip()[:80]
    track_slug = data.get("track") or ""
    level = data.get("level") or ""
    note = (data.get("note") or "").strip()[:500]

    errors = {}
    if len(name) < 2:
        errors["name"] = "Enter your full name."
    if not EMAIL_RE.match(email):
        errors["email"] = "Enter a valid email address."
    if track_slug not in TRACK_SLUGS:
        errors["track"] = "Choose a track."
    if level not in LEVELS:
        errors["level"] = "Choose your experience level."
    if errors:
        return jsonify(ok=False, errors=errors), 400

    try:
        with closing(db()) as conn:
            conn.execute(
                "INSERT INTO registrations (name, email, team, track, level, note) VALUES (?,?,?,?,?,?)",
                (name, email, team, track_slug, level, note),
            )
            conn.commit()
    except sqlite3.IntegrityError:
        return jsonify(ok=False, errors={"email": "This email is already registered."}), 409

    return jsonify(ok=True, message=f"Welcome to Olympus, {name.split()[0]}. Check your inbox soon.")


@app.get("/admin/registrations")
def admin_registrations():
    key = app.config["ADMIN_KEY"]
    if not key or request.args.get("key") != key:
        abort(404)
    with closing(db()) as conn:
        rows = conn.execute("SELECT * FROM registrations ORDER BY id DESC").fetchall()
    return render_template("admin.html", rows=rows)


@app.errorhandler(404)
def not_found(_):
    return render_template("404.html"), 404


init_db()

if __name__ == "__main__":
    app.run(debug=True)
