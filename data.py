"""Content for the site. Edit here, no template changes needed."""

EVENT = {
    "name": "Hack Olympus",
    "tagline": "Forge something worthy of the gods.",
    "date_iso": "2027-03-12T09:00:00",   # countdown target (local time)
    "date_text": "March 12 to 14, 2027",
    "duration": "36 hours",
    "venue": "Mount Olympus Innovation Hall",
    "contact": "hello@hackolympus.dev",
}

TRACKS = [
    {"slug": "zeus", "god": "Zeus", "letter": "Ζ", "tone": "fire",
     "domain": "Artificial Intelligence",
     "blurb": "Command the storm. Build models, agents and tools that think.",
     "detail": "Zeus rules by thunder and foresight. In this track, teams build with machine learning, language models, vision and autonomous agents.",
     "ideas": ["An agent that plans a whole city's bus network", "A tutor that adapts to how each student learns",
               "Vision tools that read ancient inscriptions"]},
    {"slug": "athena", "god": "Athena", "letter": "Θ", "tone": "jade",
     "domain": "Web and Apps",
     "blurb": "Strategy and craft. Ship products people want to use.",
     "detail": "Athena favours the clever plan over brute force. Build web or mobile products with sharp design and a clear purpose.",
     "ideas": ["A local-first app for community libraries", "An accessible booking tool for small clinics",
               "A collaborative map of neighbourhood stories"]},
    {"slug": "hephaestus", "god": "Hephaestus", "letter": "Φ", "tone": "red",
     "domain": "Hardware and IoT",
     "blurb": "Work at the forge. Sensors, circuits and machines that move.",
     "detail": "The smith of the gods made golden servants. Bring a working device: embedded systems, robotics, wearables or smart sensors.",
     "ideas": ["A flood sensor network for farms", "A low-cost prosthetic controller",
               "A wearable that warns of unsafe noise levels"]},
    {"slug": "poseidon", "god": "Poseidon", "letter": "Ψ", "tone": "jade",
     "domain": "Cloud and Data",
     "blurb": "Master the deep. Scale systems and make sense of oceans of data.",
     "detail": "Poseidon governs what is vast and hidden. Build data pipelines, dashboards and infrastructure that hold up under load.",
     "ideas": ["Live ocean-health dashboard from open data", "A zero-downtime migration toolkit",
               "A cost-aware autoscaler for student projects"]},
    {"slug": "apollo", "god": "Apollo", "letter": "Ω", "tone": "fire",
     "domain": "Health and Education",
     "blurb": "Heal and teach. Technology that makes people's days better.",
     "detail": "Apollo is the god of medicine, music and learning. Build for wellbeing, access to care or education for everyone.",
     "ideas": ["Medication reminders for elderly relatives", "A sign-language practice partner",
               "A mental health check-in that respects privacy"]},
    {"slug": "ares", "god": "Ares", "letter": "Λ", "tone": "red",
     "domain": "Cybersecurity",
     "blurb": "Defend the walls. Find the weakness before the enemy does.",
     "detail": "Ares knows every battlefield. Build defensive tools, privacy tech and security education. Defence only, no attack tooling.",
     "ideas": ["A phishing-awareness game", "A password hygiene checker that runs offline",
               "A privacy audit for school apps"]},
]

JOURNEY = [
    {"when": "Dec 1, 2026", "title": "Gates open", "text": "Registration begins. Solo heroes and teams of up to four are welcome."},
    {"when": "Feb 15, 2027", "title": "The oracle speaks", "text": "Challenge briefs and mentor lineup are revealed."},
    {"when": "Mar 12, 9:00", "title": "Opening ceremony", "text": "Kickoff, rules, and the first lightning strike. The clock starts."},
    {"when": "Mar 13", "title": "Trial by fire", "text": "Mentor sessions, workshops and a midnight snack run."},
    {"when": "Mar 14, 14:00", "title": "Judgement", "text": "Demos in front of the panel. Five minutes each."},
    {"when": "Mar 14, 18:00", "title": "Coronation", "text": "Winners are crowned and prizes awarded."},
]

PRIZES = [
    {"place": "Second", "name": "Silver Laurel", "amount": "$2,500", "tone": "jade", "h": "m"},
    {"place": "First", "name": "Olympian Crown", "amount": "$5,000", "tone": "fire", "h": "l"},
    {"place": "Third", "name": "Bronze Shield", "amount": "$1,000", "tone": "red", "h": "s"},
]

FAQ = [
    ("Who can join?", "Any student or professional aged 16 or over. No experience is required. Mentors will be on hand."),
    ("How big can a team be?", "Up to four people. You can also register solo and we will help you find a team."),
    ("Does it cost anything?", "No. Registration, meals and swag are free for accepted participants."),
    ("Can I start before the event?", "Ideas and planning are fine. All code, hardware and design must be made during the 36 hours."),
    ("What should I bring?", "A laptop, chargers, an ID, and anything you need for hardware projects. We provide power, Wi-Fi and food."),
]
