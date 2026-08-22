# Stitch prompts

One preamble, then one prompt per screen. Paste the preamble first in every new Stitch
conversation, then the screen prompt underneath it. The preamble is what keeps seven screens
looking like one product.

Design only. Nothing here changes what the app does; it changes how it reads.

---

## THE PREAMBLE - paste this above every screen prompt

```
I am designing a web app called THRESHOLD. It is a heritage app for India, built for a
government innovation competition. Design it for desktop first, 1440px wide, with a mobile
layout at 390px.

WHAT THE PRODUCT DOES, so the design can carry the idea:
Between 1916 and 1922 the Archaeological Survey of India catalogued about 1,300 monuments in
Delhi. Only 174 are protected today. The rest did not disappear, they stopped being findable.
THRESHOLD reads those century-old survey pages, projects the monuments they describe back onto
today's map with a circle showing how uncertain the position is, has a human confirm each one,
and then lets each place narrate its own history to a visitor standing in front of it.

THE ONE RULE, and it must be visible in the design: show the evidence, or do not show it at
all. Every claim on screen has a route to its source in one step. The design should feel like a
document you can check, not a dashboard you have to trust.

VISUAL DIRECTION: an archival paper feel. Aged survey documents, field notebooks, printed
plates, ink on cream. Warm and quiet, not corporate, not dark-mode tech, no glassmorphism, no
purple gradients, no drop shadows on everything, no rounded pill buttons. Think a well set
printed book crossed with a map room. Generous white space. Hairline rules instead of heavy
card borders. Flat colour, almost no shadow. Sharp corners or 2px radius at most.

COLOURS, use exactly these:
  paper background      #F4EDE0
  raised surface        #FAF6EE
  sunken surface        #EAE0CE
  primary text          #1F1B16
  secondary text        #5B5245
  faint text and rules  #9A8F7C
  accent, madder red    #9A3412
  deep indigo           #1E3A5F
  verdigris green       #3F6B5E
Status colours, used only for state and never decoration:
  amber   #B45309  automated ceiling
  indigo  #1E3A5F  a human has it
  green   #3F6B5E  a human confirmed it
  grey    #8A8175  terminal
  violet  #6B21A8  already on today's map

TYPE, keep these exactly, they are already right:
  Display and headings: Cormorant Garamond, a light serif. Use it large and confident.
  Body and UI: IBM Plex Sans.
  Labels, numbers, metadata, chips: IBM Plex Mono, uppercase, wide letter spacing, small.
  Hindi and Devanagari: Noto Serif Devanagari.
Big serif headings against small monospace labels is the core typographic contrast of this
product. Lean on it.

TEXTURE: a very subtle paper grain over the whole page, about 3% opacity. Barely perceptible.

WRITING STYLE in all UI copy: plain words, no marketing language, no exclamation marks, no em
dashes anywhere, use a hyphen with spaces instead. No emoji except where a glyph carries real
meaning such as a status tick.

VOCABULARY, use these words exactly and do not substitute synonyms:
  Heritage Site, Heritage Point, Zone, Approach Ring, Threshold Crossing, Visitor, Persona,
  Narration, Fact Sheet, Living Tradition, Route, Walk, Volume, Page, Mention, Spatial Clue,
  Anchor, Uncertainty Radius, Candidate, Modern Baseline, Representation Gap, Confidence,
  Evidence, Reviewer.
Never write "AI found" or "discovered a monument". The archive recorded it, we projected it, a
Reviewer confirms it.
```

---

## 1. Landing page

