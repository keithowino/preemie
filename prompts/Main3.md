While attempting to generate an ideation at `http://localhost:3000/`

Request payload:

```js
{
    "materials": [
        {
            "name": "alphie robot",
            "quantity": 1,
            "unit": "",
            "condition": "Not working"
        }
    ],
    "constraints": {
        "goal": "Surprise me.",
        "environment": "Balcony or small outdoor area",
        "skillLevel": "BEGINNER"
    }
}
```

```js
{
    "success": false,
    "error": {
        "code": "VALIDATION_ERROR",
        "message": "Validation failed.",
        "details": [
            {
                "origin": "string",
                "code": "too_small",
                "minimum": 1,
                "inclusive": true,
                "path": [
                    "materials",
                    0,
                    "unit"
                ],
                "message": "Too small: expected string to have >=1 characters"
            }
        ]
    }
}
```
