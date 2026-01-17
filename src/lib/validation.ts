/**
 * Form validation utilities
 * Provides client-side validation rules matching backend requirements
 */

export interface ValidationResult {
  isValid: boolean
  errors: string[]
}

export interface FieldValidationResult {
  isValid: boolean
  error?: string
}

/**
 * Email validation
 */
export function validateEmail(email: string): FieldValidationResult {
  if (!email || email.trim() === '') {
    return { isValid: false, error: 'البريد الإلكتروني مطلوب' }
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return { isValid: false, error: 'البريد الإلكتروني غير صالح' }
  }

  return { isValid: true }
}

/**
 * Password validation
 * Minimum 8 characters, at least one uppercase, one lowercase, one number
 */
export function validatePassword(password: string): FieldValidationResult {
  if (!password || password.trim() === '') {
    return { isValid: false, error: 'كلمة المرور مطلوبة' }
  }

  if (password.length < 8) {
    return { isValid: false, error: 'كلمة المرور يجب أن تكون 8 أحرف على الأقل' }
  }

  if (!/[A-Z]/.test(password)) {
    return { isValid: false, error: 'كلمة المرور يجب أن تحتوي على حرف كبير واحد على الأقل' }
  }

  if (!/[a-z]/.test(password)) {
    return { isValid: false, error: 'كلمة المرور يجب أن تحتوي على حرف صغير واحد على الأقل' }
  }

  if (!/[0-9]/.test(password)) {
    return { isValid: false, error: 'كلمة المرور يجب أن تحتوي على رقم واحد على الأقل' }
  }

  return { isValid: true }
}

/**
 * Confirm password validation
 */
export function validateConfirmPassword(password: string, confirmPassword: string): FieldValidationResult {
  if (!confirmPassword || confirmPassword.trim() === '') {
    return { isValid: false, error: 'تأكيد كلمة المرور مطلوب' }
  }

  if (password !== confirmPassword) {
    return { isValid: false, error: 'كلمتا المرور غير متطابقتين' }
  }

  return { isValid: true }
}

/**
 * Required field validation
 */
export function validateRequired(value: string | number | boolean | null | undefined, fieldName: string): FieldValidationResult {
  if (value === null || value === undefined || (typeof value === 'string' && value.trim() === '')) {
    return { isValid: false, error: `${fieldName} مطلوب` }
  }

  return { isValid: true }
}

/**
 * Full name validation
 */
export function validateFullName(fullName: string): FieldValidationResult {
  if (!fullName || fullName.trim() === '') {
    return { isValid: false, error: 'الاسم الكامل مطلوب' }
  }

  if (fullName.trim().length < 3) {
    return { isValid: false, error: 'الاسم الكامل يجب أن يكون 3 أحرف على الأقل' }
  }

  if (fullName.trim().length > 100) {
    return { isValid: false, error: 'الاسم الكامل يجب ألا يتجاوز 100 حرف' }
  }

  return { isValid: true }
}

/**
 * Survey title validation
 */
export function validateSurveyTitle(title: string): FieldValidationResult {
  if (!title || title.trim() === '') {
    return { isValid: false, error: 'عنوان الاستطلاع مطلوب' }
  }

  if (title.trim().length < 3) {
    return { isValid: false, error: 'عنوان الاستطلاع يجب أن يكون 3 أحرف على الأقل' }
  }

  if (title.trim().length > 200) {
    return { isValid: false, error: 'عنوان الاستطلاع يجب ألا يتجاوز 200 حرف' }
  }

  return { isValid: true }
}

/**
 * Survey description validation
 */
export function validateSurveyDescription(description: string): FieldValidationResult {
  if (description && description.trim().length > 1000) {
    return { isValid: false, error: 'وصف الاستطلاع يجب ألا يتجاوز 1000 حرف' }
  }

  return { isValid: true }
}

/**
 * Question text validation
 */
export function validateQuestionText(text: string): FieldValidationResult {
  if (!text || text.trim() === '') {
    return { isValid: false, error: 'نص السؤال مطلوب' }
  }

  if (text.trim().length < 3) {
    return { isValid: false, error: 'نص السؤال يجب أن يكون 3 أحرف على الأقل' }
  }

  if (text.trim().length > 500) {
    return { isValid: false, error: 'نص السؤال يجب ألا يتجاوز 500 حرف' }
  }

  return { isValid: true }
}

/**
 * URL validation
 */
export function validateURL(url: string): FieldValidationResult {
  if (!url || url.trim() === '') {
    return { isValid: true } // URL is optional in most cases
  }

  try {
    new URL(url)
    return { isValid: true }
  } catch {
    return { isValid: false, error: 'الرابط غير صالح' }
  }
}

/**
 * Phone number validation (Saudi Arabia format)
 */
export function validatePhone(phone: string): FieldValidationResult {
  if (!phone || phone.trim() === '') {
    return { isValid: true } // Phone is optional in most cases
  }

  // Saudi phone number: starts with 05 or +9665, followed by 8 digits
  const phoneRegex = /^(05|\\+9665)[0-9]{8}$/
  if (!phoneRegex.test(phone.replace(/[\s-]/g, ''))) {
    return { isValid: false, error: 'رقم الهاتف غير صالح (مثال: 0512345678)' }
  }

  return { isValid: true }
}

