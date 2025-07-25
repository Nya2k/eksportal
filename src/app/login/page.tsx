"use client"

import FloatingNavbar from "@/components/FloatingNavbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle, Eye, EyeOff, LogIn } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function LoginPage() {
    const router = useRouter()
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    })
    const [showPassword, setShowPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
        if (error) setError("")
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError("")

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password,
                }),
            })

            const data = await response.json()
            console.log("Login response:", data)

            if (response.ok) {
                localStorage.removeItem('token')
                
                if (data.data && data.data.access) {
                    localStorage.setItem('token', data.data.access)
                    
                    if (data.data.refresh) {
                        localStorage.setItem('refresh_token', data.data.refresh)
                    }
                    
                    router.push('/')
                } else {
                    setError("Token tidak ditemukan dalam respons")
                }
            } else {
                setError(data.message || "Email atau kata sandi salah")
            }
        } catch (err) {
            console.error("Login error:", err)
            setError("Terjadi kesalahan. Silakan coba lagi.")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
            <FloatingNavbar />

            <div className="container mx-auto px-4 py-12 pt-28">
                <div className="max-w-md mx-auto">
                    <Card className="bg-slate-800/50 border-slate-700">
                        <CardHeader className="text-center">
                            <div className="mx-auto w-12 h-12 bg-pink-600 rounded-full flex items-center justify-center mb-4">
                                <LogIn className="h-6 w-6 text-white" />
                            </div>
                            <CardTitle className="text-2xl text-white">Masuk ke Akun</CardTitle>
                            <CardDescription className="text-slate-300">
                                Selamat datang kembali!<br />Masuk untuk melanjutkan perjalanan ekspor Anda
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <form onSubmit={handleSubmit} className="space-y-4">
                                {error && (
                                    <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-md">
                                        <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
                                        <span className="text-red-500 text-sm">{error}</span>
                                    </div>
                                )}

                                <div className="space-y-2">
                                    <Label htmlFor="email" className="text-slate-300">
                                        Email
                                    </Label>
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        placeholder="nama@email.com"
                                        className="bg-slate-700 border-slate-600 text-slate-300 placeholder:text-slate-400"
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="password" className="text-slate-300">
                                        Kata Sandi
                                    </Label>
                                    <div className="relative">
                                        <Input
                                            id="password"
                                            name="password"
                                            type={showPassword ? "text" : "password"}
                                            value={formData.password}
                                            onChange={handleInputChange}
                                            placeholder="Masukkan kata sandi"
                                            className="bg-slate-700 border-slate-600 text-slate-300 placeholder:text-slate-400 pr-10"
                                            required
                                        />
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ? (
                                                <EyeOff className="h-4 w-4 text-slate-400" />
                                            ) : (
                                                <Eye className="h-4 w-4 text-slate-400" />
                                            )}
                                        </Button>
                                    </div>
                                </div>

                                <div className="flex items-center justify-end">
                                    <Link href="/forgot-password" className="text-pink-400 hover:text-pink-300 text-sm transition-colors">
                                        Lupa kata sandi?
                                    </Link>
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full bg-pink-600 hover:bg-pink-700 text-white"
                                    disabled={isLoading}
                                >
                                    {isLoading ? "Masuk..." : "Masuk"}
                                </Button>
                            </form>

                            <div className="text-center">
                                <p className="text-slate-400">
                                    Belum punya akun?{" "}
                                    <Link href="/register" className="text-pink-400 hover:text-pink-300 transition-colors">
                                        Daftar di sini
                                    </Link>
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
