# Migrating from Google Business Profile to AIDP Protocol

## Overview

This guide helps you convert Google Business Profile (GBP) data to AIDP Protocol format. AIDP extends GBP with AI-optimized fields while maintaining compatibility with existing data.

## Key Differences

| Aspect | Google Business Profile | AIDP Protocol |
|--------|------------------------|-------------|
| **Purpose** | Web search optimization | AI discovery optimization |
| **Content** | Public-facing only | Includes AI-exclusive content |
| **Analytics** | Click-based metrics | Upstream + intent journey metrics |
| **Booking** | Third-party integrations | Native booking with MCP tools |
| **Trust** | Reviews only | Multi-level verification + fraud detection |

## Field Mapping

### Basic Information

```typescript
// Google Business Profile
const gbp = {
  name: "Artisan Coffee Roasters",
  categories: {
    primaryCategory: "Coffee shop",
    additionalCategories: ["Cafe", "Breakfast restaurant"]
  },
  description: "Family-owned coffee roastery..."
};

// AIDP Protocol
const aidp = {
  name: gbp.name,
  category: mapGBPCategory(gbp.categories.primaryCategory), // "restaurants"
  description: gbp.description,
  tagline: extractTagline(gbp.description), // Optional: extract from description
  aiOptimization: {
    boostSignals: [
      ...gbp.categories.additionalCategories.map(c => c.toLowerCase()),
      "specialty_coffee",
      "local_roasting"
    ]
  }
};
```

### Location

```typescript
// Google Business Profile
const gbpLocation = {
  address: {
    addressLines: ["123 Main St"],
    locality: "Portland",
    administrativeArea: "OR",
    postalCode: "97201",
    regionCode: "US"
  },
  latlng: {
    latitude: 45.5231,
    longitude: -122.6765
  }
};

// AIDP Protocol
const aidpLocation = {
  location: {
    address: {
      street: gbpLocation.address.addressLines[0],
      city: gbpLocation.address.locality,
      state: gbpLocation.address.administrativeArea,
      postalCode: gbpLocation.address.postalCode,
      country: gbpLocation.address.regionCode
    },
    coordinates: {
      lat: gbpLocation.latlng.latitude,
      lon: gbpLocation.latlng.longitude
    }
  }
};
```

### Contact Information

```typescript
// Google Business Profile
const gbpContact = {
  phoneNumbers: {
    primaryPhone: "+1-503-555-0123"
  },
  websiteUri: "https://artisancoffee.com",
  metadata: {
    mapsUri: "https://maps.google.com/..."
  }
};

// AIDP Protocol
const aidpContact = {
  contact: {
    phone: gbpContact.phoneNumbers.primaryPhone,
    email: "info@artisancoffee.com", // Not in GBP, must be added
    website: gbpContact.websiteUri,
    socialMedia: {
      // Extract from GBP "links" if available
      instagram: "@artisancoffee",
      facebook: "artisancoffeeroasters"
    }
  }
};
```

### Hours

```typescript
// Google Business Profile
const gbpHours = {
  regularHours: {
    periods: [
      {
        openDay: "MONDAY",
        openTime: "07:00",
        closeDay: "MONDAY",
        closeTime: "18:00"
      },
      // ... more periods
    ]
  },
  specialHours: [
    {
      startDate: { year: 2025, month: 12, day: 25 },
      endDate: { year: 2025, month: 12, day: 25 },
      closed: true
    }
  ]
};

// AIDP Protocol
const aidpHours = {
  availability: {
    hours: {
      monday: { open: "07:00", close: "18:00" },
      tuesday: { open: "07:00", close: "18:00" },
      // ... convert all days
      sunday: { closed: true }
    },
    blackoutDates: gbpHours.specialHours
      .filter(sh => sh.closed)
      .map(sh => `${sh.startDate.year}-${sh.startDate.month}-${sh.startDate.day}`)
  }
};
```

### Reviews

