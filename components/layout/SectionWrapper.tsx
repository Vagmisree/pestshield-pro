import { cn } from '@/lib/utils'
import { ReactNode } from 'react'

interface SectionWrapperProps {
  children: ReactNode
  className?: string
  background?: 'white' | 'cream' | 'green-tint' | 'dark' | 'forest'
  id?: string
}

export function SectionWrapper({ children, className, background = 'cream', id }: SectionWrapperProps) {
  return (
    <section
      id={id}
      className={cn(
        'py-16 md:py-24',
        background === 'white' && 'bg-white',
        background === 'cream' && 'bg-cream-100',
        background === 'green-tint' && 'bg-brand-50',
        background === 'dark' && 'bg-forest-900 text-white',
        background === 'forest' && 'bg-forest-950 text-white',
        className
      )}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {children}
      </div>
    </section>
  )
}
