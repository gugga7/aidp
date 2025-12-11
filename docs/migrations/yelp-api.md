# Migrating from Yelp API to AIDP Protocol

## Overview

Convert Yelp Fusion API data to AIDP Protocol format. AIDP provides AI-native features while maintaining compatibility with Yelp's rich review and business data.

## Key Differences

| Aspect | Yelp API | AIDP Protocol |
|--------|----------|-------------|
| **Discovery** | Search API | MCP tools + Search API |
| **Reviews** | Consumer-generated | Consumer + business responses |
| **Booking** | External links | Native booking system |
| **Analytics** | Not provided | Upstream + intent metrics |
| **Content** | Public only | AI-exclusive content |

## Field Mapping

### Business Basics

```typescript
// Yelp API Response
const yelpBusiness = {
  id: "artisan-coffee-roasters-portland",
  alias: "artisan-coffee-roasters-portland",
  name: "Artisan Coffee Roasters",
  image_url: "https://s3-media.yelp.com/...",
  is_closed: false,
  url: "https://www.yelp.com/biz/...",
  review_count: 342,
  categories: [
    { alias: "coffee", title: "Coffee & Tea" },
    { alias: "cafes", title: "Cafes" }
  ],
  rating: 4.5,
  coordinates: {
    latitude: 45.5231,
    longitude: -122.6765
  },
  transactions: ["pickup", "delivery"],
  price: "$$",
  location: {
    address1: "123 Main St",
    address2: "",
    address3: "",
    city: "Portland",
    zip_code: "97201",
    country: "US",
    state: "OR",
    display_address: ["123 Main St", "Portland, OR 97201"]
  },
  phone: "+15035550123",
  display_phone: "(503) 555-0123"
};

// AIDP Protocol
const aidpBusiness: AIDPSchema.BusinessProfile = {
  id: generateAIDPId('biz'),
  name: yelpBusiness.name,
  category: mapYelpCategory(yelpBusiness.categories[0].alias), // "restaurants"
  description: "", // Not provided by Yelp, must fetch from business details
  tagline: extractFromReviews(yelpBusiness.id), // Extract common themes
  
  location: {
    address: {
      street: yelpBusiness.location.address1,
      city: yelpBusiness.location.city,
      state: yelpBusiness.location.state,
      postalCode: yelpBusiness.location.zip_code,
      country: yelpBusiness.location.country
    },
    coordinates: {
      lat: yelpBusiness.coordinates.latitude,
      lon: yelpBusiness.coordinates.longitude
    }
  },
  
  contact: {
    phone: yelpBusiness.phone,
    email: "", // Not in Yelp API
    website: "", // Must fetch from business details
    socialMedia: {} // Not in Yelp API
  },
  
  media: {
    logo: yelpBusiness.image_url,
    photos: [], // Must fetch from photos endpoint
    videos: []
  },
  
  trust: {
    averageRating: yelpBusiness.rating,
    totalReviews: yelpBusiness.review_count,
    ratingBreakdown: {}, // Must calculate from reviews
    verificationLevel: 'basic',
    verificationStatus: 'pending'
  },
  
  aiOptimization: {
    boostSignals: yelpBusiness.categories.map(c => c.alias),
    exclusiveContent: {} // Must be added
  },
  
  metadata: {
    status: yelpBusiness.is_closed ? 'suspended' : 'published',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
};
```

### Business Details

