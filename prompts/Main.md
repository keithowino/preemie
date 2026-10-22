## Phase 3 — Home page and input experience

We may proceed to build the first complete user-facing screen.

- Create the headline, introduction and primary call to action.
- Implement a repeatable materials editor with name, quantity, unit and condition.
    - You are the one who came up with this structure, do explain to me what unit is.
- Add goal, environment, skill level and notes inputs.
- Provide selectable example material sets.
- Validate the input before submitting it.
- Handle submission state and prevent accidental duplicate requests.
  Deliverable: Users can prepare valid ideation requests through the interface.

Additional information:

```rest
### create and persist an ideation

POST {{baseUrl}}/ideations
Content-Type: application/json
Accept: application/json

{
  "materials": [
    {
      "name": "Plastic bottles",
      "quantity": 5,
      "unit": "pieces",
      "condition": "Clean and intact"
    },
    {
      "name": "Scrap wood",
      "quantity": 4,
      "unit": "pieces",
      "condition": "Dry and usable"
    }
  ],
  "constraints": {
    "goal": "Create useful household items from available materials",
    "environment": "Small home workshop",
    "skillLevel": "BEGINNER",
    "notes": "Prefer simple hand tools and low-cost additional materials."
  }
}
```

Response:

```json
{
	"success": true,
	"message": "Ideation generated successfully.",
	"data": {
		"generationId": "729e1242-1c86-4f41-bd04-f88eb31ac4a4",
		"input": {
			"materials": [
				{
					"name": "Plastic bottles",
					"quantity": 5,
					"unit": "pieces",
					"condition": "Clean and intact"
				},
				{
					"name": "Scrap wood",
					"quantity": 4,
					"unit": "pieces",
					"condition": "Dry and usable"
				}
			],
			"constraints": {
				"goal": "Create useful household items from available materials",
				"environment": "Small home workshop",
				"skillLevel": "BEGINNER",
				"notes": "Prefer simple hand tools and low-cost additional materials."
			}
		},
		"concepts": [
			{
				"id": "34877372-2406-40a5-a51b-728bb4fcf35e",
				"type": "REPURPOSE",
				"title": "Vertical Bottle Garden Planter",
				"summary": "Transforming plastic bottles into a vertical hanging planter system for small herbs.",
				"rationale": "Plastic bottles are durable, lightweight, and moisture-resistant, making them ideal for containing soil and small plants in a vertical space-saving orientation.",
				"feasibility": {
					"level": "HIGH",
					"rationale": "The design uses simple mechanical connections and basic cutting, which is easily achievable with standard hand tools."
				},
				"complexity": "LOW",
				"billOfMaterials": [
					{
						"name": "Plastic bottles",
						"quantity": 5,
						"source": "AVAILABLE",
						"purpose": "Plant containers"
					},
					{
						"name": "Twine or rope",
						"quantity": 2,
						"unit": "meters",
						"source": "ADDITIONAL",
						"purpose": "Suspension system"
					}
				],
				"buildPlan": {
					"tools": ["Scissors", "Utility knife", "Awl or nail"],
					"steps": [
						{
							"order": 1,
							"title": "Bottle Preparation",
							"description": "Cut an oblong opening in the side of each bottle to act as the planter bed."
						},
						{
							"order": 2,
							"title": "Drainage Holes",
							"description": "Poke small holes in the bottom of each bottle to allow water drainage."
						},
						{
							"order": 3,
							"title": "Assembly",
							"description": "Thread twine through the top and bottom of each bottle to link them vertically."
						}
					]
				},
				"scientificPrinciples": [
					"Capillary action",
					"Hydrostatic drainage",
					"Structural tension"
				],
				"limitations": [
					"Load bearing capacity of plastic under weight of wet soil is unverified",
					"UV degradation of plastic over time"
				],
				"assumptions": [
					"The bottles are large enough to support root systems",
					"The twine can hold the weight of wet soil"
				],
				"safetyWarnings": [
					"Use caution when cutting plastic as knives may slip",
					"Ensure secure mounting to avoid falling hazards"
				],
				"tests": [
					"Water drainage test: verify water flows out of bottom holes",
					"Load test: hang empty planter to verify knot stability"
				]
			},
			{
				"id": "0064ea27-dd2f-42f7-86e7-73a38d562714",
				"type": "IMPROVEMENT",
				"title": "Stable Scrap Wood Tool Stand",
				"summary": "Upgrading loose scrap wood into a structured, organized stand for hand tools.",
				"rationale": "Standard scrap wood is often discarded; by creating a tiered stand, we improve workshop organization and tool accessibility.",
				"feasibility": {
					"level": "MEDIUM",
					"rationale": "Requires basic joinery or fastening which is feasible for a beginner with simple tools."
				},
				"complexity": "MEDIUM",
				"billOfMaterials": [
					{
						"name": "Scrap wood",
						"quantity": 4,
						"source": "AVAILABLE",
						"purpose": "Structural frame and base"
					},
					{
						"name": "Wood screws",
						"quantity": 12,
						"source": "ADDITIONAL",
						"purpose": "Fastening pieces together"
					}
				],
				"buildPlan": {
					"tools": [
						"Hand saw",
						"Manual screwdriver",
						"Measuring tape"
					],
					"steps": [
						{
							"order": 1,
							"title": "Measure and Cut",
							"description": "Cut scrap wood into consistent lengths for the base and vertical supports."
						},
						{
							"order": 2,
							"title": "Assembly",
							"description": "Fasten vertical supports to the base using screws to create a stable frame."
						},
						{
							"order": 3,
							"title": "Finishing",
							"description": "Sand rough edges to prevent splinters."
						}
					]
				},
				"scientificPrinciples": [
					"Center of gravity",
					"Static equilibrium",
					"Friction"
				],
				"limitations": [
					"Depends on the quality and dimensions of available scrap wood",
					"Structural integrity is limited by fastener type"
				],
				"assumptions": [
					"The scrap wood is not significantly rotted or compromised",
					"The user has access to basic measuring tools"
				],
				"safetyWarnings": [
					"Wear eye protection when sawing",
					"Ensure screws are fully tightened to prevent wobbling"
				],
				"tests": [
					"Wobble test: ensure base sits flat on a level surface",
					"Load test: place tools on stand to verify stability"
				]
			},
			{
				"id": "edc2474c-6e04-4296-89d0-8a2c636cb62a",
				"type": "NOVEL_INVENTION",
				"title": "Bottle-Wood Desk Organizer",
				"summary": "A hybrid desk organizer using wood as a base and cut bottle sections as modular compartments.",
				"rationale": "Combining the structural rigidity of wood with the modular, customizable shapes of cut plastic creates a bespoke organization system.",
				"feasibility": {
					"level": "MEDIUM",
					"rationale": "Requires bonding plastic to wood, which may require specific adhesives not listed as standard beginner materials."
				},
				"complexity": "MEDIUM",
				"billOfMaterials": [
					{
						"name": "Plastic bottles",
						"quantity": 3,
						"source": "AVAILABLE",
						"purpose": "Compartment walls"
					},
					{
						"name": "Scrap wood",
						"quantity": 1,
						"source": "AVAILABLE",
						"purpose": "Base plate"
					},
					{
						"name": "Strong adhesive or glue",
						"quantity": 1,
						"source": "ADDITIONAL",
						"purpose": "Bonding plastic to wood"
					}
				],
				"buildPlan": {
					"tools": ["Utility knife", "Sandpaper", "Clamps"],
					"steps": [
						{
							"order": 1,
							"title": "Bottle Truncation",
							"description": "Cut the bottom 10cm off each plastic bottle to create uniform cups."
						},
						{
							"order": 2,
							"title": "Base Prep",
							"description": "Sand the wood surface to ensure better adhesion."
						},
						{
							"order": 3,
							"title": "Bonding",
							"description": "Apply adhesive to the bottom of the plastic cups and secure to the wood base."
						}
					]
				},
				"scientificPrinciples": [
					"Adhesion",
					"Surface tension",
					"Moment of inertia"
				],
				"limitations": [
					"Adhesive compatibility between plastic and wood is unverified",
					"Long-term durability of the plastic-to-wood bond is unknown"
				],
				"assumptions": [
					"The adhesive used is suitable for both plastic and wood surfaces",
					"The wood base is flat enough for stable mounting"
				],
				"safetyWarnings": [
					"Work in a well-ventilated area when using adhesives",
					"Ensure plastic edges are smooth or taped to avoid cuts"
				],
				"tests": [
					"Bond strength test: gently pull on cups after curing",
					"Stability test: ensure organizer does not tip when filled with pens"
				]
			}
		],
		"_id": "6ada5e515471b5a44ef358a5",
		"createdAt": "2026-10-22T19:04:49.070Z",
		"updatedAt": "2026-10-22T19:04:49.070Z"
	}
}
```
