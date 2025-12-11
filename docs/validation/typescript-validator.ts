/**
 * AIDP Protocol TypeScript Validator
 * 
 * Validates business profiles, bookings, reviews, and other AIDP entities
 * against the official JSON Schema specifications.
 * 
 * @package @aidp/schema-validator
 * @version 1.0.0
 */

import Ajv, { JSONSchemaType, ValidateFunction } from 'ajv';
import addFormats from 'ajv-formats';

// Type definitions
export interface BusinessProfile {
  id: string;
  name: string;
  category: BusinessCategory;
  description: string;
  tagline?: string;
  location: Location;
  contact: Contact;
  services: Service[];
  availability?: Availability;
  media?: Media;
  aiOptimization?: AIOptimization;
  trust?: Trust;
  subscription?: Subscription;
  metadata?: Metadata;
}

export type BusinessCategory =
  | 'tourism'
  | 'hospitality'
  | 'restaurants'
  | 'retail'
  | 'healthcare'
  | 'home_services'
  | 'professional_services'
  | 'wellness';

export interface Location {
  address: Address;
  coordinates: Coordinates;
  serviceArea?: ServiceArea;
}

export interface Address {
  street: string;
  city: string;
  state?: string;
  country: string;
  postalCode?: string;
}

export interface Coordinates {
  lat: number;
  lon: number;
}

export interface ServiceArea {
  type: 'radius' | 'regions';
  radius?: number;
  regions?: string[];
}

export interface Contact {
  phone: string;
  email: string;
  website?: string;
  socialMedia?: SocialMedia;
}

export interface SocialMedia {
  facebook?: string;
  instagram?: string;
  twitter?: string;
  linkedin?: string;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  category?: string;
  pricing: Pricing;
  duration?: number;
  bookable: boolean;
  requiresQuote: boolean;
}

export interface Pricing {
  type: 'fixed' | 'hourly' | 'range' | 'quote';
  amount?: number;
  minAmount?: number;
  maxAmount?: number;
  currency: string;
}

export interface Availability {
  hours?: Hours;
  blackoutDates?: string[];
}

export interface Hours {
  monday?: DayHours;
  tuesday?: DayHours;
  wednesday?: DayHours;
  thursday?: DayHours;
  friday?: DayHours;
  saturday?: DayHours;
  sunday?: DayHours;
}

export interface DayHours {
  open?: string;
  close?: string;
  closed?: boolean;
}

export interface Media {
  logo?: string;
  photos?: string[];
  videos?: string[];
  virtualTour?: string;
}

export interface AIOptimization {
  exclusiveContent?: ExclusiveContent;
  boostSignals?: string[];
  visibilityScore?: number;
  uniquenessScore?: number;
}

export interface ExclusiveContent {
  insiderTips?: string;
  localSecrets?: string;
  behindTheScenes?: string;
  culturalNotes?: string;
  sustainabilityPractices?: string;
  exclusiveOffers?: string[];
  customerTestimonials?: Testimonial[];
}

export interface Testimonial {
  name: string;
  text: string;
  date: string;
}

export interface Trust {
  verificationLevel?: 'basic' | 'certified' | 'elite';
  verificationStatus?: 'pending' | 'approved' | 'rejected';
  averageRating?: number;
  totalReviews?: number;
  ratingBreakdown?: RatingBreakdown;
  riskScore?: number;
}

export interface RatingBreakdown {
  1: number;
  2: number;
  3: number;
  4: number;
  5: number;
}

export interface Subscription {
  tier?: 'free' | 'professional' | 'enterprise';
  features?: string[];
}

export interface Metadata {
  status?: 'draft' | 'pending_review' | 'published' | 'suspended';
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
}

export interface ValidationResult {
  valid: boolean;
  errors?: ValidationError[];
}

export interface ValidationError {
  field: string;
  message: string;
  value?: any;
}

// Validator class
export class AIDPValidator {
  private ajv: Ajv;
  private validators: Map<string, ValidateFunction>;

  constructor() {
    this.ajv = new Ajv({ allErrors: true, strict: false });
    addFormats(this.ajv);
    this.validators = new Map();
    this.initializeValidators();
  }

