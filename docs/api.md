# ClaimSnap AI API Documentation

This document provides comprehensive documentation for the ClaimSnap AI API, including endpoints, request/response formats, authentication requirements, and error codes.

## Authentication

All API requests require authentication using a JWT token. The token should be included in the `Authorization` header of each request.

```
Authorization: Bearer <your_jwt_token>
```

### Obtaining a Token

To obtain a JWT token, you need to authenticate using your email and password:

```
POST /auth/login
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "your_password"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user_123",
    "email": "user@example.com",
    "subscription_tier": "pro"
  }
}
```

## API Endpoints

### User Management

#### Get User Profile

```
GET /api/users/profile
```

**Response:**
```json
{
  "id": "user_123",
  "email": "user@example.com",
  "subscription_tier": "pro",
  "monthly_quota": 500,
  "used_quota": 127,
  "created_at": "2024-01-15T00:00:00.000Z",
  "notification_settings": {
    "email_notifications": true,
    "analysis_complete": true,
    "monthly_reports": true,
    "product_updates": false
  },
  "display_settings": {
    "theme": "light",
    "gallery_view": "grid",
    "items_per_page": 12
  }
}
```

#### Update User Profile

```
PATCH /api/users/profile
```

**Request Body:**
```json
{
  "notification_settings": {
    "email_notifications": true,
    "analysis_complete": false
  }
}
```

**Response:**
```json
{
  "id": "user_123",
  "email": "user@example.com",
  "notification_settings": {
    "email_notifications": true,
    "analysis_complete": false,
    "monthly_reports": true,
    "product_updates": false
  }
}
```

### Claims Management

#### Create a Claim

```
POST /api/claims
```

**Request Body:**
```json
{
  "claim_number": "INS-12345",
  "description": "Vehicle damage from accident",
  "incident_date": "2024-01-10",
  "policy_number": "POL-67890",
  "claim_type": "vehicle"
}
```

**Response:**
```json
{
  "claim_id": "claim_123",
  "claim_number": "INS-12345",
  "user_id": "user_123",
  "description": "Vehicle damage from accident",
  "incident_date": "2024-01-10",
  "policy_number": "POL-67890",
  "claim_type": "vehicle",
  "status": "pending",
  "created_at": "2024-01-15T00:00:00.000Z",
  "updated_at": "2024-01-15T00:00:00.000Z"
}
```

#### Get All Claims

```
GET /api/claims
```

**Query Parameters:**
- `limit` (optional): Number of claims to return (default: 10)
- `offset` (optional): Offset for pagination (default: 0)
- `sort_by` (optional): Field to sort by (default: "created_at")
- `sort_order` (optional): Sort order, "asc" or "desc" (default: "desc")

**Response:**
```json
{
  "claims": [
    {
      "claim_id": "claim_123",
      "claim_number": "INS-12345",
      "status": "pending",
      "claim_type": "vehicle",
      "created_at": "2024-01-15T00:00:00.000Z",
      "photo_count": 3
    },
    {
      "claim_id": "claim_124",
      "claim_number": "INS-67890",
      "status": "approved",
      "claim_type": "property",
      "created_at": "2024-01-10T00:00:00.000Z",
      "photo_count": 5
    }
  ],
  "total": 2
}
```

#### Get Claim by ID

```
GET /api/claims/:claim_id
```

**Response:**
```json
{
  "claim_id": "claim_123",
  "claim_number": "INS-12345",
  "user_id": "user_123",
  "description": "Vehicle damage from accident",
  "incident_date": "2024-01-10",
  "policy_number": "POL-67890",
  "claim_type": "vehicle",
  "status": "pending",
  "created_at": "2024-01-15T00:00:00.000Z",
  "updated_at": "2024-01-15T00:00:00.000Z"
}
```

#### Update Claim

```
PATCH /api/claims/:claim_id
```

**Request Body:**
```json
{
  "status": "approved",
  "description": "Updated description"
}
```

**Response:**
```json
{
  "claim_id": "claim_123",
  "claim_number": "INS-12345",
  "status": "approved",
  "description": "Updated description",
  "updated_at": "2024-01-16T00:00:00.000Z"
}
```

#### Delete Claim

```
DELETE /api/claims/:claim_id
```

**Response:**
```json
{
  "success": true,
  "message": "Claim deleted successfully"
}
```

#### Get Claim Statistics

```
GET /api/claims/statistics
```

**Response:**
```json
{
  "total_claims": 34,
  "pending_claims": 12,
  "approved_claims": 18,
  "rejected_claims": 4,
  "average_processing_time": 2.3
}
```