```typescript
// Yelp Business Details API
const yelpDetails = {
  id: "artisan-coffee-roasters-portland",
  name: "Artisan Coffee Roasters",
  // ... basic fields from above
  hours: [
    {
      open: [
        { is_overnight: false, start: "0700", end: "1800", day: 0 }, // Monday
        { is_overnight: false, start: "0700", end: "1800", day: 1 }, // Tuesday
        // ... more days
      ],
      hours_type: "REGULAR",
      is_open_now: true
    }
  ],
  photos: [
    "https://s3-media.yelp.com/photo1.jpg",
    "https://s3-media.yelp.com/photo2.jpg"
  ],
  special_hours: [
    {
      date: "2025-12-25",
      is_closed: true,
      start: null,
      end: null,
      is_overnight: false
    }
  ]
};

// AIDP Protocol
const aidpAvailability = {
  availability: {
    hours: {
      monday: { open: "07:00", close: "18:00" },
      tuesday: { open: "07:00", close: "18:00" },
      wednesday: { open: "07:00", close: "18:00" },
      thursday: { open: "07:00", close: "18:00" },
      friday: { open: "07:00", close: "18:00" },
      saturday: { open: "08:00", close: "17:00" },
      sunday: { closed: true }
    },
    blackoutDates: yelpDetails.special_hours
      .filter(sh => sh.is_closed)
      .map(sh => sh.date)
  },
  media: {
    photos: yelpDetails.photos
  }
};
```

### Reviews

```typescript
// Yelp Reviews API
const yelpReviews = {
  reviews: [
    {
      id: "xzy123",
      rating: 5,
      user: {
        id: "user123",
        profile_url: "https://www.yelp.com/user_details?userid=user123",
        image_url: "https://s3-media.yelp.com/...",
        name: "John D."
      },
      text: "Amazing coffee and great atmosphere! The baristas really know their craft.",
      time_created: "2025-11-15 10:30:00",
      url: "https://www.yelp.com/biz/..."
    }
  ],
  total: 342,
  possible_languages: ["en"]
};

// AIDP Protocol
const aidpReviews = yelpReviews.reviews.map(review => ({
  id: generateAIDPId('rev'),
  businessId: "biz_abc123",
  rating: review.rating,
  title: extractTitle(review.text), // Extract first sentence
  content: review.text,
  verified: false, // Yelp doesn't expose verification status
  moderationStatus: 'approved' as const,
  businessResponse: undefined, // Yelp doesn't provide this in API
  helpfulCount: 0, // Yelp doesn't expose this
  createdAt: new Date(review.time_created).toISOString()
}));
```

## Category Mapping

```typescript
function mapYelpCategory(yelpAlias: string): AIDPSchema.BusinessCategory {
  const mapping: Record<string, AIDPSchema.BusinessCategory> = {
    // Food & Dining
    'restaurants': 'restaurants',
    'coffee': 'restaurants',
    'cafes': 'restaurants',
    'bars': 'restaurants',
    'food': 'restaurants',
    
    // Hospitality
    'hotels': 'hospitality',
    'bedbreakfast': 'hospitality',
    'hostels': 'hospitality',
    'resorts': 'hospitality',
    
    // Tourism
    'tours': 'tourism',
    'museums': 'tourism',
    'landmarks': 'tourism',
    'galleries': 'tourism',
    
    // Retail
    'shopping': 'retail',
    'fashion': 'retail',
    'bookstores': 'retail',
    
    // Healthcare
    'physicians': 'healthcare',
    'dentists': 'healthcare',
    'hospitals': 'healthcare',
    
    // Home Services
    'plumbing': 'home_services',
    'electricians': 'home_services',
    'contractors': 'home_services',
    
    // Professional Services
    'lawyers': 'professional_services',
    'accountants': 'professional_services',
    'realestate': 'professional_services',
    
    // Wellness
    'spas': 'wellness',
    'gyms': 'wellness',
    'yoga': 'wellness',
    'massage': 'wellness'
  };
  
  return mapping[yelpAlias] || 'professional_services';
}
```

## Complete Migration Script

