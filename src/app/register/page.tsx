"use client"

import FloatingNavbar from "@/components/FloatingNavbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle, CheckCircle, Eye, EyeOff, UserPlus, XCircle } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function RegisterPage() {
    const router = useRouter()
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    })
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")

    const passwordValidation = {
        minLength: formData.password.length >= 8,
        hasUppercase: /[A-Z]/.test(formData.password),
        hasLowercase: /[a-z]/.test(formData.password),
        hasNumber: /\d/.test(formData.password),
    }

    const isPasswordValid = Object.values(passwordValidation).every(Boolean)
    const doPasswordsMatch = formData.password === formData.confirmPassword && formData.confirmPassword !== ""

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
        // Clear error when user starts typing
        if (error) setError("")
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!isPasswordValid || !doPasswordsMatch) return

        setIsLoading(true)
        
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/register/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                }),
            })

            const data = await response.json()
            console.log("Registration response:", data)

            if (response.ok) {
                console.log("Registration successful:", data)
                
                localStorage.removeItem('token')
                localStorage.removeItem('refresh_token')
                
                if (data.data && data.data.access) {
                    localStorage.setItem('token', data.data.access)
                    if (data.data.refresh) {
                        localStorage.setItem('refresh_token', data.data.refresh)
                    }
                    router.push('/')
                } else {
                    router.push('/login')
                }
            } else {
                setError(data.message || "Terjadi kesalahan saat mendaftar")
            }
        } catch {
            console.error("Registration error")
            setError("Terjadi kesalahan. Silakan coba lagi.")
        } finally {
            setIsLoading(false)
        }
    }

    const ValidationItem = ({ isValid, text }: { isValid: boolean; text: string }) => (
        <div className="flex items-center gap-2">
            {isValid ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
            ) : (
                <XCircle className="h-4 w-4 text-red-500" />
            )}
            <span className={`text-sm ${isValid ? "text-green-500" : "text-red-500"}`}>{text}</span>
        </div>
    )

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
            <FloatingNavbar />

            <div className="container mx-auto px-4 py-12 pt-28">
                <div className="max-w-md mx-auto">
                    <Card className="bg-slate-800/50 border-slate-700">
                        <CardHeader className="text-center">
                            <div className="mx-auto w-12 h-12 bg-pink-600 rounded-full flex items-center justify-center mb-4">
                                <UserPlus className="h-6 w-6 text-white" />
                            </div>
                            <CardTitle className="text-2xl text-white">Buat Akun</CardTitle>
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
                                    <Label htmlFor="name" className="text-slate-300">
                                        Nama Lengkap
                                    </Label>
                                    <Input
                                        id="name"
                                        name="name"
                                        type="text"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        placeholder="Masukkan nama lengkap"
                                        className="bg-slate-700 border-slate-600 text-slate-300 placeholder:text-slate-400"
                                        required
                                    />
                                </div>

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
                                    
                                    {formData.password && (
                                        <div className="space-y-2 p-3 bg-slate-700/50 rounded-md">
                                            <ValidationItem isValid={passwordValidation.minLength} text="Minimal 8 karakter" />
                                            <ValidationItem isValid={passwordValidation.hasUppercase} text="Mengandung huruf besar" />
                                            <ValidationItem isValid={passwordValidation.hasLowercase} text="Mengandung huruf kecil" />
                                            <ValidationItem isValid={passwordValidation.hasNumber} text="Mengandung angka" />
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="confirmPassword" className="text-slate-300">
                                        Konfirmasi Kata Sandi
                                    </Label>
                                    <div className="relative">
                                        <Input
                                            id="confirmPassword"
                                            name="confirmPassword"
                                            type={showConfirmPassword ? "text" : "password"}
                                            value={formData.confirmPassword}
                                            onChange={handleInputChange}
                                            placeholder="Konfirmasi kata sandi"
                                            className="bg-slate-700 border-slate-600 text-slate-300 placeholder:text-slate-400 pr-10"
                                            required
                                        />
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        >
                                            {showConfirmPassword ? (
                                                <EyeOff className="h-4 w-4 text-slate-400" />
                                            ) : (
                                                <Eye className="h-4 w-4 text-slate-400" />
                                            )}
                                        </Button>
                                    </div>
                                    
                                    {formData.confirmPassword && (
                                        <div className="flex items-center gap-2">
                                            {doPasswordsMatch ? (
                                                <CheckCircle className="h-4 w-4 text-green-500" />
                                            ) : (
                                                <XCircle className="h-4 w-4 text-red-500" />
                                            )}
                                            <span className={`text-sm ${doPasswordsMatch ? "text-green-500" : "text-red-500"}`}>
                                                {doPasswordsMatch ? "Kata sandi cocok" : "Kata sandi tidak cocok"}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full bg-pink-600 hover:bg-pink-700 text-white"
                                    disabled={!isPasswordValid || !doPasswordsMatch || isLoading}
                                >
                                    {isLoading ? "Membuat Akun..." : "Buat Akun"}
                                </Button>
                            </form>

                            <div className="text-center">
                                <p className="text-slate-400">
                                    Sudah punya akun?{" "}
                                    <Link href="/login" className="text-pink-400 hover:text-pink-300 transition-colors">
                                        Masuk di sini
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
