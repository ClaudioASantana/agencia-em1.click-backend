---
name: premium-design
description: Guidelines for the Premium Modern Design System (Modern Blue + Neutral), focusing on semantic tokens, glassmorphism, and unified aesthetics.
---

# Premium Design System (Modern Blue)

This skill defines the visual language for the "Premium Modern" aesthetic. Use this logic when creating new views or refactoring existing ones.

## 1. Core Identity: "Professional Modernity"

- **Primary Color**: Modern Blue (Vibrant Azure) -> `221.2 83.2% 53.3%`. Avoid "Neon/Hyper Blue" but keep it vibrant.
- **Base Neutrals**: Zinc/Neutral (True Grays). Avoid "Slate" (Bluelish) or "Stone" (Yellowish) unless intended.
- **Touch**: Glassmorphism (`backdrop-blur-md`), Soft Shadows (`shadow-sm`), and Roundness (`rounded-lg`).

## 2. Semantic Tokens (Tailwind)

**NEVER** use hardcoded colors for primary elements. Use semantic aliases to allow global theming.

| Concept           | Class             | Logic                                               |
| :---------------- | :---------------- | :-------------------------------------------------- |
| **Primary Brand** | `bg-primary`      | Main buttons, active states, key icons.             |
| **Primary Text**  | `text-primary`    | Active links, highlights, primary icons.            |
| **Subtle Brand**  | `bg-primary/10`   | Badges, hover states, secondary button backgrounds. |
| **Dark Surface**  | `bg-neutral-900`  | "Premium Admin" cards, sidebars (optional).         |
| **Light Surface** | `bg-white`        | Standard cards, main content area.                  |
| **Borders**       | `border-gray-200` | Subtle separation.                                  |

## 3. Anti-Patterns (Forbidden)

- ❌ `bg-blue-600` / `text-blue-600` (Use `primary`)
- ❌ `bg-orange-*` / `bg-red-*` (Unless for specific status feedback like Warning/Error)
- ❌ `rounded-none` (Everything must have `rounded-lg` or `rounded-md`)
- ❌ "Flat" design without hierarchy (Use shadows/borders to create depth)

## 4. Component Patterns

### a) Primary Button

```vue
<Button
  class="bg-primary hover:bg-primary/90 text-white shadow-sm font-medium rounded-lg"
>
  <Icon class="mr-2 h-4 w-4" />
  Action
</Button>
```

### b) Status Badge

```vue
<div
  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary"
>
  Active
</div>
```

### c) Glass Header

```vue
<header class="bg-white/80 backdrop-blur-md border-b sticky top-0 z-50">
  <!-- Content -->
</header>
```

## 5. Advanced Component Patterns

### d) Full-Width Page Header

Use for list/index pages. If the page has filters, **include them INSIDE the sticky header** so they stay visible on scroll.

```vue
<div class="sticky top-0 z-50 bg-white shadow-sm">
  <!-- 1. Title Bar -->
  <div class="flex items-center justify-between bg-primary/5 border-b border-primary/10 px-4 pt-3 pb-4">
    <div>
      <h1 class="text-2xl font-bold tracking-tight text-neutral-900">Page Title</h1>
      <p class="text-sm text-neutral-600 mt-1">Descriptive subtitle explaining the page purpose.</p>
    </div>
    <div class="flex items-center gap-4">
      <Button class="bg-primary hover:bg-primary/90 text-white shadow-sm rounded-lg font-medium">
        <Plus class="w-4 h-4 mr-2" />
        New Item
      </Button>
    </div>
  </div>

  <!-- 2. Filter Bar (Optional - Inside Sticky) -->
  <div class="bg-neutral-50 border-b border-neutral-200 px-4 py-3">
    <div class="flex items-end gap-3 flex-wrap">
      <!-- Search Input with Label -->
      <div class="w-[400px]">
        <label class="block text-xs font-medium text-neutral-600 mb-1.5">Buscar</label>
        <div class="relative">
          <SearchIcon class="w-4 h-4 absolute left-3 top-2.5 text-neutral-400 pointer-events-none" />
          <Input
            class="h-9 w-full bg-white pl-10 border-neutral-300 focus:ring-primary"
            placeholder="Buscar..."
          />
        </div>
      </div>

      <!-- Dropdown with Label -->
      <div class="w-[160px]">
        <label class="block text-xs font-medium text-neutral-600 mb-1.5">Status</label>
        <Select>...</Select>
      </div>
    </div>
  </div>
</div>
```

