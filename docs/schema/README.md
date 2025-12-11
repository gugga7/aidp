# AIDP Schema 2025

**AI Discovery Exchange Schema - The Open Standard for AI-Accessible Local Business Data**

## Overview

AIDP Schema is an open, protocol-agnostic standard for representing local business data optimized for AI platforms. It enables AI assistants (Claude, ChatGPT, Perplexity, etc.) to discover, understand, and interact with local businesses on behalf of consumers.

## Why AIDP?

Traditional business data formats (Google Business Profile, Yelp API, schema.org) were designed for web search and human browsing. AIDP is purpose-built for the AI-native era where:

- **Consumers discover through conversation**, not search queries
- **AI agents make recommendations**, not search engines
- **Intent progresses through dialogue**, not click-through
- **Trust signals matter more** than SEO optimization

## Design Principles

1. **Protocol-Agnostic**: Works with MCP, ChatGPT Plugins, custom APIs
2. **AI-Optimized**: Structured for LLM understanding and reasoning
3. **Privacy-First**: Built-in PII sanitization and consent management
4. **Business-Controlled**: Operators own and control their data
5. **Trust-Enabled**: Verification, reviews, and fraud detection built-in
6. **Analytics-Rich**: Captures upstream metrics invisible to traditional platforms

## Schema Components

### Core Entities
- **Business Profile**: Identity, services, media, exclusive content
- **Availability**: Real-time booking slots, capacity, pricing
- **Reviews & Trust**: Ratings, responses, verification status
- **Analytics Events**: Impressions, citations, intent progression

### Protocol Definitions
- **MCP Tools**: Standardized tool catalog for Model Context Protocol
- **REST API**: OpenAPI specification for HTTP integrations
- **Webhooks**: Event-driven notifications
- **Data Export**: Portable data formats

### Trust & Safety
- **Verification Schema**: Identity verification, business legitimacy
- **Fraud Detection**: Risk scoring, anomaly detection
- **Content Moderation**: Automated and human review workflows

### Analytics & Intelligence
- **Upstream Metrics**: Pre-click visibility, zero-click exposure
- **Attribution**: Multi-touch journey tracking
- **Intent Progression**: Awareness → Consideration → Conversion
- **Competitive Benchmarking**: Category-level insights

## Quick Start

```typescript
import { AIDPSchema, validateProfile } from '@aidp/schema';

const businessProfile: AIDPSchema.BusinessProfile = {
  id: "biz_123",
  name: "Artisan Coffee Roasters",
  category: "coffee_shop",
  location: {
    address: "123 Main St",
    city: "Portland",
    coordinates: { lat: 45.5231, lng: -122.6765 }
  },
  aiOptimization: {
    boostSignals: ["specialty_coffee", "local_roasting"],
    exclusiveContent: "We roast single-origin beans daily..."
  }
};

const validation = validateProfile(businessProfile);
```

## Adoption

AIDP Schema is used by:
- **AIDP Platform**: Reference implementation (this repository)
- AI platforms, tourism boards, and local business tools (coming soon)

## Governance

AIDP Schema is maintained as an open standard with community input. See [GOVERNANCE.md](./GOVERNANCE.md) for contribution guidelines.

## Documentation

- [Core Schema Specification](./core-schema.md)
- [MCP Tool Catalog](./mcp-tools.md)
- [Migration Guides](./migrations/)
- [Integration Examples](./examples/)
- [Validation Libraries](./validation/)

## License

AIDP Schema is released under MIT License. See [LICENSE](./LICENSE) for details.

---

**Version**: 1.0.0  
**Status**: Draft  
**Last Updated**: December 2025
