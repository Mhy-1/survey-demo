# Survey System - Frontend

Modern React + TypeScript frontend for the Survey System Survey Management System.

## 🚀 Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool & dev server
- **React Router** - Client-side routing
- **TanStack Query (React Query)** - Server state management
- **Zustand** - Client state management
- **Tailwind CSS** - Styling
- **Shadcn/UI** - Component library
- **React Hook Form** - Form management
- **React Hot Toast** - Notifications
- **Axios** - HTTP client

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/       # Reusable UI components
│   │   ├── ui/          # Shadcn/UI components
│   │   ├── admin/       # Admin-specific components
│   │   └── survey/      # Survey-related components
│   ├── pages/           # Page components
│   ├── hooks/           # Custom React Query hooks
│   ├── services/        # API services
│   │   └── api/         # API endpoint handlers
│   ├── store/           # Zustand stores
│   ├── lib/             # Utilities & helpers
│   ├── types/           # TypeScript type definitions
│   └── App.tsx          # Root component
├── public/              # Static assets
├── .env.development     # Development environment variables
├── .env.production      # Production environment variables
└── vite.config.ts       # Vite configuration
```

## 🛠️ Setup & Installation

### Prerequisites
- Node.js >= 18.x
- npm >= 9.x

### Installation

1. Install dependencies:
```bash
cd frontend
npm install
```

2. Configure environment variables:
```bash
# Copy the example file
cp .env.example .env.development

# Edit .env.development and set your API URL
# VITE_API_BASE_URL=http://localhost:5000/api
```

### Running the Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The production build will be in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

## 🔧 Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | Backend API base URL | `http://localhost:5000/api` |
| `VITE_APP_NAME` | Application name | `Survey System` |
| `VITE_APP_ENV` | Environment | `development` or `production` |

## 📦 Key Features

### Authentication & Authorization
- JWT-based authentication
- Token refresh mechanism
- Role-based access control (Admin, Manager, Employee)
- Protected routes
- Automatic token attachment to requests

### Survey Management
- Create, edit, delete surveys
- Multiple question types
- Question reordering (drag & drop)
- Survey status management (draft, active, paused, closed)
- Duplicate surveys
- Role-based survey access

### Response Management
- View responses with pagination
- Filter by status and date range
- Export to CSV, Excel (admin only), PDF
- Real-time response submission
- Anonymous response support

### User Management (Admin Only)
- User listing with pagination
- Search and filter users
- Activate/deactivate users
- Role management
- User profile editing

### Analytics & Exports
- Dashboard statistics
- Survey analytics
- Client progress tracking
- Multi-format exports with role restrictions
- Loading states for all async operations

## 🎨 UI/UX Features

- **Responsive Design** - Works on desktop, tablet, and mobile
- **RTL Support** - Full Arabic language support
- **Dark Mode Ready** - Theme support built-in
- **Loading States** - Skeletons and spinners
- **Toast Notifications** - User feedback for all operations
- **Form Validation** - Client-side validation
- **Error Handling** - Graceful error displays
- **Optimistic Updates** - Instant UI feedback

## 🔐 Security Features

- **Role-based UI rendering** - Hide features based on user role
- **Secure token storage** - HttpOnly cookie support
- **CSRF protection** - Request validation
- **Input sanitization** - XSS prevention
- **Confirmation dialogs** - Prevent accidental actions

## 📚 API Integration

All API calls are handled through:
- **Service Layer** (`src/services/api/`) - API endpoint definitions
- **React Query Hooks** (`src/hooks/`) - Data fetching & caching
- **Axios Instance** (`src/lib/api-client.ts`) - HTTP client with interceptors

### Example Usage

```typescript
// Using React Query hooks
import { useSurveys } from '@/hooks/useSurveys'

function SurveyList() {
  const { data, isLoading, error } = useSurveys({ page: 1, limit: 20 })

  if (isLoading) return <LoadingSpinner />
  if (error) return <ErrorMessage />

  return <div>{/* Render surveys */}</div>
}
```

## 🧪 Testing

```bash
# Run tests (when configured)
npm test

# Run tests with coverage
npm run test:coverage
```

## 📝 Code Style

- **ESLint** - Code linting
- **Prettier** - Code formatting
- **TypeScript** - Type checking

```bash
# Lint code
npm run lint

# Format code
npm run format
```

## 🚢 Deployment

### Using Netlify/Vercel
1. Connect your repository
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Add environment variables

### Using Docker
```dockerfile
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## 🐛 Troubleshooting

### Common Issues

**Issue: API requests failing**
- Check `VITE_API_BASE_URL` in `.env.development`
- Ensure backend is running
- Check CORS configuration in backend

**Issue: Build fails**
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Check Node.js version
- Clear Vite cache: `rm -rf node_modules/.vite`

**Issue: Hot reload not working**
- Check Vite config
- Restart dev server
- Check file watchers limit (Linux)

## 📖 Documentation

- [React Query Docs](https://tanstack.com/query/latest)
- [Vite Docs](https://vitejs.dev/)
- [Tailwind CSS Docs](https://tailwindcss.com/)
- [Shadcn/UI Docs](https://ui.shadcn.com/)

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## 📄 License

[Your License Here]

## 👥 Team

Survey System Development Team

---

**Note**: This is the frontend application. The backend API is located in the `/backend` directory.
