import React, { Component, ErrorInfo, ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
  errorInfo?: ErrorInfo
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
    this.setState({ errorInfo })
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined })
  }

  handleGoHome = () => {
    window.location.href = '/'
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
          <Card className="max-w-2xl w-full">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-red-100 rounded-lg">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">حدث خطأ غير متوقع</h2>
                  <p className="text-sm text-muted-foreground">
                    نعتذر عن الإزعاج. حدث خطأ أثناء تحميل هذا المحتوى.
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Error Details (Development Mode) */}
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <div className="bg-gray-100 p-4 rounded-lg space-y-2">
                  <p className="font-semibold text-sm text-red-600">
                    رسالة الخطأ (Development):
                  </p>
                  <pre className="text-xs overflow-auto p-2 bg-white rounded border max-h-32">
                    {this.state.error.toString()}
                  </pre>
                  {this.state.errorInfo && (
                    <>
                      <p className="font-semibold text-sm text-red-600 mt-3">
                        Component Stack:
                      </p>
                      <pre className="text-xs overflow-auto p-2 bg-white rounded border max-h-48">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    </>
                  )}
                </div>
              )}

              {/* User Actions */}
              <div className="flex items-center space-x-3">
                <Button onClick={this.handleReset} className="flex-1">
                  <RefreshCw className="h-4 w-4 ml-2" />
                  إعادة المحاولة
                </Button>
                <Button onClick={this.handleGoHome} variant="outline" className="flex-1">
                  <Home className="h-4 w-4 ml-2" />
                  العودة للرئيسية
                </Button>
              </div>

              {/* Help Text */}
              <Alert>
                <AlertTitle className="text-sm">نصائح لحل المشكلة:</AlertTitle>
                <AlertDescription>
                  <ul className="text-sm mt-2 space-y-1 mr-4">
                    <li>• حاول تحديث الصفحة (F5)</li>
                    <li>• امسح ذاكرة التخزين المؤقت للمتصفح</li>
                    <li>• تأكد من اتصالك بالإنترنت</li>
                    <li>• إذا استمرت المشكلة، اتصل بالدعم الفني</li>
                  </ul>
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </div>
      )
    }

    return this.props.children
  }
}