```
Design the landing page.

This page has one job: in fifteen seconds a judge should understand what this is and want to
click something. Right now it is a wall of paragraphs and it is boring. Make it feel like the
title plate of a survey volume.

STRUCTURE, top to bottom:

A hero that fills most of the first screen. The word THRESHOLD very large in Cormorant
Garamond, and under it in italic serif "Cross it, and the place speaks." Set these against
something with visual weight: a faded archival plan or map engraving of a Mughal fort bleeding
off one edge at low opacity, or a large architectural arch drawn in hairline ink strokes. It
should look printed, not photographed. Small monospace kicker above the title reading
"Team Sigmoid - SIH 2026".

Then the problem, as two short columns, not one block:
Left: "Between 1916 and 1922 the Archaeological Survey of India catalogued roughly 1,300
monuments in Delhi. About 174 are centrally protected today. The rest did not all disappear.
They stopped being findable."
Right: "THRESHOLD reads what the archive already recorded, projects it back onto today's map
with a radius that says how sure we are, and lets a place tell its own story to whoever is
standing in front of it."

Then a full width pull quote, large serif, with a madder red rule down the left:
"One rule governs everything here: show the evidence, or don't show it at all."

Then a band of five statistics across the page, separated by hairline rules, each a very large
serif number over a small monospace caption:
  40  Pages of a 1919 survey read
  123 Mentions pulled out of them
  32  placed as Candidates with a radius
  12  already on today's map
  5   Representation Gaps
Make "5 Representation Gaps" visually dominant, in madder red, because it is the headline
finding. Consider a one line note under it: "recorded once, unmapped now".

Then three doors as large cards, equal width, hairline bordered, flat, no shadow. Each has a
small monospace kicker, a large serif title, two lines of body text, and a subtle arrow. On
hover the border turns madder red and the title changes colour. No lift, no scale.
  Card 1, kicker "For the visitor", title "Explore" - eleven Heritage Sites across Delhi,
    Narrations that start on their own when you arrive and face them.
  Card 2, kicker "For the researcher", title "Discover" - open a real scanned Page of 1919
    English and watch a passage become a pin with an honest circle.
  Card 3, kicker "For the reviewer", title "Authority" - a Candidate is as far as anything
    automated is allowed to go. Only a person moves one further.

Then a short horizontal strip showing the pipeline as a diagram, four steps with thin arrows
between them, drawn in ink hairlines with monospace labels:
  Archive Page -> Mention with a Spatial Clue -> Candidate with an Uncertainty Radius ->
  Reviewer confirms -> appears to a Visitor
This is the thing that makes three separate pages read as one product. Give it real space.

Footer: one line saying no image of a real monument in this project was generated, with a link
to Attributions.
```

---

## 2. Explore

```
Design the Explore screen. Map-led layout.

A full-bleed map of Delhi filling the viewport, with a warm sepia cast over the tiles so it
matches the paper palette. Eleven pins. Filled madder red circles are Heritage Sites with
several Heritage Points you can walk between; hollow cream circles with a red outline are
single structures. Selected pin gets an ink coloured ring.

A right rail, 380px, floating over the map with a hairline border and the raised paper
background, not a heavy panel. It scrolls independently. It contains, stacked:

Panel 1, the site list. Monospace kicker "11 Heritage Sites". One line of help text. Then a
scrollable list of all eleven, each row showing the site name in body type on the left and a
small monospace count on the right reading either "11 points" or "single structure". Hovering a
row highlights the matching pin on the map. This list must exist, it is not optional - the map
is not the only way in.

Panel 2, appears when a site is selected, replacing panel 1. Monospace kicker "Deep site" or
"Single structure". Large serif site name with the Devanagari name under it in a lighter
weight. Period line. Two sentences of description. A small monospace provenance line reading
"position from osm:w264863907", which is the evidence for the pin. Then a prominent outlined
button in madder red, "Begin tour".

Panel 3, Hidden Heritage. This is the emotional centre of the screen and currently it looks
like a list of links. Redesign it as a short stack of entries where each entry visibly declares
what kind of claim it is. Two kinds:
  Confirmed: a green tick, the name in green, and beneath it in monospace the evidence,
    "Zafar Hasan Vol. 2, scan 198, and nothing in the modern baseline sits inside its circle".
  Editorial: the name in normal ink with a small amber monospace chip reading EDITORIAL, and
    beneath it "we rank this among Delhi's least visited, which is our judgement and not a
    measurement".
The contrast between those two kinds is the whole point of the panel, so make it unmissable.
Consider a hairline divider with a monospace label between the two groups.

Add a small legend somewhere unobtrusive explaining filled versus hollow pins.

Mobile: the map takes the top 45% and the rail becomes a draggable bottom sheet.
```

