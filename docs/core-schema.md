# AIDP Core Schema Specification v1.0

## Business Profile Schema

The Business Profile is the foundational entity in AIDP Protocol, representing a local business optimized for AI discovery.

### Schema Structure Overview

![AIDP Protocol Structure](../gitbook/.gitbook/assets/schema-structure.svg)

### JSON Schema Definition

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "$id": "https://aidp.dev/schemas/business-profile/v1",
  "title": "AIDP Business Profile",
  "type": "object",
  "required": ["id", "name", "category", "description", "location", "contact", "services"],
  "properties": {
    "id": {
      "type": "string",
      "description": "Unique identifier for the business",
      "pattern": "^biz_[a-zA-Z0-9]{16,}$"
    },
    "name": {
      "type": "string",
      "maxLength": 255,
      "description": "Business name"
    },
    "category": {
      "type": "string",
      "enum": [
        "tourism",
        "hospitality",
        "restaurants",
        "retail",
        "healthcare",
        "home_services",
        "professional_services",
        "wellness"
      ],
      "description": "Primary business category"
    },
    "description": {
      "type": "string",
      "description": "Detailed business description optimized for AI understanding"
    },
    "tagline": {
      "type": "string",
      "maxLength": 255,
      "description": "Short, memorable tagline"
    },
    "location": {
      "type": "object",
      "required": ["address", "coordinates"],
      "properties": {
        "address": {
          "type": "object",
          "required": ["street", "city", "country"],
          "properties": {
            "street": { "type": "string" },
            "city": { "type": "string" },
            "state": { "type": "string" },
            "country": { "type": "string" },
            "postalCode": { "type": "string" }
          }
        },
        "coordinates": {
          "type": "object",
          "required": ["lat", "lon"],
          "properties": {
            "lat": { "type": "number", "minimum": -90, "maximum": 90 },
            "lon": { "type": "number", "minimum": -180, "maximum": 180 }
          }
        },
        "serviceArea": {
          "type": "object",
          "properties": {
            "type": { "enum": ["radius", "regions"] },
            "radius": { "type": "number", "description": "Service radius in kilometers" },
            "regions": { "type": "array", "items": { "type": "string" } }
          }
        }
      }
    },
    "contact": {
      "type": "object",
      "required": ["phone", "email"],
      "properties": {
        "phone": { "type": "string" },
        "email": { "type": "string", "format": "email" },
        "website": { "type": "string", "format": "uri" },
        "socialMedia": {
          "type": "object",
          "properties": {
            "facebook": { "type": "string" },
            "instagram": { "type": "string" },
            "twitter": { "type": "string" },
            "linkedin": { "type": "string" }
          }
        }
      }
    },
    "services": {
      "type": "array",
      "minItems": 1,
      "items": {
        "type": "object",
        "required": ["id", "name", "description", "pricing"],
        "properties": {
          "id": { "type": "string" },
          "name": { "type": "string" },
          "description": { "type": "string" },
          "category": { "type": "string" },
          "pricing": {
            "type": "object",
            "required": ["type", "currency"],
            "properties": {
              "type": { "enum": ["fixed", "hourly", "range", "quote"] },
              "amount": { "type": "number" },
              "minAmount": { "type": "number" },
              "maxAmount": { "type": "number" },
              "currency": { "type": "string", "pattern": "^[A-Z]{3}$" }
            }
          },
          "duration": { "type": "integer", "description": "Duration in minutes" },
          "bookable": { "type": "boolean" },
          "requiresQuote": { "type": "boolean" }
        }
      }
    },
    "availability": {
      "type": "object",
      "properties": {
        "hours": {
          "type": "object",
          "patternProperties": {
            "^(monday|tuesday|wednesday|thursday|friday|saturday|sunday)$": {
              "type": "object",
              "properties": {
                "open": { "type": "string", "pattern": "^([01]?[0-9]|2[0-3]):[0-5][0-9]$" },
                "close": { "type": "string", "pattern": "^([01]?[0-9]|2[0-3]):[0-5][0-9]$" },
                "closed": { "type": "boolean" }
              }
            }
          }
        },
        "blackoutDates": {
          "type": "array",
          "items": { "type": "string", "format": "date" }
        }
      }
    },
    "media": {
      "type": "object",
      "properties": {
        "logo": { "type": "string", "format": "uri" },
        "photos": { "type": "array", "items": { "type": "string", "format": "uri" } },
        "videos": { "type": "array", "items": { "type": "string", "format": "uri" } },
        "virtualTour": { "type": "string", "format": "uri" }
      }
    },
    "aiOptimization": {
      "type": "object",
      "description": "AI-specific optimization data",
      "properties": {
        "exclusiveContent": {
          "type": "object",
          "description": "Content exclusive to AI platforms",
          "properties": {
            "insiderTips": { "type": "string" },
            "localSecrets": { "type": "string" },
            "behindTheScenes": { "type": "string" },
            "culturalNotes": { "type": "string" },
            "sustainabilityPractices": { "type": "string" },
            "exclusiveOffers": { "type": "array", "items": { "type": "string" } },
            "customerTestimonials": {
              "type": "array",
              "items": {
                "type": "object",
                "properties": {
                  "name": { "type": "string" },
                  "text": { "type": "string" },
                  "date": { "type": "string", "format": "date" }
                }
              }
            }
          }
        },
        "boostSignals": {
          "type": "array",
          "items": { "type": "string" },
          "description": "Keywords and signals for AI ranking"
        },
        "visibilityScore": {
          "type": "number",
          "minimum": 0,
          "maximum": 100,
          "description": "AI visibility score (0-100)"
        },
        "uniquenessScore": {
          "type": "number",
          "minimum": 0,
          "maximum": 100,
          "description": "Content uniqueness score (0-100)"
        }
      }
    },
    "trust": {
      "type": "object",
      "properties": {
        "verificationLevel": {
          "enum": ["basic", "certified", "elite"],
          "description": "Business verification level"
        },
        "verificationStatus": {
          "enum": ["pending", "approved", "rejected"]
        },
        "averageRating": {
          "type": "number",
          "minimum": 0,
          "maximum": 5
        },
        "totalReviews": {
          "type": "integer",
          "minimum": 0
        },
        "ratingBreakdown": {
          "type": "object",
          "properties": {
            "1": { "type": "integer" },
            "2": { "type": "integer" },
            "3": { "type": "integer" },
            "4": { "type": "integer" },
            "5": { "type": "integer" }
          }
        },
        "riskScore": {
          "type": "integer",
          "minimum": 0,
          "maximum": 100,
          "description": "Fraud risk score (0=safe, 100=high risk)"
        }
      }
    },
    "subscription": {
      "type": "object",
      "properties": {
        "tier": {
          "enum": ["free", "professional", "enterprise"]
        },
        "features": {
          "type": "array",
          "items": { "type": "string" }
        }
      }
    },
    "metadata": {
      "type": "object",
      "properties": {
        "status": {
          "enum": ["draft", "pending_review", "published", "suspended"]
        },
        "createdAt": { "type": "string", "format": "date-time" },
        "updatedAt": { "type": "string", "format": "date-time" },
        "publishedAt": { "type": "string", "format": "date-time" }
      }
    }
  }
}
```

## Booking Schema

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "$id": "https://aidp.dev/schemas/booking/v1",
  "title": "AIDP Booking",
  "type": "object",
  "required": ["id", "businessId", "serviceId", "scheduledAt", "amount"],
  "properties": {
    "id": { "type": "string", "pattern": "^book_[a-zA-Z0-9]{16,}$" },
    "businessId": { "type": "string" },
    "consumerId": { "type": "string" },
    "serviceId": { "type": "string" },
    "scheduledAt": { "type": "string", "format": "date-time" },
    "duration": { "type": "integer", "description": "Duration in minutes" },
    "timezone": { "type": "string" },
    "amount": { "type": "number", "minimum": 0 },
    "currency": { "type": "string", "pattern": "^[A-Z]{3}$" },
    "status": {
      "enum": ["pending", "confirmed", "completed", "cancelled", "no_show"]
    },
    "paymentStatus": {
      "enum": ["pending", "completed", "refunded", "failed"]
    },
    "cancellation": {
      "type": "object",
      "properties": {
        "reason": { "type": "string" },
        "cancelledBy": { "enum": ["consumer", "business", "system"] },
        "cancelledAt": { "type": "string", "format": "date-time" }
      }
    }
  }
}
```