### Photo Management

#### Upload Photo

```
POST /api/photos
```

**Request Body:**
- `file`: The photo file (multipart/form-data)
- `claim_id`: The ID of the claim to associate the photo with

**Response:**
```json
{
  "photo_id": "photo_123",
  "claim_id": "claim_123",
  "user_id": "user_123",
  "image_url": "https://example.com/photos/user_123/claim_123/photo_123.jpg",
  "original_file_name": "car_damage_001.jpg",
  "detected_damage_types": ["Dent", "Scratch", "Paint Damage"],
  "object_category": "Vehicle",
  "scene_context": "Outdoor, Clear Weather",
  "analysis_results": {
    "damage_types": ["Dent", "Scratch", "Paint Damage"],
    "object_category": "Vehicle",
    "scene_context": "Outdoor, Clear Weather",
    "confidence": 94
  },
  "uploaded_at": "2024-01-15T00:00:00.000Z"
}
```

#### Get All Photos

```
GET /api/photos
```

**Query Parameters:**
- `limit` (optional): Number of photos to return (default: 10)
- `offset` (optional): Offset for pagination (default: 0)
- `sort_by` (optional): Field to sort by (default: "uploaded_at")
- `sort_order` (optional): Sort order, "asc" or "desc" (default: "desc")
- `object_category` (optional): Filter by object category
- `damage_type` (optional): Filter by damage type
- `search` (optional): Search term for file name or damage types

**Response:**
```json
{
  "photos": [
    {
      "photo_id": "photo_123",
      "claim_id": "claim_123",
      "image_url": "https://example.com/photos/user_123/claim_123/photo_123.jpg",
      "original_file_name": "car_damage_001.jpg",
      "detected_damage_types": ["Dent", "Scratch", "Paint Damage"],
      "object_category": "Vehicle",
      "scene_context": "Outdoor, Clear Weather",
      "uploaded_at": "2024-01-15T00:00:00.000Z"
    },
    {
      "photo_id": "photo_124",
      "claim_id": "claim_123",
      "image_url": "https://example.com/photos/user_123/claim_123/photo_124.jpg",
      "original_file_name": "vehicle_collision.jpg",
      "detected_damage_types": ["Impact Damage", "Glass Damage"],
      "object_category": "Vehicle",
      "scene_context": "Outdoor, Overcast",
      "uploaded_at": "2024-01-14T00:00:00.000Z"
    }
  ],
  "total": 2
}
```

#### Get Photos by Claim ID

```
GET /api/claims/:claim_id/photos
```

**Response:**
```json
{
  "photos": [
    {
      "photo_id": "photo_123",
      "claim_id": "claim_123",
      "image_url": "https://example.com/photos/user_123/claim_123/photo_123.jpg",
      "original_file_name": "car_damage_001.jpg",
      "detected_damage_types": ["Dent", "Scratch", "Paint Damage"],
      "object_category": "Vehicle",
      "scene_context": "Outdoor, Clear Weather",
      "uploaded_at": "2024-01-15T00:00:00.000Z"
    },
    {
      "photo_id": "photo_124",
      "claim_id": "claim_123",
      "image_url": "https://example.com/photos/user_123/claim_123/photo_124.jpg",
      "original_file_name": "vehicle_collision.jpg",
      "detected_damage_types": ["Impact Damage", "Glass Damage"],
      "object_category": "Vehicle",
      "scene_context": "Outdoor, Overcast",
      "uploaded_at": "2024-01-14T00:00:00.000Z"
    }
  ]
}
```

#### Get Photo by ID

```
GET /api/photos/:photo_id
```

**Response:**
```json
{
  "photo_id": "photo_123",
  "claim_id": "claim_123",
  "user_id": "user_123",
  "image_url": "https://example.com/photos/user_123/claim_123/photo_123.jpg",
  "original_file_name": "car_damage_001.jpg",
  "detected_damage_types": ["Dent", "Scratch", "Paint Damage"],
  "object_category": "Vehicle",
  "scene_context": "Outdoor, Clear Weather",
  "analysis_results": {
    "damage_types": ["Dent", "Scratch", "Paint Damage"],
    "object_category": "Vehicle",
    "scene_context": "Outdoor, Clear Weather",
    "confidence": 94
  },
  "uploaded_at": "2024-01-15T00:00:00.000Z"
}
```

#### Delete Photo

```
DELETE /api/photos/:photo_id
```

**Response:**
```json
{
  "success": true,
  "message": "Photo deleted successfully"
}
```

