# THRESHOLD

India's heritage is not missing; it is unfindable and unexplained. THRESHOLD reads what the archives already recorded, projects it back onto today's map, and lets a place tell its own story to whoever is standing in front of it.

One principle governs every decision here: **show the evidence, or don't show it at all.**

## Language

### The place

**Heritage Site**:
A bounded place a visitor travels to, containing one or more Heritage Points.
_Avoid_: monument, attraction, destination, location

**Heritage Point**:
A single named structure or space inside a Heritage Site that can speak for itself. The smallest thing that has its own story.
_Avoid_: POI, marker, node, sub-location, landmark

**Zone**:
The traced footprint of a Heritage Point - the ground the structure actually occupies.
_Avoid_: geofence, boundary, area, perimeter

**Approach Ring**:
The band around a Zone within which a Heritage Point is close enough to speak. Derived from the Zone, never drawn by hand.
_Avoid_: radius, buffer, proximity zone

**Anchor** *(discovery sense below is distinct - see Anchor under "The record")*

### The visitor

**Visitor**:
The person moving through a Heritage Site. Anonymous; we never know who they are, only where they are.
_Avoid_: user, tourist, customer

**Facing**:
Whether the Visitor's heading points at a Heritage Point's centre within tolerance. A Visitor beside a structure with their back to it is not Facing it.
_Avoid_: orientation, bearing, direction, heading

**Dwell**:
The unbroken time a Visitor holds every trigger condition. Walking past is not Dwelling.
_Avoid_: wait, delay, linger time

**Sight Line**:
The wedge thrown forward from a Visitor's Facing, as wide as the Facing tolerance and as long as the sight range. It is drawn on the map, and what it touches is what can speak.
_Avoid_: cone, view frustum, ray, line of sight

**Threshold Crossing**:
The moment a Heritage Point is Within Reach of a Visitor, who is Facing it and has Dwelled long enough. The event the whole product is named for.
_Avoid_: entry, trigger, geofence event, arrival

**Within Reach**:
Either the Visitor stands inside the Approach Ring, or their Sight Line touches it. A place you can see across a courtyard is close enough to speak; a place behind you is not, at any distance.
_Avoid_: nearby, in range, proximity

**Walk**:
One Visitor's continuous session moving through one Heritage Site.
_Avoid_: tour, trip, journey, session

**Location Source**:
Where a Visitor's position comes from. Simulated and real positions are the same kind of thing and travel the same path; only the source differs.
_Avoid_: GPS, demo mode, fake location

### The telling

**Fact Sheet**:
The sourced, human-checkable record of what is true about a Heritage Point. Every Narration is derived from one; nothing is ever said that a Fact Sheet does not support.
_Avoid_: content, description, info, data

**Narration**:
One telling of one Heritage Point, for one Persona, in one language. A Fact Sheet has many Narrations.
_Avoid_: audio, clip, script, story

**Persona**:
Who a Narration is written for. Changes how a Heritage Point is told, never which Heritage Points exist.
_Avoid_: profile, mode, audience type

**Interest Tag**:
A subject label on a Heritage Point, used to decide whether it belongs in a Route. Independent of Persona - a child may still want the military points.
_Avoid_: category, interest, theme, topic

**Living Tradition**:
The intangible practice a Heritage Point holds - a ritual, craft, cuisine or performance still connected to it. Heritage that is done, not built.
_Avoid_: culture, custom, intangible heritage

**Route**:
An ordered selection of Heritage Points that fits a Visitor's Interest Tags and time budget.
_Avoid_: itinerary, path, plan, trail

### The record

**Volume**:
A scanned archival publication we have ingested whole.
_Avoid_: document, book, source, corpus

**Page**:
One leaf of a Volume, held as both its scanned image and its text. The unit a Visitor points at and the unit we process.
_Avoid_: scan, sheet, folio

**Mention**:
A passage on a Page that names a structure. The rawest unit of the record - a Mention is a claim the archive made, not a claim we make.
_Avoid_: entity, extraction, hit, match, detection

**Spatial Clue**:
The textual description of where a Mention's structure stands, expressed relative to an Anchor - a bearing and a distance in the language of the period.
_Avoid_: location, geo hint, address, coordinates

**Anchor**:
A present-day landmark whose position we know, from which a Spatial Clue is measured.
_Avoid_: reference point, origin, base

**Uncertainty Radius**:
The distance within which a projected structure is believed to lie. Always shown; a coordinate without one is a lie.
_Avoid_: error, margin, tolerance, accuracy

**Candidate**:
A structure projected from the record that has not been confirmed against today's map. The furthest anything automated is permitted to go. Only a Reviewer moves a Candidate further.
_Avoid_: discovery, find, new site, detection, result

**Modern Baseline**:
Today's record of what is already mapped, against which a Candidate is checked.
_Avoid_: current data, OSM, ground truth

**Representation Gap**:
A Candidate with nothing from the Modern Baseline inside its Uncertainty Radius - recorded once, unmapped now. The thing this product exists to surface.
_Avoid_: undiscovered site, lost monument, hidden site

**Confidence**:
A decomposable score whose parts are always visible. Never a verdict, never a state.
_Avoid_: probability, certainty, accuracy, score

**Evidence**:
The specific Page, passage, Anchor and Baseline check standing behind a Candidate. Nothing appears on screen without its Evidence reachable in one step.
_Avoid_: proof, justification, provenance

**Reviewer**:
A person with the authority to move a Candidate out of `candidate`. The only actor who can.
_Avoid_: admin, authority, expert, moderator

### Never say

**"discovered a monument"** - nothing here discovers anything. The archive recorded it; we projected it; a Reviewer confirms it. Say *surfaced a Candidate* or *identified a Representation Gap*.

**"AI found"** - the extraction reads a Page. Attribute claims to the Volume, not to the model.

## Scope cut line

Concepts deliberately **absent** from this model. They are not unbuilt features waiting for time - they are ideas we decided this context does not contain, and adding them means changing the model, not just adding code.

**Absent, and staying absent:**
Booking, ticketing, payment, and lodging. Guides, vendors and businesses as actors. Visitor identity, accounts and login - a Visitor is a position, not a person. Visitor-submitted Mentions or Candidates (crowdsourcing). Any structure or scene that was generated rather than recorded. Historical map georeferencing - a Spatial Clue is textual here, never cartographic. Cities other than Delhi.

**Absent for now, model already shaped for it:**
Languages beyond English - Narration is already keyed by language. Volumes beyond the first - a Candidate already belongs to a Page of a Volume, so a second Volume adds evidence rather than structure. Heritage Sites beyond the three deep and eight shallow - depth is data, not schema.

**Terms that will be proposed and should be refused:**
"Recommendation" (we select by Interest Tag and time, we do not model taste), "rating" and "review" in the visitor sense (Reviewer means one thing here), "trip" (see Walk), "listing" (see Heritage Site).
