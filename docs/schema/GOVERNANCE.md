# AIDP Schema Governance Model

## Overview

AIDP Schema is an open standard maintained through community collaboration with clear governance processes. This document defines how the schema evolves, who makes decisions, and how contributors participate.

## Governance Principles

1. **Open & Transparent**: All discussions, proposals, and decisions are public
2. **Community-Driven**: Anyone can propose changes
3. **Backward Compatible**: Breaking changes require major version bumps
4. **Implementation-First**: Changes proven in production take priority
5. **AI Platform Neutral**: No single AI platform controls the standard

## Governance Structure

### Steering Committee

**Role**: Final decision-making authority on schema changes

**Composition**:
- 3 seats: AIDP Platform maintainers (reference implementation)
- 2 seats: AI platform representatives (Anthropic, OpenAI, etc.)
- 2 seats: Business/operator representatives
- 2 seats: Independent developer community

**Term**: 2 years, staggered to ensure continuity

**Responsibilities**:
- Approve/reject schema change proposals
- Set strategic direction
- Resolve disputes
- Maintain schema quality

### Working Groups

**MCP Tools Working Group**
- Defines standard MCP tool catalog
- Reviews tool proposals
- Ensures cross-platform compatibility

**Analytics & Metrics Working Group**
- Defines upstream metrics standards
- Reviews analytics schema changes
- Ensures privacy compliance

**Trust & Safety Working Group**
- Defines verification standards
- Reviews fraud detection schemas
- Ensures security best practices

**Migration & Compatibility Working Group**
- Creates migration guides
- Maintains compatibility with existing platforms
- Reviews breaking changes

## Change Proposal Process

### 1. Proposal Submission

Anyone can submit a proposal via GitHub Issues:

```markdown
## Proposal: [Title]

**Type**: [Feature | Enhancement | Breaking Change | Deprecation]
**Working Group**: [MCP Tools | Analytics | Trust & Safety | Migration]

### Problem Statement
What problem does this solve?

### Proposed Solution
Detailed description of the change

### Schema Changes
```json
{
  "newField": {
    "type": "string",
    "description": "..."
  }
}
```

### Impact Assessment
- Backward compatibility: [Yes/No]
- Affected entities: [BusinessProfile, Booking, etc.]
- Migration path: [How existing implementations adapt]

### Implementation
- Reference implementation: [Link to PR]
- Validation updates: [Required changes]
- Documentation: [What needs updating]

### Alternatives Considered
What other approaches were evaluated?
```

### 2. Community Discussion (2 weeks minimum)

- Proposal posted to GitHub Discussions
- Community provides feedback
- Working Group reviews technical details
- Proposal author iterates based on feedback

### 3. Working Group Review

- Relevant Working Group evaluates proposal
- Technical feasibility assessment
- Compatibility review
- Recommendation to Steering Committee

### 4. Steering Committee Vote

- **Simple Majority** (5/9): Minor changes, enhancements
- **Supermajority** (7/9): Breaking changes, new major features
- **Unanimous** (9/9): Governance changes

### 5. Implementation & Release

- Approved changes merged to `main` branch
- Version number updated per semantic versioning
- Release notes published
- Migration guides updated
- Validation libraries updated

## Versioning Strategy

AIDP Schema follows **Semantic Versioning 2.0.0**:

### Major Version (X.0.0)
**Breaking changes** that require implementation updates:
- Removing required fields
- Changing field types
- Renaming fields
- Changing validation rules

**Example**: Changing `category` from string to enum

**Release Cadence**: Annually (or as needed)

### Minor Version (1.X.0)
**Backward-compatible additions**:
- Adding optional fields
- Adding new enum values
- Adding new entities
- Expanding validation rules

**Example**: Adding `aiOptimization.contextualRelevance` field

**Release Cadence**: Quarterly

### Patch Version (1.0.X)
**Non-breaking fixes**:
- Documentation clarifications
- Example updates
- Validation bug fixes
- Typo corrections

**Example**: Fixing description of `visibilityScore` field

**Release Cadence**: As needed

## Deprecation Policy

### Deprecation Process

1. **Announcement** (Version N): Field marked as deprecated in schema
2. **Warning Period** (Version N+1): Validation warnings for deprecated fields
3. **Removal** (Version N+2): Field removed in next major version

**Minimum Timeline**: 12 months from deprecation to removal

### Deprecation Example

```json
{
  "oldField": {
    "type": "string",
    "deprecated": true,
    "deprecationMessage": "Use 'newField' instead. Will be removed in v2.0.0",
    "deprecatedSince": "1.5.0",
    "removalVersion": "2.0.0"
  },
  "newField": {
    "type": "string",
    "description": "Replacement for oldField"
  }
}
```

