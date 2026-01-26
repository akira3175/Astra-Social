# Coding Standards & Conventions

## Project Structure

```
backend/
├── app/
│   ├── Http/
│   │   ├── Controllers/     # HTTP Controllers
│   │   ├── Middleware/      # Custom Middleware
│   │   └── Requests/        # Form Request Validation
│   ├── Models/              # Eloquent Models
│   └── Services/            # Business Logic Services
├── database/
│   ├── migrations/          # Database Migrations
│   └── seeders/             # Database Seeders
├── routes/
│   ├── api.php              # Main API routes (includes sub-files)
│   └── api/                 # Route files by module
│       ├── auth.php
│       ├── profile.php
│       └── posts.php
└── docs/                    # Documentation
    ├── conventions/         # Coding standards
    └── api/                 # API documentation
```

## Naming Conventions

### Files & Classes
| Type | Convention | Example |
|------|------------|---------|
| Controller | PascalCase + `Controller` | `PostController.php` |
| Model | PascalCase (singular) | `Post.php` |
| Service | PascalCase + `Service` | `PostService.php` |
| Request | PascalCase + `Request` | `CreatePostRequest.php` |
| Migration | snake_case with timestamp | `2024_01_01_000000_create_posts_table.php` |

### Methods & Variables
| Type | Convention | Example |
|------|------------|---------|
| Method | camelCase | `getUserProfile()` |
| Variable | camelCase | `$userId` |
| Constant | SCREAMING_SNAKE_CASE | `PRIVACY_PUBLIC` |

### Database
| Type | Convention | Example |
|------|------------|---------|
| Table | snake_case (plural) | `posts`, `auth_tokens` |
| Column | snake_case | `user_id`, `created_at` |
| Foreign Key | singular_table + `_id` | `user_id`, `parent_id` |

## Architecture Pattern

### Controller → Service → Model

```
Request → Controller → Service → Model → Database
                ↓
           Response (JSON)
```

- **Controller**: Handle HTTP request/response, validation, authorization
- **Service**: Business logic, data transformation
- **Model**: Database interaction, relationships

### Example Flow

```php
// Controller - thin, delegates to service
public function store(CreatePostRequest $request): JsonResponse
{
    $result = $this->postService->createPost($request->user(), $request->validated());
    return response()->json(['success' => true, 'data' => $result['data']], 201);
}

// Service - contains business logic
public function createPost(User $user, array $data): array
{
    $post = Post::create([...]);
    return ['success' => true, 'data' => $post];
}
```

## API Response Format

### Success Response
```json
{
    "success": true,
    "data": { ... }
}
```

### Error Response
```json
{
    "success": false,
    "message": "Error description"
}
```

### Paginated Response
```json
{
    "success": true,
    "data": [...],
    "pagination": {
        "current_page": 1,
        "last_page": 10,
        "per_page": 10,
        "total": 100
    }
}
```

## Git Workflow

### Branch Naming
- Feature: `feature/<feature-name>`
- Bugfix: `bugfix/<bug-description>`
- Hotfix: `hotfix/<fix-description>`

### Commit Message Format
```
<type>: <short description>

[optional body]
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

Example:
```
feat: add post sharing functionality

- Add parent_id to posts table
- Create share endpoint
- Update post model with parent relationship
```

## Code Quality

### Request Validation
- Always use Form Request classes for validation
- Use `sometimes` for optional fields in update requests

### Error Handling
- Return consistent error responses with appropriate HTTP status codes
- Use `404` for not found, `403` for forbidden, `401` for unauthorized

### Security
- Never expose sensitive data in public endpoints
- Use middleware for authentication
- Validate all input data
