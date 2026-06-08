# Heroes App — Professional Superheroes Management System

https://miguelcaballero95.github.io/devtalles-react-heroes/#/

A high-performance, enterprise-grade React application designed for managing and exploring a comprehensive database of superheroes and villains. Built with **React 19** and **TanStack Query v5**, this project demonstrates advanced patterns in state management, data fetching, and modern UI composition.

---

## Part 1: Project Overview & Portfolio Showcase

### TL;DR

The Heroes App solves the problem of data visualization and management for complex entities (heroes). It features a robust search engine, paginated catalogs, and a dedicated administrative dashboard, all while maintaining a slick, responsive user experience through modern styling and performance optimizations.

### Key Features

- **Dynamic Hero Catalog**: Paginated exploration of heroes with category-based filtering (Heroes, Villains, Anti-heroes).
- **Advanced Search Engine**: Real-time search functionality with debounced filtering and category synchronization.
- **Power-Level Visualization**: Detailed hero profiles featuring interactive stat cards and progress bars for power-level analysis.
- **Persistent Favorites System**: LocalStorage-backed state management for bookmarking heroes across sessions.
- **Administrative Dashboard**: A centralized summary view with key metrics and total counts of the hero database.
- **Responsive & Accessible UI**: Built with a "mobile-first" approach using Radix UI primitives and Tailwind CSS 4.

### Tech Stack

| Technology            | Role           | Rationale                                                                                     |
| :-------------------- | :------------- | :-------------------------------------------------------------------------------------------- |
| **React 19**          | Core Framework | Utilizes the new **React Compiler** for automatic memoization and improved performance.       |
| **TypeScript**        | Type Safety    | Ensures robust development with strict typing for API responses and component props.          |
| **Vite 8**            | Build Tool     | Provides an extremely fast HMR and optimized build pipeline.                                  |
| **Tailwind CSS 4**    | Styling        | Leverages the latest CSS-in-JS capabilities and JIT engine for high-performance styling.      |
| **TanStack Query v5** | Server State   | Handles caching, synchronization, and background updates with sophisticated stale-time logic. |
| **React Router 7**    | Routing        | Manages complex nested layouts and dynamic slug-based navigation.                             |
| **Shadcn/UI**         | UI Components  | Provides highly accessible, customizable, and composable UI primitives.                       |

### Key Dependencies

- **Axios**: Promised-based HTTP client for structured API communication.
- **Lucide React**: For a consistent and lightweight iconography system.
- **Radix UI**: Underlying accessible primitives for Tabs, Dialogs, and Menus.
- **Class Variance Authority (CVA)**: For managing complex component variants and styles.

### Architecture & Folder Structure

This project follows a **Feature-based Modular Architecture**, promoting high cohesion and low coupling. Each domain (Heroes, Admin, Auth) encapsulates its own actions, components, hooks, and types.

```text
src/
├── admin/               # Admin-specific logic and pages
│   ├── layouts/         # Specialized layouts for dashboard
│   └── pages/           # Admin-only views
├── auth/                # Authentication logic (extendable)
├── components/          # Shared UI & Custom components
│   ├── custom/          # High-level domain-agnostic components
│   └── ui/              # Shadcn/UI primitives
├── heroes/              # Main Feature Module
│   ├── actions/         # API abstraction layer (Action Pattern)
│   ├── api/             # Axios instances and configuration
│   ├── components/      # Feature-specific components (HeroGrid, Stats)
│   ├── context/         # Local state management (Favorites)
│   ├── hooks/           # Custom hooks for domain logic
│   ├── layouts/         # Nested layout components
│   ├── pages/           # Hero details, Search, and Home views
│   └── types/           # Interface definitions for API and models
├── lib/                 # Utility functions (Tailwind merge, etc.)
└── router/              # Centralized route configuration
```

### Key Learnings & Growth

- **React Compiler Integration**: Successfully implemented the new React 19 compiler, reducing the need for manual `useMemo` and `useCallback` while maintaining optimal re-render cycles.
- **Action Pattern Decoupling**: Abstracted API logic into pure asynchronous "actions," making the UI components agnostic of the fetching library and easier to unit test.
- **Complex UI Composition**: Leveraged Shadcn/UI's composition patterns to build data-heavy views (Hero Profiles) that remain readable and maintainable.
- **Stale-While-Revalidate**: Mastered TanStack Query's cache invalidation strategies to provide an "instant" feel when navigating between previously visited heroes.