## Review Schema

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "$id": "https://aidp.dev/schemas/review/v1",
  "title": "AIDP Review",
  "type": "object",
  "required": ["id", "businessId", "rating", "title", "content"],
  "properties": {
    "id": { "type": "string", "pattern": "^rev_[a-zA-Z0-9]{16,}$" },
    "businessId": { "type": "string" },
    "consumerId": { "type": "string" },
    "bookingId": { "type": "string" },
    "rating": { "type": "integer", "minimum": 1, "maximum": 5 },
    "title": { "type": "string", "maxLength": 255 },
    "content": { "type": "string" },
    "photos": { "type": "array", "items": { "type": "string", "format": "uri" } },
    "verified": { "type": "boolean" },
    "moderationStatus": {
      "enum": ["pending", "approved", "rejected", "flagged"]
    },
    "businessResponse": {
      "type": "object",
      "properties": {
        "content": { "type": "string" },
        "respondedAt": { "type": "string", "format": "date-time" }
      }
    },
    "helpfulCount": { "type": "integer", "minimum": 0 },
    "createdAt": { "type": "string", "format": "date-time" }
  }
}
```

## Upstream Metrics Schema

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "$id": "https://aidp.dev/schemas/upstream-metric/v1",
  "title": "AIDP Upstream Metric",
  "description": "Tracks pre-click visibility and AI-native engagement",
  "type": "object",
  "required": ["id", "businessId", "timestamp"],
  "properties": {
    "id": { "type": "string" },
    "businessId": { "type": "string" },
    "impression": {
      "type": "object",
      "properties": {
        "inSummary": { "type": "boolean" },
        "context": { "type": "string", "maxLength": 2000 }
      }
    },
    "citation": {
      "type": "object",
      "properties": {
        "count": { "type": "integer", "minimum": 0 },
        "placement": { "enum": ["primary", "secondary", "tertiary"] },
        "context": { "type": "string", "maxLength": 2000 }
      }
    },
    "comparison": {
      "type": "object",
      "properties": {
        "appeared": { "type": "boolean" },
        "comparedWith": { "type": "array", "items": { "type": "string" } },
        "position": { "type": "integer", "minimum": 1 }
      }
    },
    "zeroClick": {
      "type": "object",
      "properties": {
        "impression": { "type": "boolean" },
        "brandAwarenessValue": { "type": "number", "minimum": 0 }
      }
    },
    "session": {
      "type": "object",
      "properties": {
        "sessionId": { "type": "string" },
        "aiPlatform": { "type": "string" },
        "userQuery": { "type": "string", "maxLength": 1000 }
      }
    },
    "geography": {
      "type": "object",
      "properties": {
        "country": { "type": "string" },
        "region": { "type": "string" },
        "city": { "type": "string" }
      }
    },
    "timestamp": { "type": "string", "format": "date-time" }
  }
}
```