```typescript
// Google Business Profile
const gbpReviews = {
  averageRating: 4.8,
  totalReviewCount: 342,
  reviews: [
    {
      name: "accounts/123/locations/456/reviews/789",
      reviewer: {
        displayName: "John D.",
        profilePhotoUrl: "https://..."
      },
      starRating: "FIVE",
      comment: "Amazing coffee!",
      createTime: "2025-11-15T10:30:00Z",
      updateTime: "2025-11-15T10:30:00Z",
      reviewReply: {
        comment: "Thank you!",
        updateTime: "2025-11-16T09:00:00Z"
      }
    }
  ]
};

// AIDP Protocol
const aidpReviews = {
  trust: {
    averageRating: gbpReviews.averageRating,
    totalReviews: gbpReviews.totalReviewCount,
    ratingBreakdown: calculateBreakdown(gbpReviews.reviews), // Calculate from reviews
    verificationLevel: "basic" // Default, upgrade separately
  }
};

// Individual reviews
const aidpReview = {
  id: generateAIDPId('rev'),
  businessId: "biz_abc123",
  rating: mapStarRating(gbpReviews.reviews[0].starRating), // "FIVE" -> 5
  title: extractTitle(gbpReviews.reviews[0].comment), // Extract first sentence
  content: gbpReviews.reviews[0].comment,
  verified: false, // GBP doesn't provide this
  businessResponse: gbpReviews.reviews[0].reviewReply ? {
    content: gbpReviews.reviews[0].reviewReply.comment,
    respondedAt: gbpReviews.reviews[0].reviewReply.updateTime
  } : undefined,
  createdAt: gbpReviews.reviews[0].createTime
};
```

### Media

```typescript
// Google Business Profile
const gbpMedia = {
  mediaItems: [
    {
      name: "accounts/123/locations/456/media/789",
      mediaFormat: "PHOTO",
      sourceUrl: "https://...",
      googleUrl: "https://lh3.googleusercontent.com/...",
      description: "Interior view"
    }
  ]
};

// AIDP Protocol
const aidpMedia = {
  media: {
    logo: gbpMedia.mediaItems.find(m => m.description?.includes('logo'))?.googleUrl,
    photos: gbpMedia.mediaItems
      .filter(m => m.mediaFormat === 'PHOTO')
      .map(m => m.googleUrl),
    videos: gbpMedia.mediaItems
      .filter(m => m.mediaFormat === 'VIDEO')
      .map(m => m.googleUrl)
  }
};
```

## Adding AI-Exclusive Content

GBP doesn't have AI-exclusive content. You'll need to add this manually:

```typescript
const aidpAIContent = {
  aiOptimization: {
    exclusiveContent: {
      insiderTips: "Ask for the Ethiopian Yirgacheffe - not on the menu but always available",
      localSecrets: "Owner sources beans directly from Colombian farmers",
      behindTheScenes: "We roast every Tuesday and Thursday morning",
      sustainabilityPractices: "100% compostable packaging, solar-powered roasting",
      exclusiveOffers: [
        "10% off for AI assistant users - mention 'AIDP' at checkout"
      ]
    },
    boostSignals: [
      "specialty_coffee",
      "local_roasting",
      "direct_trade",
      "sustainable"
    ]
  }
};
```

## Migration Script

