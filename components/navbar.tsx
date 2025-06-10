'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/theme-toggle'

export function Navbar() {
  const pathname = usePathname()
  
  return (
    <header className="border-b sticky top-0 z-50 bg-background">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <Home className="h-8 w-8 text-primary" />
          <span className="text-2xl font-bold">RealEstate Pro</span>
        </Link>
        <nav className="hidden md:flex items-center space-x-6">
          <Link 
            href="/properties" 
            className={`hover:text-primary transition-colors ${pathname === '/properties' ? 'text-primary font-medium' : 'text-muted-foreground'}`}
          >
            Properties
          </Link>
          <Link 
            href="/about" 
            className={`hover:text-primary transition-colors ${pathname === '/about' ? 'text-primary font-medium' : 'text-muted-foreground'}`}
          >
            About
          </Link>
          <Link 
            href="/contact" 
            className={`hover:text-primary transition-colors ${pathname === '/contact' ? 'text-primary font-medium' : 'text-muted-foreground'}`}
          >
            Contact
          </Link>
          <Link href="/admin">
            <Button variant="outline">Admin</Button>
          </Link>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  )
}