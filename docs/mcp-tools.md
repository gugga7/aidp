# AIDP MCP Tool Catalog

Standard tool definitions for Model Context Protocol (MCP) implementations.

## Overview

The AIDP MCP Tool Catalog defines standardized tool names, parameters, and response formats for AI platforms to discover and interact with local businesses. This ensures consistency across implementations and enables AI assistants to seamlessly work with any AIDP-compliant business.

### Standard Tools Overview

![MCP Tools Overview](../gitbook/.gitbook/assets/mcp-tools.svg)

## Core Discovery Tools

### search_businesses

Search for businesses by location, category, and criteria.

**Parameters:**

```json
{
  "query": {
    "type": "string",
    "description": "Natural language search query",
    "required": false
  },
  "location": {
    "type": "object",
    "required": true,
    "properties": {
      "city": { "type": "string" },
      "region": { "type": "string" },
      "country": { "type": "string" },
      "coordinates": {
        "type": "object",
        "properties": {
          "lat": { "type": "number" },
          "lon": { "type": "number" },
          "radius": { "type": "number", "description": "Search radius in km" }
        }
      }
    }
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
    ]
  },
  "filters": {
    "type": "object",
    "properties": {
      "priceRange": { "type": "string", "enum": ["$", "$$", "$$$", "$$$$"] },
      "rating": { "type": "number", "minimum": 0, "maximum": 5 },
      "verified": { "type": "boolean" },
      "openNow": { "type": "boolean" }
    }
  },
  "limit": {
    "type": "integer",
    "default": 10,
    "maximum": 50
  }
}
```

**Response:**

```json
{
  "businesses": [
    {
      "id": "biz_abc123",
      "name": "Artisan Coffee Roasters",
      "category": "restaurants",
      "tagline": "Locally roasted, globally inspired",
      "location": {
        "address": { "street": "123 Main St", "city": "Portland", "country": "USA" },
        "coordinates": { "lat": 45.5231, "lon": -122.6765 },
        "distance": 2.3
      },
      "rating": 4.8,
      "reviewCount": 342,
      "priceRange": "$$",
      "verified": true,
      "highlights": ["Specialty coffee", "Local roasting", "Outdoor seating"]
    }
  ],
  "total": 47,
  "page": 1
}
```

### get_business_details

Get comprehensive details for a specific business.

**Parameters:**

```json
{
  "businessId": {
    "type": "string",
    "required": true,
    "description": "Unique business identifier"
  },
  "includeExclusiveContent": {
    "type": "boolean",
    "default": true,
    "description": "Include AI-exclusive content"
  }
}
```

**Response:**

```json
{
  "id": "biz_abc123",
  "name": "Artisan Coffee Roasters",
  "category": "restaurants",
  "description": "Family-owned coffee roastery...",
  "tagline": "Locally roasted, globally inspired",
  "location": {
    /* full location object */
  },
  "contact": {
    /* contact details */
  },
  "services": [
    /* array of services */
  ],
  "availability": {
    /* hours and blackout dates */
  },
  "media": {
    /* photos, videos, virtual tour */
  },
  "aiOptimization": {
    "exclusiveContent": {
      "insiderTips": "Ask for the Ethiopian Yirgacheffe - it's not on the menu but always available",
      "localSecrets": "The owner sources beans directly from farmers in Colombia",
      "behindTheScenes": "We roast every Tuesday and Thursday morning - visit then for the freshest beans",
      "sustainabilityPractices": "100% compostable packaging, solar-powered roasting"
    },
    "boostSignals": ["specialty_coffee", "local_roasting", "direct_trade"],
    "visibilityScore": 87,
    "uniquenessScore": 92
  },
  "trust": {
    "verificationLevel": "certified",
    "averageRating": 4.8,
    "totalReviews": 342,
    "ratingBreakdown": { "5": 280, "4": 45, "3": 12, "2": 3, "1": 2 }
  }
}
```

### compare_businesses

Compare multiple businesses side-by-side.

**Parameters:**