---

## 3. Plan

```
Design the plan screen, where a Visitor sets up their Walk. Document-led, centred column,
maximum 900px, generous margins like a printed page.

Header: monospace kicker "Plan your Walk", large serif "Red Fort", Devanagari name beneath,
one line of period and context.

Three numbered sections, each with a large serif numeral in the margin, the way a printed
form numbers its parts. Hairline rule between sections.

1. What interests you. Five selectable chips: History, Architecture, Culture and traditions,
   Military, Religion. Unselected is a hairline outline with muted text; selected is filled
   madder red with cream text. Multi-select. A quiet line beneath: "Choose nothing and you get
   everything."

2. How long you have. Four options: 10 minutes, 15 minutes, 30 minutes, As long as it takes.
   Same chip treatment, single select. Beneath, live feedback in monospace that updates with
   the choice: "7 Heritage Points, 4 left out to fit" - this proves the control does something
   and it should be visually prominent, not a footnote.

3. Who is it for. Three Persona cards, wider than chips, each with a serif title and a line of
   description: History "What happened here, and when", Architecture "How it was built, and why
   that way", Kids "Shorter, and told as a story". Selected card gets a madder red border and a
   tinted background.

Then a wide primary button, "Begin tour", with a small line under it: "This button also unlocks
audio, which browsers block until you ask for it."

Consider a small preview to the right or below, on desktop only: a thumbnail of the site map
with the resulting Route drawn as a dashed madder line through the chosen points, updating as
choices change. That makes the whole screen feel alive.
```

---

## 4. Tour, the main screen

```
Design the Walk screen. This is the most important screen in the product. Map-led.

LEFT, about 62% of the width: the site map of Red Fort, zoomed in. On it:
  - Zone footprints of each Heritage Point as filled polygons in a translucent indigo.
  - Approach Rings around each Zone as dashed hairline outlines.
  - The Route as a dashed madder red line connecting them in order.
  - The Visitor as a small circle. Cream with an ink outline when simulated; solid madder red
    with a cream outline when the position is real from the phone.
  - A facing cone projecting from the Visitor, a translucent madder wedge about 120 degrees
    wide, showing what they are looking at.
  - When the Visitor is dwelling, a ring around them fills clockwise over three seconds like a
    progress arc. This is the signature animation of the whole product. Make it beautiful.
  - Floating map controls: zoom, and a recentre button.

RIGHT RAIL, about 38%, raised paper, scrolls independently. Restructure it as three tabs, because
it currently crams everything into one column: NOW, ROUTE, NEARBY.

Tab NOW, the default:
  - A status strip at the top: site name, a toggle reading "Simulated" or "Phone", and when live
    a monospace accuracy readout like "12 m accuracy".
  - THE TRIGGER PANEL, and this deserves to be the hero of the rail. It explains why a place is
    or is not speaking. Design it as a small instrument panel with three conditions listed
    vertically, each with a state glyph and a live value:
        INSIDE APPROACH RING     yes
        FACING                   away by 84 degrees
        STOOD STILL              1.4s of 3s
    Each condition is a row with a monospace label on the left, a value on the right, and a
    filled or hollow marker. Met conditions are verdigris green, unmet are amber, with the
    failing one called out. When all three are met the panel turns green and reads SPEAKING.
    This is the thing judges will stare at. Right now it is three lines of grey text.
  - The Heritage Point name, very large serif, Devanagari beneath.
  - Persona switcher: three small monospace chips, History Architecture Kids.
  - The Narration player: a play button, duration, and the transcript beneath it with the
    currently spoken sentence highlighted in a warm tint and the rest in muted ink. The
    highlight should move sentence by sentence as the audio plays.
  - A LIVING TRADITION card. This is currently buried at the bottom and it carries half the
    cultural weight of the whole product. Promote it: give it its own visual identity, a warm
    tinted background, a small icon or ornament, a status chip reading living, dormant or lost
    in the state colours, a serif title and two or three lines of text. It should feel like a
    different kind of knowledge from the architecture facts around it.
  - A THEN AND NOW card: two photographs of the same structure a century apart with a vertical
    draggable divider between them. Year labels in monospace at each top corner. A visible drag
    handle on the divider line. Beneath, one line saying what changed, then a small monospace
    credit line with both photographers and licences.
  - A collapsible "Show evidence" section listing the sourced Fact Sheet lines, each with its
    source in monospace beneath.

Tab ROUTE: the ordered list of Heritage Points with walking time between each, tap any to jump
to it, with the ones already spoken marked.

Tab NEARBY: the Hidden Heritage list, same treatment as on Explore.

An opening overlay before the Walk starts: a centred card over a dimmed map explaining the three
conditions in plain language, with a "Begin tour" button.
```

