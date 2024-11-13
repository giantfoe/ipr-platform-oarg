'use client'

import { useTheme } from "@/app/_providers/ThemeProvider"
import { Sun, Moon, Monitor } from "lucide-react"

export default function SettingsPage() {
  const { theme, setTheme } = useTheme()

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Display Settings</h1>
      
      <div className="bg-card shadow rounded-lg p-6">
        <h2 className="text-lg font-medium mb-4">Theme</h2>
        <div className="grid grid-cols-3 gap-4">
          <button
            onClick={() => setTheme('light')}
            className={`p-4 rounded-lg border flex flex-col items-center gap-2 ${
              theme === 'light' ? 'border-primary bg-primary/5' : 'border-border'
            }`}
          >
            <Sun className="h-6 w-6" />
            <span>Light</span>
          </button>
          <button
            onClick={() => setTheme('dark')}
            className={`p-4 rounded-lg border flex flex-col items-center gap-2 ${
              theme === 'dark' ? 'border-primary bg-primary/5' : 'border-border'
            }`}
          >
            <Moon className="h-6 w-6" />
            <span>Dark</span>
          </button>
          <button
            onClick={() => setTheme('system')}
            className={`p-4 rounded-lg border flex flex-col items-center gap-2 ${
              theme === 'system' ? 'border-primary bg-primary/5' : 'border-border'
            }`}
          >
            <Monitor className="h-6 w-6" />
            <span>System</span>
          </button>
        </div>
      </div>
    </div>
  )
} 