**Key Details:**

- **Single Sticky Container**: `@sticky top-0 z-50` wraps BOTH the Title Bar and Filter Bar.
- **Title Bar**: `bg-primary/5` + `border-primary/10`.
- **Filter Bar**: `bg-neutral-50` + `border-neutral-200` (visually distinct but integrated).
- **Labels**: Always include labels above filter inputs for clarity.

**Content Area Pattern:**

After the sticky header, normal flow resumes:

```vue
<!-- Content Area with Padding -->
<div class="px-4 py-6 space-y-6">
  <!-- Your cards, tables, forms go here -->
</div>
```

**Key Details:**

- **NO** `bg-white` or `bg-gray-*` on content wrapper - let body background show through
- `px-4 py-6`: Consistent padding (horizontal: 16px, vertical: 24px)
- `space-y-6`: Consistent vertical spacing between sections (24px)
- Individual cards/components have their own `bg-white` backgrounds

**Key Details:**

- `items-end`: Aligns all elements by their bottom edge (important for labels)
- `h-9`: Consistent height (36px) for all inputs/buttons
- `w-[700px]`: Fixed width for search input
- `pl-10`: Left padding to accommodate icon
- `pointer-events-none`: Icon doesn't block input clicks
- **Labels**: `text-xs font-medium text-neutral-600 mb-1.5` for clarity and accessibility
- **Wrapper divs**: Each input/select wrapped in div to group with label

### f) Premium Data Table

Modern table with icons, badges, and hover effects:

```vue
<Card class="overflow-hidden">
  <CardContent class="p-0">
    <Table>
      <TableHeader>
        <TableRow class="border-b border-neutral-200 bg-neutral-50/50">
          <TableHead class="font-semibold text-neutral-700 text-xs uppercase tracking-wider">Column</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow 
          v-for="item in items" 
          :key="item.id"
          class="border-b border-neutral-100 hover:bg-primary/5 transition-colors duration-200"
        >
          <!-- Title Cell with Icon -->
          <TableCell class="py-4">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <svg class="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
              </div>
              <div>
                <div class="font-semibold text-neutral-900">{{ item.title }}</div>
                <div class="text-xs text-neutral-500 mt-0.5">Subtitle or metadata</div>
              </div>
            </div>
          </TableCell>

          <!-- Date Cell with Icon -->
          <TableCell class="py-4">
            <div class="flex items-center gap-2 text-sm text-neutral-600">
              <svg class="w-4 h-4 text-neutral-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
              <div>
                <div>{{ formatDate(item.date) }}</div>
                <div class="text-xs text-neutral-400">until {{ formatDate(item.endDate) }}</div>
              </div>
            </div>
          </TableCell>

          <!-- Status Badge -->
          <TableCell class="py-4">
            <Badge
              :class="item.active 
                ? 'bg-green-50 text-green-700 border border-green-200' 
                : 'bg-neutral-100 text-neutral-600 border border-neutral-200'"
              class="rounded-full px-3 py-1 text-xs font-medium"
            >
              <span class="flex items-center gap-1.5">
                <span :class="item.active ? 'bg-green-500' : 'bg-neutral-400'" class="w-1.5 h-1.5 rounded-full"></span>
                {{ item.active ? 'Active' : 'Inactive' }}
              </span>
            </Badge>
          </TableCell>

          <!-- Count Badge -->
          <TableCell class="py-4 text-center">
            <div class="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-semibold text-sm">
              {{ item.count }}
            </div>
          </TableCell>

          <!-- Actions -->
          <TableCell class="py-4">
            <div class="flex items-center justify-end gap-1">
              <Button 
                variant="ghost" 
                size="icon"
                class="h-9 w-9 text-neutral-500 hover:text-primary hover:bg-primary/10 transition-colors rounded-lg"
              >
                <Pencil class="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon"
                class="h-9 w-9 text-neutral-500 hover:text-red-600 hover:bg-red-50 transition-colors rounded-lg"
              >
                <Trash2 class="h-4 w-4" />
              </Button>
            </div>
          </TableCell>
        </TableRow>

        <!-- Empty State -->
        <TableRow v-if="items.length === 0">
          <TableCell colspan="5" class="py-12 text-center">
            <div class="flex flex-col items-center gap-3">
              <div class="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center">
                <svg class="w-8 h-8 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
              </div>
              <div>
                <p class="text-neutral-600 font-medium">No items found</p>
                <p class="text-sm text-neutral-400 mt-1">Create your first item to get started</p>
              </div>
            </div>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </CardContent>
</Card>
```