```typescript
import { YelpAPI } from 'yelp-fusion';
import { AIDPSchema, validateBusinessProfile } from '@aidp/schema';

async function migrateFromYelp(yelpBusinessId: string, yelpApiKey: string) {
  const yelp = new YelpAPI(yelpApiKey);
  
  // Fetch business details
  const business = await yelp.business(yelpBusinessId);
  const reviews = await yelp.reviews(yelpBusinessId);
  
  // Calculate rating breakdown from reviews
  const ratingBreakdown = calculateRatingBreakdown(reviews.reviews);
  
  // Convert to AIDP
  const aidpProfile: AIDPSchema.BusinessProfile = {
    id: generateAIDPId('biz'),
    name: business.name,
    category: mapYelpCategory(business.categories[0]?.alias || 'restaurants'),
    description: business.description || generateDescription(business, reviews),
    tagline: extractTagline(reviews.reviews),
    
    location: {
      address: {
        street: business.location.address1,
        city: business.location.city,
        state: business.location.state,
        postalCode: business.location.zip_code,
        country: business.location.country
      },
      coordinates: {
        lat: business.coordinates.latitude,
        lon: business.coordinates.longitude
      }
    },
    
    contact: {
      phone: business.phone,
      email: '', // Must be provided
      website: business.url,
      socialMedia: {} // Must be provided
    },
    
    services: extractServices(business), // Custom logic
    
    availability: {
      hours: convertYelpHours(business.hours?.[0]?.open || []),
      blackoutDates: business.special_hours
        ?.filter(sh => sh.is_closed)
        .map(sh => sh.date) || []
    },
    
    media: {
      logo: business.image_url,
      photos: business.photos || [],
      videos: []
    },
    
    aiOptimization: {
      boostSignals: business.categories.map(c => c.alias),
      exclusiveContent: {
        // Must be filled by business owner
      },
      visibilityScore: 0,
      uniquenessScore: 0
    },
    
    trust: {
      averageRating: business.rating,
      totalReviews: business.review_count,
      ratingBreakdown,
      verificationLevel: 'basic',
      verificationStatus: 'pending',
      riskScore: 0
    },
    
    subscription: {
      tier: 'free',
      features: []
    },
    
    metadata: {
      status: business.is_closed ? 'suspended' : 'published',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  };
  
  // Validate
  const validation = validateBusinessProfile(aidpProfile);
  if (!validation.valid) {
    throw new Error(`Invalid AIDP profile: ${validation.errors}`);
  }
  
  return {
    profile: aidpProfile,
    reviews: reviews.reviews.map(r => convertReview(r, aidpProfile.id))
  };
}

// Helper functions
function convertYelpHours(yelpHours: any[]): AIDPSchema.Hours {
  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  const hours: any = {};
  
  yelpHours.forEach(slot => {
    const day = days[slot.day];
    hours[day] = {
      open: formatTime(slot.start),
      close: formatTime(slot.end)
    };
  });
  
  return hours;
}

function formatTime(yelpTime: string): string {
  // Convert "0700" to "07:00"
  return `${yelpTime.slice(0, 2)}:${yelpTime.slice(2, 4)}`;
}

function calculateRatingBreakdown(reviews: any[]): Record<number, number> {
  const breakdown = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  reviews.forEach(review => {
    breakdown[review.rating as keyof typeof breakdown]++;
  });
  return breakdown;
}

function extractTagline(reviews: any[]): string {
  // Extract most common positive phrases from reviews
  const commonPhrases = reviews
    .filter(r => r.rating >= 4)
    .map(r => r.text.split('.')[0])
    .slice(0, 5);
  
  // Simple heuristic: return most common first sentence
  return commonPhrases[0] || "Quality service you can trust";
}

function generateDescription(business: any, reviews: any): string {
  // Generate description from business data and reviews if not provided
  const category = business.categories[0]?.title || 'business';
  const location = business.location.city;
  const highlights = extractHighlights(reviews.reviews);
  
  return `${business.name} is a ${category} located in ${location}. ${highlights}`;
}

function extractHighlights(reviews: any[]): string {
  // Extract common positive themes from reviews
  const keywords = ['great', 'amazing', 'excellent', 'best', 'friendly', 'professional'];
  const mentions = reviews
    .filter(r => r.rating >= 4)
    .flatMap(r => r.text.toLowerCase().split(' '))
    .filter(word => keywords.includes(word));
  
  const topKeywords = [...new Set(mentions)].slice(0, 3);
  return `Known for ${topKeywords.join(', ')} service.`;
}

function extractServices(business: any): AIDPSchema.Service[] {
  // Yelp doesn't provide structured services, must be added manually
  return [
    {
      id: generateAIDPId('svc'),
      name: 'General Service',
      description: `${business.categories[0]?.title} services`,
      category: business.categories[0]?.alias || 'general',
      pricing: {
        type: 'range',
        minAmount: parsePriceRange(business.price).min,
        maxAmount: parsePriceRange(business.price).max,
        currency: 'USD'
      },
      bookable: business.transactions?.includes('pickup') || false,
      requiresQuote: true
    }
  ];
}

function parsePriceRange(yelpPrice: string): { min: number; max: number } {
  const priceMap: Record<string, { min: number; max: number }> = {
    '$': { min: 10, max: 30 },
    '$$': { min: 30, max: 60 },
    '$$$': { min: 60, max: 100 },
    '$$$$': { min: 100, max: 200 }
  };
  return priceMap[yelpPrice] || { min: 0, max: 0 };
}

function convertReview(yelpReview: any, businessId: string): AIDPSchema.Review {
  return {
    id: generateAIDPId('rev'),
    businessId,
    rating: yelpReview.rating,
    title: yelpReview.text.split('.')[0].slice(0, 255),
    content: yelpReview.text,
    verified: false,
    moderationStatus: 'approved',
    helpfulCount: 0,
    createdAt: new Date(yelpReview.time_created).toISOString()
  };
}

function generateAIDPId(prefix: string): string {
  return `${prefix}_${Math.random().toString(36).substr(2, 16)}`;
}
```

