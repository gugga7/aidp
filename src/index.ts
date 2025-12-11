/**
 * AIDP Protocol - The open protocol for AI-accessible local business data
 * 
 * This package provides TypeScript types, validation, and utilities for the
 * AI Discovery Protocol (AIDP), enabling standardized data exchange between
 * local businesses and AI assistants.
 * 
 * @version 1.0.0
 * @license MIT
 */

export * from './types';
export * from './validator';
export * from './utils';
export * from './mcp-tools';

// Re-export commonly used types for convenience
export type {
  BusinessProfile,
  BookingRequest,
  BookingResponse,
  Review,
  UpstreamMetrics,
  IntentJourney
} from './types';

// Version information
export const VERSION = '1.0.0';
export const PROTOCOL_VERSION = '1.0';

/**
 * AIDP Protocol constants
 */
export const AIDP = {
  VERSION: '1.0.0',
  PROTOCOL_VERSION: '1.0',
  SCHEMA_URL: 'https://schemas.aidp.dev/v1',
  DOCUMENTATION_URL: 'https://docs.aidp.dev',
  REPOSITORY_URL: 'https://github.com/gugga7/aidp'
} as const;