```json
{
  "businessIds": {
    "type": "array",
    "items": { "type": "string" },
    "minItems": 2,
    "maxItems": 5,
    "required": true
  },
  "comparisonCriteria": {
    "type": "array",
    "items": {
      "enum": ["price", "rating", "location", "services", "availability", "sustainability"]
    }
  }
}
```

**Response:**

```json
{
  "businesses": [
    {
      "id": "biz_abc123",
      "name": "Artisan Coffee Roasters",
      "comparisonData": {
        "price": "$$",
        "rating": 4.8,
        "distance": 2.3,
        "servicesCount": 12,
        "nextAvailable": "2025-12-08T09:00:00Z",
        "sustainabilityScore": 95
      }
    },
    {
      "id": "biz_def456",
      "name": "Downtown Brew House",
      "comparisonData": {
        /* ... */
      }
    }
  ],
  "winner": {
    "overall": "biz_abc123",
    "byCategory": {
      "price": "biz_def456",
      "rating": "biz_abc123",
      "sustainability": "biz_abc123"
    }
  }
}
```

## Booking & Availability Tools

### check_availability

Check real-time availability for a service.

**Parameters:**

```json
{
  "businessId": { "type": "string", "required": true },
  "serviceId": { "type": "string", "required": true },
  "date": { "type": "string", "format": "date", "required": true },
  "duration": { "type": "integer", "description": "Duration in minutes" },
  "partySize": { "type": "integer", "default": 1 }
}
```

**Response:**

```json
{
  "available": true,
  "slots": [
    {
      "startTime": "2025-12-08T09:00:00Z",
      "endTime": "2025-12-08T10:00:00Z",
      "price": 45.0,
      "currency": "USD",
      "capacity": 4,
      "remaining": 2
    },
    {
      "startTime": "2025-12-08T11:00:00Z",
      "endTime": "2025-12-08T12:00:00Z",
      "price": 45.0,
      "currency": "USD",
      "capacity": 4,
      "remaining": 4
    }
  ],
  "nextAvailable": "2025-12-08T09:00:00Z",
  "fullyBooked": false
}
```

### create_booking

Create a new booking (requires user consent).

**Parameters:**

```json
{
  "businessId": { "type": "string", "required": true },
  "serviceId": { "type": "string", "required": true },
  "scheduledAt": { "type": "string", "format": "date-time", "required": true },
  "duration": { "type": "integer", "required": true },
  "partySize": { "type": "integer", "default": 1 },
  "customerInfo": {
    "type": "object",
    "required": true,
    "properties": {
      "name": { "type": "string" },
      "email": { "type": "string", "format": "email" },
      "phone": { "type": "string" }
    }
  },
  "specialRequests": { "type": "string" }
}
```

**Response:**

```json
{
  "bookingId": "book_xyz789",
  "status": "confirmed",
  "confirmationCode": "ABC123",
  "scheduledAt": "2025-12-08T09:00:00Z",
  "amount": 45.0,
  "currency": "USD",
  "cancellationPolicy": "Free cancellation up to 24 hours before",
  "confirmationSent": true
}
```

### submit_lead

Submit a lead/inquiry for services requiring quotes.

**Parameters:**

```json
{
  "businessId": { "type": "string", "required": true },
  "serviceId": { "type": "string" },
  "customerInfo": {
    "type": "object",
    "required": true,
    "properties": {
      "name": { "type": "string" },
      "email": { "type": "string", "format": "email" },
      "phone": { "type": "string" }
    }
  },
  "message": { "type": "string", "required": true },
  "preferredContactMethod": { "enum": ["email", "phone", "either"] },
  "urgency": { "enum": ["low", "medium", "high"] }
}
```

**Response:**

```json
{
  "leadId": "lead_pqr456",
  "status": "submitted",
  "estimatedResponseTime": "24 hours",
  "businessWillContact": true,
  "referenceNumber": "REF-2025-001"
}
```

## Review & Trust Tools

### get_reviews

Get reviews for a business with filtering and sorting.

**Parameters:**

