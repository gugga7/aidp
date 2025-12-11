/**
 * AIDP Protocol TypeScript Type Definitions
 * 
 * Complete type definitions for the AI Discovery Protocol (AIDP)
 * enabling type-safe development with AIDP-compliant data structures.
 */

// Base Types
export interface Coordinates {
  lat: number;
  lng: number;
}

export interface Address {
  street?: string;
  city: string;
  state: string;
  country: string;
  postalCode?: string;
  formatted: string;
}

export interface Location {
  address: Address;
  coordinates: Coordinates;
  neighborhood?: string;
  timezone?: string;
}

export interface Contact {
  phone?: string;
  email?: string;
  website?: string;
  socialMedia?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    linkedin?: string;
  };
}

// Business Profile Types
export interface BusinessHours {
  open: string; // HH:MM format
  close: string; // HH:MM format
  closed?: boolean;
}

export interface Schedule {
  monday?: BusinessHours;
  tuesday?: BusinessHours;
  wednesday?: BusinessHours;
  thursday?: BusinessHours;
  friday?: BusinessHours;
  saturday?: BusinessHours;
  sunday?: BusinessHours;
}

export interface Availability {
  schedule: Schedule;
  timezone: string;
  exceptions?: {
    date: string; // YYYY-MM-DD
    hours?: BusinessHours;
    closed?: boolean;
    reason?: string;
  }[];
  advanceBooking?: string; // e.g., "24 hours", "1 week"
}

export interface Service {
  id: string;
  name: string;
  description?: string;
  category?: string;
  price?: number;
  currency?: string;
  duration?: number; // minutes
  bookable: boolean;
  requirements?: string[];
  tags?: string[];
}

export interface Media {
  photos?: string[];
  videos?: string[];
  virtualTour?: string;
  logo?: string;
}

export interface ExclusiveContent {
  insiderTips?: string[];
  localSecrets?: string[];
  ownerStory?: string;
  hiddenGems?: string[];
  bestTimes?: string[];
  specialOffers?: string[];
}

export interface TrustSignals {
  verified: boolean;
  claimedByOwner: boolean;
  lastUpdated: string; // ISO 8601
  responseRate?: number; // percentage
  responseTime?: string; // e.g., "within 2 hours"
  certifications?: string[];
  awards?: string[];
}

export interface BusinessProfile {
  // Basic Information
  id: string;
  name: string;
  category: string;
  subcategories?: string[];
  description?: string;
  
  // Location & Contact
  location: Location;
  contact: Contact;
  
  // Services & Availability
  services?: Service[];
  availability?: Availability;
  
  // Media & Content
  media?: Media;
  exclusiveContent?: ExclusiveContent;
  
  // Trust & Verification
  trustSignals: TrustSignals;
  
  // Additional Information
  amenities?: string[];
  paymentMethods?: string[];
  languages?: string[];
  priceRange?: '$' | '$$' | '$$$' | '$$$$';
  tags?: string[];
  
  // Metadata
  createdAt?: string; // ISO 8601
  updatedAt?: string; // ISO 8601
}

// Booking Types
export interface Customer {
  name: string;
  email: string;
  phone?: string;
  specialRequests?: string;
}

export interface BookingRequest {
  businessId: string;
  serviceId?: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  duration?: number; // minutes
  partySize: number;
  customer: Customer;
  paymentMethod?: string;
  notes?: string;
}

export interface BookingResponse {
  id: string;
  businessId: string;
  businessName: string;
  serviceId?: string;
  serviceName?: string;
  date: string;
  time: string;
  duration?: number;
  partySize: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  customer: Customer;
  totalPrice?: number;
  currency?: string;
  confirmationCode: string;
  createdAt: string;
  cancellationDeadline?: string;
  instructions?: {
    arrival?: string;
    location?: string;
    contact?: string;
  };
}

// Review Types
export interface ReviewAuthor {
  name: string;
  verified?: boolean;
  reviewCount?: number;
  avatar?: string;
}

