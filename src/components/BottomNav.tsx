'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Home, Search, Plus, User, Menu,
  Tractor, Leaf, MapPin, Bell
} from 'lucide-react'

const BottomNav: React.FC = () => {
  const pathname = usePathname()
  const [showMenu, setShowMenu] = useState(false)

  const navItems = [
    {
      href: '/',
      label: 'الرئيسية',
      icon: Home,
      active: pathname === '/'
    },
    {
      href: '/equipment',
      label: 'المعدات',
      icon: Tractor,
      active: pathname.startsWith('/equipment')
    },
    {
      href: '/land',
      label: 'الأراضي',
      icon: Leaf,
      active: pathname.startsWith('/land')
    },
    {
      href: '/animals',
      label: 'الحيوانات',
      icon: function AnimalIcon(props: any) { return <span className="text-lg">🐄</span> },
      active: pathname.startsWith('/animals')
    },
    {
      href: '/search',
      label: 'البحث',
      icon: Search,
      active: pathname.startsWith('/search')
    },
    {
      href: '/profile',
      label: 'حسابي',
      icon: User,
      active: pathname.startsWith('/profile') || pathname.startsWith('/dashboard')
    }
  ]

  const quickActions = [
    {
      href: '/equipment/new',
      label: 'إضافة معدات',
      icon: Plus,
      color: 'emerald'
    },
    {
      href: '/land/new',
      label: 'إضافة أرض',
      icon: MapPin,
      color: 'green'
    },
    {
      href: '/animals/new',
      label: 'إضافة حيوان',
      icon: Plus,
      color: 'purple'
    },
    {
      href: '/notifications',
      label: 'الإشعارات',
      icon: Bell,
      color: 'orange'
    }
  ]

  return (
    <>
      {/* Bottom Navigation */}
      <motion.nav
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className="fixed bottom-0 left-0 right-0 z-50 lg:hidden"
      >
        <div className="bg-white/10 backdrop-blur-xl border-t border-white/20 mx-4 mb-4 rounded-2xl">
          <div className="flex items-center justify-around p-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="relative flex flex-col items-center p-3 rounded-xl transition-all duration-200 group touch-manipulation"
              >
                <div
                  className={`relative p-2 rounded-lg transition-all duration-200 ${
                    item.active 
                      ? 'bg-emerald-500/20 text-emerald-400' 
                      : 'text-gray-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  {item.active && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-emerald-500/20 rounded-lg"
                      initial={false}
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                </div>
                <span className="text-xs mt-1 text-white/80">{item.label}</span>
              </Link>
            ))}

            {/* More Menu Button */}
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="flex flex-col items-center p-3 rounded-xl transition-all duration-200 touch-manipulation"
              >
                <div className={`p-2 rounded-lg transition-all duration-200 ${
                  showMenu 
                    ? 'bg-emerald-500/20' 
                    : 'hover:bg-white/10'
                }`}>
                  <Menu className="w-5 h-5" />
                </div>
                <span className="text-xs mt-1 text-white/80">المزيد</span>
              </button>

              {/* Quick Actions Dropdown */}
              <AnimatePresence>
                {showMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 20, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-2 shadow-2xl"
                  >
                    <div className="flex flex-col gap-2 min-w-[140px]">
                      {quickActions.map((action, index) => (
                        <motion.div
                          key={action.href}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.03 }}
                        >
                          <Link
                            href={action.href}
                            onClick={() => setShowMenu(false)}
                            className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-200 touch-manipulation"
                          >
                            <div className={`w-8 h-8 rounded-lg bg-${action.color}-500/20 flex items-center justify-center`}>
                              <action.icon className="w-4 h-4 text-emerald-400" />
                            </div>
                            <span className="text-sm font-medium">{action.label}</span>
                          </Link>
                        </motion.div>
                      ))}
                    </div>
                    
                    {/* Arrow */}
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-white/10"></div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Backdrop for menu */}
      <AnimatePresence>
        {showMenu && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowMenu(false)}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>
    </>
  )
}

export default BottomNav
