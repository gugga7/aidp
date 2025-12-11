/**
 * AIDP Protocol Validation
 * 
 * JSON Schema validation for all AIDP Protocol entities
 * ensuring data integrity and compliance with the specification.
 */

import { 
  BusinessProfile, 
  BookingRequest, 
  BookingResponse, 
  Review, 
  UpstreamMetrics,
  IntentJourney,
  ValidationResult 
} from './types';

// Simple validation functions without AJV dependency

// Validation functions
export function validateBusinessProfileData(data: unknown): ValidationResult {
  if (!data || typeof data !== 'object') {
    return { valid: false, errors: ['Data must be an object'] };
  }
  
  const profile = data as any;
  const errors: string[] = [];
  
  // Required fields validation
  if (!profile.id) errors.push('id is required');
  if (!profile.name) errors.push('name is required');
  if (!profile.category) errors.push('category is required');
  if (!profile.location) errors.push('location is required');
  if (!profile.contact) errors.push('contact is required');
  if (!profile.trustSignals) errors.push('trustSignals is required');
  
  // Location validation
  if (profile.location) {
    if (!profile.location.address) errors.push('location.address is required');
    if (!profile.location.coordinates) errors.push('location.coordinates is required');
    
    if (profile.location.address) {
      if (!profile.location.address.city) errors.push('location.address.city is required');
      if (!profile.location.address.state) errors.push('location.address.state is required');
      if (!profile.location.address.country) errors.push('location.address.country is required');
      if (!profile.location.address.formatted) errors.push('location.address.formatted is required');
    }
    
    if (profile.location.coordinates) {
      if (typeof profile.location.coordinates.lat !== 'number') errors.push('location.coordinates.lat must be a number');
      if (typeof profile.location.coordinates.lng !== 'number') errors.push('location.coordinates.lng must be a number');
    }
  }
  
  // Trust signals validation
  if (profile.trustSignals) {
    if (typeof profile.trustSignals.verified !== 'boolean') errors.push('trustSignals.verified must be a boolean');
    if (typeof profile.trustSignals.claimedByOwner !== 'boolean') errors.push('trustSignals.claimedByOwner must be a boolean');
    if (!profile.trustSignals.lastUpdated) errors.push('trustSignals.lastUpdated is required');
  }
  
  return {
    valid: errors.length === 0,
    errors: errors.length > 0 ? errors : undefined
  };
}

export function validateBookingRequestData(data: unknown): ValidationResult {
  // Simplified validation for booking request
  if (!data || typeof data !== 'object') {
    return { valid: false, errors: ['Data must be an object'] };
  }
  
  const booking = data as any;
  const errors: string[] = [];
  
  if (!booking.businessId) errors.push('businessId is required');
  if (!booking.date) errors.push('date is required');
  if (!booking.time) errors.push('time is required');
  if (!booking.partySize || booking.partySize < 1) errors.push('partySize must be at least 1');
  if (!booking.customer) errors.push('customer is required');
  if (booking.customer && !booking.customer.name) errors.push('customer.name is required');
  if (booking.customer && !booking.customer.email) errors.push('customer.email is required');
  
  return {
    valid: errors.length === 0,
    errors: errors.length > 0 ? errors : undefined
  };
}

export function validateReviewData(data: unknown): ValidationResult {
  // Simplified validation for review
  if (!data || typeof data !== 'object') {
    return { valid: false, errors: ['Data must be an object'] };
  }
  
  const review = data as any;
  const errors: string[] = [];
  
  if (!review.id) errors.push('id is required');
  if (!review.businessId) errors.push('businessId is required');
  if (!review.rating || review.rating < 1 || review.rating > 5) {
    errors.push('rating must be between 1 and 5');
  }
  if (!review.text) errors.push('text is required');
  if (!review.author) errors.push('author is required');
  if (review.author && !review.author.name) errors.push('author.name is required');
  if (!review.date) errors.push('date is required');
  
  return {
    valid: errors.length === 0,
    errors: errors.length > 0 ? errors : undefined
  };
}

export function validateUpstreamMetricsData(data: unknown): ValidationResult {
  // Simplified validation for upstream metrics
  if (!data || typeof data !== 'object') {
    return { valid: false, errors: ['Data must be an object'] };
  }
  
  const metrics = data as any;
  const errors: string[] = [];
  
  if (!metrics.impressions) errors.push('impressions is required');
  if (metrics.impressions && typeof metrics.impressions.total !== 'number') {
    errors.push('impressions.total must be a number');
  }
  if (!metrics.citations) errors.push('citations is required');
  if (metrics.citations && typeof metrics.citations.total !== 'number') {
    errors.push('citations.total must be a number');
  }
  if (!metrics.zeroClick) errors.push('zeroClick is required');
  if (metrics.zeroClick && typeof metrics.zeroClick.total !== 'number') {
    errors.push('zeroClick.total must be a number');
  }
  
  return {
    valid: errors.length === 0,
    errors: errors.length > 0 ? errors : undefined
  };
}

// Export validation functions with type-safe interfaces
export {
  validateBusinessProfileData as validateBusinessProfile,
  validateBookingRequestData as validateBookingRequest,
  validateReviewData as validateReview,
  validateUpstreamMetricsData as validateUpstreamMetrics
};

// Validation options
export interface ValidationOptions {
  strict?: boolean;
  allowAdditional?: boolean;
  coerceTypes?: boolean;
}

// Enhanced validation with options
export function validate<T>(
  data: unknown,
  validator: (data: unknown) => ValidationResult,
  options: ValidationOptions = {}
): ValidationResult {
  // Apply options if needed
  if (options.coerceTypes) {
    // Basic type coercion could be implemented here
  }
  
  return validator(data);
}