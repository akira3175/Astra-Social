# Profile API

## Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/profile/{id}` | Get public profile | No |
| GET | `/profile/me` | Get own profile | Yes |
| PATCH | `/profile/me` | Update own profile | Yes |

---

## Get Public Profile

**GET** `/profile/{id}`

### Response (200)
```json
{
    "success": true,
    "data": {
        "user": {
            "id": 1,
            "username": "johndoe",
            "is_verified": true,
            "created_at": "2024-01-01T00:00:00.000000Z"
        },
        "profile": {
            "first_name": "John",
            "last_name": "Doe",
            "bio": "Hello world!",
            "avatar_url": null,
            "cover_url": null,
            "gender": "MALE"
        }
    }
}
```

> **Note**: Public profile hides sensitive info (email, phone, address, birth_date)

---

## Get Own Profile

**GET** `/profile/me`

**Headers**: `Authorization: Bearer <token>`

### Response (200)
```json
{
    "success": true,
    "data": {
        "user": {
            "id": 1,
            "username": "johndoe",
            "email": "john@example.com",
            "role": "User",
            "is_active": true,
            "is_verified": true,
            "last_login": "2024-01-01T12:00:00.000000Z",
            "created_at": "2024-01-01T00:00:00.000000Z"
        },
        "profile": {
            "first_name": "John",
            "last_name": "Doe",
            "bio": "Hello world!",
            "avatar_url": null,
            "cover_url": null,
            "phone": "+84123456789",
            "address": "Ho Chi Minh City",
            "birth_date": "1990-01-01",
            "gender": "MALE"
        }
    }
}
```

---

## Update Profile

**PATCH** `/profile/me`

**Headers**: `Authorization: Bearer <token>`

### Request (partial update)
```json
{
    "first_name": "John",
    "last_name": "Doe",
    "bio": "Updated bio"
}
```

### Available Fields
| Field | Type | Validation |
|-------|------|------------|
| first_name | string | max 50 chars |
| last_name | string | max 50 chars |
| bio | string | - |
| avatar_url | string | max 255 chars |
| cover_url | string | max 255 chars |
| phone | string | max 20 chars, unique |
| address | string | max 255 chars |
| birth_date | date | before today |
| gender | enum | MALE, FEMALE, OTHER |

### Response (200)
```json
{
    "success": true,
    "data": {
        "user": { ... },
        "profile": { ... }
    }
}
```