  private initializeValidators(): void {
    // Business Profile Schema
    const businessProfileSchema: JSONSchemaType<BusinessProfile> = {
      type: 'object',
      required: ['id', 'name', 'category', 'description', 'location', 'contact', 'services'],
      properties: {
        id: { type: 'string', pattern: '^biz_[a-zA-Z0-9]{16,}$' },
        name: { type: 'string', maxLength: 255 },
        category: {
          type: 'string',
          enum: [
            'tourism',
            'hospitality',
            'restaurants',
            'retail',
            'healthcare',
            'home_services',
            'professional_services',
            'wellness',
          ],
        },
        description: { type: 'string' },
        tagline: { type: 'string', maxLength: 255, nullable: true },
        location: {
          type: 'object',
          required: ['address', 'coordinates'],
          properties: {
            address: {
              type: 'object',
              required: ['street', 'city', 'country'],
              properties: {
                street: { type: 'string' },
                city: { type: 'string' },
                state: { type: 'string', nullable: true },
                country: { type: 'string' },
                postalCode: { type: 'string', nullable: true },
              },
            },
            coordinates: {
              type: 'object',
              required: ['lat', 'lon'],
              properties: {
                lat: { type: 'number', minimum: -90, maximum: 90 },
                lon: { type: 'number', minimum: -180, maximum: 180 },
              },
            },
            serviceArea: {
              type: 'object',
              nullable: true,
              required: ['type'],
              properties: {
                type: { type: 'string', enum: ['radius', 'regions'] },
                radius: { type: 'number', nullable: true },
                regions: { type: 'array', items: { type: 'string' }, nullable: true },
              },
            },
          },
        },
        contact: {
          type: 'object',
          required: ['phone', 'email'],
          properties: {
            phone: { type: 'string' },
            email: { type: 'string', format: 'email' },
            website: { type: 'string', format: 'uri', nullable: true },
            socialMedia: {
              type: 'object',
              nullable: true,
              properties: {
                facebook: { type: 'string', nullable: true },
                instagram: { type: 'string', nullable: true },
                twitter: { type: 'string', nullable: true },
                linkedin: { type: 'string', nullable: true },
              },
              required: [],
            },
          },
        },
        services: {
          type: 'array',
          minItems: 1,
          items: {
            type: 'object',
            required: ['id', 'name', 'description', 'pricing', 'bookable', 'requiresQuote'],
            properties: {
              id: { type: 'string' },
              name: { type: 'string' },
              description: { type: 'string' },
              category: { type: 'string', nullable: true },
              pricing: {
                type: 'object',
                required: ['type', 'currency'],
                properties: {
                  type: { type: 'string', enum: ['fixed', 'hourly', 'range', 'quote'] },
                  amount: { type: 'number', nullable: true },
                  minAmount: { type: 'number', nullable: true },
                  maxAmount: { type: 'number', nullable: true },
                  currency: { type: 'string', pattern: '^[A-Z]{3}$' },
                },
              },
              duration: { type: 'number', nullable: true },
              bookable: { type: 'boolean' },
              requiresQuote: { type: 'boolean' },
            },
          },
        },
        availability: { type: 'object', nullable: true, required: [] },
        media: { type: 'object', nullable: true, required: [] },
        aiOptimization: { type: 'object', nullable: true, required: [] },
        trust: { type: 'object', nullable: true, required: [] },
        subscription: { type: 'object', nullable: true, required: [] },
        metadata: { type: 'object', nullable: true, required: [] },
      },
    };

    this.validators.set('businessProfile', this.ajv.compile(businessProfileSchema));
  }

  /**
   * Validate a business profile
   */
  validateBusinessProfile(profile: unknown): ValidationResult {
    const validator = this.validators.get('businessProfile');
    if (!validator) {
      throw new Error('Business profile validator not initialized');
    }

    const valid = validator(profile);

    if (!valid && validator.errors) {
      return {
        valid: false,
        errors: validator.errors.map((err) => ({
          field: err.instancePath || err.schemaPath,
          message: err.message || 'Validation error',
          value: err.data,
        })),
      };
    }

    // Additional business logic validation
    const businessErrors = this.validateBusinessLogic(profile as BusinessProfile);
    if (businessErrors.length > 0) {
      return {
        valid: false,
        errors: businessErrors,
      };
    }

    return { valid: true };
  }