**Key Details:**

- `p-0` on CardContent: Remove default padding for edge-to-edge table
- `py-4`: Generous vertical padding in cells (16px)
- `border-neutral-100`: Very subtle row dividers
- `hover:bg-primary/5`: Subtle hover effect
- `transition-colors duration-200`: Smooth 200ms transitions
- `bg-neutral-50/50`: Semi-transparent header background
- `text-xs uppercase tracking-wider`: Professional header style

### g) Status Badge Variants

```vue
<!-- Active (Green) -->
<Badge
  class="bg-green-50 text-green-700 border border-green-200 rounded-full px-3 py-1 text-xs font-medium"
>
  <span class="flex items-center gap-1.5">
    <span class="w-1.5 h-1.5 rounded-full bg-green-500"></span>
    Active
  </span>
</Badge>

<!-- Inactive (Neutral) -->
<Badge
  class="bg-neutral-100 text-neutral-600 border border-neutral-200 rounded-full px-3 py-1 text-xs font-medium"
>
  <span class="flex items-center gap-1.5">
    <span class="w-1.5 h-1.5 rounded-full bg-neutral-400"></span>
    Inactive
  </span>
</Badge>

<!-- Default/Featured (Primary) -->
<Badge
  class="bg-primary/10 text-primary border border-primary/20 rounded-full px-3 py-1 text-xs font-medium"
>
  <span class="flex items-center gap-1.5">
    <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
    </svg>
    Default
  </span>
</Badge>
```

## 6. Micro-Animations

Always add smooth transitions for better UX:

```vue
<!-- Hover Effects -->
class="hover:bg-primary/5 transition-colors duration-200"

<!-- Button Hover -->
class="hover:bg-primary/90 transition-all duration-150"

<!-- Icon Button Hover -->
class="hover:text-primary hover:bg-primary/10 transition-colors"
```

## 7. Spacing System

Use consistent spacing for visual rhythm:

- **Page padding**: `px-4 py-6` (horizontal: 16px, vertical: 24px)
- **Card padding**: Default or `p-0` for edge-to-edge content
- **Cell padding**: `py-4` (16px vertical)
- **Gap between elements**: `gap-3` (12px) or `gap-4` (16px)
- **Minimal padding**: `px-2` (8px) for tight spaces

## 8. Refactoring Checklist

When updating an old page:

1. **Search** for `blue-`, `green-`, `slate-`.
2. **Replace** with `primary` (brand) or `neutral` (ui).
3. **Check** `radius`. If `rounded-none` or `rounded-sm`, upgrade to `rounded-lg`.
4. **Add icons** to table cells (calendar, document, etc.)
5. **Add hover effects** with `transition-colors duration-200`
6. **Use badges** with dot indicators for status
7. **Improve empty states** with icons and helpful text
8. **Simplify**. Remove excessive gradients or vivid colors. Let the Blue pop against the Gray.
