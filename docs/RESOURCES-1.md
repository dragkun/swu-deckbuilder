# Card Data Schema

This document describes the schema for the `resources-1.res` file used in the Star Wars: Unlimited deck builder. The file contains 5 main sections: leaders, bases, events, upgrades, and units.

## File Structure

```json
{
  "leaders": [...],
  "bases": [...],
  "events": [...],
  "upgrades": [...],
  "units": [...],
}
```

## Common Card Properties

All cards share these base properties:

| Property | Type | Description |
|----------|------|-------------|
| id | number | Unique identifier for the card |
| cardNumber | number | Card number within the set |
| title | string | Name of the card |
| subtitle | string | Subtitle or flavor text (can be null or empty) |
| cardId | string\|null | Alternative card identifier |
| cardUid | string | Unique identifier string |
| image | object | Contains paths to card images |
| rarity | object | Card rarity information |
| expansion | array | Set/expansion information |
| cost | number | Resource cost to play the card |
| hp | number | Health points |
| power | number | Attack power |
| unique | boolean | Whether the card is unique |
| text | string | Card effect text |
| aspects | array | List of aspects (e.g., "Cunning", "Villainy") |
| aspectDuplicates | array | Additional aspects if any |
| type | string | "Leader", "Base", "Event", "Upgrade", or "Unit" |
| traits | array | Character traits (e.g., "Force", "Jedi") |
| keywords | array | Special keywords on the card |
| arenas | array | Valid arenas for play (e.g., "Ground") |

### Card Example

```json
{
  "id": 1,
  "cardNumber": 16,
  "title": "Jango Fett",
  "subtitle": "Concealing the Conspiracy",
  "cardId": null,
  "cardUid": "9faf7486-d3fa-42b6-a48c-5301cfec4f70",
  "cost": 5,
  "hp": 7,
  "power": 3,
  "unique": true,
  "text": "When a friendly unit deals damage to an enemy unit: You may exhaust this leader. If you do, exhaust that enemy unit.",
  "image": {
    "front": "Jango_Fett_Leader.png",
    "back": "Jango_Fett_Leader_Unit.png"
  },
  "aspects": ["Cunning", "Villainy"],
  "aspectDuplicates": [],
  "type": "Leader",
  "traits": ["Underworld", "Bounty Hunter"],
  "keywords": [],
  "arenas": ["Ground"],
  "rarity": {
    "id": 2,
    "name": "Common"
  },
  "expansion": [{
    "id": 3,
    "name": "Twilight of the Republic",
    "code": "TWI"
  }]
}
```

## Base Cards

Bases represent locations that provide strategic advantages.

### Base-Specific Properties

| Property | Type | Description |
|----------|------|-------------|
| hp | number | Base health points |
| text | string | Base effect text |
| aspects | array | List of aspects |
| type | string | Always "Base" |
| traits | array | Location traits |
| keywords | array | Special keywords |

## Event Cards

Events are action cards that provide various effects.

### Event-Specific Properties

| Property | Type | Description |
|----------|------|-------------|
| cost | number | Resource cost to play the event |
| text | string | Event effect text |
| aspects | array | List of aspects |
| type | string | Always "Event" |
| keywords | array | Special keywords |

## Image Object

The image object structure:

```json
{
  "front": "string", // Path to front image
  "back": "string"   // Path to back image (if applicable)
}
```

## Rarity Object

```json
{
  "id": number,
  "name": string    // e.g., "Common", "Rare"
}
```

## Expansion Object

```json
{
  "id": number,
  "name": string,   // e.g., "Twilight of the Republic"
  "code": string    // Set code, e.g., "TWI"
}
```

## Variants

Cards may have multiple variants with different art or treatments:

```json
{
  "variants": [
    {
      "id": number,
      "cardNumber": number,
      "cardCount": number,
      "type": string,      // e.g., "Standard", "Hyperspace", "Showcase"
      "image": {
        "front": string,
        "back": string
      }
    }
  ]
}
```
