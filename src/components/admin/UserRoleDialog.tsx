import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Loader2, Shield } from 'lucide-react'
import { useUpdateUser } from '@/hooks/useUsers'

interface UserRoleDialogProps {
  user: {
    id: string
    full_name: string
    email: string
    role: string
  } | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function UserRoleDialog({ user, open, onOpenChange }: UserRoleDialogProps) {
  const [selectedRole, setSelectedRole] = useState(user?.role || '')
  const updateUserMutation = useUpdateUser()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || selectedRole === user.role) {
      onOpenChange(false)
      return
    }

    try {
      await updateUserMutation.mutateAsync({
        id: user.id,
        data: { role: selectedRole as 'admin' | 'manager' | 'employee' }
      })
      onOpenChange(false)
    } catch (error) {
      console.error('Failed to update user role:', error)
    }
  }

  if (!user) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]" dir="rtl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            تغيير دور المستخدم
          </DialogTitle>
          <DialogDescription>
            تغيير دور المستخدم: <strong>{user.full_name}</strong>
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="email">البريد الإلكتروني</Label>
              <input
                id="email"
                value={user.email}
                disabled
                className="w-full px-3 py-2 border rounded-md bg-gray-50 text-gray-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">الدور الجديد</Label>
              <Select value={selectedRole} onValueChange={setSelectedRole}>
                <SelectTrigger id="role">
                  <SelectValue placeholder="اختر الدور" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">مدير (Admin)</SelectItem>
                  <SelectItem value="manager">مدير فرعي (Manager)</SelectItem>
                  <SelectItem value="employee">موظف (Employee)</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                {selectedRole === 'admin' && '✓ الوصول الكامل لجميع الميزات'}
                {selectedRole === 'manager' && '✓ إدارة الاستطلاعات الخاصة فقط'}
                {selectedRole === 'employee' && '✓ الرد على الاستطلاعات المخصصة'}
              </p>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={updateUserMutation.isPending}
            >
              إلغاء
            </Button>
            <Button
              type="submit"
              disabled={updateUserMutation.isPending || selectedRole === user.role}
            >
              {updateUserMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin ml-2" />
                  جاري الحفظ...
                </>
              ) : (
                'حفظ التغييرات'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
