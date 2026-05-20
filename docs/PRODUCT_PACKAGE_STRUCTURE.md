# Product Package Structure — Maxxsiren Inventory System

```
maxxsiren-inventory/
├── src/
│   ├── app/                              # ROUTING LAYER (thin, no business logic)
│   │   ├── (auth)/                       # Route group: public pages
│   │   │   └── login/
│   │   │       └── page.tsx
│   │   ├── (dashboard)/                  # Route group: protected pages
│   │   │   ├── layout.tsx                # Layout + middleware auth check
│   │   │   ├── page.tsx                  # /dashboard
│   │   │   ├── barang/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [id]/page.tsx
│   │   │   ├── barang-masuk/
│   │   │   │   └── page.tsx
│   │   │   ├── barang-keluar/
│   │   │   │   └── page.tsx
│   │   │   ├── stok/
│   │   │   │   └── page.tsx
│   │   │   ├── laporan/
│   │   │   │   └── page.tsx
│   │   │   └── pengguna/
│   │   │       └── page.tsx
│   │   ├── api/                          # API Routes (only when needed)
│   │   │   └── laporan/
│   │   │       └── route.ts             
│   │   ├── layout.tsx
│   │   └── globals.css
│   │
│   ├── features/                         # FEATURE LAYER (all business logic)
│   │   ├── auth/
│   │   ├── barang/
│   │   ├── barang-masuk/
│   │   ├── barang-keluar/
│   │   ├── stok/
│   │   ├── laporan/
│   │   ├── dashboard/
│   │   └── pengguna/
│   │
│   ├── components/                       # SHARED UI LAYER (components without business logic)
│   │   ├── ui/                           # Shadcn UI primitives
│   │   ├── layout/                       # Global layout components
│   │   └── common/                       # Common cross-feature components
│   │
│   ├── server/                           # SERVER-ONLY INFRASTRUCTURE
│   │   ├── db.ts                         # Prisma client singleton
│   │   ├── supabase.ts                   # Supabase server client
│   │   └── auth.ts                       # Auth helper
│   │
│   └── lib/                              # UTILITIES LAYER (safe for client & server)
│       ├── supabase/
│       ├── validations/                  # Zod schemas
│       ├── types/                        # Global TypeScript types
│       ├── constants/                    # Application constants
│       └── utils.ts                      # Pure functions (date formatting, etc.)
│
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
├── public/
├── middleware.ts                         # Route protection (Supabase Auth)
├── package.json
└── tsconfig.json
```
