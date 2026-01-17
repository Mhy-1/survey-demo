import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  User,
  Mail,
  Shield,
  CheckCircle,
  XCircle,
  Search,
  UserPlus,
  Loader2,
  Edit,
  Trash2,
  AlertTriangle
} from 'lucide-react'
import { useUsers, useUpdateUser, useDeleteUser, useActivateUser, useDeactivateUser } from '@/hooks/useUsers'
import { formatDate } from '@/lib/utils'
import toast from 'react-hot-toast'
import UserRoleDialog from './UserRoleDialog'
import { UserListSkeleton } from '@/components/common/LoadingSkeleton'

export default function UserManagement() {
  const [page, setPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const [roleDialogOpen, setRoleDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deactivateDialogOpen, setDeactivateDialogOpen] = useState(false)
  const [userToDelete, setUserToDelete] = useState<any>(null)
  const [userToDeactivate, setUserToDeactivate] = useState<any>(null)
  const limit = 20

  // Fetch users with filters
  const { data: usersData, isLoading, error: fetchError } = useUsers({
    page,
    limit,
    role: (roleFilter && roleFilter !== 'all') ? roleFilter : undefined,
    is_active: (statusFilter && statusFilter !== 'all') ? statusFilter === 'active' : undefined,
    search: searchQuery || undefined
  })

  const updateUserMutation = useUpdateUser()
  const deleteUserMutation = useDeleteUser()
  const activateUserMutation = useActivateUser()
  const deactivateUserMutation = useDeactivateUser()

  const users = usersData?.data || []
  const pagination = usersData?.pagination || { total: 0, page: 1, limit: 20, totalPages: 1 }

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return <Badge className="bg-purple-100 text-purple-800">مدير</Badge>
      case 'manager':
        return <Badge className="bg-blue-100 text-blue-800">مدير فرعي</Badge>
      case 'employee':
        return <Badge className="bg-green-100 text-green-800">موظف</Badge>
      default:
        return <Badge variant="outline">غير محدد</Badge>
    }
  }

  const handleActivateUser = async (userId: string) => {
    try {
      await activateUserMutation.mutateAsync(userId)
    } catch (error) {
      console.error('Failed to activate user:', error)
    }
  }

  const handleDeactivateUser = async () => {
    if (!userToDeactivate) return
    try {
      await deactivateUserMutation.mutateAsync(userToDeactivate.id)
      setDeactivateDialogOpen(false)
      setUserToDeactivate(null)
    } catch (error) {
      console.error('Failed to deactivate user:', error)
    }
  }

  const handleDeleteUser = async () => {
    if (!userToDelete) return
    try {
      await deleteUserMutation.mutateAsync(userToDelete.id)
      setDeleteDialogOpen(false)
      setUserToDelete(null)
    } catch (error) {
      console.error('Failed to delete user:', error)
    }
  }

  const openRoleDialog = (user: any) => {
    setSelectedUser(user)
    setRoleDialogOpen(true)
  }

  const openDeactivateDialog = (user: any) => {
    setUserToDeactivate(user)
    setDeactivateDialogOpen(true)
  }

  const openDeleteDialog = (user: any) => {
    setUserToDelete(user)
    setDeleteDialogOpen(true)
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold">إدارة المستخدمين</h2>
          <p className="text-muted-foreground">جاري تحميل المستخدمين...</p>
        </div>
        <UserListSkeleton count={5} />
      </div>
    )
  }

  // Show error state if API endpoint doesn't exist
  if (fetchError) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold">إدارة المستخدمين</h2>
          <p className="text-muted-foreground">عرض وإدارة جميع المستخدمين في النظام</p>
        </div>
        <Card>
          <CardContent className="p-12">
            <div className="flex flex-col items-center justify-center text-center space-y-4">
              <AlertTriangle className="h-16 w-16 text-orange-500" />
              <div className="space-y-2">
                <h3 className="text-xl font-semibold">الميزة قيد التطوير</h3>
                <p className="text-muted-foreground max-w-md">
                  نعمل حالياً على تطوير نظام إدارة المستخدمين. ستتوفر هذه الميزة قريباً.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">إدارة المستخدمين</h2>
          <p className="text-muted-foreground">
            عرض وإدارة جميع المستخدمين في النظام
          </p>
        </div>
        <Button>
          <UserPlus className="h-4 w-4 mr-2" />
          إضافة مستخدم
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="search">البحث</Label>
              <div className="relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="بحث بالاسم أو البريد..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pr-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">الدور</Label>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger id="role">
                  <SelectValue placeholder="جميع الأدوار" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع الأدوار</SelectItem>
                  <SelectItem value="admin">مدير</SelectItem>
                  <SelectItem value="manager">مدير فرعي</SelectItem>
                  <SelectItem value="employee">موظف</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">الحالة</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger id="status">
                  <SelectValue placeholder="جميع الحالات" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع الحالات</SelectItem>
                  <SelectItem value="active">نشط</SelectItem>
                  <SelectItem value="inactive">غير نشط</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="mt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchQuery('')
                setRoleFilter('all')
                setStatusFilter('all')
                setPage(1)
              }}
            >
              إعادة تعيين الفلاتر
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>المستخدمون ({pagination.total})</CardTitle>
          <CardDescription>
            قائمة بجميع المستخدمين المسجلين في النظام
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {users.length === 0 ? (
              <div className="text-center py-8">
                <User className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground">لا توجد مستخدمين</p>
              </div>
            ) : (
              users.map((user: any) => (
                <Card key={user.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 flex-1">
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                            <User className="h-6 w-6 text-primary" />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="font-semibold text-lg">{user.full_name}</h3>
                            {getRoleBadge(user.role)}
                            {user.is_active ? (
                              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                نشط
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
                                <XCircle className="h-3 w-3 mr-1" />
                                غير نشط
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            <div className="flex items-center space-x-1">
                              <Mail className="h-4 w-4" />
                              <span>{user.email}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Shield className="h-4 w-4" />
                              <span>انضم في {formatDate(user.created_at)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {user.is_active ? (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openDeactivateDialog(user)}
                          >
                            <XCircle className="h-4 w-4" />
                          </Button>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleActivateUser(user.id)}
                            disabled={activateUserMutation.isPending}
                          >
                            {activateUserMutation.isPending ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <CheckCircle className="h-4 w-4" />
                            )}
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openRoleDialog(user)}
                          title="تغيير الدور"
                        >
                          <Shield className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openDeleteDialog(user)}
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between mt-6">
              <div className="text-sm text-muted-foreground">
                عرض {((pagination.page - 1) * pagination.limit) + 1} - {Math.min(pagination.page * pagination.limit, pagination.total)} من {pagination.total} مستخدم
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(prev => Math.max(1, prev - 1))}
                  disabled={pagination.page === 1}
                >
                  السابق
                </Button>
                <div className="flex items-center space-x-1">
                  {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                    const pageNum = i + 1
                    return (
                      <Button
                        key={pageNum}
                        variant={pagination.page === pageNum ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setPage(pageNum)}
                      >
                        {pageNum}
                      </Button>
                    )
                  })}
                  {pagination.totalPages > 5 && (
                    <>
                      <span className="px-2">...</span>
                      <Button
                        variant={pagination.page === pagination.totalPages ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setPage(pagination.totalPages)}
                      >
                        {pagination.totalPages}
                      </Button>
                    </>
                  )}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(prev => Math.min(pagination.totalPages, prev + 1))}
                  disabled={pagination.page === pagination.totalPages}
                >
                  التالي
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Role Management Dialog */}
      <UserRoleDialog
        user={selectedUser}
        open={roleDialogOpen}
        onOpenChange={setRoleDialogOpen}
      />

      {/* Deactivate Confirmation Dialog */}
      <Dialog open={deactivateDialogOpen} onOpenChange={setDeactivateDialogOpen}>
        <DialogContent className="sm:max-w-[425px]" dir="rtl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              تأكيد إلغاء التفعيل
            </DialogTitle>
            <DialogDescription>
              هل أنت متأكد من إلغاء تفعيل المستخدم{' '}
              <strong>{userToDeactivate?.full_name}</strong>؟
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-muted-foreground">
              سيتم منع المستخدم من تسجيل الدخول حتى يتم تفعيله مرة أخرى.
            </p>
          </div>
          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setDeactivateDialogOpen(false)
                setUserToDeactivate(null)
              }}
              disabled={deactivateUserMutation.isPending}
            >
              إلغاء
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleDeactivateUser}
              disabled={deactivateUserMutation.isPending}
            >
              {deactivateUserMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin ml-2" />
                  جاري الإلغاء...
                </>
              ) : (
                'إلغاء التفعيل'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]" dir="rtl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              تحذير: حذف المستخدم
            </DialogTitle>
            <DialogDescription>
              هل أنت متأكد من حذف المستخدم{' '}
              <strong>{userToDelete?.full_name}</strong>؟
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-3">
            <div className="bg-red-50 border border-red-200 rounded-md p-3">
              <p className="text-sm text-red-800 font-semibold">
                ⚠️ هذا الإجراء لا يمكن التراجع عنه!
              </p>
            </div>
            <ul className="text-sm text-muted-foreground space-y-1 mr-4">
              <li>• سيتم حذف جميع بيانات المستخدم نهائياً</li>
              <li>• سيتم حذف جميع الاستطلاعات المرتبطة (إن وجدت)</li>
              <li>• لا يمكن استعادة البيانات بعد الحذف</li>
            </ul>
          </div>
          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setDeleteDialogOpen(false)
                setUserToDelete(null)
              }}
              disabled={deleteUserMutation.isPending}
            >
              إلغاء
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleDeleteUser}
              disabled={deleteUserMutation.isPending}
            >
              {deleteUserMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin ml-2" />
                  جاري الحذف...
                </>
              ) : (
                'حذف نهائياً'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