## Intent Journey Schema

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "$id": "https://aidp.dev/schemas/intent-journey/v1",
  "title": "AIDP Intent Journey",
  "description": "Tracks conversational journey from awareness to conversion",
  "type": "object",
  "required": ["id", "businessId", "sessionId", "initialQuery"],
  "properties": {
    "id": { "type": "string" },
    "businessId": { "type": "string" },
    "sessionId": { "type": "string" },
    "initialQuery": { "type": "string", "maxLength": 1000 },
    "refinements": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "query": { "type": "string" },
          "timestamp": { "type": "string", "format": "date-time" },
          "turnNumber": { "type": "integer" }
        }
      }
    },
    "citationMoments": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "timestamp": { "type": "string", "format": "date-time" },
          "context": { "type": "string" },
          "placement": { "enum": ["primary", "secondary", "tertiary"] },
          "turnNumber": { "type": "integer" }
        }
      }
    },
    "metrics": {
      "type": "object",
      "properties": {
        "totalTurns": { "type": "integer" },
        "totalRefinements": { "type": "integer" },
        "journeyLength": { "type": "integer", "description": "Duration in seconds" },
        "intentStrength": { "enum": ["low", "medium", "high"] }
      }
    },
    "conversion": {
      "type": "object",
      "properties": {
        "converted": { "type": "boolean" },
        "timeToConversion": { "type": "integer", "description": "Seconds from first mention" },
        "conversionType": { "enum": ["booking", "lead", "click"] },
        "bookingId": { "type": "string" },
        "leadId": { "type": "string" }
      }
    },
    "touchpoints": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "type": { "enum": ["impression", "citation", "comparison", "click"] },
          "timestamp": { "type": "string", "format": "date-time" },
          "value": { "type": "number", "description": "Attribution weight" },
          "context": { "type": "string" }
        }
      }
    },
    "startedAt": { "type": "string", "format": "date-time" },
    "completedAt": { "type": "string", "format": "date-time" }
  }
}
```

## Key Differences from Traditional Schemas

### 1. AI-Optimized Content

- `aiOptimization.exclusiveContent`: Content designed for AI platforms, not web scraping
- `aiOptimization.boostSignals`: Semantic signals for AI ranking
- `aiOptimization.visibilityScore`: AI-specific visibility metric

### 2. Upstream Metrics

- Tracks impressions, citations, and zero-click visibility
- Captures value before traditional analytics begin
- Based on Microsoft research on AI search behavior

### 3. Intent Journeys

- Multi-turn conversational tracking
- Citation moments and refinements
- Time-to-conversion from first mention

### 4. Trust & Safety

- Built-in verification levels
- Risk scoring for fraud detection
- Moderation status for content

### 5. Protocol-Agnostic

- Works with MCP, REST APIs, webhooks
- Portable across AI platforms
- Business-controlled data

## Validation

Use the official AIDP validation libraries:

```bash
npm install @aidp/schema-validator
```

```typescript
import { validateBusinessProfile } from '@aidp/schema-validator';

const result = validateBusinessProfile(profileData);
if (!result.valid) {
  console.error(result.errors);
}
```

## Versioning

AIDP Protocol follows semantic versioning:

- **Major**: Breaking changes to schema structure
- **Minor**: Backward-compatible additions
- **Patch**: Documentation and clarifications

Current version: **1.0.0**
