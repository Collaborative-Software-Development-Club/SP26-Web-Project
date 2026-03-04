# React Conventions

## File Naming

All files should be named using kebab-case **(I just found out it’s what it’s called).

Example: my-file-name.tsx

If it is a React component it should be the same name as a component but in *kebab case.*

For example, if you are creating a file for a component named MyReactComponent, its file should be named my-react-component.tsx.

## Component Conventions

- All components should be exported using export and not export default except the Next.js pages as they need to be default exported.
- If a component is a minor convenience for another one, it can go on the same file underneath the main component.
- If you are creating a separate component to organize code better but it is only used once, put it in a separate file in(your_team)/components directory
- If you are creating a component meant to be used in multiple places, add it to the /components folder.
- Custom components should be under (your_team)/components directory
- Use always function declarations for components instead of arrow functions (export function MyComponent(){})
- Prefer not to declare component props separately
    
    ```tsx
    // yes
    
    function MyComponent({prop1, prop2}: {prop1: string, prop2: string}){
    }
    
    // no
    
    type MyComponentProps = {prop1: string, prop2: string}
    
    function MyComponent({prop1, prop2}: MyComponentProps){
    }
    ```
    

## Server vs Client Conventions

- Prefer to use server components unless client interactivity is necessary
- Prefer to load data in a server component then pass it on to a client component with props
- Don’t create API routes for fetching data
- Keep server actions in (your_team)/_actions.ts; use the "use server" directive at the top of the file or the function.

## **Auth**

- Use requireAuth() from @/lib/auth in server components/pages that must be logged-in; avoid fetching user again when you already have it from layout.

## Next Router

- Use route groups like (profile), (chat) for layout/organization; they don’t affect the URL.
- Use _ for non-routes (e.g. _components, _actions) so they aren’t exposed as routes.

## Shadcn Conventions

- Always use Shadcn components from @/components/ui instead of native HTML elements for common UI components (Button, Input, Card, Label, etc.).

```tsx
// ✅ yes
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

<Button type="submit">Log in</Button>
<Input id="email" name="email" />
<Card>...</Card>

// ❌ no
<button type="submit">Log in</button>
<input id="email" name="email" />
<div className="card">...</div>
```

- Before creating a custom component, check the [Shadcn UI documentation](https://ui.shadcn.com/docs/components) to see if a component already exists. If a component exists but isn't installed,  add it using: `npx shadcn@latest add component-name`

## Tailwind Conventions

- Prefer semantic theme tokens (`bg-background`, `text-foreground`, `text-primary`, `border-border`) over hardcoded colors.
- Avoid absolute positioning unless necessary; prefer relative positioning and flexbox/grid layouts.
- Use Tailwind's spacing scale (`p-4`, `gap-2`, `mt-8`) instead of arbitrary values(`w-[123px]`)

```jsx
// ✅ yes
<div className="relative flex gap-4 p-6 bg-background border border-border">
	<Button variant="primary">Submit</Button>
</div>

// ❌ no
<div className="absolute top-[20px] left-[30px] w-[123px] bg-[#ffffff]">
	<button className="p-[15px]">Submit</button>
</div>
```



# Project File Structure

scraper/        #Scraper script for Housing listing
└──scraper.py
web-app/
├── app/
│		├── (chat)/
│		│   ├── chat/
│		│   │   ├── page.tsx
│		│   │   ├── _components/     # Chat-only components
│		│   │   └── _actions.ts      # Chat server actions
│		├── (housing)/
│		│   └── housing/
│		│       ├── page.tsx
│		│       ├── _components/
│		│       └── _actions.ts
│		├── (match)/
│		│   └── match/
│		│       ├── page.tsx
│		│       ├── _components/
│		│       └── _actions.ts
│		└── (profile)/
│		   ├── login/
│		   ├── profile/
│		   │   ├── page.tsx
│		   │   ├── _components/
│		   │   └── _actions.ts
│		   └── signup/
├── components/
│   └── ui/    #Shadcn UI components
├── hooks/
├── lib/
│   ├── types/
│   └── supabase/
└── supabase/migrations/
└── .env.local     #Where you keep Supabase URL + API keys