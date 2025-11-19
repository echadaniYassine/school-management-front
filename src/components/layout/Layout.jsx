// src/components/layout/Layout.jsx
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Menu,
  X,
  Home,
  BookOpen,
  Users,
  GraduationCap,
  ClipboardList,
  User,
  LogOut,
  Settings,
  ChevronRight
} from 'lucide-react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Button, ThemeToggle, LanguageSelector } from '@/components/ui'
import { useAuth } from '@/contexts/AuthContext'
import { cn } from '@/lib/utils'

export function Layout({ children }) {
  const { t } = useTranslation()
  const { user, logout } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  const navigation = [
    {
      name: t('nav.dashboard'),
      href: '/dashboard',
      icon: Home,
      roles: ['admin', 'guardian', 'student']
    },
    {
      name: t('nav.students'),
      href: '/students',
      icon: Users,
      roles: ['admin']
    },
    {
      name: t('nav.teachers'),
      href: '/teachers',
      icon: Users,
      roles: ['admin']
    },
    {
      name: t('nav.guardians'),
      href: '/guardians',
      icon: GraduationCap,
      roles: ['admin']
    },
    {
      name: t('nav.registrations'),
      href: '/registrations',
      icon: ClipboardList,
      roles: ['admin']
    },
    {
      name: t('nav.schedule'),
      href: '/schedule',
      icon: ClipboardList,
      roles: ['admin']
    },
  ]

  const filteredNavigation = navigation.filter(item =>
    item.roles.includes(user?.role)
  )

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const sidebarVariants = {
    open: {
      x: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 40
      }
    },
    closed: {
      x: "-100%",
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 40
      }
    }
  }

  const overlayVariants = {
    open: { opacity: 1 },
    closed: { opacity: 0 }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0">
        <div className="flex flex-col flex-grow bg-card border-r shadow-sm">
          {/* Logo */}
          <div className="flex items-center justify-center h-16 px-4 border-b">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                SchoolMS
              </span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {filteredNavigation.map((item) => {
              const isActive = location.pathname === item.href
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 group",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent"
                  )}
                >
                  <item.icon className={cn(
                    "w-5 h-5 transition-transform duration-200",
                    isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground",
                    "group-hover:scale-110"
                  )} />
                  <span>{item.name}</span>
                  {isActive && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="ml-auto"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </motion.div>
                  )}
                </Link>
              )
            })}
          </nav>

          {/* User Menu */}
          <div className="p-4 border-t">
            <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent transition-colors">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                {user?.name?.charAt(0)?.toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{user?.name}</p>
                <p className="text-xs text-muted-foreground capitalize">{user?.role}</p>
              </div>
            </div>

            <div className="mt-3 space-y-1">
              <Link
                to="/profile"
                className="flex items-center gap-2 px-2 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors"
              >
                <User className="w-4 h-4" />
                {t('nav.profile')}
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-2 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors w-full text-left"
              >
                <LogOut className="w-4 h-4" />
                {t('nav.logout')}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              variants={overlayVariants}
              initial="closed"
              animate="open"
              exit="closed"
              className="fixed inset-0 z-40 bg-black/50 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.div
              variants={sidebarVariants}
              initial="closed"
              animate="open"
              exit="closed"
              className="fixed inset-y-0 left-0 z-50 w-64 bg-card shadow-xl lg:hidden"
            >
              <div className="flex flex-col h-full">
                {/* Mobile Header */}
                <div className="flex items-center justify-between h-16 px-4 border-b">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                      <GraduationCap className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      SchoolMS
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSidebarOpen(false)}
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>

                {/* Mobile Navigation */}
                <nav className="flex-1 px-4 py-6 space-y-2">
                  {filteredNavigation.map((item) => {
                    const isActive = location.pathname === item.href
                    return (
                      <Link
                        key={item.name}
                        to={item.href}
                        onClick={() => setSidebarOpen(false)}
                        className={cn(
                          "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                          isActive
                            ? "bg-primary text-primary-foreground"
                            : "text-muted-foreground hover:text-foreground hover:bg-accent"
                        )}
                      >
                        <item.icon className="w-5 h-5" />
                        <span>{item.name}</span>
                      </Link>
                    )
                  })}
                </nav>

                {/* Mobile User Menu */}
                <div className="p-4 border-t">
                  <div className="flex items-center gap-3 p-2 rounded-lg mb-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                      {user?.name?.charAt(0)?.toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{user?.name}</p>
                      <p className="text-xs text-muted-foreground capitalize">{user?.role}</p>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <Link
                      to="/profile"
                      onClick={() => setSidebarOpen(false)}
                      className="flex items-center gap-2 px-2 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors"
                    >
                      <User className="w-4 h-4" />
                      {t('nav.profile')}
                    </Link>
                    <button
                      onClick={() => {
                        setSidebarOpen(false)
                        handleLogout()
                      }}
                      className="flex items-center gap-2 px-2 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors w-full text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      {t('nav.logout')}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="lg:pl-64">
        {/* Top Bar */}
        <div className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 sm:px-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden"
          >
            <Menu className="w-5 h-5" />
          </Button>

          <div className="flex-1" />

          <div className="flex items-center gap-2">
            <LanguageSelector />
            <ThemeToggle />
          </div>
        </div>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  )
}