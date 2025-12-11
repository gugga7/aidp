/**
 * AIDP Protocol Utilities
 * 
 * Helper functions for working with AIDP Protocol data,
 * including migration tools and data transformation utilities.
 */

import { BusinessProfile, UpstreamMetrics, IntentJourney } from './types';

// Migration helpers for converting from existing platforms
export function convertFromGoogleBusiness(googleData: any): Partial<BusinessProfile> {
  return {
    id: googleData.place_id || `google_${Date.now()}`,
    name: googleData.name,
    category: googleData.types?.[0] || 'Business',
    description: googleData.editorial_summary?.overview,
    location: {
      address: {
        street: googleData.vicinity,
        city: googleData.address_components?.find((c: any) => c.types.includes('locality'))?.long_name || '',
        state: googleData.address_components?.find((c: any) => c.types.includes('administrative_area_level_1'))?.short_name || '',
        country: googleData.address_components?.find((c: any) => c.types.includes('country'))?.short_name || '',
        postalCode: googleData.address_components?.find((c: any) => c.types.includes('postal_code'))?.long_name,
        formatted: googleData.formatted_address || googleData.vicinity
      },
      coordinates: {
        lat: googleData.geometry?.location?.lat || 0,
        lng: googleData.geometry?.location?.lng || 0
      }
    },
    contact: {
      phone: googleData.formatted_phone_number,
      website: googleData.website
    },
    media: {
      photos: googleData.photos?.map((photo: any) => 
        `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photo.photo_reference}&key=YOUR_API_KEY`
      )
    },
    trustSignals: {
      verified: googleData.business_status === 'OPERATIONAL',
      claimedByOwner: false,
      lastUpdated: new Date().toISOString()
    }
  };
}

export function convertFromYelp(yelpData: any): Partial<BusinessProfile> {
  return {
    id: yelpData.id || `yelp_${Date.now()}`,
    name: yelpData.name,
    category: yelpData.categories?.[0]?.title || 'Business',
    location: {
      address: {
        street: yelpData.location?.address1,
        city: yelpData.location?.city || '',
        state: yelpData.location?.state || '',
        country: yelpData.location?.country || 'US',
        postalCode: yelpData.location?.zip_code,
        formatted: yelpData.location?.display_address?.join(', ') || ''
      },
      coordinates: {
        lat: yelpData.coordinates?.latitude || 0,
        lng: yelpData.coordinates?.longitude || 0
      }
    },
    contact: {
      phone: yelpData.phone,
      website: yelpData.url
    },
    priceRange: yelpData.price as '$' | '$$' | '$$$' | '$$$$',
    media: {
      photos: yelpData.photos || []
    },
    trustSignals: {
      verified: !yelpData.is_closed,
      claimedByOwner: false,
      lastUpdated: new Date().toISOString()
    }
  };
}

// Analytics utilities
export function calculateShareOfVoice(
  businessMetrics: UpstreamMetrics,
  competitorMetrics: UpstreamMetrics[]
): number {
  const totalCitations = businessMetrics.citations.total + 
    competitorMetrics.reduce((sum, competitor) => sum + competitor.citations.total, 0);
  
  if (totalCitations === 0) return 0;
  
  return (businessMetrics.citations.total / totalCitations) * 100;
}