  /**
   * Business logic validation beyond schema
   */
  private validateBusinessLogic(profile: BusinessProfile): ValidationError[] {
    const errors: ValidationError[] = [];

    // Validate ID format
    if (!profile.id.startsWith('biz_')) {
      errors.push({
        field: 'id',
        message: 'Business ID must start with "biz_"',
        value: profile.id,
      });
    }

    // Validate coordinates
    if (profile.location.coordinates.lat < -90 || profile.location.coordinates.lat > 90) {
      errors.push({
        field: 'location.coordinates.lat',
        message: 'Latitude must be between -90 and 90',
        value: profile.location.coordinates.lat,
      });
    }

    if (profile.location.coordinates.lon < -180 || profile.location.coordinates.lon > 180) {
      errors.push({
        field: 'location.coordinates.lon',
        message: 'Longitude must be between -180 and 180',
        value: profile.location.coordinates.lon,
      });
    }

    // Validate services
    profile.services.forEach((service, index) => {
      if (service.pricing.type === 'fixed' && !service.pricing.amount) {
        errors.push({
          field: `services[${index}].pricing.amount`,
          message: 'Fixed pricing requires an amount',
          value: service.pricing,
        });
      }

      if (service.pricing.type === 'range') {
        if (!service.pricing.minAmount || !service.pricing.maxAmount) {
          errors.push({
            field: `services[${index}].pricing`,
            message: 'Range pricing requires minAmount and maxAmount',
            value: service.pricing,
          });
        } else if (service.pricing.minAmount > service.pricing.maxAmount) {
          errors.push({
            field: `services[${index}].pricing`,
            message: 'minAmount must be less than maxAmount',
            value: service.pricing,
          });
        }
      }
    });

    // Validate AI optimization scores
    if (profile.aiOptimization) {
      if (
        profile.aiOptimization.visibilityScore !== undefined &&
        (profile.aiOptimization.visibilityScore < 0 || profile.aiOptimization.visibilityScore > 100)
      ) {
        errors.push({
          field: 'aiOptimization.visibilityScore',
          message: 'Visibility score must be between 0 and 100',
          value: profile.aiOptimization.visibilityScore,
        });
      }

      if (
        profile.aiOptimization.uniquenessScore !== undefined &&
        (profile.aiOptimization.uniquenessScore < 0 || profile.aiOptimization.uniquenessScore > 100)
      ) {
        errors.push({
          field: 'aiOptimization.uniquenessScore',
          message: 'Uniqueness score must be between 0 and 100',
          value: profile.aiOptimization.uniquenessScore,
        });
      }
    }

    // Validate trust scores
    if (profile.trust) {
      if (
        profile.trust.averageRating !== undefined &&
        (profile.trust.averageRating < 0 || profile.trust.averageRating > 5)
      ) {
        errors.push({
          field: 'trust.averageRating',
          message: 'Average rating must be between 0 and 5',
          value: profile.trust.averageRating,
        });
      }

      if (profile.trust.riskScore !== undefined && (profile.trust.riskScore < 0 || profile.trust.riskScore > 100)) {
        errors.push({
          field: 'trust.riskScore',
          message: 'Risk score must be between 0 and 100',
          value: profile.trust.riskScore,
        });
      }
    }

    return errors;
  }

  /**
   * Validate hours format
   */
  validateHours(hours: Hours): ValidationResult {
    const errors: ValidationError[] = [];
    const timePattern = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;

    Object.entries(hours).forEach(([day, dayHours]) => {
      if (dayHours && !dayHours.closed) {
        if (dayHours.open && !timePattern.test(dayHours.open)) {
          errors.push({
            field: `hours.${day}.open`,
            message: 'Invalid time format. Use HH:MM (24-hour)',
            value: dayHours.open,
          });
        }

        if (dayHours.close && !timePattern.test(dayHours.close)) {
          errors.push({
            field: `hours.${day}.close`,
            message: 'Invalid time format. Use HH:MM (24-hour)',
            value: dayHours.close,
          });
        }
      }
    });

    return errors.length > 0 ? { valid: false, errors } : { valid: true };
  }
}

// Export singleton instance
export const validator = new AIDPValidator();

// Convenience functions
export function validateBusinessProfile(profile: unknown): ValidationResult {
  return validator.validateBusinessProfile(profile);
}

export function validateHours(hours: Hours): ValidationResult {
  return validator.validateHours(hours);
}
