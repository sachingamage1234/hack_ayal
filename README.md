# Hack Olympus

A Greek-mythology hackathon site built with Flask. Burning red, jade green and fire yellow.

## Run it

```bash
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
python app.py
```
Open http://127.0.0.1:5000

## Images

`static/img/zeus.jpg` hero background, `static/img/spear.png` the two spears (cut out and levelled, the right one is mirrored in CSS),
`static/img/athena.jpg` the Athena banner near the end of the page. Swap any file with the same name to change it.

## Edit content

All text (dates, tracks, prizes, FAQ) lives in `data.py`. Dates and prize amounts are placeholders.

## Registrations

Saved to `instance/olympus.db` (SQLite). To view them:

```bash
ADMIN_KEY=choose-a-secret python app.py
# then visit /admin/registrations?key=choose-a-secret
```

## Structure

```
app.py            routes, validation, database
data.py           site content
templates/        base, index, track, 404, admin
static/css        style.css (theme tokens at the top)
static/js         main.js (nav, countdown, spear scroll animation, form)
                  pantheon.js (god spotlight), fx.js (fire and leaf particles)
static/img        put zeus.jpg here
```

## Particles

`fx.js` reads `data-fx="fire"` or `data-fx="leaf"` on each section and spawns embers (roaming the whole screen) or leaves (drifting in from the edges)
while that section is in view. Change a section's mood by editing the attribute. Particles are disabled for visitors
who prefer reduced motion.