---

## Part 2: Comprehensive Technical Study Notes

### 1. Component Architecture & Composition

**The Conceptual 'Why'**: To build a scalable UI, we must distinguish between reusable primitives and feature-specific compositions. This project uses a **Layout-Pattern** to manage consistent shells (Admin vs. Public) and **Atomic Components** for granular UI elements.

**Implementation**:

- **Presentational vs. Container**: Pages (Containers) handle data fetching via hooks, while components (Presentational) focus on rendering.
- **Layouts**: `HeroesLayout` and `AdminLayout` wrap children to provide consistent navigation and branding.

```tsx
// Example of Layout Composition in app.router.tsx
{
  path: '/',
  element: <HeroesLayout />, // Persistent shell
  children: [
    { index: true, element: <HomePage /> },
    { path: 'heroes/:slug', element: <HeroPage /> }
  ]
}
```

### 2. Advanced React Hooks & Logic Abstraction

**The Conceptual 'Why'**: Business logic should be extracted from components to ensure DRY (Don't Repeat Yourself) principles and simplify the UI layer.

**Implementation**: Custom hooks like `usePaginatedHero` encapsulate TanStack Query logic, providing a clean interface for components to consume loading, error, and data states.

```tsx
// src/heroes/hooks/usePaginatedHero.tsx
export const usePaginatedHero = (
  page: number = 1,
  limit: number = 6,
  category: string = "all",
) => {
  return useQuery({
    queryKey: ["heroes", { page, limit, category }], // Structured query keys for granular caching
    queryFn: () => getHeroesByPageAction(page, limit, category),
    staleTime: 1000 * 60 * 5, // Data remains fresh for 5 minutes
  });
};
```

### 3. Server State vs. Local State

**The Conceptual 'Why'**: Managing server data requires different strategies than managing local UI state (like a list of favorites). Mixing them often leads to "state synchronization hell."

**Strategy**:

- **TanStack Query**: Manages all hero data (asynchronous server state).
- **React Context**: Manages "Favorites" (synchronous local state with LocalStorage persistence).

```tsx
// src/heroes/context/FavoriteHeroContext.tsx
export const FavoriteHeroProvider = ({ children }: PropsWithChildren) => {
  const [favorites, setFavorites] = useState<Hero[]>(
    getFavoritesFromLocalStorage,
  );

  const toggleFavorite = (hero: Hero) => {
    const heroExists = favorites.find((h) => h.id === hero.id);
    setFavorites(
      heroExists
        ? favorites.filter((h) => h.id !== hero.id)
        : [...favorites, hero],
    );
  };

  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  return (
    <FavoriteHeroContext.Provider value={{ favorites, toggleFavorite }}>
      {children}
    </FavoriteHeroContext.Provider>
  );
};
```

### 4. Routing & Performance Optimization

**The Conceptual 'Why'**: Large applications should not load everything at once. Dynamic routing and code-splitting are essential for maintaining a low Time-To-Interactive (TTI).

**Strategy**:

- **Lazy Loading**: Using `React.lazy()` for non-critical routes (like Search).
- **Slug-based Dynamic Routes**: Efficiently fetching specific hero data based on URL parameters.

```tsx
// Lazy loading implementation
const SearchPage = lazy(() => import("@/heroes/pages/search/SearchPage"));

// HeroPage fetching by slug
const { slug = "" } = useParams();
const { data: superheroData } = useQuery({
  queryKey: ["heroes", slug],
  queryFn: () => getHeroBySlug(slug),
});
```

### 5. API Integration (The Action Pattern)

**The Conceptual 'Why'**: Directly calling `axios.get` inside a component makes it hard to change the API structure or library. The **Action Pattern** creates a contract between the API and the UI.

**Implementation**:

```tsx
// src/heroes/actions/get-heroes-by-page.action.ts
export const getHeroesByPageAction = async (
  page: number,
  limit: number,
  category: string,
): Promise<HeroesResponse> => {
  const { data } = await heroApi.get<HeroesResponse>("/", {
    params: { limit, category, offset: (page - 1) * limit },
  });

  // Data Transformation: Injecting base URL for images
  return {
    ...data,
    heroes: data.heroes.map((hero) => ({
      ...hero,
      image: `${BASE_URL}/images/${hero.image}`,
    })),
  };
};
```
