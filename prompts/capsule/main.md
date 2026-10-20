The important distinction is that each stage has a different job. The input experience should make describing materials effortless; the results experience should make the ideas easy to compare; and the development experience should make a selected idea actionable.

We should make those three stages excellent before adding accounts, a community, an invention museum, or other secondary features.

## UX and required pages

My recommendation is a small, focused application with three primary screens and one optional supporting page. We should not build a separate page for every feature we might eventually want.

1. Home — /

_Essential_

The entry point and primary conversion screen.

- A clear headline explaining what Preemie does.
- A large materials input area, not merely a single-line text box.
- Example materials users can click to populate the input.
- Optional project constraints such as available tools or skill level, kept secondary.
- One prominent Generate ideas action.

2. Ideas — /ideas/:generationId

_Essential_

The decision-making screen.

- Show the materials submitted.
- Present exactly three differentiated concepts.
- Make the differences between concepts immediately apparent.
- Show feasibility, estimated complexity, required materials, and key caveats.
- Let users open one concept for further development.
- Provide loading, error, retry, and empty states.

3. Project workspace — /ideas/:generationId/:ideaId

_Essential_

The implementation screen.

- Concept overview and design rationale.
- Bill of materials, distinguishing available items from additional requirements.
- Ordered assembly instructions.
- Scientific principles and design trade-offs.
- Safety precautions and validation tests.
- A way to return to the other two concepts.

4. My projects — /projects

_Optional for first release_

A future home for saved and previously generated ideas. Add it to the MVP only if persistence is already straightforward and does not delay the main workflow.

---

## Navigation

Keep the navigation deliberately restrained:

- Preemie — return home.
- My projects — only when persistence is implemented.
- New exploration — start over.

I would not put Lab, Museum, Community, Workspace, and several other destinations in the header at this stage. Those imply distinct product capabilities that we have not yet established.

---

**The workspace must be real**

A polished screen showing a title, materials, and a list of steps is not sufficient by itself. The user needs to understand whether the design is actually feasible.

For example, if someone submits a DC motor, a toy propeller, a battery, and wires, Preemie should distinguish:

- Components already available.
- Additional parts that must be sourced.
- Assumptions about voltage, current, motor specifications, and mechanical compatibility.
- Assembly steps that require verification.
- Hazards such as exposed conductors, moving blades, or short circuits.

The application should present AI-generated concepts as engineering proposals, not certified designs or verified inventions. A novelty score alone cannot establish that an invention is undiscovered or patentable.

---

## Visual identity: typography, colour, and styling

I recommend an industrial editorial design direction: part engineering notebook, part modern product-design studio. It should feel intelligent, precise, practical, and creative rather than like a generic AI dashboard.

The proposed illustrative starting palette:

```text
Palette

Sage:           #DDE5D8
Signal orange:  #D96C3F
Graphite:       #202522
Warm canvas:    #F5F3ED

Typography

Interface and body typeface:    Inter
Display typeface:               Manrope
```

---

The generated concept schema should require, at minimum:

- A stable ID and one of the three allowed categories.
- A title, summary, and design rationale.
- Required materials, with available and additional items distinguished.
- Feasibility and complexity assessments with clear meanings.
- Ordered build steps.
- Assumptions, safety warnings, and validation tests.

---

Preemie MVP scope

- Materials submission: Text input, validation, optional constraints, example prompts.
- Three AI-generated concepts: Repurpose, Improve, and Invent with a defined response schema.
- Concept comparison: Rationale, feasibility, complexity, required parts, and limitations.
- Detailed build plan: Materials, ordered instructions, scientific principles, safety, and testing.
- Backend AI integration: Server-side API key, request validation, error handling, and basic rate limiting.
- Responsive interface: Loading, error, empty, success, and mobile layouts.

Deferred

- Persistence and accounts
- Generated concept imagery
- PDF export, community, and public gallery

```

```
