"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { createClient } from "@/utils/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Icons } from "@/components/icons"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"

export default function LoginForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)
    setError(null)

    const formData = new FormData(event.currentTarget)
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    const supabase = createClient()

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError(error.message)
      setIsLoading(false)
      return
    }

    router.refresh()
    router.push("/dashboard")
  }

  return (
    <Card className="w-full">
      <CardHeader className="space-y-3">
        <div className="flex justify-center">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-F9D4ddrEGGEsQzz8ilIzEghEuUMTJc.png"
            alt="DigiSME Logo"
            width={150}
            height={50}
            className="object-contain"
          />
        </div>
        <h2 className="text-2xl font-semibold text-center">Welcome back!</h2>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              placeholder="contact@onesta.com"
              type="email"
              disabled={isLoading}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" name="password" type="password" disabled={isLoading} required />
          </div>
          {error && <div className="text-sm text-red-500">{error}</div>}
          <Button type="submit" className="w-full bg-[#1e4d8c]" disabled={isLoading}>
            {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
            Login
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col space-y-4">
        <Link href="/forgot-password" className="text-sm text-center text-blue-600 hover:underline w-full">
          Activate / Forgot password with OTP
        </Link>
        <div className="flex justify-center space-x-4">
          <Button variant="outline" size="icon">
            <Icons.facebook className="h-4 w-4 text-blue-600" />
          </Button>
          <Button variant="outline" size="icon">
            <Icons.instagram className="h-4 w-4 text-pink-600" />
          </Button>
          <Button variant="outline" size="icon">
            <Icons.linkedin className="h-4 w-4 text-blue-600" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}