---

## 5. Discover, the researcher screen

```
Design the Discover screen. Document-led. This screen currently looks like three random panels
and a person opening it does not know what it is for. Fix that first.

Add a proper header band across the top, on paper-sunk background, that orients the visitor
before anything else:
  Monospace kicker: "The researcher's view".
  Large serif heading: "Watch a 1919 page become a place on the map".
  Two lines of body: "This is Maulvi Zafar Hasan's survey of Delhi, published in 1919. Pick any
  of its forty Pages and press Analyse. Every structure the page names becomes a card, every
  location it describes becomes a pin with a circle showing how sure we are, and every step is
  inspectable."
  Then a horizontal four-step diagram with thin arrows, monospace labels, drawn as hairline ink:
    PAGE -> MENTION -> SPATIAL CLUE -> CANDIDATE WITH A RADIUS
  Each step has one line of explanation under it. This diagram is the fix for "I don't know
  what this page is".

BELOW THAT, three columns:

LEFT, 220px, the shelf. Monospace kicker "The shelf". The volume title. A vertical list of forty
Page numbers. Each row shows the scan number, the printed page number smaller, and on the right
a madder red count of how many places that Page put on the map, or a dash if none. The dash rows
should be visibly quieter. A short line of help: "The number on the right is how many places
that page put on the map last time it was read."

CENTRE, flexible, the Page. The scanned page image with a hairline border and a slight paper
shadow so it reads as a physical object. Beneath it the transcribed text in a monospace or
serif-mono face, with the currently selected passage highlighted in a warm amber wash. A
prominent "Analyse" button top right of this column, madder red outline, that shows "Reading the
page" while working.

RIGHT, 420px, results. At the top a small inline map showing the pins and their Uncertainty
Radius circles, drawn as translucent madder discs with a hairline edge. Under it a header row
reading "3 mentions, 2 placed, 1 partial" in monospace with a source chip on the right, green
"live" or amber "cached". When cached, a line beneath explaining why in plain language.

Then the Mention cards, stacked. Each card:
  - Structure name in serif, structure type in monospace on the right.
  - Period if known.
  - The Spatial Clue rendered as readable English: "300 yards S of Police Station Paharganj".
  - A verdict chip in the state colours: "On today's map" violet, "Representation Gap" madder,
    "Too wide to check" grey, "Not placed" faint.
  - The radius in metres and a Confidence number in monospace.
  - When a Mention could not be placed, a quiet explanatory line, not an error.
  - When the model composed a passage instead of copying it, a red line saying so.

An Evidence panel that slides in from the right when a card is opened, overlaying the results
column. It shows, stacked with hairline dividers and monospace labels: the Page and scan number,
the exact passage quoted in a serif face with quote marks, the Anchor used and its source, the
bearing and distance, then the Uncertainty Radius broken into its four parts shown as a small
horizontal stacked bar with a legend, then the Modern Baseline check listing what was found
inside the circle. Design the radius breakdown as a real visualisation, it is the most
persuasive object in the product.
```

---

## 6. Authority, the reviewer screen

