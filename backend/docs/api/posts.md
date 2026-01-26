# Posts API

## Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/posts` | Get all posts (newsfeed) | No |
| GET | `/posts/{id}` | Get single post | No |
| GET | `/users/{userId}/posts` | Get posts by user | No |
| POST | `/posts` | Create new post | Yes |
| PATCH | `/posts/{id}` | Update post | Yes |
| DELETE | `/posts/{id}` | Delete post | Yes |

---

## Get All Posts (Newsfeed)

**GET** `/posts`

### Query Parameters
| Param | Type | Default | Description |
|-------|------|---------|-------------|
| page | int | 1 | Page number |
| per_page | int | 10 | Items per page |

### Response (200)
```json
{
    "success": true,
    "data": [
        {
            "id": 1,
            "user_id": 1,
            "parent_id": null,
            "content": "Hello world!",
            "privacy": "PUBLIC",
            "likes_count": 0,
            "comments_count": 0,
            "created_at": "2024-01-01T12:00:00.000000Z",
            "user": {
                "id": 1,
                "username": "johndoe",
                "profile": {
                    "first_name": "John",
                    "last_name": "Doe",
                    "avatar_url": null
                }
            }
        }
    ],
    "pagination": {
        "current_page": 1,
        "last_page": 1,
        "per_page": 10,
        "total": 1
    }
}
```

---

## Get Single Post

**GET** `/posts/{id}`

### Response (200)
```json
{
    "success": true,
    "data": {
        "id": 1,
        "user_id": 1,
        "parent_id": null,
        "content": "Hello world!",
        "privacy": "PUBLIC",
        "likes_count": 0,
        "comments_count": 0,
        "created_at": "2024-01-01T12:00:00.000000Z",
        "user": { ... }
    }
}
```

---

## Get Posts by User

**GET** `/users/{userId}/posts`

### Query Parameters
| Param | Type | Default |
|-------|------|---------|
| page | int | 1 |
| per_page | int | 10 |

---

## Create Post

**POST** `/posts`

**Headers**: `Authorization: Bearer <token>`

### Request (Original Post)
```json
{
    "content": "Hello world!",
    "privacy": "PUBLIC"
}
```

### Request (Share Post)
```json
{
    "content": "Check this out!",
    "parent_id": 1,
    "privacy": "PUBLIC"
}
```

### Fields
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| content | string | No | Post content |
| privacy | enum | No | PUBLIC, FRIENDS, ONLY_ME (default: PUBLIC) |
| parent_id | int | No | ID of post to share |

### Response (201)
```json
{
    "success": true,
    "data": {
        "id": 2,
        "user_id": 1,
        "parent_id": 1,
        "content": "Check this out!",
        "privacy": "PUBLIC",
        "likes_count": 0,
        "comments_count": 0,
        "created_at": "2024-01-01T12:00:00.000000Z",
        "user": { ... },
        "parent": {
            "id": 1,
            "content": "Original post",
            "user": { ... }
        }
    }
}
```

---

## Update Post

**PATCH** `/posts/{id}`

**Headers**: `Authorization: Bearer <token>`

### Request
```json
{
    "content": "Updated content",
    "privacy": "FRIENDS"
}
```

> **Note**: Only post owner can update

---

## Delete Post

**DELETE** `/posts/{id}`

**Headers**: `Authorization: Bearer <token>`

### Response (200)
```json
{
    "success": true,
    "message": "Post deleted successfully"
}
```

> **Note**: Soft delete - post can be recovered
