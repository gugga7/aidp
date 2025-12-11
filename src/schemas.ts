/**
 * JSON Schema definitions for AIDP Protocol data structures
 */

export const businessProfileSchema = {
  $id: 'https://aidp.dev/schemas/business-profile.json',
  type: 'object',
  required: ['id', 'name', 'description', 'category', 'location', 'contact', 'businessHours', 'services', 'trustSignals', 'protocolVersion'],
  properties: {
    id: { type: 'string', format: 'aidp-id' },
    name: { type: 'string', minLength: 1, maxLength: 200 },
    description: { type: 'string', minLength: 10, maxLength: 2000 },
    category: { type: 'string', minLength: 1 },
    subcategories: { type: 'array', items: { type: 'string' } },
    location: {
      type: 'object',
      required: ['address', 'city', 'state', 'country', 'postalCode'],
      properties: {
        address: { type: 'string' },
        city: { type: 'string' },
        state: { type: 'string' },
        country: { type: 'string' },
        postalCode: { type: 'string' },
        coordinates: {
          type: 'object',
          properties: {
            latitude: { type: 'number', minimum: -90, maximum: 90 },
            longitude: { type: 'number', minimum: -180, maximum: 180 }
          }
        }
      }
    },
    contact: {
      type: 'object',
      properties: {
        phone: { type: 'string', format: 'phone' },
        email: { type: 'string', format: 'email' },
        website: { type: 'string', format: 'uri' }
      }
    },
    businessHours: { type: 'object' },
    services: { type: 'array', items: { type: 'object' } },
    trustSignals: {
      type: 'object',
      required: ['verified'],
      properties: {
        verified: { type: 'boolean' },
        badges: { type: 'array', items: { type: 'string' } }
      }
    },
    protocolVersion: { type: 'string' },
    createdAt: { type: 'string', format: 'date-time' },
    updatedAt: { type: 'string', format: 'date-time' }
  }
};

export const bookingRequestSchema = {
  $id: 'https://aidp.dev/schemas/booking-request.json',
  type: 'object',
  required: ['businessId', 'date', 'time', 'partySize', 'customerInfo', 'source'],
  properties: {
    businessId: { type: 'string', format: 'aidp-id' },
    serviceId: { type: 'string', format: 'aidp-id' },
    date: { type: 'string', format: 'date' },
    time: { type: 'string', format: 'time' },
    partySize: { type: 'integer', minimum: 1, maximum: 50 },
    customerInfo: {
      type: 'object',
      required: ['name', 'email'],
      properties: {
        name: { type: 'string', minLength: 1 },
        email: { type: 'string', format: 'email' },
        phone: { type: 'string', format: 'phone' }
      }
    },
    source: { type: 'string' }
  }
};

export const bookingResponseSchema = {
  $id: 'https://aidp.dev/schemas/booking-response.json',
  type: 'object',
  required: ['id', 'bookingId', 'businessId', 'status', 'confirmationCode'],
  properties: {
    id: { type: 'string', format: 'aidp-id' },
    bookingId: { type: 'string', format: 'aidp-id' },
    businessId: { type: 'string', format: 'aidp-id' },
    status: { type: 'string', enum: ['confirmed', 'pending', 'cancelled', 'completed'] },
    confirmationCode: { type: 'string' }
  }
};

export const reviewSchema = {
  $id: 'https://aidp.dev/schemas/review.json',
  type: 'object',
  required: ['id', 'businessId', 'rating', 'content', 'author', 'source'],
  properties: {
    id: { type: 'string', format: 'aidp-id' },
    businessId: { type: 'string', format: 'aidp-id' },
    rating: { type: 'integer', minimum: 1, maximum: 5 },
    content: { type: 'string', minLength: 10, maxLength: 5000 },
    author: {
      type: 'object',
      required: ['name', 'verified'],
      properties: {
        name: { type: 'string' },
        verified: { type: 'boolean' }
      }
    },
    source: { type: 'string' }
  }
};