```
Design the Authority screen. Document-led. Right now a visitor has no idea what this page is,
so the design has to answer that in the first two seconds.

Header band, on paper-sunk:
  Monospace kicker: "The reviewer's desk".
  Large serif: "Nothing automated gets past Candidate".
  Body: "The pipeline can go as far as proposing a Candidate with a radius and a source. It can
  never say a monument exists. Only a person here can move one forward, and every move is
  written to a record that cannot be edited."

Under that, a horizontal state diagram, which is the single best explanation of this page. Draw
it as five boxes connected by arrows, each box in its state colour with a hairline border:
    Candidate (amber) -> Under review (indigo) -> Verified (green)
                                               -> Rejected (grey)
                                               -> Already on today's map (violet)
Label the first box "as far as automation goes" and put a small human figure or hand glyph on
the arrow leaving it, to show where the person enters. Each box shows a live count.

Then the queue. Filter chips across the top in the state colours with counts. Each Candidate is
a row, not a card, with hairline dividers, so the queue reads like a ledger:
  - Name in serif on the left, status word in its state colour in monospace on the right.
  - A metadata line in monospace: structure type, scan number, radius in metres, the baseline
    verdict, and the Confidence score.
  - A row of actions: an "Evidence" button, then only the moves that are legal from the current
    state, as outlined madder buttons. When a state is terminal, a quiet line reading "terminal,
    nothing moves from here" instead of buttons.
  - Colour is never the only signal. Every status carries a colour, a word, and a distinct glyph
    shape, because five colours will not survive a projector.

A source chip at the top right, green "live" or amber "stale", and when stale a line explaining
that the database is unreachable and this is the snapshot committed with the app.

At the bottom, the Walk log. Monospace kicker, serif heading "Threshold Crossings that
happened", a line saying it is anonymous and a Walk is a random id thrown away, never a person.
Then a list of crossings with the Heritage Point, the persona, the kind, whether the position
was simulated or real, and a timestamp. When the database is unreachable, a clear line saying so
rather than an empty list.

After a Reviewer verifies something, show a confirmation strip with a link reading "See it on
the map", pointing at Explore. That link is what makes the three pages read as one product.
```

---

## 7. Attributions

```
Design the Attributions page. Document-led, centred column, maximum 1000px. This page should
feel like the colophon at the back of a printed book.

Header: monospace kicker "Sources", large serif "Attributions", then a paragraph: "Everything
shown in THRESHOLD came from somewhere, and this page says where. No image of a real monument in
this project was generated. Archival photography is public domain by age; modern photography is
Creative Commons and credited both here and beside the image itself."

Section 1, Then and now photographs. A table with hairline rules only, no zebra striping, no
borders around cells. Columns: Heritage Point with a small monospace "then" or "now" beneath,
Author, Date, Licence, and a link reading "Wikimedia Commons". Set the author names in body
type and the dates and licences in monospace.

Section 2, The record. A definition list: term in ink, description in muted ink beneath, hairline
rule between entries. Entries for the archival volume, the Modern Baseline pull with its feature
count and date, the Zone footprints, the map tiles, the narration voices, and the typefaces.

Section 3, What is not here. Set this apart with a rule above it and slightly larger type,
because it is the strongest claim on the page: "No generated imagery of any real place. No
photograph whose author or licence we could not name. Nothing on screen that does not have a
route back to a source in one step."

Keep it quiet, dense and confident. This page should look like it was typeset, not designed.
```

---

## After Stitch

Stitch will give you layouts, not our stack. Take from it in this order:

1. Structure and hierarchy - what sits where, what is big, what is small. Cheapest to port and
   the biggest win.
2. Copy blocks and the explanatory diagrams - the header bands on Discover and Authority are the
   whole answer to "I don't know what this page is".
3. Component treatments - the trigger panel, the Living Tradition card, the radius breakdown bar.
4. Colour and type - mostly already correct, so only take deltas.

Do not take: rounded pills, drop shadows, gradients, icon sets that do not match hairline ink
drawing, or anything that needs a new dependency.