export interface BusinessResponse {
  text: string;
  date: string;
  responder: string;
}

export interface Review {
  id: string;
  businessId: string;
  rating: number; // 1-5
  title?: string;
  text: string;
  author: ReviewAuthor;
  date: string; // ISO 8601
  verified?: boolean;
  helpful?: number;
  businessResponse?: BusinessResponse;
  tags?: string[];
  photos?: string[];
}

// Analytics Types
export interface PlatformMetrics {
  [platform: string]: number;
}

export interface CitationPlacement {
  primary: number;
  secondary: number;
  tertiary: number;
}

export interface UpstreamMetrics {
  impressions: {
    total: number;
    trend?: number; // percentage change
    byPlatform: PlatformMetrics;
  };
  citations: {
    total: number;
    trend?: number;
    placement: CitationPlacement;
  };
  zeroClick: {
    total: number;
    visibility: number; // percentage
    shareOfVoice?: number;
  };
  timeRange?: {
    start: string;
    end: string;
  };
}

export interface IntentTurn {
  turn: number;
  intentScore: number; // 0-100
  query: string;
  action?: string;
  timestamp?: string;
}

export interface IntentJourney {
  id: string;
  businessId?: string;
  pattern?: 'steadily_increasing' | 'spike_pattern' | 'volatile_pattern' | 'decreasing_pattern';
  conversionProbability?: number; // 0-1
  turns: IntentTurn[];
  outcome?: 'conversion' | 'abandonment' | 'ongoing';
  createdAt?: string;
}

export interface AttributionTouchpoint {
  type: 'impression' | 'citation' | 'comparison' | 'click' | 'booking';
  platform: string;
  attribution: number; // 0-1
  value: number;
  timestamp: string;
}

export interface AttributionAnalysis {
  model: 'first_touch' | 'last_touch' | 'linear' | 'time_decay' | 'position_based';
  touchpoints: AttributionTouchpoint[];
  totalValue: number;
  conversionValue: number;
}

// Search & Discovery Types
export interface SearchFilters {
  priceRange?: '$' | '$$' | '$$$' | '$$$$';
  rating?: number;
  openNow?: boolean;
  verified?: boolean;
  category?: string;
  amenities?: string[];
}

export interface SearchParams {
  query: string;
  location: string;
  radius?: number; // miles
  limit?: number;
  sortBy?: 'relevance' | 'rating' | 'distance' | 'price';
  filters?: SearchFilters;
}

export interface SearchResult {
  businesses: BusinessProfile[];
  totalResults: number;
  searchRadius: number;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
}

// MCP Tool Types
export interface MCPToolParameter {
  type: string;
  description: string;
  required?: boolean;
  enum?: string[];
  default?: any;
  properties?: Record<string, MCPToolParameter>;
  items?: MCPToolParameter;
}

export interface MCPToolSchema {
  type: 'object';
  properties: Record<string, MCPToolParameter>;
  required?: string[];
}

export interface MCPTool {
  name: string;
  description: string;
  inputSchema: MCPToolSchema;
}

// Error Types
export interface AIDPError {
  code: string;
  message: string;
  details?: Record<string, any>;
}

export interface ValidationResult {
  valid: boolean;
  errors?: string[];
  warnings?: string[];
}

// Utility Types
export type BusinessCategory = 
  | 'Restaurant'
  | 'Coffee Shop'
  | 'Hotel'
  | 'Retail Store'
  | 'Service Provider'
  | 'Entertainment'
  | 'Healthcare'
  | 'Beauty & Wellness'
  | 'Automotive'
  | 'Professional Services'
  | 'Other';

export type PriceRange = '$' | '$$' | '$$$' | '$$$$';

export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';

export type ReviewRating = 1 | 2 | 3 | 4 | 5;

// Export aliases for convenience
export type Business = BusinessProfile;
export type Booking = BookingRequest;