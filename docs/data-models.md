# ClaimSnap AI Data Models

This document describes the data models used in the ClaimSnap AI application, including their attributes, relationships, and constraints.

## User

The User model represents a registered user of the application.

### Attributes

| Attribute | Type | Description | Constraints |
|-----------|------|-------------|------------|
| id | UUID | Unique identifier for the user | Primary key |
| email | String | User's email address | Unique, Required |
| subscription_tier | String | User's subscription tier (free, pro, business) | Required, Default: 'free' |
| monthly_quota | Integer | Number of photos allowed per month | Required, Default: 50 |
| used_quota | Integer | Number of photos used in the current month | Required, Default: 0 |
| notification_settings | JSON | User's notification preferences | Optional |
| display_settings | JSON | User's display preferences | Optional |
| created_at | Timestamp | When the user was created | Required |
| updated_at | Timestamp | When the user was last updated | Required |

### Relationships

- Has many Claims
- Has many Photos (through Claims)

### Example

```json
{
  "id": "user_123",
  "email": "user@example.com",
  "subscription_tier": "pro",
  "monthly_quota": 500,
  "used_quota": 127,
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
  },
  "created_at": "2024-01-15T00:00:00.000Z",
  "updated_at": "2024-01-15T00:00:00.000Z"
}
```

## Claim

The Claim model represents an insurance claim created by a user.

### Attributes

| Attribute | Type | Description | Constraints |
|-----------|------|-------------|------------|
| id | UUID | Unique identifier for the claim | Primary key |
| user_id | UUID | ID of the user who created the claim | Foreign key, Required |
| claim_number | String | Unique claim number | Required |
| description | Text | Description of the claim | Optional |
| incident_date | Date | Date of the incident | Optional |
| policy_number | String | Insurance policy number | Optional |
| claim_type | String | Type of claim (vehicle, property, personal, other) | Required |
| status | String | Status of the claim (pending, approved, rejected) | Required, Default: 'pending' |
| created_at | Timestamp | When the claim was created | Required |
| updated_at | Timestamp | When the claim was last updated | Required |

### Relationships

- Belongs to User
- Has many Photos

### Example

```json
{
  "id": "claim_123",
  "user_id": "user_123",
  "claim_number": "INS-12345",
  "description": "Vehicle damage from accident",
  "incident_date": "2024-01-10",
  "policy_number": "POL-67890",
  "claim_type": "vehicle",
  "status": "pending",
  "created_at": "2024-01-15T00:00:00.000Z",
  "updated_at": "2024-01-15T00:00:00.000Z"
}
```

## Photo

The Photo model represents a photo uploaded for a claim.

### Attributes

| Attribute | Type | Description | Constraints |
|-----------|------|-------------|------------|
| id | UUID | Unique identifier for the photo | Primary key |
| claim_id | UUID | ID of the claim the photo belongs to | Foreign key, Required |
| user_id | UUID | ID of the user who uploaded the photo | Foreign key, Required |
| image_url | String | URL of the photo | Required |
| storage_path | String | Path to the photo in storage | Required |
| original_file_name | String | Original file name of the photo | Required |
| detected_damage_types | Array | Types of damage detected in the photo | Optional |
| object_category | String | Category of the object in the photo | Optional |
| scene_context | String | Context of the scene in the photo | Optional |
| analysis_results | JSON | Full results of the AI analysis | Optional |
| uploaded_at | Timestamp | When the photo was uploaded | Required |

### Relationships

- Belongs to Claim
- Belongs to User (through Claim)

### Example

