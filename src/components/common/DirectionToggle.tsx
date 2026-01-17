import { Languages } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useThemeStore } from '@/store/themeStore'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

/**
 * LanguageToggle Component
 *
 * This component switches between Arabic and English languages,
 * and automatically adjusts text direction (RTL for Arabic, LTR for English).
 */
export default function DirectionToggle() {
  const { i18n } = useTranslation()
  const { direction, setDirection } = useThemeStore()

  const switchLanguage = (lang: 'ar' | 'en') => {
    console.log('Switching language to:', lang)
    i18n.changeLanguage(lang).then(() => {
      console.log('Language changed successfully to:', i18n.language)
      localStorage.setItem('language', lang)
      // Auto-set direction based on language
      setDirection(lang === 'ar' ? 'rtl' : 'ltr')
      // Force page reload to ensure all components update
      window.location.reload()
    })
  }

  const currentLanguage = i18n.language || 'ar'

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <Languages className="h-5 w-5" />
          <span className="sr-only">Toggle language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => switchLanguage('ar')}
          className="flex items-center justify-between"
        >
          <span>العربية</span>
          {currentLanguage === 'ar' && (
            <span className="mr-2 h-2 w-2 rounded-full bg-primary" />
          )}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => switchLanguage('en')}
          className="flex items-center justify-between"
        >
          <span>English</span>
          {currentLanguage === 'en' && (
            <span className="mr-2 h-2 w-2 rounded-full bg-primary" />
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
