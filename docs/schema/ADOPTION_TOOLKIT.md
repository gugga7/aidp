# AIDP Schema Adoption Toolkit

## Quick Start for Different Audiences

### For AI Platform Developers

**Goal**: Integrate AIDP Schema to discover and interact with local businesses

**Steps**:
1. Install AIDP SDK: `npm install @aidp/sdk`
2. Implement MCP client or REST API client
3. Use standard tool catalog for discovery
4. Handle booking/lead flows with user consent
5. Track upstream metrics for business value

**Example Integration**:
```typescript
import { AIDPClient } from '@aidp/sdk';

const client = new AIDPClient({
  apiKey: process.env.AIDP_API_KEY,
  protocol: 'mcp' // or 'rest'
});

// Search for businesses
const results = await client.searchBusinesses({
  query: 'coffee shops with outdoor seating',
  location: { city: 'Portland', country: 'USA' },
  filters: { verified: true, openNow: true }
});

// Get detailed profile with AI-exclusive content
const business = await client.getBusinessDetails(results.businesses[0].id, {
  includeExclusiveContent: true
});

// Check availability
const slots = await client.checkAvailability({
  businessId: business.id,
  serviceId: business.services[0].id,
  date: '2025-12-08'
});
```

### For Local Businesses

**Goal**: Get discovered by AI assistants and manage your AI presence

**Steps**:
1. Create AIDP profile (via AIDP Platform or compatible service)
2. Add AI-exclusive content (insider tips, local secrets)
3. Structure services with pricing
4. Set up booking system (optional)
5. Monitor upstream metrics

**Benefits**:
- Appear in Claude, ChatGPT, Perplexity results
- Track impressions and citations before clicks
- Understand AI-driven customer journeys
- Differentiate with exclusive content
- Direct bookings without third-party fees

### For SaaS Developers

**Goal**: Make your business management platform AIDP-compatible

**Steps**:
1. Export customer data in AIDP format
2. Implement AIDP API endpoints
3. Provide MCP server for each business
4. Sync data bidirectionally
5. Add upstream analytics dashboard

**Example**: POS system, booking software, CRM

### For Tourism Boards & Chambers of Commerce

**Goal**: Make your region's businesses discoverable by AI

**Steps**:
1. Create AIDP directory for your region
2. Migrate existing business data
3. Provide onboarding for local businesses
4. Aggregate analytics across region
5. Promote AI discoverability

**Example**: "Visit Portland" tourism board

## Integration Patterns

### Pattern 1: Direct Integration (AI Platforms)

```
AI Assistant → AIDP MCP Server → Business Data
```

**Use Case**: Claude, ChatGPT integrating AIDP businesses

**Implementation**:
```typescript
// MCP Client
import { MCPClient } from '@modelcontextprotocol/sdk';

const mcp = new MCPClient({
  serverUrl: 'https://api.aidp.dev/mcp',
  authentication: { apiKey: process.env.AIDP_API_KEY }
});

// Discover available tools
const tools = await mcp.listTools();

// Execute search
const result = await mcp.executeTool('search_businesses', {
  location: { city: 'Portland', country: 'USA' },
  category: 'restaurants'
});
```

### Pattern 2: Aggregator (Business Directories)

```
AI Assistant → Directory MCP → Multiple AIDP Businesses
```

**Use Case**: Regional directory aggregating local businesses

**Implementation**:
```typescript
// Directory aggregates multiple businesses
class RegionalDirectory {
  async searchBusinesses(params) {
    // Query local database of AIDP-compliant businesses
    const businesses = await db.query(`
      SELECT * FROM businesses 
      WHERE city = $1 AND category = $2
    `, [params.location.city, params.category]);
    
    // Return in AIDP format
    return businesses.map(b => this.toAIDPFormat(b));
  }
}
```

### Pattern 3: Proxy/Adapter (Legacy Systems)

```
AI Assistant → AIDP Adapter → Legacy API → Business Data
```

**Use Case**: Wrapping existing APIs (Yelp, Google) in AIDP format

**Implementation**:
```typescript
// Adapter translates between AIDP and legacy format
class YelpToAIDPAdapter {
  async getBusinessDetails(aidpId: string) {
    const yelpId = this.mapAIDPToYelp(aidpId);
    const yelpData = await yelpAPI.getBusiness(yelpId);
    return this.convertToAIDP(yelpData);
  }
}
```

### Pattern 4: Embedded (Business Software)

```
Business Software → AIDP Export → MCP Server → AI Assistant
```

