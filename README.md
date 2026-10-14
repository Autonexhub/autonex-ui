# Autonex UI

A React component library built on Radix UI primitives with Tailwind CSS styling.

## Packages

| Package | Version | Description |
|---------|---------|-------------|
| `@autonexhub/react` | 1.0.0 | 40+ React components |
| `@autonexhub/tokens` | 0.1.0 | Design tokens & Tailwind preset |

## Installation

### 1. Configure GitHub Packages registry

Create or update `.npmrc` in your project root:

```
@autonexhub:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
```

Set `GITHUB_TOKEN` environment variable with a [Personal Access Token](https://github.com/settings/tokens) that has `read:packages` scope.

### 2. Install packages

```bash
pnpm add @autonexhub/react @autonexhub/tokens
```

### 3. Configure Tailwind

```js
// tailwind.config.js
import { autonexPreset } from '@autonexhub/tokens/tailwind.preset'

export default {
  presets: [autonexPreset],
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    './node_modules/@autonexhub/react/dist/**/*.{js,mjs}'
  ]
}
```

### 4. Import CSS tokens

```css
/* globals.css */
@import '@autonexhub/tokens';
```

## Usage

```tsx
import { Button, Card, CardHeader, CardTitle, CardContent } from '@autonexhub/react'

export function Example() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Hello</CardTitle>
      </CardHeader>
      <CardContent>
        <Button>Click me</Button>
      </CardContent>
    </Card>
  )
}
```

## Components

### Core
Button, Card, Dialog, Input, Label

### Form
Checkbox, Form, RadioGroup, Select, Slider, Switch, Textarea, Toggle, ToggleGroup

### Overlay
Accordion, AlertDialog, Avatar, Collapsible, ContextMenu, DropdownMenu, HoverCard, Menubar, NavigationMenu, Popover, Progress, ScrollArea, Separator, Tabs, Tooltip

### Additional
Alert, AspectRatio, Badge, Breadcrumb, Drawer, Sheet, Skeleton, Sonner (toasts), Table

### Utilities
- `cn()` - Class name merging (clsx + tailwind-merge)
- `useIsMobile()` - Responsive breakpoint hook

## Development

```bash
# Install dependencies
pnpm install

# Build all packages
pnpm build

# Type check
pnpm typecheck
```

## Release

Releases are automated via GitHub Actions:

1. Create a changeset: `pnpm changeset`
2. Commit and push
3. Run version: `pnpm version-packages`
4. Commit and push
5. Trigger release workflow from GitHub Actions

## License

MIT
