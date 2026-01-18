import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useAuthStore } from '@/store/authStore'
import { FileText, Eye, EyeOff, AlertCircle, Info } from 'lucide-react'

export default function LoginPage() {
  const { t } = useTranslation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const navigate = useNavigate()
  const { login, error: authError, clearError } = useAuthStore()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    clearError()

    try {
      // Call mock API login
      await login(email, password)

      // Get user from store after successful login
      const user = useAuthStore.getState().user

      // Navigate based on role
      if (user) {
        switch (user.role) {
          case 'admin':
          case 'manager':
            navigate('/admin/dashboard')
            break
          case 'employee':
            navigate('/employee/dashboard')
            break
          default:
            navigate('/')
        }
      }

    } catch (error: any) {
      console.error('Login error:', error)
      setError(error.message || t('login.invalidCredentials'))
    } finally {
      setIsLoading(false)
    }
  }

  const fillDemoCredentials = (type: 'admin' | 'employee') => {
    if (type === 'admin') {
      setEmail('admin@amsteel.demo')
      setPassword('demo123')
    } else {
      setEmail('sarah@amsteel.demo')
      setPassword('demo123')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Demo Banner */}
        <div className="mb-4 p-3 bg-blue-100 border border-blue-200 rounded-lg">
          <div className="flex items-start gap-2">
            <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-800">
              <strong>{t('login.demoBanner.title')}</strong> - {t('login.demoBanner.description')}
            </div>
          </div>
        </div>

        <Card className="shadow-xl">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <FileText className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="text-2xl font-bold">{t('login.title')}</CardTitle>
            <CardDescription>
              {t('login.subtitle')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-center mb-2">
                {t('login.welcome')}
              </h2>
              <p className="text-sm text-muted-foreground text-center">
                {t('login.welcomeDescription')}
              </p>
            </div>

            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">{t('login.email')}</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t('login.emailPlaceholder')}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">{t('login.password')}</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={t('login.passwordPlaceholder')}
                    required
                    className="pe-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute end-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="remember"
                    checked={rememberMe}
                    onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                  />
                  <Label htmlFor="remember" className="text-sm">
                    {t('login.rememberMe')}
                  </Label>
                </div>
                <Button variant="link" className="p-0 h-auto text-sm">
                  {t('login.forgotPassword')}
                </Button>
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? t('login.signingIn') : t('login.signIn')}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                {t('login.noAccount')}{' '}
                <Link to="/register" className="text-primary hover:underline">
                  {t('login.createAccount')}
                </Link>
              </p>
            </div>

            {/* Demo Credentials */}
            <div className="mt-6 p-4 bg-muted/50 rounded-lg border">
              <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <Info className="h-4 w-4" />
                {t('login.demoCredentials')}
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-2 bg-background rounded border">
                  <div>
                    <div className="font-medium text-sm">{t('login.adminAccount')}</div>
                    <div className="text-xs text-muted-foreground">admin@amsteel.demo / demo123</div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => fillDemoCredentials('admin')}
                    type="button"
                  >
                    {t('login.use')}
                  </Button>
                </div>
                <div className="flex items-center justify-between p-2 bg-background rounded border">
                  <div>
                    <div className="font-medium text-sm">{t('login.employeeAccount')}</div>
                    <div className="text-xs text-muted-foreground">sarah@amsteel.demo / demo123</div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => fillDemoCredentials('employee')}
                    type="button"
                  >
                    {t('login.use')}
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground mt-4">
          {t('login.footer')}
        </p>
      </div>
    </div>
  )
}
