# API Documentation

## Base URL
```
http://localhost:8000/api
```

## Authentication
Most endpoints require JWT authentication. Include the token in the Authorization header:
```
Authorization: Bearer <access_token>
```

## Modules

| Module | Description | File |
|--------|-------------|------|
| [Auth](./auth.md) | Registration, Login, Token management | `auth.md` |
| [Profile](./profile.md) | User profile management | `profile.md` |
| [Posts](./posts.md) | Post CRUD operations | `posts.md` |

## Response Format

### Success
```json
{
    "success": true,
    "data": { ... }
}
```

### Error
```json
{
    "success": false,
    "message": "Error description"
}
```

## HTTP Status Codes

| Code | Description |
|------|-------------|
| 200 | OK |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 422 | Validation Error |
| 500 | Server Error |
