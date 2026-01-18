import { useTranslation } from 'react-i18next'
import { Badge } from '@/components/ui/badge'

interface FooterProps {
  className?: string
}

export default function Footer({ className }: FooterProps) {
  const { t } = useTranslation()
  const currentYear = new Date().getFullYear()

  return (
    <footer className={`border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 ${className || ''}`}>
      <div className="container py-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Copyright */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>{t('footer.copyright')}</span>
            <span className="hidden sm:inline">-</span>
            <span className="hidden sm:inline">{currentYear}</span>
          </div>

          {/* Demo Badge */}
          <Badge variant="secondary" className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-200">
            {t('footer.demoBadge')}
          </Badge>

          {/* Rights Reserved - Hidden on mobile */}
          <div className="hidden sm:block text-sm text-muted-foreground">
            {t('footer.allRightsReserved')}
          </div>
        </div>
      </div>
    </footer>
  )
}
