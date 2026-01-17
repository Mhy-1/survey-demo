import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import QuestionTypeSelector from '@/components/survey/QuestionTypeSelector'
import QuestionEditor from '@/components/survey/QuestionEditor'
import SurveySettings from '@/components/survey/SurveySettings'
import {
  Plus,
  Save,
  Eye,
  Settings,
  Trash2,
  GripVertical,
  FileText,
  Users,
  Clock,
  Shield,
  BarChart3,
  Play,
  Pause,
  CheckCircle,
  ArrowLeft,
  ArrowRight,
  Copy,
  Move
} from 'lucide-react'
import { Question } from '@/types'
import { useQuestions, useCreateQuestion, useUpdateQuestion, useDeleteQuestion, useReorderQuestions } from '@/hooks/useQuestions'
import { useSurvey } from '@/hooks/useSurveys'
import toast from 'react-hot-toast'

export default function SurveyBuilder() {
  const { id: surveyId } = useParams<{ id: string }>()

  const [survey, setSurvey] = useState<{
    id: string
    title: string
    description: string
    type: string
    status: string
    unique_slug: string
    welcome_message: string
    thank_you_message: string
    duration_type: string
    start_date: string | null
    end_date: string | null
    max_responses: number | null
    is_anonymous: boolean
    allow_multiple: boolean
    allow_editing: boolean
    requires_auth: boolean
    show_progress_bar: boolean
    redirect_url: string
    track_ip: boolean
    track_location: boolean
    client_name?: string
    client_company?: string
    questions: Question[]
  }>({
    id: '1',
    title: 'استطلاع جديد',
    description: '',
    type: 'internal',
    status: 'draft',
    unique_slug: 'new-survey',
    welcome_message: '',
    thank_you_message: '',
    duration_type: 'unlimited',
    start_date: null,
    end_date: null,
    max_responses: null,
    is_anonymous: false,
    allow_multiple: false,
    allow_editing: false,
    requires_auth: false,
    show_progress_bar: true,
    redirect_url: '',
    track_ip: false,
    track_location: false,
    questions: []
  })

  const [activeTab, setActiveTab] = useState('questions')
  const [isAddingQuestion, setIsAddingQuestion] = useState(false)
  const [selectedQuestionType, setSelectedQuestionType] = useState('')
  const [activeQuestionId, setActiveQuestionId] = useState<string | null>(null)
  const [showValidationErrors, setShowValidationErrors] = useState(false)

  // React Query hooks
  const { data: surveyData, isLoading: isSurveyLoading } = useSurvey(surveyId || '')
  const { data: questionsData, isLoading: isQuestionsLoading } = useQuestions(surveyId || '')
  const createQuestionMutation = useCreateQuestion(surveyId || '')
  const updateQuestionMutation = useUpdateQuestion(surveyId || '')
  const deleteQuestionMutation = useDeleteQuestion(surveyId || '')
  const reorderQuestionsMutation = useReorderQuestions(surveyId || '')

  // Load survey data from API
  useEffect(() => {
    if (surveyData) {
      setSurvey(prev => ({
        ...prev,
        ...surveyData,
        questions: questionsData || []
      }))
    }
  }, [surveyData, questionsData])

  // Show loading state
  if (surveyId && (isSurveyLoading || isQuestionsLoading)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">جاري تحميل الاستطلاع...</p>
        </div>
      </div>
    )
  }

  const hasValidQuestions = () => {
    return survey.questions.some(question => {
      // Check if question has text
      if (!question.question_text?.trim()) return false
      
      // Check if choice questions have at least 2 options
      if (['single_choice', 'multiple_choice', 'dropdown'].includes(question.question_type)) {
        const choices = question.options?.choices || []
        const validChoices = choices.filter(choice => choice?.trim())
        return validChoices.length >= 2
      }
      
      return true
    })
  }

  const validateAllQuestions = () => {
    const errors: Array<{questionIndex: number, questionText: string, errors: string[]}> = []
    
    survey.questions.forEach((question, index) => {
      const questionErrors: string[] = []
      
      // Check question text
      if (!question.question_text?.trim()) {
        questionErrors.push('نص السؤال مطلوب')
      }
      
      // Check choice questions
      if (['single_choice', 'multiple_choice', 'dropdown'].includes(question.question_type)) {
        const choices = question.options?.choices || []
        const validChoices = choices.filter(choice => choice?.trim())
        if (validChoices.length < 2) {
          questionErrors.push('يجب إضافة خيارين صحيحين على الأقل')
        }
      }
      
      // Check rating questions
      if (question.question_type === 'rating') {
        if (!question.options?.max || question.options.max < 2) {
          questionErrors.push('يجب أن يكون المقياس 2 على الأقل')
        }
      }
      
      if (questionErrors.length > 0) {
        errors.push({
          questionIndex: index + 1,
          questionText: question.question_text || 'سؤال بدون عنوان',
          errors: questionErrors
        })
      }
    })
    
    return errors
  }

  const handleAddQuestion = async (type: string) => {
    if (!surveyId) {
      toast.error('معرف الاستطلاع غير موجود')
      return
    }

    const questionData = {
      question_type: type,
      question_text: '',
      description: '',
      is_required: false,
      order_index: survey.questions.length + 1,
      options: {
        choices: type === 'single_choice' || type === 'multiple_choice' || type === 'dropdown'
          ? ['خيار 1', 'خيار 2']
          : undefined,
        max: type === 'rating' ? 5 : undefined,
        min: type === 'rating' ? 1 : undefined,
        labels: type === 'rating' ? ['سيء جداً', 'ممتاز'] : undefined
      }
    }

    try {
      const newQuestion = await createQuestionMutation.mutateAsync(questionData)
      setIsAddingQuestion(false)
      setSelectedQuestionType('')
      // Automatically activate the new question for editing
      setActiveQuestionId(newQuestion.id)
    } catch (error) {
      // Error is handled by the mutation hook
      console.error('Failed to create question:', error)
    }
  }

  const handleUpdateQuestion = async (questionId: string, updates: Partial<Question>) => {
    // Optimistic update
    setSurvey(prev => ({
      ...prev,
      questions: prev.questions.map(q =>
        q.id === questionId ? { ...q, ...updates } : q
      )
    }))

    // Reset validation errors when user starts fixing questions
    if (showValidationErrors) {
      setShowValidationErrors(false)
    }

    // Update via API
    try {
      await updateQuestionMutation.mutateAsync({ id: questionId, data: updates })
    } catch (error) {
      // Error is handled by the mutation hook
      console.error('Failed to update question:', error)
    }
  }

  const handleDeleteQuestion = async (questionId: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا السؤال؟')) {
      return
    }

    try {
      await deleteQuestionMutation.mutateAsync(questionId)
    } catch (error) {
      // Error is handled by the mutation hook
      console.error('Failed to delete question:', error)
    }
  }

  const handleDuplicateQuestion = async (questionId: string) => {
    if (!surveyId) {
      toast.error('معرف الاستطلاع غير موجود')
      return
    }

    const question = survey.questions.find(q => q.id === questionId)
    if (question) {
      const duplicatedQuestionData = {
        question_type: question.question_type,
        question_text: `${question.question_text} (نسخة)`,
        description: question.description,
        is_required: question.is_required,
        order_index: survey.questions.length + 1,
        options: question.options,
        validation_rules: question.validation_rules,
        conditional_logic: question.conditional_logic
      }

      try {
        await createQuestionMutation.mutateAsync(duplicatedQuestionData)
      } catch (error) {
        console.error('Failed to duplicate question:', error)
      }
    }
  }

  const handleMoveQuestion = async (questionId: string, direction: 'up' | 'down') => {
    const questionIndex = survey.questions.findIndex(q => q.id === questionId)
    if (questionIndex === -1) return

    const newIndex = direction === 'up' ? questionIndex - 1 : questionIndex + 1
    if (newIndex < 0 || newIndex >= survey.questions.length) return

    const newQuestions = [...survey.questions]
    const [movedQuestion] = newQuestions.splice(questionIndex, 1)
    newQuestions.splice(newIndex, 0, movedQuestion)

    // Update order indices
    const question_orders = newQuestions.map((q, index) => ({
      id: q.id,
      order_index: index + 1
    }))

    // Optimistic update
    setSurvey(prev => ({
      ...prev,
      questions: newQuestions.map((q, index) => ({ ...q, order_index: index + 1 }))
    }))

    // Call API
    if (surveyId) {
      try {
        await reorderQuestionsMutation.mutateAsync({ question_orders })
      } catch (error) {
        console.error('Failed to reorder questions:', error)
      }
    }
  }

  const handleDragEnd = async (result: any) => {
    if (!result.destination) return

    const items = Array.from(survey.questions)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    // Update order indexes
    const question_orders = items.map((q, index) => ({
      id: q.id,
      order_index: index + 1
    }))

    // Optimistic update
    setSurvey(prev => ({
      ...prev,
      questions: items.map((q, index) => ({ ...q, order_index: index + 1 }))
    }))

    // Call API
    if (surveyId) {
      try {
        await reorderQuestionsMutation.mutateAsync({ question_orders })
      } catch (error) {
        console.error('Failed to reorder questions:', error)
      }
    }
  }

  const handleSave = () => {
    // Check if there are valid questions
    if (!hasValidQuestions()) {
      alert('يجب إضافة سؤال واحد صحيح على الأقل قبل الحفظ')
      return
    }
    
    // Validate client name for external surveys before saving
    if (survey.type === 'external' && !survey.client_name?.trim()) {
      alert('يجب إدخال اسم العميل للاستطلاعات الخارجية')
      return
    }
    
    console.log('Saving survey as draft:', survey)
    // Set status to draft when saving
    setSurvey(prev => ({ ...prev, status: 'draft' }))
    // In real app, this would save to backend
    alert('تم حفظ الاستطلاع كمسودة بنجاح!')
  }

  const handlePreview = () => {
    // Check if there are valid questions
    if (!hasValidQuestions()) {
      alert('يجب إضافة سؤال واحد صحيح على الأقل قبل المعاينة')
      return
    }
    
    console.log('Previewing survey:', survey)
    // Create preview URL with survey data
    const previewData = encodeURIComponent(JSON.stringify(survey))
    window.open(`/survey/preview?data=${previewData}`, '_blank')
  }

  const handlePublish = () => {
    // Check basic survey info
    if (!survey.title.trim()) {
      alert('يجب إدخال عنوان للاستطلاع')
      return
    }
    
    // Validate client name for external surveys
    if (survey.type === 'external' && !survey.client_name?.trim()) {
      alert('يجب إدخال اسم العميل للاستطلاعات الخارجية')
      return
    }
    
    // Check if there are any questions
    if (survey.questions.length === 0) {
      alert('يجب إضافة سؤال واحد على الأقل قبل النشر')
      return
    }
    
    // Validate all questions
    const validationErrors = validateAllQuestions()
    if (validationErrors.length > 0) {
      // Show validation errors in UI
      setShowValidationErrors(true)
      
      let errorMessage = 'يرجى إصلاح الأخطاء التالية قبل النشر:\n\n'
      validationErrors.forEach(error => {
        errorMessage += `السؤال ${error.questionIndex}: ${error.questionText}\n`
        error.errors.forEach(err => {
          errorMessage += `  • ${err}\n`
        })
        errorMessage += '\n'
      })
      errorMessage += 'يمكنك إما إكمال الأسئلة الناقصة أو حذفها للمتابعة.'
      
      alert(errorMessage)
      return
    }
    
    console.log('Publishing survey:', survey)
    setSurvey(prev => ({ ...prev, status: 'active' }))
    alert('تم نشر الاستطلاع بنجاح!')
  }

  const handleSurveyUpdate = (updates: any) => {
    setSurvey(prev => ({ ...prev, ...updates }))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">منشئ الاستطلاعات</h1>
          <p className="text-muted-foreground">
            إنشاء وإدارة الاستطلاعات المتقدمة
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant={survey.status === 'draft' ? 'secondary' : 'default'}>
            {survey.status === 'draft' ? 'مسودة' : 'نشط'}
          </Badge>
          <Button 
            variant="outline" 
            onClick={handlePreview}
            disabled={!hasValidQuestions()}
          >
            <Eye className="h-4 w-4 mr-2" />
            معاينة
          </Button>
          <Button 
            onClick={handleSave}
            disabled={!hasValidQuestions()}
          >
            <Save className="h-4 w-4 mr-2" />
            حفظ
          </Button>
          {survey.status === 'draft' && (
            <Button 
              onClick={handlePublish} 
              className="bg-green-600 hover:bg-green-700"
              disabled={!hasValidQuestions()}
            >
              <Play className="h-4 w-4 mr-2" />
              نشر
            </Button>
          )}
        </div>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="questions">الأسئلة</TabsTrigger>
          <TabsTrigger value="settings">الإعدادات</TabsTrigger>
        </TabsList>

        {/* Questions Tab */}
        <TabsContent value="questions" className="space-y-6">
          {/* Survey Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle>معلومات الاستطلاع الأساسية</CardTitle>
              <CardDescription>
                أدخل المعلومات الأساسية للاستطلاع
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">عنوان الاستطلاع *</Label>
                  <Input
                    id="title"
                    value={survey.title}
                    onChange={(e) => handleSurveyUpdate({ title: e.target.value })}
                    placeholder="أدخل عنوان الاستطلاع"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">نوع الاستطلاع</Label>
                  <Select 
                    value={survey.type} 
                    onValueChange={(value) => handleSurveyUpdate({ type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="internal">داخلي (للموظفين)</SelectItem>
                      <SelectItem value="external">خارجي (للعملاء)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">وصف الاستطلاع</Label>
                <Textarea
                  id="description"
                  value={survey.description}
                  onChange={(e) => handleSurveyUpdate({ description: e.target.value })}
                  placeholder="أدخل وصفاً مختصراً للاستطلاع"
                  rows={3}
                />
              </div>
              {survey.type === 'external' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="client_name">اسم العميل *</Label>
                    <Input
                      id="client_name"
                      value={survey.client_name || ''}
                      onChange={(e) => handleSurveyUpdate({ client_name: e.target.value })}
                      placeholder="أدخل اسم العميل"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="client_company">شركة العميل</Label>
                    <Input
                      id="client_company"
                      value={survey.client_company || ''}
                      onChange={(e) => handleSurveyUpdate({ client_company: e.target.value })}
                      placeholder="أدخل اسم الشركة (اختياري)"
                    />
                  </div>
                </div>
              )}
              
              {/* Duration Settings */}
              <div className="space-y-4 border-t pt-4">
                <h3 className="font-medium">إعدادات المدة</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="duration_type">نوع المدة</Label>
                    <Select 
                      value={survey.duration_type} 
                      onValueChange={(value) => handleSurveyUpdate({ duration_type: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="unlimited">غير محدودة</SelectItem>
                        <SelectItem value="limited">محدودة بتاريخ</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {survey.duration_type === 'limited' && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="start_date">تاريخ البداية</Label>
                        <Input
                          id="start_date"
                          type="date"
                          value={survey.start_date || ''}
                          onChange={(e) => handleSurveyUpdate({ start_date: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="end_date">تاريخ النهاية</Label>
                        <Input
                          id="end_date"
                          type="date"
                          value={survey.end_date || ''}
                          onChange={(e) => handleSurveyUpdate({ end_date: e.target.value })}
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>إدارة الأسئلة</CardTitle>
                  <CardDescription>
                    أضف وحرر الأسئلة لاستطلاعك
                  </CardDescription>
                </div>
                <Button onClick={() => setIsAddingQuestion(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  إضافة سؤال
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {/* Question Type Selector */}
              {isAddingQuestion && (
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium">اختر نوع السؤال</h3>
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setIsAddingQuestion(false)
                        setSelectedQuestionType('')
                      }}
                    >
                      إلغاء
                    </Button>
                  </div>
                  <QuestionTypeSelector
                    onSelect={(type) => {
                      handleAddQuestion(type)
                      setIsAddingQuestion(false)
                    }}
                  />
                </div>
              )}

              {/* Questions List */}
              <div className="space-y-4">
                {survey.questions.length === 0 ? (
                  <div className="text-center py-12">
                    <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">لا توجد أسئلة بعد</h3>
                    <p className="text-muted-foreground mb-4">
                      ابدأ بإضافة سؤال جديد لاستطلاعك
                    </p>
                    <Button onClick={() => setIsAddingQuestion(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      إضافة أول سؤال
                    </Button>
                  </div>
                ) : (
                  <DragDropContext onDragEnd={handleDragEnd}>
                    <Droppable droppableId="questions">
                      {(provided, snapshot) => (
                        <div 
                          {...provided.droppableProps} 
                          ref={provided.innerRef}
                          className={`min-h-[100px] transition-colors duration-200 ${
                            snapshot.isDraggingOver 
                              ? 'bg-primary/5 border-2 border-dashed border-primary rounded-lg' 
                              : ''
                          }`}
                        >
                          {survey.questions.map((question, index) => (
                            <Draggable key={question.id} draggableId={question.id} index={index}>
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  className={`mb-4 transition-all duration-200 ${
                                    snapshot.isDragging 
                                      ? 'opacity-75 rotate-2 scale-105 shadow-lg z-50' 
                                      : ''
                                  }`}
                                >
                                  <QuestionEditor
                                    question={question}
                                    onUpdate={(updates) => handleUpdateQuestion(question.id, updates)}
                                    onDelete={() => handleDeleteQuestion(question.id)}
                                    onDuplicate={() => handleDuplicateQuestion(question.id)}
                                    onMove={(direction) => handleMoveQuestion(question.id, direction)}
                                    canMoveUp={index > 0}
                                    canMoveDown={index < survey.questions.length - 1}
                                    dragHandleProps={provided.dragHandleProps}
                                    isActive={activeQuestionId === question.id}
                                    onActivate={() => setActiveQuestionId(question.id)}
                                    onDeactivate={() => setActiveQuestionId(null)}
                                    showValidationErrors={showValidationErrors}
                                  />
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </DragDropContext>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>


        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-6">
          <SurveySettings
            survey={survey}
            onUpdate={handleSurveyUpdate}
            onSave={handleSave}
            onPreview={handlePreview}
            onPublish={handlePublish}
            hasValidQuestions={hasValidQuestions()}
          />
        </TabsContent>


      </Tabs>
    </div>
  )
}