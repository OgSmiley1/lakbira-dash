# La Kbira API Documentation

**Version:** 1.0  
**Base URL:** `https://api.lakbira.ae`  
**Authentication:** OAuth 2.0 / JWT  
**Author:** Manus AI

---

## Table of Contents

1. [Authentication](#authentication)
2. [Products API](#products-api)
3. [Collections API](#collections-api)
4. [Orders API](#orders-api)
5. [Clients API](#clients-api)
6. [Admin API](#admin-api)
7. [AI Integration API](#ai-integration-api)
8. [Error Handling](#error-handling)
9. [Rate Limiting](#rate-limiting)
10. [Examples](#examples)

---

## Authentication

### OAuth 2.0 Flow

All API requests require authentication using OAuth 2.0:

```
Authorization: Bearer {access_token}
```

### Getting an Access Token

**Endpoint:** `POST /auth/token`

**Request:**
```json
{
  "client_id": "your_client_id",
  "client_secret": "your_client_secret",
  "grant_type": "client_credentials"
}
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "token_type": "Bearer",
  "expires_in": 3600
}
```

### JWT Token Structure

The JWT token contains the following claims:

| Claim | Description |
|-------|-------------|
| `sub` | User ID |
| `email` | User email |
| `role` | User role (user, admin) |
| `iat` | Token issued at timestamp |
| `exp` | Token expiration timestamp |

---

## Products API

### Get All Products

**Endpoint:** `GET /api/products`

**Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `limit` | integer | No | Max results (default: 20) |
| `offset` | integer | No | Pagination offset (default: 0) |
| `collection` | string | No | Filter by collection ID |
| `featured` | boolean | No | Filter featured products |

**Response:**
```json
{
  "data": [
    {
      "id": "prod_001",
      "nameEn": "Royal Blue Kaftan",
      "nameAr": "قفطان أزرق ملكي",
      "descriptionEn": "Handcrafted luxury kaftan...",
      "descriptionAr": "قفطان فاخر مصنوع يدويًا...",
      "basePrice": 1500,
      "fabricEn": "Premium silk",
      "fabricAr": "حرير فاخر",
      "collectionId": "col_001",
      "isFeatured": true,
      "createdAt": "2024-10-01T10:00:00Z"
    }
  ],
  "total": 45,
  "limit": 20,
  "offset": 0
}
```

### Get Product by ID

**Endpoint:** `GET /api/products/{id}`

**Response:**
```json
{
  "id": "prod_001",
  "nameEn": "Royal Blue Kaftan",
  "nameAr": "قفطان أزرق ملكي",
  "descriptionEn": "Handcrafted luxury kaftan...",
  "basePrice": 1500,
  "fabricEn": "Premium silk",
  "collectionId": "col_001",
  "colors": ["blue", "navy", "turquoise"],
  "sizes": ["XS", "S", "M", "L", "XL", "XXL"],
  "customizable": true,
  "createdAt": "2024-10-01T10:00:00Z"
}
```

---

## Collections API

### Get All Collections

**Endpoint:** `GET /api/collections`

**Response:**
```json
{
  "data": [
    {
      "id": "col_001",
      "nameEn": "Ramadan Eid Collection 2024",
      "nameAr": "مجموعة عيد رمضان 2024",
      "descriptionEn": "Handcrafted luxury kaftans...",
      "storyEn": "This collection celebrates...",
      "coverImage": "https://cdn.lakbira.ae/col_001_cover.jpg",
      "videoUrl": "https://video.lakbira.ae/col_001.mp4",
      "isActive": true,
      "createdAt": "2024-10-01T10:00:00Z"
    }
  ],
  "total": 8
}
```

### Get Collection by ID

**Endpoint:** `GET /api/collections/{id}`

**Response:**
```json
{
  "id": "col_001",
  "nameEn": "Ramadan Eid Collection 2024",
  "nameAr": "مجموعة عيد رمضان 2024",
  "descriptionEn": "Handcrafted luxury kaftans...",
  "descriptionAr": "قفاطين فاخرة مصنوعة يدويًا...",
  "storyEn": "This collection celebrates...",
  "storyAr": "تحتفل هذه المجموعة...",
  "coverImage": "https://cdn.lakbira.ae/col_001_cover.jpg",
  "videoUrl": "https://video.lakbira.ae/col_001.mp4",
  "isActive": true,
  "products": [
    {
      "id": "prod_001",
      "nameEn": "Royal Blue Kaftan",
      "basePrice": 1500
    }
  ],
  "createdAt": "2024-10-01T10:00:00Z"
}
```

---

## Orders API

### Create Order

**Endpoint:** `POST /api/orders`

**Request:**
```json
{
  "productId": "prod_001",
  "customerId": "cust_001",
  "selectedColor": "blue",
  "selectedSize": "M",
  "customMeasurements": {
    "chest": 95,
    "waist": 85,
    "length": 140
  },
  "quantity": 1,
  "totalPrice": 1500,
  "notes": "Please ensure perfect fit"
}
```

**Response:**
```json
{
  "id": "ord_001",
  "productId": "prod_001",
  "customerId": "cust_001",
  "status": "pending",
  "totalPrice": 1500,
  "createdAt": "2024-10-15T14:30:00Z",
  "updatedAt": "2024-10-15T14:30:00Z"
}
```

### Get Orders

**Endpoint:** `GET /api/orders`

**Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `status` | string | No | Filter by status |
| `customerId` | string | No | Filter by customer |
| `limit` | integer | No | Max results |
| `offset` | integer | No | Pagination offset |

**Response:**
```json
{
  "data": [
    {
      "id": "ord_001",
      "productId": "prod_001",
      "customerId": "cust_001",
      "status": "pending",
      "totalPrice": 1500,
      "createdAt": "2024-10-15T14:30:00Z"
    }
  ],
  "total": 42,
  "limit": 20,
  "offset": 0
}
```

### Get Order by ID

**Endpoint:** `GET /api/orders/{id}`

**Response:**
```json
{
  "id": "ord_001",
  "productId": "prod_001",
  "customerId": "cust_001",
  "status": "pending",
  "selectedColor": "blue",
  "selectedSize": "M",
  "customMeasurements": {
    "chest": 95,
    "waist": 85,
    "length": 140
  },
  "totalPrice": 1500,
  "notes": "Please ensure perfect fit",
  "createdAt": "2024-10-15T14:30:00Z",
  "updatedAt": "2024-10-15T14:30:00Z"
}
```

### Update Order Status

**Endpoint:** `PUT /api/orders/{id}/status`

**Request:**
```json
{
  "status": "approved",
  "adminNotes": "Order approved for production"
}
```

**Response:**
```json
{
  "id": "ord_001",
  "status": "approved",
  "adminNotes": "Order approved for production",
  "updatedAt": "2024-10-15T15:00:00Z"
}
```

### Approve Order

**Endpoint:** `POST /api/orders/{id}/approve`

**Request:**
```json
{
  "adminNotes": "Ready for production"
}
```

**Response:**
```json
{
  "id": "ord_001",
  "status": "approved",
  "updatedAt": "2024-10-15T15:00:00Z"
}
```

### Reject Order

**Endpoint:** `POST /api/orders/{id}/reject`

**Request:**
```json
{
  "reason": "Out of stock for selected color"
}
```

**Response:**
```json
{
  "id": "ord_001",
  "status": "rejected",
  "rejectionReason": "Out of stock for selected color",
  "updatedAt": "2024-10-15T15:00:00Z"
}
```

---

## Clients API

### Get All Clients

**Endpoint:** `GET /api/clients` (Admin only)

**Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `limit` | integer | No | Max results |
| `offset` | integer | No | Pagination offset |
| `search` | string | No | Search by name/email |

**Response:**
```json
{
  "data": [
    {
      "id": "cust_001",
      "name": "Fatima Al Mansouri",
      "email": "fatima@example.com",
      "phone": "+971501234567",
      "city": "Dubai",
      "country": "UAE",
      "memberSince": "2024-01-15T10:00:00Z",
      "totalOrders": 5,
      "totalSpent": 7500
    }
  ],
  "total": 156,
  "limit": 20,
  "offset": 0
}
```

### Get Client by ID

**Endpoint:** `GET /api/clients/{id}`

**Response:**
```json
{
  "id": "cust_001",
  "name": "Fatima Al Mansouri",
  "email": "fatima@example.com",
  "phone": "+971501234567",
  "city": "Dubai",
  "country": "UAE",
  "memberSince": "2024-01-15T10:00:00Z",
  "totalOrders": 5,
  "totalSpent": 7500,
  "orders": [
    {
      "id": "ord_001",
      "status": "delivered",
      "totalPrice": 1500,
      "createdAt": "2024-10-15T14:30:00Z"
    }
  ]
}
```

---

## Admin API

### Get Dashboard Statistics

**Endpoint:** `GET /api/admin/stats` (Admin only)

**Response:**
```json
{
  "totalOrders": 156,
  "pendingOrders": 12,
  "approvedOrders": 89,
  "totalClients": 45,
  "totalRevenue": 234000,
  "averageOrderValue": 1500
}
```

### Get Audit Logs

**Endpoint:** `GET /api/admin/audit-logs` (Admin only)

**Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `action` | string | No | Filter by action |
| `entityType` | string | No | Filter by entity type |
| `userId` | string | No | Filter by user |
| `startDate` | string | No | ISO date format |
| `endDate` | string | No | ISO date format |

**Response:**
```json
{
  "data": [
    {
      "id": "audit_001",
      "userId": "admin_001",
      "action": "order_approved",
      "entityType": "order",
      "entityId": "ord_001",
      "status": "success",
      "timestamp": "2024-10-15T15:00:00Z",
      "ipAddress": "192.168.1.1",
      "changes": {
        "status": ["pending", "approved"]
      }
    }
  ],
  "total": 234
}
```

---

## AI Integration API

### Analyze Market Trends

**Endpoint:** `GET /api/ai/market-trends` (Admin only)

**Response:**
```json
{
  "trends": [
    "Increasing demand for sustainable fabrics",
    "Growing interest in custom tailoring"
  ],
  "opportunities": [
    "Launch eco-friendly collection",
    "Expand custom tailoring services"
  ],
  "threats": [
    "Increased competition from fast fashion",
    "Supply chain disruptions"
  ]
}
```

### Get System Health

**Endpoint:** `GET /api/ai/health`

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2024-10-15T15:00:00Z",
  "components": {
    "database": "healthy",
    "api": "healthy",
    "storage": "healthy",
    "cache": "healthy"
  },
  "metrics": {
    "uptime": 99.9,
    "responseTime": 145,
    "requestsPerSecond": 234
  }
}
```

### Process Order with AI

**Endpoint:** `POST /api/ai/process-order`

**Request:**
```json
{
  "orderId": "ord_001",
  "orderData": {
    "totalPrice": 1500,
    "customMeasurements": true,
    "isVip": false
  }
}
```

**Response:**
```json
{
  "priority": "normal",
  "estimatedDays": 14,
  "recommendations": [
    "Schedule fitting appointment",
    "Offer free shipping"
  ]
}
```

---

## Error Handling

### Error Response Format

All errors follow this format:

```json
{
  "error": {
    "code": "INVALID_REQUEST",
    "message": "Invalid request parameters",
    "details": {
      "field": "email",
      "issue": "Invalid email format"
    }
  }
}
```

### Common Error Codes

| Code | Status | Description |
|------|--------|-------------|
| `UNAUTHORIZED` | 401 | Missing or invalid authentication |
| `FORBIDDEN` | 403 | Insufficient permissions |
| `NOT_FOUND` | 404 | Resource not found |
| `INVALID_REQUEST` | 400 | Invalid request parameters |
| `CONFLICT` | 409 | Resource already exists |
| `RATE_LIMITED` | 429 | Too many requests |
| `SERVER_ERROR` | 500 | Internal server error |

---

## Rate Limiting

### Rate Limit Headers

All responses include rate limit information:

```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1634321400
```

### Rate Limits

| Endpoint | Limit | Window |
|----------|-------|--------|
| **Public** | 100 req/min | Per IP |
| **Authenticated** | 1000 req/min | Per user |
| **Admin** | 5000 req/min | Per user |

---

## Examples

### Example 1: Create Order and Get Status

```bash
# Create order
curl -X POST https://api.lakbira.ae/api/orders \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "productId": "prod_001",
    "customerId": "cust_001",
    "selectedColor": "blue",
    "selectedSize": "M",
    "totalPrice": 1500
  }'

# Response
{
  "id": "ord_001",
  "status": "pending",
  "createdAt": "2024-10-15T14:30:00Z"
}

# Get order status
curl -X GET https://api.lakbira.ae/api/orders/ord_001 \
  -H "Authorization: Bearer {token}"
```

### Example 2: Approve Order as Admin

```bash
curl -X POST https://api.lakbira.ae/api/orders/ord_001/approve \
  -H "Authorization: Bearer {admin_token}" \
  -H "Content-Type: application/json" \
  -d '{
    "adminNotes": "Ready for production"
  }'
```

### Example 3: Get Market Trends

```bash
curl -X GET https://api.lakbira.ae/api/ai/market-trends \
  -H "Authorization: Bearer {admin_token}"
```

---

## Webhooks

### Webhook Events

The API supports webhooks for the following events:

| Event | Description |
|-------|-------------|
| `order.created` | New order placed |
| `order.approved` | Order approved by admin |
| `order.rejected` | Order rejected |
| `order.shipped` | Order shipped |
| `order.delivered` | Order delivered |

### Webhook Payload

```json
{
  "event": "order.approved",
  "timestamp": "2024-10-15T15:00:00Z",
  "data": {
    "orderId": "ord_001",
    "status": "approved",
    "adminNotes": "Ready for production"
  }
}
```

---

## Support

For API support and questions:

- **Email:** api-support@lakbira.ae
- **Documentation:** https://docs.lakbira.ae
- **Status Page:** https://status.lakbira.ae

---

**Document Version:** 1.0  
**Last Updated:** October 2024  
**Next Review:** January 2025