#### Get Photo Statistics

```
GET /api/photos/statistics
```

**Response:**
```json
{
  "total_photos": 127,
  "by_object_category": {
    "Vehicle": 78,
    "Property": 42,
    "Item": 7
  },
  "by_damage_type": {
    "Dent": 45,
    "Scratch": 38,
    "Water Damage": 22,
    "Glass Damage": 15,
    "Fire Damage": 7
  },
  "average_confidence": 91.2
}
```

### Subscription Management

#### Get Current Subscription

```
GET /api/subscriptions/current
```

**Response:**
```json
{
  "id": "sub_123",
  "status": "active",
  "plan": {
    "id": "price_pro",
    "name": "Pro",
    "amount": 4900,
    "interval": "month"
  },
  "current_period_end": 1707955200,
  "cancel_at_period_end": false
}
```

#### Create Checkout Session

```
POST /api/subscriptions/checkout
```

**Request Body:**
```json
{
  "price_id": "price_pro",
  "success_url": "https://example.com/success",
  "cancel_url": "https://example.com/cancel"
}
```

**Response:**
```json
{
  "session_id": "cs_123",
  "url": "https://checkout.stripe.com/c/pay/cs_123"
}
```

#### Cancel Subscription

```
POST /api/subscriptions/cancel
```

**Response:**
```json
{
  "success": true,
  "message": "Subscription will be canceled at the end of the billing period"
}
```

#### Get Billing History

```
GET /api/subscriptions/billing-history
```

**Response:**
```json
{
  "invoices": [
    {
      "id": "in_123",
      "amount": 4900,
      "status": "paid",
      "created": 1705276800,
      "period_start": 1702684800,
      "period_end": 1705276800,
      "plan": "Pro"
    },
    {
      "id": "in_124",
      "amount": 4900,
      "status": "paid",
      "created": 1702684800,
      "period_start": 1700006400,
      "period_end": 1702684800,
      "plan": "Pro"
    }
  ]
}
```

## Error Codes

The API uses standard HTTP status codes to indicate the success or failure of a request. In addition, error responses include a JSON object with more details about the error.

```json
{
  "error": {
    "code": "invalid_request",
    "message": "The request was invalid",
    "details": "Claim number is required"
  }
}
```

### Common Error Codes

| Status Code | Error Code | Description |
|-------------|------------|-------------|
| 400 | invalid_request | The request was invalid |
| 401 | unauthorized | Authentication is required |
| 403 | forbidden | The user does not have permission to access the resource |
| 404 | not_found | The requested resource was not found |
| 409 | conflict | The request conflicts with the current state of the resource |
| 422 | validation_failed | The request failed validation |
| 429 | rate_limit_exceeded | The user has sent too many requests |
| 500 | server_error | An error occurred on the server |

## Rate Limiting

The API implements rate limiting to prevent abuse. Rate limits are based on the user's subscription tier:

- Free: 100 requests per hour
- Pro: 1,000 requests per hour
- Business: 10,000 requests per hour

When a rate limit is exceeded, the API returns a 429 Too Many Requests response with a Retry-After header indicating how long to wait before making another request.

## Webhooks

ClaimSnap AI provides webhooks for real-time notifications of events. To receive webhooks, you need to register a webhook URL in your account settings.

### Webhook Events

| Event | Description |
|-------|-------------|
| claim.created | A new claim was created |
| claim.updated | A claim was updated |
| claim.deleted | A claim was deleted |
| photo.uploaded | A new photo was uploaded |
| photo.analyzed | A photo was analyzed |
| subscription.created | A new subscription was created |
| subscription.updated | A subscription was updated |
| subscription.canceled | A subscription was canceled |

### Webhook Payload

```json
{
  "event": "photo.analyzed",
  "created_at": "2024-01-15T00:00:00.000Z",
  "data": {
    "photo_id": "photo_123",
    "claim_id": "claim_123",
    "user_id": "user_123",
    "detected_damage_types": ["Dent", "Scratch", "Paint Damage"],
    "object_category": "Vehicle",
    "scene_context": "Outdoor, Clear Weather",
    "confidence": 94
  }
}
```

## API Versioning

The API is versioned to ensure backward compatibility. The current version is v1. You can specify the API version in the URL:

```
https://api.claimsnap.ai/v1/claims
```

## SDK Support

ClaimSnap AI provides official SDKs for the following languages:

- JavaScript/TypeScript
- Python
- Ruby
- PHP
- Java

For more information, visit the [SDK documentation](https://docs.claimsnap.ai/sdks).