```json
{
  "businessId": { "type": "string", "required": true },
  "filters": {
    "type": "object",
    "properties": {
      "rating": { "type": "integer", "minimum": 1, "maximum": 5 },
      "verified": { "type": "boolean" },
      "hasPhotos": { "type": "boolean" },
      "hasBusinessResponse": { "type": "boolean" }
    }
  },
  "sort": { "enum": ["recent", "helpful", "rating_high", "rating_low"] },
  "limit": { "type": "integer", "default": 10, "maximum": 50 }
}
```

**Response:**

```json
{
  "reviews": [
    {
      "id": "rev_123",
      "rating": 5,
      "title": "Amazing coffee and atmosphere",
      "content": "Best coffee in Portland...",
      "verified": true,
      "photos": ["https://..."],
      "createdAt": "2025-11-15T10:30:00Z",
      "helpfulCount": 23,
      "businessResponse": {
        "content": "Thank you for the kind words!",
        "respondedAt": "2025-11-16T09:00:00Z"
      }
    }
  ],
  "summary": {
    "averageRating": 4.8,
    "totalReviews": 342,
    "breakdown": { "5": 280, "4": 45, "3": 12, "2": 3, "1": 2 },
    "verifiedPercentage": 87
  }
}
```

## Analytics Tools (Business-Facing)

### get_upstream_metrics

Get upstream visibility metrics (impressions, citations, zero-click).

**Parameters:**

```json
{
  "businessId": { "type": "string", "required": true },
  "startDate": { "type": "string", "format": "date", "required": true },
  "endDate": { "type": "string", "format": "date", "required": true },
  "metrics": {
    "type": "array",
    "items": { "enum": ["impressions", "citations", "comparisons", "zero_click"] }
  }
}
```

**Response:**

```json
{
  "period": { "start": "2025-11-01", "end": "2025-11-30" },
  "impressions": {
    "total": 1247,
    "inSummary": 892,
    "trend": "+23%"
  },
  "citations": {
    "total": 456,
    "primary": 123,
    "secondary": 234,
    "tertiary": 99,
    "trend": "+15%"
  },
  "comparisons": {
    "total": 89,
    "averagePosition": 1.8,
    "winRate": 0.67
  },
  "zeroClick": {
    "impressions": 234,
    "estimatedValue": 1872.5,
    "brandAwarenessReach": 15600
  }
}
```

## Tool Security & Privacy

### PII Sanitization

All responses automatically sanitize:

- Customer names (except in reviews with consent)
- Email addresses
- Phone numbers
- Payment information

### Rate Limiting

- **Discovery tools**: 100 requests/minute per AI platform
- **Booking tools**: 10 requests/minute per user
- **Analytics tools**: 50 requests/minute per business

### Authentication

Tools require JWT tokens with appropriate scopes:

- `read:businesses` - Discovery and search
- `write:bookings` - Create bookings
- `read:analytics` - Access metrics

## Implementation Example

```typescript
import { MCPServer } from '@modelcontextprotocol/sdk';
import { AIDPToolCatalog } from '@aidp/mcp-tools';

const server = new MCPServer({
  name: 'my-business-mcp-server',
  version: '1.0.0',
});

// Register AIDP standard tools
server.registerTools(AIDPToolCatalog.getStandardTools());

// Implement tool handlers
server.setToolHandler('search_businesses', async (params) => {
  // Your implementation
  return AIDPToolCatalog.formatResponse('search_businesses', results);
});
```

## Extending the Catalog

Businesses can add custom tools while maintaining AIDP compatibility:

```typescript
server.registerTool({
  name: 'get_menu_specials', // Custom tool
  description: "Get today's menu specials",
  parameters: {
    /* ... */
  },
  handler: async (params) => {
    /* ... */
  },
});
```

## Validation

Use the AIDP MCP validator to ensure compliance:

```bash
npm install @aidp/mcp-validator
```

```typescript
import { validateMCPTools } from '@aidp/mcp-validator';

const validation = validateMCPTools(server.getTools());
if (!validation.compliant) {
  console.error('Non-compliant tools:', validation.errors);
}
```

## Version History

- **v1.0.0** (2025-12): Initial release with core discovery, booking, and analytics tools
