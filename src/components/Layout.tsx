import { ReactNode } from 'react'
import Header from './layout/Header'
import Footer from './layout/Footer'

interface LayoutProps {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="container mx-auto py-6 flex-1">
        {children}
      </main>
      <Footer />
    </div>
  )
}
