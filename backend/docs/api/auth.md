# Auth API

## Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/auth/register` | Register new user | No |
| POST | `/auth/login` | Login | No |
| POST | `/auth/refresh` | Refresh access token | No |
| POST | `/auth/logout` | Logout | No |

---

## Register

**POST** `/auth/register`

### Request
```json
{
    "username": "johndoe",
    "email": "john@example.com",
    "password": "password123",
    "password_confirmation": "password123"
}
```

### Response (201)
```json
{
    "success": true,
    "data": {
        "user": {
            "id": 1,
            "username": "johndoe",
            "email": "john@example.com"
        },
        "tokens": {
            "access_token": "eyJ...",
            "refresh_token": "abc123...",
            "token_type": "bearer",
            "expires_in": 3600
        }
    }
}
```

### Validation
| Field | Rules |
|-------|-------|
| username | required, 3-50 chars, unique, alphanumeric + underscore |
| email | required, valid email, unique |
| password | required, min 6 chars, confirmed |

---

## Login

**POST** `/auth/login`

### Request
```json
{
    "email": "john@example.com",
    "password": "password123"
}
```

### Response (200)
```json
{
    "success": true,
    "data": {
        "access_token": "eyJ...",
        "refresh_token": "abc123...",
        "token_type": "bearer",
        "expires_in": 3600
    }
}
```

### Errors
| Code | Message |
|------|---------|
| 401 | Invalid credentials |
| 403 | Account is not active |

---

## Refresh Token

**POST** `/auth/refresh`

### Request
```json
{
    "refresh_token": "abc123..."
}
```

### Response (200)
```json
{
    "success": true,
    "data": {
        "access_token": "eyJ...",
        "token_type": "bearer",
        "expires_in": 3600
    }
}
```

---

## Logout

**POST** `/auth/logout`

### Request
```json
{
    "refresh_token": "abc123..."
}
```

### Response (200)
```json
{
    "success": true,
    "message": "Logged out successfully"
}
```
