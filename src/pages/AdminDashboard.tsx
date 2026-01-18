import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { searchSurveys } from '@/lib/smartSearch'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import {
  Plus,
  Download,
  Eye,
  Edit,
  ChevronDown,
  BarChart3,
  Users,
  TrendingUp,
  FileText,
  Calendar,
  Target,
  CheckCircle,
  Play,
  MoreHorizontal,
  Share2,
  Trash2,
  Copy,
  Loader2
} from 'lucide-react'
import { toast } from 'react-hot-toast'
import { useSurveys, useCreateSurvey, useDeleteSurvey, usePublishSurvey, usePauseSurvey, useCloseSurvey, useDuplicateSurvey } from '@/hooks/useSurveys'
import { useDashboardStats } from '@/hooks/useAnalytics'
import { useExportCSV, useExportExcel, useExportPDF } from '@/hooks/useExports'
import { useAuthStore } from '@/store/authStore'

// Import new components
import ResponseManagement from '@/components/admin/ResponseManagement'
import ClientTracking from '@/components/admin/ClientTracking'
import SurveySharing from '@/components/admin/SurveySharing'
import SurveySettings from '@/components/admin/SurveySettings'
import UserManagement from '@/components/admin/UserManagement'

export default function AdminDashboard() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { user } = useAuthStore()
  const [activeTab, setActiveTab] = useState('overview')
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [clientFilter, setClientFilter] = useState('all')
  const [selectedSurveys, setSelectedSurveys] = useState<string[]>([])
  const [selectedSurveyForSharing, setSelectedSurveyForSharing] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [limit] = useState(20)

  // Fetch surveys from API
  const { data: surveysData, isLoading, error } = useSurveys({
    page,
    limit,
    status: statusFilter !== 'all' ? statusFilter : undefined,
    search: searchTerm || undefined,
  })

  // Fetch dashboard stats from API
  const { data: dashboardStatsData, isLoading: isLoadingStats } = useDashboardStats()

  // Mutations
  const createMutation = useCreateSurvey()
  const deleteMutation = useDeleteSurvey()
  const publishMutation = usePublishSurvey()
  const pauseMutation = usePauseSurvey()
  const closeMutation = useCloseSurvey()
  const duplicateMutation = useDuplicateSurvey()

  // Export mutations
  const exportCSVMutation = useExportCSV()
  const exportExcelMutation = useExportExcel()
  const exportPDFMutation = useExportPDF()

  // Get surveys from API response
  const surveys = surveysData?.data || []
  const pagination = surveysData?.pagination

  // Get unique clients for filter dropdown
  // NOTE: This must be called before any early returns (Rules of Hooks)
  const uniqueClients = useMemo(() => {
    if (!Array.isArray(surveys)) return []
    return [...new Set(surveys
      .filter(survey => survey.client_name)
      .map(survey => survey.client_name)
    )]
  }, [surveys])

  // Use stats from API or fallback to calculated stats
  const stats = useMemo(() => {
    if (dashboardStatsData?.data) {
      // Use API data
      return {
        totalSurveys: dashboardStatsData.data.total_surveys || 0,
        activeSurveys: dashboardStatsData.data.active_surveys || 0,
        totalResponses: dashboardStatsData.data.total_responses || 0,
        completionRate: dashboardStatsData.data.completion_rate || 0,
        thisMonth: dashboardStatsData.data.surveys_this_month || 0,
        lastMonth: dashboardStatsData.data.surveys_last_month || 0,
        totalClients: dashboardStatsData.data.total_clients || 0
      }
    }

    // Fallback: Calculate stats from surveys data
    if (!Array.isArray(surveys)) {
      return {
        totalSurveys: 0,
        activeSurveys: 0,
        totalResponses: 0,
        completionRate: 0,
        thisMonth: 0,
        lastMonth: 0,
        totalClients: 0
      }
    }

    const totalResponses = surveys.reduce((sum, s) => sum + s.total_responses, 0)
    const completedResponses = surveys.reduce((sum, s) => sum + s.completed_responses, 0)
    const avgCompletionRate = totalResponses > 0 ? Math.round((completedResponses / totalResponses) * 100) : 0

    return {
      totalSurveys: pagination?.total || surveys.length,
      activeSurveys: surveys.filter(s => s.status === 'active').length,
      totalResponses,
      completionRate: avgCompletionRate,
      thisMonth: surveys.filter(s => {
        const createdDate = new Date(s.created_at)
        const now = new Date()
        return createdDate.getMonth() === now.getMonth() && createdDate.getFullYear() === now.getFullYear()
      }).length,
      lastMonth: 0,
      totalClients: uniqueClients.length
    }
  }, [dashboardStatsData, surveys, pagination, uniqueClients])

  // Filter surveys on client side for additional filtering
  const filteredSurveys = useMemo(() => {
    if (!Array.isArray(surveys)) return []
    return surveys.filter(survey => {
      const matchesClient = clientFilter === 'all' ||
                           (survey.client_name && survey.client_name === clientFilter)
      return matchesClient
    })
  }, [surveys, clientFilter])

  // Handle loading and error states (AFTER all hooks per Rules of Hooks)
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="mr-2 text-lg">{t('adminDashboard.loading')}</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="p-6">
          <p className="text-red-600">{t('adminDashboard.error')}</p>
        </Card>
      </div>
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'draft': return 'bg-gray-100 text-gray-800'
      case 'paused': return 'bg-yellow-100 text-yellow-800'
      case 'closed': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return t('adminDashboard.status.active')
      case 'draft': return t('adminDashboard.status.draft')
      case 'paused': return t('adminDashboard.status.paused')
      case 'closed': return t('adminDashboard.status.closed')
      default: return t('adminDashboard.status.unknown')
    }
  }

  // Survey Actions
  const handleViewSurvey = (surveyId: string) => {
    navigate(`/admin/survey-builder/${surveyId}?tab=preview`)
  }

  const handleEditSurvey = (surveyId: string) => {
    navigate(`/admin/survey-builder/${surveyId}`)
  }

  const handleViewAnalytics = (surveyId: string) => {
    navigate(`/admin/survey-builder/${surveyId}?tab=analytics`)
  }

  const handleShareSurvey = (surveyId: string) => {
    navigate(`/admin/survey-builder/${surveyId}?tab=sharing`)
  }

  const handleDuplicateSurvey = async (surveyId: string) => {
    try {
      await duplicateMutation.mutateAsync(surveyId)
    } catch (error) {
      // Error handled by mutation
    }
  }

  const handleDeleteSurvey = async (surveyId: string) => {
    if (confirm(t('adminDashboard.confirmDelete'))) {
      try {
        await deleteMutation.mutateAsync(surveyId)
      } catch (error) {
        // Error handled by mutation
      }
    }
  }

  const handlePublishSurvey = async (surveyId: string) => {
    try {
      await publishMutation.mutateAsync(surveyId)
    } catch (error) {
      // Error handled by mutation
    }
  }

  const handlePauseSurvey = async (surveyId: string) => {
    try {
      await pauseMutation.mutateAsync(surveyId)
    } catch (error) {
      // Error handled by mutation
    }
  }

  const handleCloseSurvey = async (surveyId: string) => {
    if (confirm(t('adminDashboard.confirmClose'))) {
      try {
        await closeMutation.mutateAsync(surveyId)
      } catch (error) {
        // Error handled by mutation
      }
    }
  }

  const handleExportData = async (format: 'csv' | 'excel' | 'pdf' = 'csv') => {
    // Check if at least one survey is selected
    if (selectedSurveys.length === 0) {
      toast.error(t('adminDashboard.export.selectOne'))
      return
    }

    // Check role-based restrictions for Excel export
    if (format === 'excel' && user?.role !== 'admin') {
      toast.error(t('adminDashboard.export.adminOnly'))
      return
    }

    try {
      if (format === 'csv') {
        await exportCSVMutation.mutateAsync(selectedSurveys)
      } else if (format === 'excel') {
        await exportExcelMutation.mutateAsync(selectedSurveys)
      } else if (format === 'pdf') {
        await exportPDFMutation.mutateAsync(selectedSurveys)
      }
      setSelectedSurveys([])
    } catch (error) {
      // Error is handled by mutation hooks
      console.error('Export failed:', error)
    }
  }

  const handleCreateSurvey = async () => {
    try {
      const newSurvey = await createMutation.mutateAsync({
        title: t('adminDashboard.newSurvey'),
        description: '',
        type: 'internal',
        duration_type: 'unlimited'
      })

      // Navigate to survey builder with the new survey ID
      navigate(`/admin/survey-builder/${newSurvey.id}`)
    } catch (error) {
      // Error toast already shown by mutation
      console.error('Failed to create survey:', error)
    }
  }

  const handleSelectSurvey = (surveyId: string) => {
    setSelectedSurveys(prev => 
      prev.includes(surveyId) 
        ? prev.filter(id => id !== surveyId)
        : [...prev, surveyId]
    )
  }

  const handleSelectAllSurveys = () => {
    if (selectedSurveys.length === filteredSurveys.length) {
      setSelectedSurveys([])
    } else {
      setSelectedSurveys(filteredSurveys.map(s => s.id))
    }
  }

  const getSelectedSurveyForSharing = () => {
    if (!selectedSurveyForSharing) return null
    return surveys.find(s => s.id === selectedSurveyForSharing)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{t('adminDashboard.title')}</h1>
          <p className="text-muted-foreground">
            {t('adminDashboard.subtitle')}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                disabled={selectedSurveys.length === 0}
              >
                <Download className="h-4 w-4 me-2" />
                {t('adminDashboard.buttons.export')}
                <ChevronDown className="h-4 w-4 ms-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => handleExportData('csv')}
                disabled={exportCSVMutation.isPending}
              >
                {exportCSVMutation.isPending ? (
                  <Loader2 className="h-4 w-4 me-2 animate-spin" />
                ) : (
                  <Download className="h-4 w-4 me-2" />
                )}
                {t('adminDashboard.export.csv')}
              </DropdownMenuItem>
              {user?.role === 'admin' && (
                <DropdownMenuItem
                  onClick={() => handleExportData('excel')}
                  disabled={exportExcelMutation.isPending}
                >
                  {exportExcelMutation.isPending ? (
                    <Loader2 className="h-4 w-4 me-2 animate-spin" />
                  ) : (
                    <Download className="h-4 w-4 me-2" />
                  )}
                  {t('adminDashboard.export.excel')}
                </DropdownMenuItem>
              )}
              <DropdownMenuItem
                onClick={() => handleExportData('pdf')}
                disabled={exportPDFMutation.isPending}
              >
                {exportPDFMutation.isPending ? (
                  <Loader2 className="h-4 w-4 me-2 animate-spin" />
                ) : (
                  <Download className="h-4 w-4 me-2" />
                )}
                {t('adminDashboard.export.pdf')}
              </DropdownMenuItem>
              {selectedSurveys.length > 0 && (
                <div className="px-2 py-1 text-xs text-muted-foreground border-t">
                  {t('adminDashboard.export.selectedCount')}: {selectedSurveys.length}
                </div>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
          <Button onClick={handleCreateSurvey} disabled={createMutation.isPending}>
            {createMutation.isPending ? (
              <Loader2 className="h-4 w-4 me-2 animate-spin" />
            ) : (
              <Plus className="h-4 w-4 me-2" />
            )}
            {createMutation.isPending ? t('adminDashboard.creating') : t('adminDashboard.newSurvey')}
          </Button>
        </div>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">{t('adminDashboard.quickActions.title')}</h3>
              <p className="text-sm text-muted-foreground">{t('adminDashboard.quickActions.description')}</p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={handleCreateSurvey}
                disabled={createMutation.isPending}
                className="flex items-center gap-2"
              >
                {createMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Plus className="h-4 w-4" />
                )}
                <span>{createMutation.isPending ? t('adminDashboard.creating') : t('adminDashboard.buttons.createSurvey')}</span>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    disabled={selectedSurveys.length === 0}
                    className="flex items-center gap-2"
                  >
                    <Download className="h-4 w-4" />
                    <span>{t('adminDashboard.buttons.export')}</span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleExportData('csv')}>
                    <Download className="h-4 w-4 me-2" />
                    {t('adminDashboard.export.csv')}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleExportData('pdf')}>
                    <Download className="h-4 w-4 me-2" />
                    {t('adminDashboard.export.pdf')}
                  </DropdownMenuItem>
                  {selectedSurveys.length > 0 && (
                    <div className="px-2 py-1 text-xs text-muted-foreground border-t">
                      {t('adminDashboard.export.selectedCount')}: {selectedSurveys.length}
                    </div>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
              <Button
                variant="outline"
                onClick={() => setActiveTab('settings')}
                className="flex items-center gap-2"
              >
                <Target className="h-4 w-4" />
                <span>{t('adminDashboard.buttons.advancedSettings')}</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>


      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{t('adminDashboard.stats.totalSurveys')}</p>
                <p className="text-2xl font-bold">{stats.totalSurveys}</p>
              </div>
              <div className="h-8 w-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <FileText className="h-4 w-4 text-blue-600" />
              </div>
            </div>
            <div className="mt-2 flex items-center text-sm">
              <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
              <span className="text-green-600">+12%</span>
              <span className="text-muted-foreground ms-2">{t('adminDashboard.stats.fromLastMonth')}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{t('adminDashboard.stats.activeSurveys')}</p>
                <p className="text-2xl font-bold">{stats.activeSurveys}</p>
              </div>
              <div className="h-8 w-8 bg-green-100 rounded-lg flex items-center justify-center">
                <Play className="h-4 w-4 text-green-600" />
              </div>
            </div>
            <div className="mt-2 flex items-center text-sm">
              <CheckCircle className="h-4 w-4 text-green-600 mr-1" />
              <span className="text-green-600">{t('adminDashboard.stats.allTime')}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{t('adminDashboard.stats.totalResponses')}</p>
                <p className="text-2xl font-bold">{stats.totalResponses}</p>
              </div>
              <div className="h-8 w-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <Users className="h-4 w-4 text-purple-600" />
              </div>
            </div>
            <div className="mt-2 flex items-center text-sm">
              <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
              <span className="text-green-600">+18%</span>
              <span className="text-muted-foreground ms-2">{t('adminDashboard.stats.fromLastMonth')}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{t('adminDashboard.stats.completionRate')}</p>
                <p className="text-2xl font-bold">{stats.completionRate}%</p>
              </div>
              <div className="h-8 w-8 bg-orange-100 rounded-lg flex items-center justify-center">
                <Target className="h-4 w-4 text-orange-600" />
              </div>
            </div>
            <div className="mt-2 flex items-center text-sm">
              <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
              <span className="text-green-600">+5%</span>
              <span className="text-muted-foreground ms-2">{t('adminDashboard.stats.fromLastMonth')}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{t('adminDashboard.stats.clients')}</p>
                <p className="text-2xl font-bold">{stats.totalClients}</p>
              </div>
              <div className="h-8 w-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                <Users className="h-4 w-4 text-indigo-600" />
              </div>
            </div>
            <div className="mt-2 flex items-center text-sm">
              <span className="text-muted-foreground">{t('adminDashboard.stats.activeClients')}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="inline-flex h-auto w-full flex-wrap items-center justify-start gap-2 bg-muted p-2 rounded-lg">
          <TabsTrigger value="overview" className="flex-shrink-0">{t('adminDashboard.tabs.overview')}</TabsTrigger>
          <TabsTrigger value="surveys" className="flex-shrink-0">{t('adminDashboard.tabs.surveys')}</TabsTrigger>
          <TabsTrigger value="responses" className="flex-shrink-0">{t('adminDashboard.tabs.responses')}</TabsTrigger>
          <TabsTrigger value="clients" className="flex-shrink-0">{t('adminDashboard.tabs.clients')}</TabsTrigger>
          {user?.role === 'admin' && (
            <TabsTrigger value="users" className="flex-shrink-0">{t('adminDashboard.tabs.users')}</TabsTrigger>
          )}
          <TabsTrigger value="settings" className="flex-shrink-0">{t('adminDashboard.tabs.settings')}</TabsTrigger>
          <TabsTrigger value="sharing" className="flex-shrink-0">{t('adminDashboard.sharing.tab')}</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>{t('adminDashboard.recentSurveys.title')}</CardTitle>
                <CardDescription>
                  {t('adminDashboard.recentSurveys.description')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {(Array.isArray(surveys) ? surveys : []).slice(0, 3).map((survey) => (
                    <div key={survey.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center">
                          <FileText className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{survey.title}</p>
                          <p className="text-sm text-muted-foreground">{survey.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(survey.status)}>
                          {getStatusText(survey.status)}
                        </Badge>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t('adminDashboard.monthlyStats.title')}</CardTitle>
                <CardDescription>
                  {t('adminDashboard.monthlyStats.description')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{t('adminDashboard.monthlyStats.newResponses')}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold">{stats.thisMonth}</span>
                      <Badge variant="secondary" className="text-green-600">
                        +{stats.thisMonth - stats.lastMonth}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{t('adminDashboard.monthlyStats.activeSurveys')}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold">{stats.activeSurveys}</span>
                      <Badge variant="secondary" className="text-blue-600">
                        +2
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{t('adminDashboard.monthlyStats.completionRate')}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold">{stats.completionRate}%</span>
                      <Badge variant="secondary" className="text-green-600">
                        +5%
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Surveys Tab */}
        <TabsContent value="surveys" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{t('adminDashboard.surveys.title')}</CardTitle>
                  <CardDescription>
                    {t('adminDashboard.surveys.description')}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={selectedSurveys.length === filteredSurveys.length && filteredSurveys.length > 0}
                      onCheckedChange={handleSelectAllSurveys}
                    />
                    <span className="text-sm text-muted-foreground">
                      {t('adminDashboard.surveys.selectAll')} ({selectedSurveys.length}/{filteredSurveys.length})
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Input
                      placeholder={t('adminDashboard.surveys.searchPlaceholder')}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-64"
                    />
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">{t('adminDashboard.filters.all')}</SelectItem>
                        <SelectItem value="active">{t('adminDashboard.status.active')}</SelectItem>
                        <SelectItem value="draft">{t('adminDashboard.status.draft')}</SelectItem>
                        <SelectItem value="paused">{t('adminDashboard.status.paused')}</SelectItem>
                        <SelectItem value="closed">{t('adminDashboard.status.closed')}</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={clientFilter} onValueChange={setClientFilter}>
                      <SelectTrigger className="w-48">
                        <SelectValue placeholder={t('adminDashboard.filters.byClient')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">{t('adminDashboard.filters.allClients')}</SelectItem>
                        {uniqueClients.map((client) => (
                          <SelectItem key={client} value={client || ''}>
                            {client}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredSurveys.map((survey) => (
                  <div key={survey.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-4">
                      <Checkbox
                        checked={selectedSurveys.includes(survey.id)}
                        onCheckedChange={() => handleSelectSurvey(survey.id)}
                      />
                      <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center">
                        <FileText className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="font-medium">{survey.title}</h3>
                          <Badge variant="outline" className="text-xs">
                            {survey.type === 'internal' ? t('adminDashboard.surveyType.internal') : t('adminDashboard.surveyType.external')}
                          </Badge>
                          {survey.client_name && (
                            <Badge variant="secondary" className="text-xs">
                              {survey.client_name}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{survey.description}</p>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            <span>{survey.responses}/{survey.target} {t('adminDashboard.surveys.responses')}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>{t('adminDashboard.surveys.createdOn')} {survey.created_at}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(survey.status)}>
                        {getStatusText(survey.status)}
                      </Badge>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleViewSurvey(survey.id)}
                          title={t('adminDashboard.actions.view')}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditSurvey(survey.id)}
                          title={t('adminDashboard.actions.edit')}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setSelectedSurveyForSharing(survey.id)
                            setActiveTab('sharing')
                          }}
                          title={t('adminDashboard.actions.share')}
                        >
                          <Share2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleViewAnalytics(survey.id)}
                          title={t('adminDashboard.actions.analytics')}
                        >
                          <BarChart3 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleShareSurvey(survey.id)}
                          title={t('adminDashboard.actions.share')}
                        >
                          <Share2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDuplicateSurvey(survey.id)}
                          title={t('adminDashboard.actions.duplicate')}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteSurvey(survey.id)}
                          title={t('adminDashboard.actions.delete')}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Responses Tab */}
        <TabsContent value="responses" className="space-y-6">
          <ResponseManagement 
            surveyId={undefined}
            onExport={(responses, format) => {
              console.log('Export responses:', responses.length, 'format:', format)
              
              if (format === 'csv') {
                // CSV export logic
                const csvContent = responses.map(r =>
                  `"${r.surveyTitle}","${r.respondentName || t('adminDashboard.export.anonymous')}","${r.status}","${r.startedAt}"`
                ).join('\n')
                const csvHeader = `${t('adminDashboard.export.csvHeaders.survey')},${t('adminDashboard.export.csvHeaders.respondent')},${t('adminDashboard.export.csvHeaders.status')},${t('adminDashboard.export.csvHeaders.date')}\n`
                const blob = new Blob([csvHeader + csvContent], { type: 'text/csv;charset=utf-8;' })
                const url = URL.createObjectURL(blob)
                const a = document.createElement('a')
                a.href = url
                a.download = `responses-export-${new Date().toISOString().split('T')[0]}.csv`
                document.body.appendChild(a)
                a.click()
                document.body.removeChild(a)
                URL.revokeObjectURL(url)
              } else if (format === 'pdf') {
                // PDF export would be handled by a PDF library
                console.log('PDF export would be implemented with a PDF library')
              }


              toast.success(t('adminDashboard.export.successMessage', { count: responses.length, format: format.toUpperCase() }))
            }}
          />
        </TabsContent>

        {/* Clients Tab */}
        <TabsContent value="clients" className="space-y-6">
          <ClientTracking 
            onExport={(clients, format) => {
              console.log('Export clients:', clients.length, 'format:', format)
              
              if (format === 'csv') {
                // CSV export logic
                const csvContent = clients.map(c =>
                  `"${c.name}","${c.company}","${c.email}","${c.totalSurveys}","${c.averageRating}","${c.status}"`
                ).join('\n')
                const csvHeader = `${t('adminDashboard.export.csvHeaders.name')},${t('adminDashboard.export.csvHeaders.company')},${t('adminDashboard.export.csvHeaders.email')},${t('adminDashboard.export.csvHeaders.surveys')},${t('adminDashboard.export.csvHeaders.rating')},${t('adminDashboard.export.csvHeaders.status')}\n`
                const blob = new Blob([csvHeader + csvContent], { type: 'text/csv;charset=utf-8;' })
                const url = URL.createObjectURL(blob)
                const a = document.createElement('a')
                a.href = url
                a.download = `clients-export-${new Date().toISOString().split('T')[0]}.csv`
                document.body.appendChild(a)
                a.click()
                document.body.removeChild(a)
                URL.revokeObjectURL(url)
              } else if (format === 'pdf') {
                // PDF export would be handled by a PDF library
                console.log('PDF export would be implemented with a PDF library')
              }


              toast.success(t('adminDashboard.export.clientsExported', { count: clients.length, format: format.toUpperCase() }))
            }}
          />
        </TabsContent>


        {/* Users Tab (Admin only) */}
        {user?.role === 'admin' && (
          <TabsContent value="users" className="space-y-6">
            <UserManagement />
          </TabsContent>
        )}

        {/* Analytics Tab */}
        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-6">
          <SurveySettings
            survey={{
              id: "1",
              title: t('adminDashboard.sampleSurvey.title'),
              description: t('adminDashboard.sampleSurvey.description'),
              type: "internal",
              status: "active",
              settings: {
                allowAnonymous: false,
                allowMultipleResponses: false,
                requireLogin: true,
                durationType: "unlimited",
                allowEditing: false,
                showProgressBar: true,
                trackIP: true,
                trackLocation: false,
                collectEmail: false,
                allowFileUpload: false,
                enableConditionalLogic: false,
                enableSkipLogic: false
              }
            }}
            onUpdate={(updates) => {
              console.log('Survey updated:', updates)
            }}
          />
        </TabsContent>

        {/* Sharing Tab */}
        <TabsContent value="sharing" className="space-y-6">
          {!selectedSurveyForSharing ? (
            <Card>
              <CardHeader>
                <CardTitle>{t('adminDashboard.sharing.title')}</CardTitle>
                <CardDescription>
                  {t('adminDashboard.sharing.chooseDescription')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center py-8">
                    <Share2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">{t('adminDashboard.sharing.selectSurvey')}</h3>
                    <p className="text-muted-foreground mb-4">
                      {t('adminDashboard.sharing.selectDescription')}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label>{t('adminDashboard.sharing.availableSurveys')}</Label>
                    <Select value={selectedSurveyForSharing || ''} onValueChange={setSelectedSurveyForSharing}>
                      <SelectTrigger>
                        <SelectValue placeholder={t('adminDashboard.sharing.selectPlaceholder')} />
                      </SelectTrigger>
                      <SelectContent>
                        {filteredSurveys.map((survey) => (
                          <SelectItem key={survey.id} value={survey.id}>
                            <div className="flex items-center gap-2">
                              <span>{survey.title}</span>
                              <Badge variant="outline" className="text-xs">
                                {survey.type === 'internal' ? t('adminDashboard.surveyType.internal') : t('adminDashboard.surveyType.external')}
                              </Badge>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium">{t('adminDashboard.sharing.title')}</h3>
                  <p className="text-muted-foreground">
                    {getSelectedSurveyForSharing()?.title}
                  </p>
                </div>
                <Button
                  variant="outline"
                  onClick={() => setSelectedSurveyForSharing(null)}
                >
                  {t('adminDashboard.sharing.changeSurvey')}
                </Button>
              </div>
              
              <SurveySharing 
                surveyId={selectedSurveyForSharing}
                surveyTitle={getSelectedSurveyForSharing()?.title || ''}
                surveyUrl={`https://survey.example.com/survey/${selectedSurveyForSharing}`}
                isPublic={getSelectedSurveyForSharing()?.status === 'active'}
                onShare={(method, data) => {
                  switch (method) {
                    case 'email':
                      toast.success(t('adminDashboard.sharing.emailSent'))
                      break
                    case 'social':
                      toast.success(t('adminDashboard.sharing.socialShared'))
                      break
                    case 'link':
                      navigator.clipboard.writeText(data.url)
                      toast.success(t('adminDashboard.sharing.linkCopied'))
                      break
                    case 'embed':
                      navigator.clipboard.writeText(data.embedCode)
                      toast.success(t('adminDashboard.sharing.embedCopied'))
                      break
                    default:
                      toast.success(t('adminDashboard.sharing.success'))
                  }
                }}
              />
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}