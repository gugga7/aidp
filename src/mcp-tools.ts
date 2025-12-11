/**
 * AIDP Protocol MCP Tools
 * 
 * Model Context Protocol (MCP) tool definitions for AIDP Protocol.
 * These tools enable AI assistants to interact with local business data
 * in a standardized way.
 */

import { MCPTool } from './types';

// Discovery Tools
const searchBusinessesTool: MCPTool = {
  name: 'search_businesses',
  description: 'Find businesses matching search criteria with location-based filtering and advanced options',
  inputSchema: {
    type: 'object',
    properties: {
      query: {
        type: 'string',
        description: 'Search query (e.g., "coffee shops", "italian restaurants")',
        required: true
      },
      location: {
        type: 'string',
        description: 'Location (e.g., "San Francisco, CA", "New York, NY")',
        required: true
      },
      category: {
        type: 'string',
        description: 'Business category filter',
        required: false
      },
      radius: {
        type: 'number',
        description: 'Search radius in miles (default: 5)',
        required: false,
        default: 5
      },
      limit: {
        type: 'number',
        description: 'Maximum number of results (default: 10, max: 50)',
        required: false,
        default: 10
      },
      sortBy: {
        type: 'string',
        description: 'Sort results by criteria',
        enum: ['relevance', 'rating', 'distance', 'price'],
        required: false,
        default: 'relevance'
      },
      filters: {
        type: 'object',
        description: 'Additional filters',
        properties: {
          priceRange: {
            type: 'string',
            description: 'Price range filter',
            enum: ['$', '$$', '$$$', '$$$$']
          },
          rating: {
            type: 'number',
            description: 'Minimum rating (1-5)'
          },
          openNow: {
            type: 'boolean',
            description: 'Only show businesses open now'
          },
          verified: {
            type: 'boolean',
            description: 'Only show verified businesses'
          }
        },
        required: false
      }
    },
    required: ['query', 'location']
  }
};

const getBusinessDetailsTool: MCPTool = {
  name: 'get_business_details',
  description: 'Get comprehensive details for a specific business including exclusive content',
  inputSchema: {
    type: 'object',
    properties: {
      businessId: {
        type: 'string',
        description: 'Unique business identifier',
        required: true
      },
      includeReviews: {
        type: 'boolean',
        description: 'Include recent reviews (default: false)',
        required: false,
        default: false
      },
      includeAvailability: {
        type: 'boolean',
        description: 'Include current availability (default: false)',
        required: false,
        default: false
      }
    },
    required: ['businessId']
  }
};

// Booking Tools
const checkAvailabilityTool: MCPTool = {
  name: 'check_availability',
  description: 'Check availability for a business service or time slot',
  inputSchema: {
    type: 'object',
    properties: {
      businessId: {
        type: 'string',
        description: 'Business identifier',
        required: true
      },
      serviceId: {
        type: 'string',
        description: 'Specific service ID (optional)',
        required: false
      },
      date: {
        type: 'string',
        description: 'Date in YYYY-MM-DD format',
        required: true
      },
      time: {
        type: 'string',
        description: 'Preferred time in HH:MM format (optional)',
        required: false
      },
      partySize: {
        type: 'number',
        description: 'Number of people (default: 1)',
        required: false,
        default: 1
      },
      duration: {
        type: 'number',
        description: 'Duration in minutes (optional)',
        required: false
      }
    },
    required: ['businessId', 'date']
  }
};

const createBookingTool: MCPTool = {
  name: 'create_booking',
  description: 'Create a new booking at a business',
  inputSchema: {
    type: 'object',
    properties: {
      businessId: {
        type: 'string',
        description: 'Business identifier',
        required: true
      },
      serviceId: {
        type: 'string',
        description: 'Service ID (optional)',
        required: false
      },
      date: {
        type: 'string',
        description: 'Date in YYYY-MM-DD format',
        required: true
      },
      time: {
        type: 'string',
        description: 'Time in HH:MM format',
        required: true
      },
      partySize: {
        type: 'number',
        description: 'Number of people',
        required: true
      },
      duration: {
        type: 'number',
        description: 'Duration in minutes (optional)',
        required: false
      },
      customer: {
        type: 'object',
        description: 'Customer information',
        properties: {
          name: {
            type: 'string',
            description: 'Customer name',
            required: true
          },
          email: {
            type: 'string',
            description: 'Customer email',
            required: true
          },
          phone: {
            type: 'string',
            description: 'Customer phone number',
            required: true
          },
          specialRequests: {
            type: 'string',
            description: 'Special requests or notes',
            required: false
          }
        },
        required: true
      },
      paymentMethod: {
        type: 'string',
        description: 'Payment method if deposit required',
        required: false
      }
    },
    required: ['businessId', 'date', 'time', 'partySize', 'customer']
  }
};

const getBookingTool: MCPTool = {
  name: 'get_booking',
  description: 'Retrieve booking details by confirmation code or booking ID',
  inputSchema: {
    type: 'object',
    properties: {
      bookingId: {
        type: 'string',
        description: 'Booking ID',
        required: false
      },
      confirmationCode: {
        type: 'string',
        description: 'Confirmation code',
        required: false
      },
      email: {
        type: 'string',
        description: 'Customer email for verification',
        required: false
      }
    },
    required: []
  }
};

