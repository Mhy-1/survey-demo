# AMSteel Survey System - Demo

A demonstration version of the AMSteel Survey Management System. This is a fully functional frontend application that runs with mock data - no backend server required.

## Demo Credentials

| Account Type | Email | Password |
|-------------|-------|----------|
| Admin | `admin@amsteel.demo` | `demo123` |
| Employee | `sarah@amsteel.demo` | `demo123` |

## Features

- **Survey Management**: Create, edit, and manage surveys with multiple question types
- **Question Types**: Rating scales, multiple choice, single choice, NPS, text areas
- **Response Collection**: View and analyze survey responses
- **Analytics Dashboard**: Charts and statistics for survey performance
- **User Management**: Admin can manage users and roles
- **Export Options**: Export data to CSV, Excel, and PDF
- **Responsive Design**: Works on desktop, tablet, and mobile

## Tech Stack

- **React 18** with TypeScript
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Shadcn/UI** - Component library
- **React Query** - State management
- **Zustand** - Client state
- **React Router** - Navigation

## Quick Start

### Prerequisites
- Node.js >= 18.x
- npm >= 9.x

### Installation

```bash
# Clone the repository
git clone https://github.com/msharydajam/survey-demo.git
cd survey-demo

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The production build will be in the `dist/` directory.

## Deployment to Vercel

### Option 1: One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/msharydajam/survey-demo)

### Option 2: Manual Deployment

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy:
```bash
vercel
```

3. Set up custom domain (if needed):
```bash
vercel domains add survey.lab.mdajam.com
```

### Option 3: Connect GitHub Repository

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New" > "Project"
3. Import the GitHub repository
4. Vercel will auto-detect Vite settings
5. Click "Deploy"

## Project Structure

```
survey-demo/
├── src/
│   ├── components/       # UI components
│   │   ├── ui/          # Shadcn/UI components
│   │   ├── admin/       # Admin components
│   │   └── survey/      # Survey components
│   ├── data/            # Mock data
│   │   └── mockData.ts  # Sample surveys, users, responses
│   ├── pages/           # Page components
│   ├── services/        # API services (using mock data)
│   │   ├── api/         # API endpoint handlers
│   │   └── mockApi.ts   # Mock API implementation
│   ├── store/           # Zustand stores
│   ├── hooks/           # Custom React Query hooks
│   └── App.tsx          # Root component
├── vercel.json          # Vercel configuration
└── vite.config.ts       # Vite configuration
```

## Mock Data

This demo includes sample data for:
- **4 Users**: 1 admin, 1 manager, 2 employees
- **5 Surveys**: Various statuses (active, draft, closed)
- **Multiple Questions**: Different question types per survey
- **Sample Responses**: Pre-populated response data
- **Analytics Data**: Dashboard statistics and charts

## Troubleshooting

### Build Fails

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Vite Cache Issues

```bash
rm -rf node_modules/.vite
npm run dev
```

## License

MIT License - For demonstration purposes only.

---

**Note**: This is a demo version with mock data. For the full production system with backend, see the main AMSteel Survey System repository.
