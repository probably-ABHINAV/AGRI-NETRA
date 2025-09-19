'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Sprout,
  Home,
  BarChart3,
  Brain,
  Bug,
  Zap,
  MessageSquare,
  Settings,
  Menu,
  X,
  User,
  LogOut,
  Shield,
} from 'lucide-react'
import LanguageSelector from '@/components/language-selector'
import { useLanguage } from '@/hooks/use-language'
import { logoutAction } from '@/app/actions/auth'

function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const { t } = useLanguage()

  const navigationItems = [
    { name: t('nav.dashboard') || 'Dashboard', href: "/dashboard", icon: Home, adminOnly: false },
    { name: t('nav.recommendations') || 'Crop Advice', href: "/crop-recommendations", icon: Brain, adminOnly: false },
    { name: t('nav.pest-detection') || 'Pest Detection', href: "/pest-detection", icon: Bug, adminOnly: false },
    { name: t('nav.sensors') || 'IoT Sensors', href: "/sensors", icon: Zap, adminOnly: false },
    { name: t('nav.analytics') || 'Analytics', href: "/analytics", icon: BarChart3, adminOnly: false },
    { name: t('nav.chat') || 'Expert Chat', href: "/chat", icon: MessageSquare, badge: 3, adminOnly: false },
    { name: t('nav.admin') || 'Admin Panel', href: "/admin", icon: Shield, adminOnly: true },
  ]

  const visibleNavigationItems = navigationItems.filter(item => !item.adminOnly);

  const isActive = (href: string) => pathname === href

  if (pathname === "/" || pathname.startsWith("/auth/")) {
    return null
  }

  const UserProfileDropdown = () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-gray-100 rounded-lg transition-colors">
          <Avatar className="h-8 w-8">
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>FN</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <p className="text-sm font-medium text-foreground">John Farmer</p>
            <p className="text-xs text-muted-foreground">Premium Plan</p>
          </div>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">John Farmer</p>
            <p className="text-xs leading-none text-muted-foreground">farmer@example.com</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/profile" className="cursor-pointer">
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Settings className="mr-2 h-4 w-4" />
          <span>Settings</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer"
          onClick={async () => await logoutAction()}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>{t('nav.logout')}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 bg-white border-r">
        <div className="flex items-center gap-2 h-16 px-6 border-b">
          <Sprout className="h-8 w-8 text-primary" />
          <span className="text-xl font-bold text-foreground">AgriNetra</span>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          {visibleNavigationItems.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive(item.href)
                    ? "bg-primary/10 text-primary"
                    : "text-gray-600 hover:text-foreground hover:bg-gray-100"
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="flex-1">{item.name}</span>
                {item.badge && <Badge className="bg-red-500 text-white text-xs">{item.badge}</Badge>}
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t">
          <div className="mb-4">
            <LanguageSelector compact={true} showStateSelector={true} />
          </div>
          <UserProfileDropdown />
        </div>
      </div>

      {/* Mobile Header & Menu */}
      <div className="lg:hidden bg-white border-b px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sprout className="h-6 w-6 text-primary" />
          <span className="text-lg font-bold text-foreground">AgriNetra</span>
        </div>
        <Button variant="ghost" size="sm" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-b">
          <nav className="px-4 py-2 space-y-1">
            {visibleNavigationItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive(item.href)
                      ? "bg-primary/10 text-primary"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="flex-1">{item.name}</span>
                  {item.badge && <Badge className="bg-red-500 text-white text-xs">{item.badge}</Badge>}
                </Link>
              )
            })}
          </nav>
          <div className="p-4 border-t">
            <div className="mb-4">
              <LanguageSelector compact={true} showStateSelector={true} />
            </div>
            <UserProfileDropdown />
          </div>
        </div>
      )}
    </>
  )
}

export default Navigation