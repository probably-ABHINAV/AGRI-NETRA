"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Sprout,
  LayoutDashboard,
  BarChart3,
  MessageSquare,
  Zap,
  Shield,
  Settings,
  User,
  LogOut,
  Menu,
  X,
  Leaf,
  Bug,
} from "lucide-react"

export default function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  const navigationItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Crop Recommendations", href: "/crop-recommendations", icon: Leaf },
    { name: "Pest Detection", href: "/pest-detection", icon: Bug },
    { name: "IoT Sensors", href: "/sensors", icon: Zap },
    { name: "Analytics", href: "/analytics", icon: BarChart3 },
    { name: "Expert Chat", href: "/chat", icon: MessageSquare, badge: 3 },
    { name: "Admin Panel", href: "/admin", icon: Shield, adminOnly: true },
  ]

  const isActive = (href: string) => pathname === href

  // Don't show navigation on auth pages or landing page
  if (pathname === "/" || pathname.startsWith("/auth/")) {
    return null
  }

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 lg:bg-white lg:border-r lg:border-gray-200">
        <div className="flex items-center gap-2 h-16 px-6 border-b border-gray-200">
          <Sprout className="h-8 w-8 text-green-600" />
          <span className="text-xl font-bold text-gray-900">AgriNetra</span>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive(item.href)
                    ? "bg-green-100 text-green-700"
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

        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <User className="h-4 w-4 text-green-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">John Farmer</p>
              <p className="text-xs text-gray-500">Premium Plan</p>
            </div>
          </div>
          <div className="mt-3 space-y-1">
            <Button variant="ghost" size="sm" className="w-full justify-start">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Header */}
      <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sprout className="h-6 w-6 text-green-600" />
          <span className="text-lg font-bold text-gray-900">AgriNetra</span>
        </div>
        <Button variant="ghost" size="sm" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-gray-200">
          <nav className="px-4 py-2 space-y-1">
            {navigationItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive(item.href)
                      ? "bg-green-100 text-green-700"
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
        </div>
      )}
    </>
  )
}