// Social Tools
const getReviewsTool: MCPTool = {
  name: 'get_reviews',
  description: 'Get reviews and ratings for a business',
  inputSchema: {
    type: 'object',
    properties: {
      businessId: {
        type: 'string',
        description: 'Business identifier',
        required: true
      },
      limit: {
        type: 'number',
        description: 'Maximum reviews to return (default: 10, max: 50)',
        required: false,
        default: 10
      },
      sortBy: {
        type: 'string',
        description: 'Sort reviews by criteria',
        enum: ['newest', 'oldest', 'rating_high', 'rating_low'],
        required: false,
        default: 'newest'
      },
      rating: {
        type: 'number',
        description: 'Filter by rating (1-5)',
        required: false
      },
      verified: {
        type: 'boolean',
        description: 'Only verified reviews',
        required: false
      }
    },
    required: ['businessId']
  }
};

const compareBusinessesTool: MCPTool = {
  name: 'compare_businesses',
  description: 'Compare multiple businesses side by side',
  inputSchema: {
    type: 'object',
    properties: {
      businessIds: {
        type: 'array',
        description: 'Array of business IDs to compare (2-5 businesses)',
        items: {
          type: 'string',
          description: 'Business ID'
        },
        required: true
      },
      criteria: {
        type: 'array',
        description: 'Comparison criteria',
        items: {
          type: 'string',
          description: 'Comparison criterion',
          enum: ['rating', 'price', 'distance', 'reviews', 'amenities']
        },
        required: false,
        default: ['rating', 'price', 'distance']
      }
    },
    required: ['businessIds']
  }
};

// Lead Tools
const submitLeadTool: MCPTool = {
  name: 'submit_lead',
  description: 'Submit a lead or inquiry to a business',
  inputSchema: {
    type: 'object',
    properties: {
      businessId: {
        type: 'string',
        description: 'Business identifier',
        required: true
      },
      customer: {
        type: 'object',
        description: 'Customer information',
        properties: {
          name: {
            type: 'string',
            description: 'Customer name',
            required: true
          },
          email: {
            type: 'string',
            description: 'Customer email',
            required: true
          },
          phone: {
            type: 'string',
            description: 'Customer phone (optional)',
            required: false
          }
        },
        required: true
      },
      inquiry: {
        type: 'object',
        description: 'Inquiry details',
        properties: {
          type: {
            type: 'string',
            description: 'Type of inquiry',
            enum: ['general', 'booking', 'catering', 'event', 'pricing'],
            required: true
          },
          subject: {
            type: 'string',
            description: 'Inquiry subject',
            required: true
          },
          message: {
            type: 'string',
            description: 'Detailed message',
            required: true
          },
          preferredContact: {
            type: 'string',
            description: 'Preferred contact method',
            enum: ['email', 'phone', 'either'],
            required: false,
            default: 'email'
          }
        },
        required: true
      },
      context: {
        type: 'object',
        description: 'Additional context',
        properties: {
          source: {
            type: 'string',
            description: 'Where the lead came from',
            required: false
          },
          urgency: {
            type: 'string',
            description: 'Urgency level',
            enum: ['low', 'medium', 'high'],
            required: false,
            default: 'medium'
          }
        },
        required: false
      }
    },
    required: ['businessId', 'customer', 'inquiry']
  }
};

// MCP Tools Collection
export class MCPTools {
  static getAllTools(): MCPTool[] {
    return [
      searchBusinessesTool,
      getBusinessDetailsTool,
      checkAvailabilityTool,
      createBookingTool,
      getBookingTool,
      getReviewsTool,
      compareBusinessesTool,
      submitLeadTool
    ];
  }

  static getDiscoveryTools(): MCPTool[] {
    return [searchBusinessesTool, getBusinessDetailsTool];
  }

  static getBookingTools(): MCPTool[] {
    return [checkAvailabilityTool, createBookingTool, getBookingTool];
  }

  static getSocialTools(): MCPTool[] {
    return [getReviewsTool, compareBusinessesTool];
  }

  static getLeadTools(): MCPTool[] {
    return [submitLeadTool];
  }

  static getToolByName(name: string): MCPTool | undefined {
    return this.getAllTools().find(tool => tool.name === name);
  }

  // Individual tool getters for convenience
  static getSearchBusinessesTool(): MCPTool {
    return searchBusinessesTool;
  }

  static getGetBusinessDetailsTool(): MCPTool {
    return getBusinessDetailsTool;
  }

  static getCheckAvailabilityTool(): MCPTool {
    return checkAvailabilityTool;
  }

  static getCreateBookingTool(): MCPTool {
    return createBookingTool;
  }

  static getGetBookingTool(): MCPTool {
    return getBookingTool;
  }

  static getGetReviewsTool(): MCPTool {
    return getReviewsTool;
  }

  static getCompareBusinessesTool(): MCPTool {
    return compareBusinessesTool;
  }

  static getSubmitLeadTool(): MCPTool {
    return submitLeadTool;
  }
}

// Export individual tools for convenience
export {
  searchBusinessesTool,
  getBusinessDetailsTool,
  checkAvailabilityTool,
  createBookingTool,
  getBookingTool,
  getReviewsTool,
  compareBusinessesTool,
  submitLeadTool
};