/**
 * Number range validation
 */
export function validateNumberRange(value: number, min?: number, max?: number, fieldName: string = 'القيمة'): FieldValidationResult {
  if (isNaN(value)) {
    return { isValid: false, error: `${fieldName} يجب أن يكون رقماً صالحاً` }
  }

  if (min !== undefined && value < min) {
    return { isValid: false, error: `${fieldName} يجب أن يكون ${min} على الأقل` }
  }

  if (max !== undefined && value > max) {
    return { isValid: false, error: `${fieldName} يجب ألا يتجاوز ${max}` }
  }

  return { isValid: true }
}

/**
 * String length validation
 */
export function validateLength(value: string, min?: number, max?: number, fieldName: string = 'النص'): FieldValidationResult {
  const length = value ? value.trim().length : 0

  if (min !== undefined && length < min) {
    return { isValid: false, error: `${fieldName} يجب أن يكون ${min} أحرف على الأقل` }
  }

  if (max !== undefined && length > max) {
    return { isValid: false, error: `${fieldName} يجب ألا يتجاوز ${max} حرف` }
  }

  return { isValid: true }
}

/**
 * Array validation (for multi-select fields)
 */
export function validateArray(value: any[], min?: number, max?: number, fieldName: string = 'القائمة'): FieldValidationResult {
  if (!Array.isArray(value)) {
    return { isValid: false, error: `${fieldName} غير صالح` }
  }

  if (min !== undefined && value.length < min) {
    return { isValid: false, error: `يجب اختيار ${min} عنصر على الأقل` }
  }

  if (max !== undefined && value.length > max) {
    return { isValid: false, error: `يجب ألا يتجاوز عدد العناصر ${max}` }
  }

  return { isValid: true }
}

/**
 * Date validation
 */
export function validateDate(date: string | Date, fieldName: string = 'التاريخ'): FieldValidationResult {
  if (!date) {
    return { isValid: false, error: `${fieldName} مطلوب` }
  }

  const dateObj = typeof date === 'string' ? new Date(date) : date
  if (isNaN(dateObj.getTime())) {
    return { isValid: false, error: `${fieldName} غير صالح` }
  }

  return { isValid: true }
}

/**
 * Date range validation
 */
export function validateDateRange(startDate: string | Date, endDate: string | Date): FieldValidationResult {
  const start = typeof startDate === 'string' ? new Date(startDate) : startDate
  const end = typeof endDate === 'string' ? new Date(endDate) : endDate

  if (isNaN(start.getTime())) {
    return { isValid: false, error: 'تاريخ البداية غير صالح' }
  }

  if (isNaN(end.getTime())) {
    return { isValid: false, error: 'تاريخ النهاية غير صالح' }
  }

  if (start > end) {
    return { isValid: false, error: 'تاريخ البداية يجب أن يكون قبل تاريخ النهاية' }
  }

  return { isValid: true }
}

/**
 * Validate login form
 */
export function validateLoginForm(email: string, password: string): ValidationResult {
  const errors: string[] = []

  const emailResult = validateEmail(email)
  if (!emailResult.isValid) {
    errors.push(emailResult.error!)
  }

  if (!password || password.trim() === '') {
    errors.push('كلمة المرور مطلوبة')
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

/**
 * Validate registration form
 */
export function validateRegistrationForm(
  fullName: string,
  email: string,
  password: string,
  confirmPassword: string
): ValidationResult {
  const errors: string[] = []

  const nameResult = validateFullName(fullName)
  if (!nameResult.isValid) {
    errors.push(nameResult.error!)
  }

  const emailResult = validateEmail(email)
  if (!emailResult.isValid) {
    errors.push(emailResult.error!)
  }

  const passwordResult = validatePassword(password)
  if (!passwordResult.isValid) {
    errors.push(passwordResult.error!)
  }

  const confirmPasswordResult = validateConfirmPassword(password, confirmPassword)
  if (!confirmPasswordResult.isValid) {
    errors.push(confirmPasswordResult.error!)
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

/**
 * Validate survey form
 */
export function validateSurveyForm(title: string, description?: string): ValidationResult {
  const errors: string[] = []

  const titleResult = validateSurveyTitle(title)
  if (!titleResult.isValid) {
    errors.push(titleResult.error!)
  }

  if (description) {
    const descriptionResult = validateSurveyDescription(description)
    if (!descriptionResult.isValid) {
      errors.push(descriptionResult.error!)
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

export default {
  validateEmail,
  validatePassword,
  validateConfirmPassword,
  validateRequired,
  validateFullName,
  validateSurveyTitle,
  validateSurveyDescription,
  validateQuestionText,
  validateURL,
  validatePhone,
  validateNumberRange,
  validateLength,
  validateArray,
  validateDate,
  validateDateRange,
  validateLoginForm,
  validateRegistrationForm,
  validateSurveyForm,
}