## What's Missing from Yelp

1. **Email addresses** - Not in Yelp API
2. **Structured services** - Must be created manually
3. **Booking system** - Yelp only links externally
4. **AI-exclusive content** - Unique to AIDP
5. **Business responses** - Not in API (only on website)
6. **Upstream metrics** - Not tracked by Yelp

## Enriching Yelp Data

After migration, enhance with AIDP-specific features:

```typescript
// Add AI-exclusive content
aidpProfile.aiOptimization.exclusiveContent = {
  insiderTips: "Ask about our secret menu items",
  localSecrets: "We source ingredients from local farms",
  sustainabilityPractices: "Zero-waste kitchen, composting program"
};

// Structure services properly
aidpProfile.services = [
  {
    id: generateAIDPId('svc'),
    name: "Espresso Drinks",
    description: "Handcrafted espresso beverages",
    category: "beverages",
    pricing: { type: 'range', minAmount: 4, maxAmount: 7, currency: 'USD' },
    duration: 5,
    bookable: false,
    requiresQuote: false
  },
  {
    id: generateAIDPId('svc'),
    name: "Coffee Tasting",
    description: "Guided tasting of single-origin coffees",
    category: "experiences",
    pricing: { type: 'fixed', amount: 25, currency: 'USD' },
    duration: 60,
    bookable: true,
    requiresQuote: false
  }
];
```

## Benefits of Migration

- **AI Discovery**: Appear in AI assistant results
- **Direct Booking**: No third-party fees
- **Richer Analytics**: Track upstream metrics
- **Exclusive Content**: Differentiate from Yelp listing
- **Data Ownership**: Control your business data

## Maintaining Both Platforms

Keep Yelp and AIDP in sync:

```typescript
async function syncToYelp(aidpProfile: AIDPSchema.BusinessProfile) {
  // Yelp API is read-only for most businesses
  // Use Yelp Business Owner portal for updates
  console.log('Update these fields in Yelp Business portal:');
  console.log('- Business hours:', aidpProfile.availability.hours);
  console.log('- Photos:', aidpProfile.media.photos);
  console.log('- Description:', aidpProfile.description);
}
```

## Next Steps

1. Export Yelp data using Fusion API
2. Run migration script
3. Add missing fields (email, services, AI content)
4. Set up MCP server
5. Monitor both platforms

## Support

- Documentation: https://docs.aidp.dev/migrations/yelp
- Migration tool: `npm install @aidp/yelp-migrator`
- Community: https://github.com/aidp-platform/discussions
