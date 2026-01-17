import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { formatDate } from '@/lib/utils'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Users,
  UserCheck,
  FileText,
  BarChart3,
  TrendingUp,
  Plus,
  Activity,
  Shield,
  Database,
  Crown,
  Target,
  CheckCircle,
  AlertCircle,
  Clock,
  Settings
} from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { useCreateSurvey } from '@/hooks/useSurveys'
import toast from 'react-hot-toast'

// Import new components
import EmployeeManagement from '@/components/developer/EmployeeManagement'
import SystemStatistics from '@/components/developer/SystemStatistics'
import ActivityLog from '@/components/developer/ActivityLog'
import NotificationSystem from '@/components/developer/NotificationSystem'
import SystemConfiguration from '@/components/developer/SystemConfiguration'
import AdvancedResponseManagement from '@/components/developer/AdvancedResponseManagement'
import BackupRestore from '@/components/developer/BackupRestore'

export default function AdvancedAdminDashboard() {
  const { t } = useTranslation()
  const { user } = useAuthStore()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('overview')
  const createSurveyMutation = useCreateSurvey()

  // Mock data
  const stats = {
    totalEmployees: 156,
    totalAdmins: 8,
    totalSurveys: 45,
    totalResponses: 1247,
    newEmployeesThisWeek: 3,
    newEmployeesThisMonth: 12,
    activeSurveys: 12,
    completedSurveys: 33,
    averageResponseRate: 78.5,
    systemUptime: '99.9%',
    lastBackup: '2024-01-20T02:00:00Z',
    storageUsed: '2.3 GB',
    totalStorage: '10 GB'
  }

  const recentActivity = [
    {
      id: '1',
      type: 'employee_registered',
      message: 'سجل الموظف أحمد محمد',
      timestamp: '2024-01-20T10:30:00Z',
      user: 'أحمد محمد'
    },
    {
      id: '2',
      type: 'survey_created',
      message: 'أنشئ استطلاع رضا الموظفين',
      timestamp: '2024-01-20T09:15:00Z',
      user: 'فاطمة أحمد'
    },
    {
      id: '3',
      type: 'promotion',
      message: 'تم ترقية محمد السعيد إلى مدير',
      timestamp: '2024-01-19T16:45:00Z',
      user: 'المطور الرئيسي'
    }
  ]


  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'employee_registered': return <Users className="h-4 w-4 text-blue-600" />
      case 'survey_created': return <FileText className="h-4 w-4 text-green-600" />
      case 'promotion': return <Crown className="h-4 w-4 text-purple-600" />
      default: return <Activity className="h-4 w-4 text-gray-600" />
    }
  }

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'employee_registered': return 'text-blue-600'
      case 'survey_created': return 'text-green-600'
      case 'promotion': return 'text-purple-600'
      default: return 'text-gray-600'
    }
  }

  // Handler to create a new survey
  const handleCreateSurvey = async () => {
    try {
      const newSurvey = await createSurveyMutation.mutateAsync({
        title: 'استطلاع جديد',
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

  return (
    <div className="space-y-8 p-6">
      {/* Header with better styling */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              لوحة الإدارة المتقدمة
            </h1>
          </div>
          <p className="text-muted-foreground text-sm mr-11">
            مرحباً {user?.full_name}، إليك نظرة شاملة على إدارة النظام
          </p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <Button
            variant="outline"
            onClick={() => navigate('/admin/dashboard')}
            className="gap-2 hover:bg-primary/5 transition-colors"
          >
            <Users className="h-4 w-4" />
            العودة للوحة الرئيسية
          </Button>
          <Button
            onClick={handleCreateSurvey}
            disabled={createSurveyMutation.isPending}
            className="gap-2 bg-primary hover:bg-primary/90 transition-colors"
          >
            <Plus className="h-4 w-4" />
            {createSurveyMutation.isPending ? 'جاري الإنشاء...' : 'إنشاء استطلاع جديد'}
          </Button>
        </div>
      </div>

      {/* Main Content with Enhanced Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <div className="bg-card/50 rounded-lg p-2 border">
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-9 gap-2 h-auto bg-transparent">
            <TabsTrigger
              value="overview"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all"
            >
              نظرة عامة
            </TabsTrigger>
            <TabsTrigger
              value="employees"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all"
            >
              الموظفون
            </TabsTrigger>
            <TabsTrigger
              value="responses"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all"
            >
              الردود
            </TabsTrigger>
            <TabsTrigger
              value="statistics"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all"
            >
              الإحصائيات
            </TabsTrigger>
            <TabsTrigger
              value="activity"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all"
            >
              سجل الأنشطة
            </TabsTrigger>
            <TabsTrigger
              value="notifications"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all"
            >
              الإشعارات
            </TabsTrigger>
            <TabsTrigger
              value="configuration"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all"
            >
              الإعدادات
            </TabsTrigger>
            <TabsTrigger
              value="backup"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all"
            >
              النسخ الاحتياطية
            </TabsTrigger>
            <TabsTrigger
              value="system"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all"
            >
              النظام
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-8">
          {/* Stats Cards with Enhanced Styling */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-blue-500 hover:scale-105">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  إجمالي الموظفين
                </CardTitle>
                <div className="p-2 bg-blue-50 rounded-lg">
                  <Users className="h-5 w-5 text-blue-600" />
                </div>
              </CardHeader>
              <CardContent className="space-y-1">
                <div className="text-3xl font-bold text-blue-600">{stats.totalEmployees}</div>
                <p className="text-xs text-green-600 font-medium flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  +{stats.newEmployeesThisWeek} هذا الأسبوع
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-purple-500 hover:scale-105">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  المديرين
                </CardTitle>
                <div className="p-2 bg-purple-50 rounded-lg">
                  <UserCheck className="h-5 w-5 text-purple-600" />
                </div>
              </CardHeader>
              <CardContent className="space-y-1">
                <div className="text-3xl font-bold text-purple-600">{stats.totalAdmins}</div>
                <p className="text-xs text-muted-foreground font-medium">
                  يمكنهم إنشاء الاستطلاعات
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-green-500 hover:scale-105">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  الاستطلاعات
                </CardTitle>
                <div className="p-2 bg-green-50 rounded-lg">
                  <FileText className="h-5 w-5 text-green-600" />
                </div>
              </CardHeader>
              <CardContent className="space-y-1">
                <div className="text-3xl font-bold text-green-600">{stats.totalSurveys}</div>
                <p className="text-xs text-muted-foreground font-medium">
                  {stats.activeSurveys} استطلاع نشط
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-orange-500 hover:scale-105">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  الردود
                </CardTitle>
                <div className="p-2 bg-orange-50 rounded-lg">
                  <BarChart3 className="h-5 w-5 text-orange-600" />
                </div>
              </CardHeader>
              <CardContent className="space-y-1">
                <div className="text-3xl font-bold text-orange-600">{stats.totalResponses.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground font-medium">
                  {stats.averageResponseRate}% معدل الاستجابة
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity - Enhanced */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="border-b pb-4">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  <CardTitle>النشاط الأخير</CardTitle>
                </div>
                <CardDescription>
                  آخر الأنشطة في النظام
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                      <div className={`flex-shrink-0 p-2 rounded-lg ${getActivityColor(activity.type)}`}>
                        {getActivityIcon(activity.type)}
                      </div>
                      <div className="flex-1 min-w-0 space-y-1">
                        <p className="text-sm font-medium leading-tight">{activity.message}</p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <span>بواسطة {activity.user}</span>
                          <span>•</span>
                          <span>{formatDate(activity.timestamp)}</span>
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="border-b pb-4">
                <div className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-primary" />
                  <CardTitle>حالة النظام</CardTitle>
                </div>
                <CardDescription>
                  مؤشرات الأداء التقنية
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-50 rounded-lg">
                        <Shield className="h-4 w-4 text-green-600" />
                      </div>
                      <span className="text-sm font-medium">الأمان</span>
                    </div>
                    <Badge className="bg-green-100 text-green-800 hover:bg-green-200 transition-colors">
                      آمن
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-50 rounded-lg">
                        <Activity className="h-4 w-4 text-blue-600" />
                      </div>
                      <span className="text-sm font-medium">وقت التشغيل</span>
                    </div>
                    <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200 transition-colors">
                      {stats.systemUptime}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-50 rounded-lg">
                        <Database className="h-4 w-4 text-purple-600" />
                      </div>
                      <span className="text-sm font-medium">آخر نسخة احتياطية</span>
                    </div>
                    <span className="text-xs text-muted-foreground font-medium">
                      {formatDate(stats.lastBackup)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-orange-50 rounded-lg">
                        <Target className="h-4 w-4 text-orange-600" />
                      </div>
                      <span className="text-sm font-medium">التخزين</span>
                    </div>
                    <span className="text-xs text-muted-foreground font-medium">
                      {stats.storageUsed} من {stats.totalStorage}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Employees Tab */}
        <TabsContent value="employees" className="space-y-6">
          <EmployeeManagement 
            onPromote={(employeeId, note) => {
              console.log('Promote:', employeeId, note)
              toast.success('تم ترقية الموظف بنجاح! يمكنه الآن إنشاء الاستطلاعات.')
              // Here you would typically make an API call to update the employee role
            }}
            onDemote={(employeeId, note) => {
              console.log('Demote:', employeeId, note)
              toast.success('تم تراجع الترقية بنجاح!')
              // Here you would typically make an API call to update the employee role
            }}
            onExport={(employees) => {
              console.log('Export employees:', employees)
              // Here you would typically trigger a download or API call for export
            }}
          />
        </TabsContent>

        {/* Advanced Response Management Tab */}
        <TabsContent value="responses" className="space-y-6">
          <AdvancedResponseManagement 
            onModifyResponse={(responseId, data, reason) => {
              console.log('Modify response:', responseId, data, reason)
              toast.success('تم تعديل الرد بنجاح!')
              // Here you would typically make an API call to modify the response
            }}
            onDeleteResponse={(responseId, reason) => {
              console.log('Delete response:', responseId, reason)
              toast.success('تم حذف الرد بنجاح!')
              // Here you would typically make an API call to delete the response
            }}
            onBulkDelete={(responseIds, reason) => {
              console.log('Bulk delete responses:', responseIds, reason)
              toast.success(`تم حذف ${responseIds.length} رد بنجاح!`)
              // Here you would typically make an API call for bulk deletion
            }}
            onExport={(responses, format) => {
              console.log('Export responses:', responses.length, format)
              toast.success(`تم تصدير ${responses.length} رد بصيغة ${format.toUpperCase()}!`)
              // Here you would typically trigger a download or API call for export
            }}
          />
        </TabsContent>

        {/* Statistics Tab */}
        <TabsContent value="statistics" className="space-y-6">
          <SystemStatistics 
            onExport={(data) => console.log('Export statistics:', data)}
          />
        </TabsContent>

        {/* Activity Log Tab */}
        <TabsContent value="activity" className="space-y-6">
          <ActivityLog 
            onExport={(logs) => {
              console.log('Export activity logs:', logs)
              toast.success('تم تصدير سجل الأنشطة بنجاح!')
            }}
          />
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-6">
          <NotificationSystem 
            onSendNotification={(notification) => {
              console.log('Send notification:', notification)
              toast.success('تم إرسال الإشعار بنجاح!')
            }}
            onMarkAsRead={(notificationId) => {
              console.log('Mark as read:', notificationId)
              toast.success('تم تعليم الإشعار كمقروء!')
            }}
            onDeleteNotification={(notificationId) => {
              console.log('Delete notification:', notificationId)
              toast.success('تم حذف الإشعار!')
            }}
          />
        </TabsContent>

        {/* System Configuration Tab */}
        <TabsContent value="configuration" className="space-y-6">
          <SystemConfiguration 
            onSave={(config) => {
              console.log('Save configuration:', config)
              toast.success('تم حفظ الإعدادات بنجاح!')
            }}
            onReset={() => {
              console.log('Reset configuration')
              toast.success('تم إعادة تعيين الإعدادات!')
            }}
            onExport={(config) => {
              console.log('Export configuration:', config)
              const dataStr = JSON.stringify(config, null, 2)
              const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)
              const exportFileDefaultName = 'survey-system-config.json'
              const linkElement = document.createElement('a')
              linkElement.setAttribute('href', dataUri)
              linkElement.setAttribute('download', exportFileDefaultName)
              linkElement.click()
              toast.success('تم تصدير الإعدادات!')
            }}
            onImport={(config) => {
              console.log('Import configuration:', config)
              toast.success('تم استيراد الإعدادات!')
            }}
          />
        </TabsContent>

        {/* Backup & Restore Tab */}
        <TabsContent value="backup" className="space-y-6">
          <BackupRestore 
            onCreateBackup={(config) => {
              console.log('Create backup:', config)
              toast.success('تم بدء إنشاء النسخة الاحتياطية!')
            }}
            onRestoreBackup={(backupId, options) => {
              console.log('Restore backup:', backupId, options)
              toast.success('تم بدء عملية الاستعادة!')
            }}
            onDeleteBackup={(backupId) => {
              console.log('Delete backup:', backupId)
              toast.success('تم حذف النسخة الاحتياطية!')
            }}
            onScheduleBackup={(schedule) => {
              console.log('Schedule backup:', schedule)
              toast.success('تم جدولة النسخة الاحتياطية!')
            }}
          />
        </TabsContent>

        {/* System Tab - Enhanced */}
        <TabsContent value="system" className="space-y-6">
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="border-b pb-4">
              <div className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-primary" />
                <CardTitle>إدارة النظام</CardTitle>
              </div>
              <CardDescription>
                أدوات إدارة النظام والصيانة
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="border-2 hover:border-green-200 hover:shadow-md transition-all">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-3 text-base">
                      <div className="p-2 bg-green-50 rounded-lg">
                        <Shield className="h-5 w-5 text-green-600" />
                      </div>
                      <span>الأمان</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors">
                      <span className="text-sm font-medium">حالة الأمان</span>
                      <Badge className="bg-green-100 text-green-800 hover:bg-green-200">آمن</Badge>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors">
                      <span className="text-sm font-medium">آخر فحص</span>
                      <span className="text-xs text-muted-foreground font-medium">منذ ساعتين</span>
                    </div>
                    <Button variant="outline" className="w-full gap-2 hover:bg-green-50 hover:text-green-700 hover:border-green-300 transition-colors mt-2">
                      <Shield className="h-4 w-4" />
                      فحص الأمان
                    </Button>
                  </CardContent>
                </Card>

                <Card className="border-2 hover:border-blue-200 hover:shadow-md transition-all">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-3 text-base">
                      <div className="p-2 bg-blue-50 rounded-lg">
                        <Database className="h-5 w-5 text-blue-600" />
                      </div>
                      <span>النسخ الاحتياطية</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors">
                      <span className="text-sm font-medium">آخر نسخة</span>
                      <span className="text-xs text-muted-foreground font-medium">{formatDate(stats.lastBackup)}</span>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors">
                      <span className="text-sm font-medium">حجم النسخة</span>
                      <span className="text-xs text-muted-foreground font-medium">1.2 GB</span>
                    </div>
                    <Button variant="outline" className="w-full gap-2 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300 transition-colors mt-2">
                      <Database className="h-4 w-4" />
                      إنشاء نسخة احتياطية
                    </Button>
                  </CardContent>
                </Card>

                <Card className="border-2 hover:border-purple-200 hover:shadow-md transition-all">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-3 text-base">
                      <div className="p-2 bg-purple-50 rounded-lg">
                        <Activity className="h-5 w-5 text-purple-600" />
                      </div>
                      <span>الأداء</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors">
                      <span className="text-sm font-medium">وقت التشغيل</span>
                      <Badge className="bg-green-100 text-green-800 hover:bg-green-200">{stats.systemUptime}</Badge>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors">
                      <span className="text-sm font-medium">استجابة الخادم</span>
                      <span className="text-xs text-muted-foreground font-medium">45ms</span>
                    </div>
                    <Button variant="outline" className="w-full gap-2 hover:bg-purple-50 hover:text-purple-700 hover:border-purple-300 transition-colors mt-2">
                      <Activity className="h-4 w-4" />
                      فحص الأداء
                    </Button>
                  </CardContent>
                </Card>

                <Card className="border-2 hover:border-orange-200 hover:shadow-md transition-all">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-3 text-base">
                      <div className="p-2 bg-orange-50 rounded-lg">
                        <Target className="h-5 w-5 text-orange-600" />
                      </div>
                      <span>التخزين</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors">
                      <span className="text-sm font-medium">المستخدم</span>
                      <span className="text-xs text-muted-foreground font-medium">{stats.storageUsed}</span>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors">
                      <span className="text-sm font-medium">المتاح</span>
                      <span className="text-xs text-muted-foreground font-medium">7.7 GB</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2 overflow-hidden">
                      <div className="bg-gradient-to-r from-orange-500 to-orange-600 h-2.5 rounded-full transition-all duration-500" style={{ width: '23%' }}></div>
                    </div>
                    <Button variant="outline" className="w-full gap-2 hover:bg-orange-50 hover:text-orange-700 hover:border-orange-300 transition-colors mt-2">
                      <Target className="h-4 w-4" />
                      تنظيف التخزين
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}