```json
{
  "id": "photo_123",
  "claim_id": "claim_123",
  "user_id": "user_123",
  "image_url": "https://example.com/photos/user_123/claim_123/photo_123.jpg",
  "storage_path": "photos/user_123/claim_123/photo_123.jpg",
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

## Subscription

The Subscription model represents a user's subscription to the service.

### Attributes

| Attribute | Type | Description | Constraints |
|-----------|------|-------------|------------|
| id | String | Unique identifier for the subscription | Primary key |
| user_id | UUID | ID of the user who owns the subscription | Foreign key, Required |
| stripe_customer_id | String | Stripe customer ID | Required |
| stripe_subscription_id | String | Stripe subscription ID | Required |
| plan_id | String | ID of the subscription plan | Required |
| status | String | Status of the subscription (active, canceled, past_due) | Required |
| current_period_start | Timestamp | Start of the current billing period | Required |
| current_period_end | Timestamp | End of the current billing period | Required |
| cancel_at_period_end | Boolean | Whether the subscription will be canceled at the end of the period | Required, Default: false |
| created_at | Timestamp | When the subscription was created | Required |
| updated_at | Timestamp | When the subscription was last updated | Required |

### Relationships

- Belongs to User

### Example

```json
{
  "id": "sub_123",
  "user_id": "user_123",
  "stripe_customer_id": "cus_123",
  "stripe_subscription_id": "sub_123",
  "plan_id": "price_pro",
  "status": "active",
  "current_period_start": "2024-01-15T00:00:00.000Z",
  "current_period_end": "2024-02-15T00:00:00.000Z",
  "cancel_at_period_end": false,
  "created_at": "2024-01-15T00:00:00.000Z",
  "updated_at": "2024-01-15T00:00:00.000Z"
}
```

## Invoice

The Invoice model represents a billing invoice for a subscription.

### Attributes

| Attribute | Type | Description | Constraints |
|-----------|------|-------------|------------|
| id | String | Unique identifier for the invoice | Primary key |
| user_id | UUID | ID of the user who owns the invoice | Foreign key, Required |
| subscription_id | String | ID of the subscription | Foreign key, Required |
| stripe_invoice_id | String | Stripe invoice ID | Required |
| amount | Integer | Amount in cents | Required |
| status | String | Status of the invoice (paid, open, void) | Required |
| period_start | Timestamp | Start of the billing period | Required |
| period_end | Timestamp | End of the billing period | Required |
| created_at | Timestamp | When the invoice was created | Required |
| updated_at | Timestamp | When the invoice was last updated | Required |

### Relationships

- Belongs to User
- Belongs to Subscription

### Example

```json
{
  "id": "inv_123",
  "user_id": "user_123",
  "subscription_id": "sub_123",
  "stripe_invoice_id": "in_123",
  "amount": 4900,
  "status": "paid",
  "period_start": "2024-01-15T00:00:00.000Z",
  "period_end": "2024-02-15T00:00:00.000Z",
  "created_at": "2024-01-15T00:00:00.000Z",
  "updated_at": "2024-01-15T00:00:00.000Z"
}
```

## Database Schema

The following diagram shows the relationships between the different models:

```
User
  |
  |-- Claim
  |     |
  |     |-- Photo
  |
  |-- Subscription
        |
        |-- Invoice
```

## Database Indexes

To optimize query performance, the following indexes are recommended:

### User Table
- Primary Key: `id`
- Unique Index: `email`

### Claim Table
- Primary Key: `id`
- Index: `user_id`
- Unique Index: `claim_number`
- Index: `status`
- Index: `created_at`

### Photo Table
- Primary Key: `id`
- Index: `claim_id`
- Index: `user_id`
- Index: `uploaded_at`
- Index: `object_category`

### Subscription Table
- Primary Key: `id`
- Index: `user_id`
- Index: `status`
- Index: `current_period_end`

### Invoice Table
- Primary Key: `id`
- Index: `user_id`
- Index: `subscription_id`
- Index: `created_at`

## Data Validation Rules

### User
- Email must be a valid email format
- Subscription tier must be one of: 'free', 'pro', 'business'
- Monthly quota must be a positive integer
- Used quota must be a non-negative integer

### Claim
- Claim number must be unique
- Claim type must be one of: 'vehicle', 'property', 'personal', 'other'
- Status must be one of: 'pending', 'approved', 'rejected'
- Incident date must be a valid date

### Photo
- Image URL must be a valid URL
- Storage path must be a valid path
- Detected damage types must be an array of strings
- Object category must be a string
- Scene context must be a string
- Analysis results must be a valid JSON object

### Subscription
- Status must be one of: 'active', 'canceled', 'past_due'
- Current period start must be a valid date
- Current period end must be a valid date
- Cancel at period end must be a boolean

### Invoice
- Amount must be a positive integer
- Status must be one of: 'paid', 'open', 'void'
- Period start must be a valid date
- Period end must be a valid date

## Data Migration Strategies

When making changes to the data models, the following migration strategies are recommended:

1. **Adding a new field**: Add the field with a default value to ensure backward compatibility
2. **Removing a field**: First mark the field as deprecated, then remove it in a future release
3. **Changing a field type**: Create a new field with the new type, migrate data, then remove the old field
4. **Renaming a field**: Create a new field with the new name, migrate data, then remove the old field

## Data Security

To ensure data security, the following measures are implemented:

1. **Encryption**: Sensitive data is encrypted at rest and in transit
2. **Access Control**: Row-level security policies restrict access to data based on user ID
3. **Audit Logs**: All data modifications are logged for audit purposes
4. **Backups**: Regular backups are performed to prevent data loss
5. **Data Retention**: Data is retained according to the data retention policy

## Data Retention Policy

- User data is retained as long as the user has an active account
- Deleted user data is retained for 30 days before permanent deletion
- Claim data is retained for 7 years after the claim is closed
- Photo data is retained for 7 years after the claim is closed
- Subscription data is retained for 7 years after the subscription is canceled
- Invoice data is retained for 7 years after the invoice is paid

