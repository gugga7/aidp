# 🤖 AIDP Protocol

**The open protocol for AI-accessible local business data**

[![npm version](https://badge.fury.io/js/aidp-protocol.svg)](https://www.npmjs.com/package/aidp-protocol)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)

---

## What is AIDP?

**AIDP (AI Discovery Protocol)** is an open standard that defines how local business data should be structured for AI platforms. Like HTTP for web traffic, AIDP standardizes the data exchange between local businesses and AI assistants.

### Why AIDP Matters

Traditional business data formats (Google Business Profile, Yelp API) were designed for web search. AIDP is purpose-built for **AI-native discovery**:

| Feature | Traditional Formats | AIDP Protocol |
|---------|---------------------|---------------|
| **Designed for** | Web crawlers | AI assistants |
| **Data structure** | HTML/JSON fragments | AI-optimized schema |
| **Availability** | Static | Real-time |
| **Analytics** | Clicks only | Upstream visibility |
| **Control** | Platform-owned | Business-owned |

---

## Installation

```bash
npm install aidp-protocol
```

---

## Quick Start

```typescript
import { validateBusinessProfile, BusinessProfile } from 'aidp-protocol';

const business: BusinessProfile = {
  id: 'biz_123',
  name: 'Acme Coffee Roasters',
  category: 'Coffee Shop',
  description: 'Artisan coffee roasters since 2010',
  location: {
    address: '123 Main St',
    city: 'Portland',
    state: 'OR',
    postalCode: '97201',
    country: 'US',
    coordinates: { latitude: 45.5231, longitude: -122.6765 }
  },
  contact: {
    phone: '+1-503-555-0123',
    email: 'hello@acmecoffee.com',
    website: 'https://acmecoffee.com'
  },
  hours: {
    monday: { open: '07:00', close: '18:00' },
    tuesday: { open: '07:00', close: '18:00' },
    // ...
  }
};

// Validate the profile
const result = validateBusinessProfile(business);

if (result.valid) {
  console.log('✅ Profile is valid and AI-ready!');
} else {
  console.log('❌ Validation errors:', result.errors);
}
```

---

## Core Features

### 🎯 AI-Optimized Schema
Structured data designed for LLM comprehension, not just web crawlers.

### 📊 Upstream Analytics
Track visibility metrics that happen *before* traditional analytics (impressions, citations).

### 🔌 Protocol-Agnostic
Works with MCP (Model Context Protocol), ChatGPT Plugins, REST APIs, and more.

### 🏢 Business-Controlled
Businesses own and control their data — no platform lock-in.

### 🌐 Open Standard
MIT licensed, community-governed, transparent development.

---

## Use Cases

- **Local Businesses**: Make your business discoverable by AI assistants
- **Developers**: Build AI-powered local search applications
- **Platforms**: Implement AIDP to serve AI-native business data
- **AI Assistants**: Query standardized business data via MCP

---

## Documentation

| Document | Description |
|----------|-------------|
| [Core Schema](./docs/core-schema.md) | Data model specification |
| [MCP Tools](./docs/mcp-tools.md) | Model Context Protocol integration |
| [Validation](./docs/validation/) | TypeScript validation utilities |
| [Migration Guides](./docs/migrations/) | Migrate from Google Business, Yelp |
| [Governance](./docs/GOVERNANCE.md) | Project governance model |

---

## Contributing

We welcome contributions! Please see our [Contributing Guide](./CONTRIBUTING.md) and [Code of Conduct](./CODE_OF_CONDUCT.md).

### Ways to Contribute

- 🐛 Report bugs via [GitHub Issues](https://github.com/gugga7/aidp/issues)
- 💡 Suggest features via [Feature Requests](https://github.com/gugga7/aidp/issues/new?template=feature_request.md)
- 📝 Improve documentation
- �� Submit pull requests

---

## License

MIT License — see [LICENSE](./LICENSE) for details.

---

## Links

- 📦 [NPM Package](https://www.npmjs.com/package/aidp-protocol)
- 📚 [Documentation](https://aidp.dev)
- 🐛 [Issue Tracker](https://github.com/gugga7/aidp/issues)
- 💬 [Discussions](https://github.com/gugga7/aidp/discussions)

---

<p align="center">
  <strong>Built for the AI-native era</strong><br>
  <sub>Making local business data accessible to AI assistants everywhere</sub>
</p>
