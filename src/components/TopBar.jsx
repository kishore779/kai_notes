import { useState, useRef, useEffect } from 'react'
import { Bell, Moon, Sun, User, Check } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'

export default function TopBar() {
  const { isDark, toggleTheme } = useTheme()
  const [showNotifications, setShowNotifications] = useState(false)
  const [showProfile, setShowProfile] = useState(false)
  const [notifications, setNotifications] = useState([
    { id: 1, message: 'Welcome to Hushh Study!', read: false, createdAt: new Date().toISOString() }
  ])
  const notifRef = useRef(null)
  const profileRef = useRef(null)

  const unreadCount = notifications.filter(n => !n.read).length

  const clearNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifications(false)
      }
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setShowProfile(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="flex items-center justify-end gap-4 p-4 border-b border-white/10">
      {/* Dark mode toggle */}
      <button
        onClick={toggleTheme}
        className="p-2 rounded-xl glass hover:bg-white/10 transition-all"
      >
        {isDark ? <Sun size={20} /> : <Moon size={20} />}
      </button>

      {/* Notifications */}
      <div className="relative" ref={notifRef}>
        <button
          onClick={() => setShowNotifications(!showNotifications)}
          className="p-2 rounded-xl glass hover:bg-white/10 transition-all relative"
        >
          <Bell size={20} />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </button>

        {showNotifications && (
          <div className="absolute right-0 mt-2 w-80 glass-card animate-slide-in z-50">
            <h3 className="font-semibold mb-3">Notifications</h3>
            {notifications.length === 0 ? (
              <p className="text-gray-400 text-sm">No notifications</p>
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={`p-3 rounded-lg ${notif.read ? 'bg-white/5' : 'bg-violet-500/20'} flex items-start justify-between gap-2`}
                  >
                    <div>
                      <p className="text-sm">{notif.message}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(notif.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <button
                      onClick={() => clearNotification(notif.id)}
                      className="text-gray-400 hover:text-white"
                    >
                      <Check size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Profile */}
      <div className="relative" ref={profileRef}>
        <button
          onClick={() => setShowProfile(!showProfile)}
          className="p-2 rounded-xl glass hover:bg-white/10 transition-all"
        >
          <User size={20} />
        </button>

        {showProfile && (
          <div className="absolute right-0 mt-2 w-48 glass-card animate-slide-in z-50">
            <div className="pb-3 border-b border-white/10 mb-3">
              <p className="font-medium">Guest User</p>
              <p className="text-sm text-gray-400">Welcome!</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
