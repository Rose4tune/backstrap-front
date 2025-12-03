# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Bagstrap is a Next.js-based Korean student community platform serving university students with features including community boards, timetable management, mentoring, career services, and notifications. The project is transitioning from legacy GraphQL to modern REST API architecture.

## Development Commands

### Core Development
```bash
# Install dependencies
yarn install

# Development server
yarn dev

# Production build
yarn build
yarn start

# Linting
yarn lint
```

### API Type Generation
```bash
# Generate REST API types from OpenAPI spec (dev)
yarn generate:api-dev

# Generate REST API types from OpenAPI spec (prod)
yarn generate:api-prod
```

### Legacy GraphQL (when needed)
```bash
# Generate GraphQL types and hooks (legacy)
yarn gql:codegen
```

## Architecture Overview

### API Strategy (Migration in Progress)
- **REST APIs (Primary)**: Modern approach for all new features in `src/apis/`
- **GraphQL (Legacy)**: Existing functionality only, avoid for new development

### State Management
- **MobX**: Primary state management for application state
- **Apollo Client**: Legacy GraphQL state (avoid for new features)
- **React Context**: Authentication and global UI state

### Data Layer Architecture
```
Frontend Components
├── REST APIs (src/apis/) ← **Use for new development**
│   ├── Standard CRUD operations
│   ├── Consistent error handling
│   └── OpenAPI type generation
└── GraphQL (Legacy) ← **Avoid for new features**
    ├── Existing complex queries
    └── Legacy caching
```

### Project Structure
```
/
├── src/                    # Modern architecture (REST APIs, new components)
│   ├── apis/              # **Primary API layer for new development**
│   ├── components/        # Modern React components
│   ├── types/            # TypeScript definitions
│   └── utils/            # Modern utility functions
├── pages/                 # Next.js pages
├── stores/               # MobX stores
├── generated/ (legacy)   # Auto-generated GraphQL types
├── graphql/ (legacy)     # GraphQL query definitions
├── common/ (legacy)      # Legacy shared components
├── components/ (legacy)  # Legacy components
└── utils/ (legacy)       # Legacy utilities
```

## Key Development Patterns

### REST API Functions (Preferred)
All new API functions should follow this pattern:
```typescript
import { ApiResponse } from 'types/ApiResponseType';
import { components } from 'src/types/api';

export default async function apiFunction(
  params: ParamsType,
  accessToken?: string
): Promise<ApiResponse<ResponseType>> {
  const REST_API_ENDPOINT = process.env.NEXT_PUBLIC_REST_API_ENDPOINT;
  const requestUrl = `${REST_API_ENDPOINT}/api/v1/module/action`;

  try {
    const response = await axios.post(requestUrl, requestBody, {
      headers: {
        Accept: '*/*',
        'Content-Type': 'application/json',
        ...(accessToken && { Authorization: `Bearer ${accessToken}` })
      },
      validateStatus: () => true
    });

    if (status === 200 || status === 201) {
      return { success: true, data: response.data };
    }

    // Standardized Korean error handling
    return { success: false, messages: getErrorMessage(status) };
  } catch (error) {
    return {
      success: false,
      messages: '네트워크 오류가 발생했습니다. 다시 시도해주세요.'
    };
  }
}
```

### Component Architecture
- **src/components/**: Modern React components (preferred for new development)
- **common/**: Legacy components (avoid modifying unless necessary)
- Use functional components with hooks
- Observer pattern for MobX integration: `export default observer(Component)`

### Import Path Conventions
```typescript
// Preferred for new development
import { ApiResponse } from 'types/ApiResponseType'
import { components } from 'src/types/api'
import apiFunction from '@api/module/apiFunction'
import Component from '@components/module/Component'

// Legacy imports (avoid for new features)
import { useQuery } from '@generated/graphql'
```

### Styling
- **Primary**: Tailwind CSS with custom design system
- **Secondary**: SCSS modules for complex components
- **Custom Theme**: Extensive color palette and typography system defined in tailwind.config.js

## Environment Configuration

### Required Environment Variables
Create `.env.local` file with:
```
NEXT_PUBLIC_REST_API_ENDPOINT=<rest-api-url>
NEXT_PUBLIC_GQL_API_ENDPOINT=<graphql-url> # Legacy
NEXT_PUBLIC_BASE_SERVICE_PROTOCOL=<http|https>
NEXT_PUBLIC_BASE_SERVICE_DOMAIN=<domain>
```

## Authentication & Authorization

### Token Management
- JWT tokens stored in HTTP-only cookies
- Automatic token refresh
- REST API token handling (preferred)
- Legacy GraphQL token handling (avoid)

### User State
- **UserStore**: REST API-based user state (preferred for new features)
- **MeStore**: GraphQL-based user state (legacy, avoid modification)

## Development Guidelines

### For New Features
1. **Always use REST APIs** in `src/apis/`
2. **Create components** in `src/components/`
3. **Follow OpenAPI specification** for type safety
4. **Use MobX** for state management when needed

### For Existing Features
1. **Avoid modifying GraphQL** queries/mutations unless critical
2. **Prefer REST API migration** when making significant changes
3. **Keep legacy code** in current structure until migration

### API Migration Strategy
- New features: REST APIs only
- Bug fixes: Modify existing GraphQL if minimal, otherwise migrate to REST
- Enhancements: Migrate to REST APIs when possible

## Important Notes

### Type Safety
- Use `ApiResponse<T>` wrapper for all REST responses
- Auto-generated types from `src/types/api.d.ts`
- OpenAPI specification drives type generation

### Korean Localization
- All user-facing text should be in Korean
- Error messages follow Korean UX patterns
- Date formatting uses Korean locale (`ko-KR`)

### Mobile-First Development
- Responsive design with Tailwind breakpoints
- Touch-friendly interactions
- Progressive web app capabilities

## Common Tasks

### Adding New REST API (Preferred)
1. Create function in `src/apis/{module}/{functionName}.ts`
2. Use OpenAPI types from `src/types/api.d.ts`
3. Follow standardized error handling patterns
4. Import using `@api/{module}/{functionName}` alias

### Adding New Component
1. Create in `src/components/{module}/ComponentName.tsx`
2. Use functional component with TypeScript
3. Apply Tailwind classes for styling
4. Use MobX observer when state management needed

### Working with Legacy GraphQL
1. Avoid creating new GraphQL operations
2. When modifying existing: update in `graphql/{Entity}.query.graphql`
3. Run `yarn gql:codegen` only when necessary
4. Consider migrating to REST API instead

### State Management Priority
1. **Local state**: React useState/useReducer
2. **Component-tree state**: React Context
3. **Global app state**: MobX stores
4. **Server state**: REST APIs with proper error handling