# AstraSocial PRO Frontend Coding Standards

## 1. Project Structure

```
frontend/src/
├── assets/          # Static assets (images, fonts)
├── components/      # Shared components
│   ├── ui/          # Generic, reusable UI atoms (Button, Card, Input)
│   └── [Feature]/   # Feature-specific components
├── configs/         # App configuration (API, constants)
├── context/         # React Context providers
├── hooks/           # Custom React hooks
├── pages/           # Page components (routed)
│   └── [Feature]/   # Feature directories (e.g., Auth, Profile)
├── services/        # API service layers
├── types/           # TypeScript interfaces/types
└── utils/           # Helper functions
```

## 2. Component Guidelines

-   **Functional Components**: Use React Functional Components with Hooks.
-   **PascalCase**: Component filenames and directories should be PascalCase (e.g., `LoginPage.tsx`).
-   **Index Export**: Always create an `index.ts` in the component folder for cleaner imports.
    ```typescript
    // index.ts
    export { default } from "./MyComponent";
    ```
-   **Props Interface**: Define a `Props` interface for every component, exported if needed.

## 3. Styling Guidelines (Vanilla CSS)

We prioritize **Vanilla CSS** over heavy UI libraries to maintain full control and performance.

-   **File Storage**: CSS files should sit next to their components (e.g., `Button.css` next to `Button.tsx`).
-   **Naming Convention**: Use kebab-case for classes.
-   **BEM-like Approach**:
    -   Block: `.btn`
    -   Modifier: `.btn-primary`, `.btn-large`
    -   Element: `.btn-icon`
-   **Variables**: Use CSS variables for theme colors (defined in `index.css`) where possible.

## 4. UI Components (`src/components/ui`)

-   These are "dumb" components (pure presentation).
-   They should not contain business logic or API calls.
-   They strictly follow the defined design system.
-   **Example**: `Button`, `Card`, `TextField`.

## 5. State Management

-   **Local State**: Use `useState` for component-level state.
-   **Global State**: Use React Context for strictly global data (User session, Theme).
-   **Server State**: Manage via `services` and `useEffect` (or later React Query).

## 6. API & Services

-   **Centralized Calls**: All API calls must reside in `src/services/`.
-   **No Inline Fetch**: Do not use `fetch` or `axios` directly inside components.
-   **Types**: Return types should be strictly defined in `src/types/`.

### Example Service
```typescript
// services/authService.ts
export const login = async (creds: LoginRequest): Promise<LoginResponse> => {
  // ... implementation
};
```

## 7. TypeScript

-   **Strict Mode**: No `any` unless absolutely necessary.
-   **Interfaces**: Prefer `interface` over `type` for object definitions.
-   **Files**: Use `.ts` for logic and `.tsx` for components.

## 8. Git & Commits

-   **Atomic Commits**: One feature/fix per commit.
-   **Message Format**: `type(scope): description`
    -   `feat(auth): add login page`
    -   `fix(ui): correct button padding`
    -   `docs(readme): update setup instructions`
