"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import Cookies from 'js-cookie'

export default function AdminLoginPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Check hardcoded credentials
    if (username === "adminu" && password === "1234") {
      // Set both localStorage (for client-side) and cookie (for middleware)
      localStorage.setItem("adminAuth", "true")
      localStorage.setItem("adminUser", username)
      
      // Set cookie for middleware authentication
      Cookies.set('adminAuth', 'true', { expires: 1 }) // Expires in 1 day
      
      router.push("/admin")
    } else {
      setError("Invalid credentials")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            
            {error && <p className="text-red-500 text-sm">{error}</p>}
            
            <Button type="submit" className="w-full bg-gray-800 hover:bg-gray-700">
              Login
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}