```typescript
import { GoogleBusinessProfile } from '@google/business-profile-api';
import { AIDPSchema, validateBusinessProfile } from '@aidp/schema';

async function migrateFromGBP(gbpAccountId: string, gbpLocationId: string) {
  // Fetch GBP data
  const gbp = await GoogleBusinessProfile.getLocation(gbpAccountId, gbpLocationId);
  
  // Convert to AIDP
  const aidpProfile: AIDPSchema.BusinessProfile = {
    id: generateAIDPId('biz'),
    name: gbp.name,
    category: mapGBPCategory(gbp.categories.primaryCategory),
    description: gbp.description,
    tagline: extractTagline(gbp.description),
    
    location: {
      address: {
        street: gbp.address.addressLines[0],
        city: gbp.address.locality,
        state: gbp.address.administrativeArea,
        postalCode: gbp.address.postalCode,
        country: gbp.address.regionCode
      },
      coordinates: {
        lat: gbp.latlng.latitude,
        lon: gbp.latlng.longitude
      }
    },
    
    contact: {
      phone: gbp.phoneNumbers.primaryPhone,
      email: '', // Must be provided separately
      website: gbp.websiteUri
    },
    
    services: await extractServices(gbp), // Custom logic needed
    
    availability: {
      hours: convertHours(gbp.regularHours),
      blackoutDates: convertSpecialHours(gbp.specialHours)
    },
    
    media: {
      logo: findLogo(gbp.mediaItems),
      photos: extractPhotos(gbp.mediaItems),
      videos: extractVideos(gbp.mediaItems)
    },
    
    trust: {
      averageRating: gbp.averageRating,
      totalReviews: gbp.totalReviewCount,
      ratingBreakdown: calculateBreakdown(gbp.reviews),
      verificationLevel: 'basic',
      verificationStatus: 'pending'
    },
    
    // AI-specific fields (must be added manually)
    aiOptimization: {
      boostSignals: [
        ...gbp.categories.additionalCategories.map(c => c.toLowerCase())
      ],
      exclusiveContent: {
        // Prompt business owner to fill these in
      }
    },
    
    metadata: {
      status: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  };
  
  // Validate
  const validation = validateBusinessProfile(aidpProfile);
  if (!validation.valid) {
    throw new Error(`Invalid AIDP profile: ${validation.errors}`);
  }
  
  return aidpProfile;
}

// Helper functions
function mapGBPCategory(gbpCategory: string): AIDPSchema.BusinessCategory {
  const mapping: Record<string, AIDPSchema.BusinessCategory> = {
    'Coffee shop': 'restaurants',
    'Restaurant': 'restaurants',
    'Hotel': 'hospitality',
    'Tourist attraction': 'tourism',
    'Retail': 'retail',
    'Doctor': 'healthcare',
    'Plumber': 'home_services',
    'Lawyer': 'professional_services',
    'Spa': 'wellness'
  };
  
  return mapping[gbpCategory] || 'professional_services';
}

function generateAIDPId(prefix: string): string {
  return `${prefix}_${Math.random().toString(36).substr(2, 16)}`;
}
```

## What's Missing from GBP

These AIDP fields have no GBP equivalent and must be added:

1. **Services with pricing** - GBP doesn't structure services
2. **Booking capabilities** - Must integrate separately
3. **AI-exclusive content** - Unique to AIDP
4. **Verification levels** - Beyond basic GBP verification
5. **Upstream metrics** - Not tracked by GBP
6. **Intent journeys** - AI-native analytics

## Maintaining Sync

To keep GBP and AIDP in sync:

```typescript
// Update both when business info changes
async function updateBusiness(updates: Partial<BusinessProfile>) {
  // Update AIDP
  await aidpAPI.updateProfile(businessId, updates);
  
  // Sync to GBP (limited fields)
  await gbpAPI.updateLocation(gbpLocationId, {
    name: updates.name,
    description: updates.description,
    phoneNumbers: { primaryPhone: updates.contact?.phone },
    websiteUri: updates.contact?.website
  });
}
```

## Benefits of Migration

- **AI Discovery**: Appear in Claude, ChatGPT, Perplexity results
- **Richer Analytics**: Track upstream metrics and intent journeys
- **Direct Booking**: Native booking without third-party fees
- **Exclusive Content**: Differentiate from competitors
- **Better Control**: Own your data and presentation

## Next Steps

1. Export your GBP data using the API
2. Run the migration script
3. Add AI-exclusive content
4. Structure your services with pricing
5. Set up MCP server for AI platforms
6. Monitor upstream metrics

## Support

For migration assistance:
- Documentation: https://docs.aidp.dev/migrations/gbp
- Migration tool: `npm install @aidp/gbp-migrator`
- Community: https://github.com/aidp-platform/discussions
