# Saanvi Careers Frontend

Next.js application for the Saanvi Careers platform.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Redux Toolkit
- **Authentication**: Clerk
- **UI Components**: Radix UI
- **Animations**: Framer Motion
- **Charts**: Chart.js
- **Video Player**: Video.js

## Getting Started

### Installation

```bash
npm install
```

### Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_API_URL=http://localhost:3001
ANTHROPIC_API_KEY=re_...
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Build

```bash
npm run build
npm start
```

## Project Structure

```
frontend/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Auth routes
│   ├── (dashboard)/       # Dashboard routes
│   ├── admin/             # Admin routes
│   ├── courses/           # Course pages
│   └── layout.tsx         # Root layout
├── src/
│   ├── components/        # React components
│   ├── lib/              # Utilities and helpers
│   ├── redux/            # Redux store and slices
│   └── styles/           # Global styles
├── public/               # Static assets
├── api/                  # Next.js API routes
└── plugins/              # Vite plugins
```

## Features

### Pages

- **Home** - Landing page with course listings
- **Courses** - Browse and search courses
- **Course Details** - View course information and videos
- **Dashboard** - User dashboard with enrollments
- **Admin** - Admin panel for course management
- **Profile** - User profile and settings
- **News** - Latest updates and articles
- **Interview Prep** - Interview preparation resources

### Components

- **CourseCard** - Course display card
- **VideoPlayer** - Custom video player with DRM
- **Navbar** - Navigation bar with auth
- **Footer** - Site footer
- **AdminSidebar** - Admin navigation
- **Charts** - Analytics charts
- **Forms** - Form components with validation

## Styling

Uses Tailwind CSS with custom configuration:

- Custom colors and themes
- Responsive design
- Dark mode support (planned)
- Animation utilities

## State Management

Redux Toolkit for global state:

- **auth** - Authentication state
- **courses** - Course data
- **enrollments** - User enrollments
- **ui** - UI state (modals, toasts)

## Authentication

Clerk handles authentication:

- Sign up / Sign in
- Social login (Google, GitHub)
- JWT tokens
- Protected routes
- Role-based access

## API Integration

Axios for API calls to backend:

```typescript
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});
```

## Deployment

### Vercel (Recommended)

```bash
vercel deploy
```

### Docker

```bash
docker build -t saanvi-careers-frontend .
docker run -p 3000:3000 saanvi-careers-frontend
```

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript compiler

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk public key | Yes |
| `CLERK_SECRET_KEY` | Clerk secret key | Yes |
| `NEXT_PUBLIC_API_URL` | Backend API URL | Yes |
| `ANTHROPIC_API_KEY` | Claude API key for chat | Yes |

## Performance

- Server-side rendering (SSR)
- Static generation (SSG) for public pages
- Image optimization with Next.js Image
- Code splitting and lazy loading
- CDN delivery via Vercel

## SEO

- Meta tags for all pages
- Open Graph tags
- Sitemap generation
- Robots.txt

## Accessibility

- Semantic HTML
- ARIA labels
- Keyboard navigation
- Screen reader support

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

Private - Saanvi Careers