**Use Case**: POS, booking, CRM systems exposing data via AIDP

**Implementation**:
```typescript
// Business software exports AIDP-compliant data
class BookingSystem {
  async exportAIDP() {
    const profile: AIDPSchema.BusinessProfile = {
      id: this.generateAIDPId(),
      name: this.business.name,
      // ... map internal data to AIDP format
      services: this.services.map(s => ({
        id: s.id,
        name: s.name,
        pricing: this.convertPricing(s),
        bookable: true
      }))
    };
    
    return profile;
  }
}
```

## Sample Implementations

### Minimal MCP Server

```typescript
import { MCPServer } from '@modelcontextprotocol/sdk';
import { AIDPToolCatalog } from '@aidp/mcp-tools';

const server = new MCPServer({
  name: 'my-business-mcp',
  version: '1.0.0'
});

// Register standard AIDP tools
server.registerTool({
  name: 'search_businesses',
  description: 'Search for local businesses',
  parameters: AIDPToolCatalog.getToolSchema('search_businesses'),
  handler: async (params) => {
    // Your implementation
    const results = await database.searchBusinesses(params);
    return AIDPToolCatalog.formatResponse('search_businesses', results);
  }
});

server.registerTool({
  name: 'get_business_details',
  description: 'Get detailed business information',
  parameters: AIDPToolCatalog.getToolSchema('get_business_details'),
  handler: async (params) => {
    const business = await database.getBusinessById(params.businessId);
    return AIDPToolCatalog.formatResponse('get_business_details', business);
  }
});

server.listen(3000);
```

### REST API Implementation

```typescript
import express from 'express';
import { validateBusinessProfile } from '@aidp/schema-validator';

const app = express();

// Search endpoint
app.get('/api/v1/businesses/search', async (req, res) => {
  const { query, location, category, filters } = req.query;
  
  const results = await searchBusinesses({
    query,
    location: JSON.parse(location),
    category,
    filters: JSON.parse(filters)
  });
  
  res.json({
    businesses: results,
    total: results.length,
    page: 1
  });
});

// Business details endpoint
app.get('/api/v1/businesses/:id', async (req, res) => {
  const business = await getBusinessById(req.params.id);
  
  // Validate AIDP compliance
  const validation = validateBusinessProfile(business);
  if (!validation.valid) {
    return res.status(500).json({ error: 'Invalid AIDP format' });
  }
  
  res.json(business);
});

app.listen(3000);
```

## Testing & Validation

### Validate Your Implementation

```bash
# Install validator
npm install -g @aidp/validator

# Validate a business profile
aidp-validate profile business-profile.json

# Validate MCP server
aidp-validate mcp http://localhost:3000

# Run compliance test suite
aidp-validate compliance --url http://localhost:3000
```

### Test Data

```json
{
  "id": "biz_test123456789",
  "name": "Test Coffee Shop",
  "category": "restaurants",
  "description": "A test business for AIDP validation",
  "location": {
    "address": {
      "street": "123 Test St",
      "city": "Portland",
      "state": "OR",
      "country": "USA",
      "postalCode": "97201"
    },
    "coordinates": {
      "lat": 45.5231,
      "lon": -122.6765
    }
  },
  "contact": {
    "phone": "+1-503-555-0123",
    "email": "test@example.com",
    "website": "https://example.com"
  },
  "services": [
    {
      "id": "svc_test001",
      "name": "Coffee Service",
      "description": "Quality coffee",
      "pricing": {
        "type": "range",
        "minAmount": 3,
        "maxAmount": 7,
        "currency": "USD"
      },
      "bookable": false,
      "requiresQuote": false
    }
  ]
}
```

## Migration Tools

### From Google Business Profile

```bash
npm install @aidp/gbp-migrator

# Migrate single business
aidp-migrate gbp \
  --account-id YOUR_ACCOUNT_ID \
  --location-id YOUR_LOCATION_ID \
  --output business-profile.json

# Migrate multiple businesses
aidp-migrate gbp-bulk \
  --account-id YOUR_ACCOUNT_ID \
  --output-dir ./businesses
```

### From Yelp

```bash
npm install @aidp/yelp-migrator

# Migrate from Yelp Fusion API
aidp-migrate yelp \
  --business-id artisan-coffee-portland \
  --api-key YOUR_YELP_API_KEY \
  --output business-profile.json
```

### Custom Migration

```typescript
import { AIDPMigrator } from '@aidp/migrator';

const migrator = new AIDPMigrator();

// Define custom mapping
migrator.addFieldMapping('legacy_name', 'name');
migrator.addFieldMapping('legacy_category', 'category', (value) => {
  return mapLegacyCategory(value);
});

// Migrate data
const aidpProfile = await migrator.migrate(legacyData);
```