export function analyzeIntentProgression(journey: IntentJourney): {
  pattern: string;
  conversionProbability: number;
  trend: 'increasing' | 'decreasing' | 'volatile' | 'stable';
} {
  const scores = journey.turns.map(turn => turn.intentScore);
  
  // Calculate trend
  let trend: 'increasing' | 'decreasing' | 'volatile' | 'stable' = 'stable';
  
  if (scores.length > 1) {
    const firstHalf = scores.slice(0, Math.floor(scores.length / 2));
    const secondHalf = scores.slice(Math.floor(scores.length / 2));
    
    const firstAvg = firstHalf.reduce((sum, score) => sum + score, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((sum, score) => sum + score, 0) / secondHalf.length;
    
    const difference = secondAvg - firstAvg;
    
    if (difference > 10) trend = 'increasing';
    else if (difference < -10) trend = 'decreasing';
    else {
      // Check for volatility
      const variance = scores.reduce((sum, score, i) => {
        if (i === 0) return 0;
        return sum + Math.abs(score - scores[i - 1]);
      }, 0) / (scores.length - 1);
      
      trend = variance > 20 ? 'volatile' : 'stable';
    }
  }
  
  // Calculate conversion probability based on pattern
  const finalScore = scores[scores.length - 1] || 0;
  let conversionProbability = 0;
  
  switch (trend) {
    case 'increasing':
      conversionProbability = Math.min(0.9, finalScore / 100 * 1.2);
      break;
    case 'stable':
      conversionProbability = finalScore / 100;
      break;
    case 'volatile':
      conversionProbability = Math.max(0.1, finalScore / 100 * 0.7);
      break;
    case 'decreasing':
      conversionProbability = Math.max(0.05, finalScore / 100 * 0.5);
      break;
  }
  
  return {
    pattern: journey.pattern || trend,
    conversionProbability,
    trend
  };
}

// Data transformation utilities
export function sanitizeBusinessProfile(profile: BusinessProfile): BusinessProfile {
  // Remove any PII or sensitive data
  const sanitized = { ...profile };
  
  // Remove internal IDs or sensitive contact info if needed
  if (sanitized.contact.email?.includes('@internal')) {
    delete sanitized.contact.email;
  }
  
  return sanitized;
}

export function enrichBusinessProfile(
  profile: Partial<BusinessProfile>,
  additionalData: Record<string, any>
): BusinessProfile {
  // Add AI-exclusive content and enrich the profile
  const enriched: BusinessProfile = {
    id: profile.id || `business_${Date.now()}`,
    name: profile.name || 'Unnamed Business',
    category: profile.category || 'Business',
    location: profile.location || {
      address: {
        city: '',
        state: '',
        country: '',
        formatted: ''
      },
      coordinates: { lat: 0, lng: 0 }
    },
    contact: profile.contact || {},
    trustSignals: profile.trustSignals || {
      verified: false,
      claimedByOwner: false,
      lastUpdated: new Date().toISOString()
    },
    ...profile
  };
  
  // Add exclusive content if available
  if (additionalData.insiderTips || additionalData.localSecrets) {
    enriched.exclusiveContent = {
      insiderTips: additionalData.insiderTips,
      localSecrets: additionalData.localSecrets,
      ownerStory: additionalData.ownerStory,
      ...enriched.exclusiveContent
    };
  }
  
  return enriched;
}

// Validation helpers
export function isValidCoordinates(lat: number, lng: number): boolean {
  return lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
}

export function isValidPhoneNumber(phone: string): boolean {
  // Basic phone number validation
  const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
  return phoneRegex.test(phone);
}

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

// Time and scheduling utilities
export function parseBusinessHours(hoursString: string): { open: string; close: string } | null {
  // Parse various formats like "9:00 AM - 5:00 PM", "09:00-17:00", etc.
  const timeRegex = /(\d{1,2}):?(\d{2})?\s*(AM|PM)?/gi;
  const matches = hoursString.match(timeRegex);
  
  if (!matches || matches.length < 2) return null;
  
  const parseTime = (timeStr: string): string => {
    const match = timeStr.match(/(\d{1,2}):?(\d{2})?\s*(AM|PM)?/i);
    if (!match) return '00:00';
    
    let hours = parseInt(match[1]);
    const minutes = match[2] ? parseInt(match[2]) : 0;
    const period = match[3]?.toUpperCase();
    
    if (period === 'PM' && hours !== 12) hours += 12;
    if (period === 'AM' && hours === 12) hours = 0;
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };
  
  return {
    open: parseTime(matches[0]),
    close: parseTime(matches[1])
  };
}

export function isBusinessOpen(
  schedule: any,
  timezone: string,
  currentTime?: Date
): boolean {
  const now = currentTime || new Date();
  const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const currentDay = dayNames[now.getDay()];
  
  const todayHours = schedule[currentDay];
  if (!todayHours || todayHours.closed) return false;
  
  const currentTimeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
  
  return currentTimeStr >= todayHours.open && currentTimeStr <= todayHours.close;
}

// Export aliases for convenience
export const convertFromGoogle = convertFromGoogleBusiness;