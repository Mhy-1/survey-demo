import { Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { lazy, Suspense, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import LoadingSpinner from './components/common/LoadingSpinner'

// Lazy load route components for better code splitting
const LoginPage = lazy(() => import('./pages/LoginPage'))
const RegisterPage = lazy(() => import('./pages/RegisterPage'))
const AdvancedAdminDashboard = lazy(() => import('./pages/AdvancedAdminDashboard'))
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'))
const EmployeeDashboard = lazy(() => import('./pages/EmployeeDashboard'))
const SurveyBuilder = lazy(() => import('./pages/SurveyBuilder'))
const SurveyViewer = lazy(() => import('./pages/SurveyViewer'))
const PublicSurvey = lazy(() => import('./pages/PublicSurvey'))
const ProfilePage = lazy(() => import('./pages/ProfilePage'))
const SettingsPage = lazy(() => import('./pages/SettingsPage'))
const SystemConfigurationPage = lazy(() => import('./pages/SystemConfigurationPage'))

// Components (not lazy loaded as they're used frequently)
import ProtectedRoute from './components/ProtectedRoute'
import Layout from './components/Layout'

function App() {
  const { i18n } = useTranslation()

  // Update HTML lang and dir attributes when language changes
  useEffect(() => {
    const lang = i18n.language
    document.documentElement.lang = lang
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr'
  }, [i18n.language])

  return (
    <div className="min-h-screen bg-background">
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/survey/:slug" element={<PublicSurvey />} />
          <Route path="/survey/preview" element={<PublicSurvey />} />
        
        {/* Advanced Admin Routes (System Management - Admin Only) */}
        <Route path="/admin/advanced" element={
          <ProtectedRoute requiredRole={['admin']}>
            <Layout>
              <AdvancedAdminDashboard />
            </Layout>
          </ProtectedRoute>
        } />

        {/* Legacy route redirect for backwards compatibility */}
        <Route path="/developer/dashboard" element={
          <ProtectedRoute requiredRole={['admin']}>
            <Layout>
              <AdvancedAdminDashboard />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/developer" element={<Navigate to="/admin/advanced" replace />} />

        {/* Admin Routes */}
        <Route path="/admin/dashboard" element={
          <ProtectedRoute requiredRole={['admin']}>
            <Layout>
              <AdminDashboard />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/admin/survey-builder/:id?" element={
          <ProtectedRoute requiredRole={['admin']}>
            <Layout>
              <SurveyBuilder />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/developer/system-config" element={<Navigate to="/admin/advanced" replace />} />

        {/* Employee Routes */}
        <Route path="/employee/dashboard" element={
          <ProtectedRoute requiredRole={['employee']}>
            <Layout>
              <EmployeeDashboard />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/employee/survey/:id" element={
          <ProtectedRoute requiredRole={['employee']}>
            <Layout>
              <SurveyViewer />
            </Layout>
          </ProtectedRoute>
        } />

        {/* Profile and Settings Routes (for all authenticated users) */}
        <Route path="/profile" element={
          <ProtectedRoute requiredRole={['admin', 'manager', 'employee']}>
            <Layout>
              <ProfilePage />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/settings" element={
          <ProtectedRoute requiredRole={['admin', 'manager', 'employee']}>
            <Layout>
              <SettingsPage />
            </Layout>
          </ProtectedRoute>
        } />

          {/* Default redirect */}
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </Suspense>

      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: 'hsl(var(--card))',
            color: 'hsl(var(--card-foreground))',
            border: '1px solid hsl(var(--border))',
          },
        }}
      />
    </div>
  )
}

export default App