## Reference Implementation

**AIDP Platform** serves as the reference implementation:
- Demonstrates best practices
- Tests schema changes in production
- Provides validation libraries
- Maintains migration tools

**Repository**: https://github.com/aidp-platform/aidp-schema

## Contribution Guidelines

### How to Contribute

1. **Report Issues**: Found a problem? Open an issue
2. **Propose Changes**: Submit a proposal (see process above)
3. **Improve Documentation**: PRs for docs always welcome
4. **Build Tools**: Create validators, migrators, SDKs
5. **Share Feedback**: Participate in discussions

### Code of Conduct

- Be respectful and inclusive
- Focus on technical merit
- Assume good intentions
- Collaborate constructively
- No harassment or discrimination

### Contributor License Agreement

Contributors retain copyright but grant AIDP Schema project:
- Perpetual, worldwide license to use contributions
- Right to sublicense under MIT License
- Right to modify and distribute

## Intellectual Property

### License

AIDP Schema is released under **MIT License**:
- Free to use commercially
- Free to modify and distribute
- Attribution required
- No warranty provided

### Trademark

"AIDP" and "AI Discovery Exchange" are trademarks of AIDP Platform:
- Use for compatible implementations: ✅ Allowed
- Use for incompatible forks: ❌ Not allowed
- Use in product names: Requires approval

### Patent Policy

Contributors agree not to assert patents against AIDP Schema implementations.

## Compliance & Certification

### AIDP Compliant

Implementations can claim "AIDP Compliant" if they:
- Pass official validation suite
- Implement core schema correctly
- Support standard MCP tools (if applicable)
- Follow privacy guidelines

### Certification Process

1. Run validation suite: `npm run aidp-validate`
2. Submit compliance report
3. Review by Working Group
4. Listed in official directory

**Cost**: Free for open-source, $500/year for commercial

## Conflict Resolution

### Dispute Process

1. **Discussion**: Attempt to resolve in Working Group
2. **Mediation**: Steering Committee mediates
3. **Vote**: Steering Committee votes if unresolved
4. **Appeal**: Can appeal to full community (rare)

### Fork Policy

Community can fork if:
- Steering Committee becomes unresponsive (>6 months)
- Governance becomes captured by single entity
- Community consensus for different direction

**Fork Requirements**:
- Must rename (cannot use "AIDP" trademark)
- Must maintain MIT License
- Should document divergence from AIDP

## Meetings & Communication

### Steering Committee Meetings
- **Frequency**: Monthly
- **Format**: Video call + public notes
- **Agenda**: Posted 1 week in advance
- **Minutes**: Published within 3 days

### Working Group Meetings
- **Frequency**: Bi-weekly
- **Format**: Video call + public notes
- **Open**: Anyone can attend

### Communication Channels
- **GitHub Discussions**: Proposals, technical discussions
- **Discord**: Real-time chat, community support
- **Mailing List**: Announcements, release notes
- **Blog**: Major updates, case studies

## Roadmap

### 2025 Q1-Q2: Foundation
- ✅ v1.0.0 release
- Core schema (BusinessProfile, Booking, Review)
- MCP tool catalog
- TypeScript validator
- Migration guides (Google, Yelp)

### 2025 Q3-Q4: Expansion
- v1.1.0: Enhanced analytics schemas
- v1.2.0: Multi-protocol adapters
- Python validator
- Additional migration guides
- Certification program launch

### 2026: Ecosystem Growth
- v1.3.0: Advanced trust & safety features
- v1.4.0: International expansion (i18n)
- v2.0.0: Major refinements based on adoption
- AI platform partnerships
- Industry-specific extensions

## Funding & Sustainability

### Current Funding
- AIDP Platform (reference implementation)
- Volunteer contributions
- Certification fees (future)

### Future Funding Options
- Corporate sponsorships
- Grant funding
- Certification program
- Premium support services

### Financial Transparency
- Annual budget published
- Quarterly financial reports
- All expenses documented publicly

## Contact

- **General Inquiries**: governance@aidp.dev
- **Steering Committee**: steering@aidp.dev
- **Security Issues**: security@aidp.dev
- **Press**: press@aidp.dev

## Amendments

This governance document can be amended by:
- Unanimous vote (9/9) of Steering Committee
- 2-week public comment period
- Ratification by community (>66% approval)

**Last Updated**: December 2025  
**Version**: 1.0.0