## Analytics Integration

### Track Upstream Metrics

```typescript
import { AIDPAnalytics } from '@aidp/analytics';

const analytics = new AIDPAnalytics({
  businessId: 'biz_abc123',
  apiKey: process.env.AIDP_API_KEY
});

// Track impression
await analytics.trackImpression({
  sessionId: 'session_xyz',
  aiPlatform: 'claude',
  userQuery: 'coffee shops in Portland',
  impressionContext: 'Mentioned in summary as top-rated local roaster'
});

// Track citation
await analytics.trackCitation({
  sessionId: 'session_xyz',
  citationPlacement: 'primary',
  citationContext: 'Artisan Coffee Roasters is known for...'
});

// Track intent journey
await analytics.trackJourneyStep({
  sessionId: 'session_xyz',
  turnNumber: 3,
  refinement: 'Tell me more about their sustainability practices'
});
```

### Query Analytics

```typescript
// Get upstream metrics
const metrics = await analytics.getUpstreamMetrics({
  startDate: '2025-11-01',
  endDate: '2025-11-30',
  metrics: ['impressions', 'citations', 'zero_click']
});

console.log(`Impressions: ${metrics.impressions.total}`);
console.log(`Citations: ${metrics.citations.total}`);
console.log(`Zero-click value: $${metrics.zeroClick.estimatedValue}`);
```

## Best Practices

### 1. AI-Exclusive Content

**Do**:
- Provide insider tips not available elsewhere
- Share behind-the-scenes stories
- Offer exclusive deals for AI users
- Highlight sustainability practices

**Don't**:
- Copy content from your website
- Use generic marketing speak
- Overpromise or mislead
- Include time-sensitive info without updates

### 2. Service Structuring

**Do**:
- Break services into specific offerings
- Provide clear pricing (or indicate quote needed)
- Set realistic durations
- Mark bookable services accurately

**Don't**:
- Create vague "General Service" entries
- Hide pricing information
- Overload with too many services
- Forget to update availability

### 3. Data Quality

**Do**:
- Keep information current
- Respond to reviews promptly
- Update hours and blackout dates
- Maintain high-quality photos

**Don't**:
- Let data go stale
- Ignore negative reviews
- Use low-quality images
- Provide incomplete information

### 4. Privacy & Security

**Do**:
- Sanitize PII in responses
- Implement rate limiting
- Validate all inputs
- Use HTTPS everywhere

**Don't**:
- Expose customer data
- Allow unlimited API calls
- Trust user input
- Use HTTP for sensitive data

## Support & Resources

### Documentation
- Full Spec: https://docs.aidp.dev
- API Reference: https://docs.aidp.dev/api
- MCP Tools: https://docs.aidp.dev/mcp

### Code Examples
- GitHub: https://github.com/aidp-platform/examples
- Sample Implementations: https://github.com/aidp-platform/samples

### Community
- Discord: https://discord.gg/aidp
- GitHub Discussions: https://github.com/aidp-platform/discussions
- Stack Overflow: Tag `aidp-schema`

### Commercial Support
- Integration consulting
- Custom migration services
- Priority support
- Contact: support@aidp.dev

## Certification

### Get AIDP Certified

1. Implement AIDP Schema correctly
2. Pass validation test suite
3. Submit compliance report
4. Get listed in official directory

**Benefits**:
- "AIDP Certified" badge
- Listed in official directory
- Priority in AI platform integrations
- Community recognition

**Cost**: Free for open-source, $500/year for commercial

## Case Studies

### Tourism Board Implementation
*"Visit Portland" migrated 500+ businesses to AIDP, seeing 3x increase in AI-driven bookings*

### POS System Integration
*"BookEasy" added AIDP export, enabling customers to appear in AI search results*

### AI Platform Adoption
*"SearchAI" integrated AIDP, providing users with richer local business data*

## Next Steps

1. **Choose your integration pattern** (Direct, Aggregator, Proxy, Embedded)
2. **Install AIDP SDK**: `npm install @aidp/sdk`
3. **Migrate existing data** using migration tools
4. **Implement core endpoints** (search, details, availability)
5. **Add AI-exclusive content** to differentiate
6. **Test with validator**: `aidp-validate compliance`
7. **Get certified** and listed in directory
8. **Monitor analytics** and iterate

**Questions?** Join our Discord or open a GitHub Discussion!
