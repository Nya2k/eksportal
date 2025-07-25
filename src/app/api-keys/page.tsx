"use client"

import FloatingNavbar from "@/components/FloatingNavbar"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calendar, Clock, Copy, Key, Plus, Trash2, Wallet } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

interface ApiKey {
    id: string
    name: string
    key: string
    expiry: string
    created_at: string
}

export default function ApiKeysPage() {
    const router = useRouter()
    const [apiKeys, setApiKeys] = useState<ApiKey[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isCreating, setIsCreating] = useState(false)
    const [newKeyName, setNewKeyName] = useState("")
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")
    const [pricing, setPricing] = useState<number | null>(null)
    const [isPricingLoading, setIsPricingLoading] = useState(true)
    const [isTopUpOpen, setIsTopUpOpen] = useState(false)
    const [isTopingUp, setIsTopingUp] = useState(false)

    useEffect(() => {
        const token = localStorage.getItem('token')
        if (!token) {
            router.push('/login')
            return
        }
        
        fetchApiKeys()
        fetchPricing()
    }, [router])

    const fetchPricing = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/chatbot/pricing/`)
            
            if (response.ok) {
                const data = await response.json()
                setPricing(data.data?.current_price || 0)
            } else {
                console.error("Failed to fetch pricing")
                setPricing(0)
            }
        } catch (err) {
            console.error("Error fetching pricing:", err)
            setPricing(0)
        } finally {
            setIsPricingLoading(false)
        }
    }

    const fetchApiKeys = async () => {
        try {
            const token = localStorage.getItem('token')
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/chatbot/keys/all/`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            })

            if (response.ok) {
                const data = await response.json()
                setApiKeys(data.data || [])
            } else {
                setError("Gagal memuat API keys")
            }
        } catch (err) {
            setError("Terjadi kesalahan saat memuat data")
        } finally {
            setIsLoading(false)
        }
    }

    const createApiKey = async () => {
        if (!newKeyName.trim()) {
            setError("Nama API key tidak boleh kosong")
            return
        }

        setIsCreating(true)
        setError("")
        
        try {
            const token = localStorage.getItem('token')
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/chatbot/keys/register/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: newKeyName.trim()
                }),
            })

            if (response.ok) {
                setSuccess("API key berhasil dibuat!")
                setNewKeyName("")
                fetchApiKeys()
            } else {
                const errorData = await response.json()
                setError(errorData.message || "Gagal membuat API key")
            }
        } catch (err) {
            setError("Terjadi kesalahan saat membuat API key")
        } finally {
            setIsCreating(false)
        }
    }

    const deleteApiKey = async (keyName: string) => {
        try {
            const token = localStorage.getItem('token')
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/chatbot/keys/delete/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: keyName
                }),
            })

            if (response.ok) {
                setSuccess("API key berhasil dihapus!")
                fetchApiKeys()
            } else {
                const errorData = await response.json()
                setError(errorData.message || "Gagal menghapus API key")
            }
        } catch (err) {
            setError("Terjadi kesalahan saat menghapus API key")
        }
    }

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text)
        setSuccess("API key berhasil disalin!")
    }

    const topUpSaldo = async (amount: number) => {
        setIsTopingUp(true)
        setError("")
        
        try {
            const token = localStorage.getItem('token')
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/saldo/topup/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    amount: amount
                }),
            })

            if (response.ok) {
                const data = await response.json()
                setSuccess(`Berhasil top up saldo sebesar Rp ${amount.toLocaleString('id-ID')}!`)
                setIsTopUpOpen(false)
                
                // Trigger refresh profile
                window.dispatchEvent(new CustomEvent('refreshProfile'))
            } else {
                const errorData = await response.json()
                setError(errorData.message || "Gagal melakukan top up")
            }
        } catch (err) {
            setError("Terjadi kesalahan saat top up saldo")
        } finally {
            setIsTopingUp(false)
        }
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    const isExpired = (expiryDate: string) => {
        return new Date(expiryDate) < new Date()
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
            <FloatingNavbar />

            <div className="container mx-auto px-4 py-8 pt-28">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <h1 className="text-4xl font-bold text-white">Kelola API Key</h1>
                        <Button
                            onClick={() => setIsTopUpOpen(true)}
                            className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
                        >
                            <Wallet className="h-4 w-4" />
                            Top Up Saldo
                        </Button>
                    </div>
                    <p className="text-xl text-slate-300 mb-4">
                        Buat dan kelola API key untuk mengakses layanan chatbot Eksportal
                    </p>
                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                            <span className="text-blue-400 font-semibold">Informasi Pricing</span>
                        </div>
                        <p className="text-slate-300 text-sm">
                            Setiap hit API dikenakan biaya {isPricingLoading ? (
                                <span className="text-slate-400">Loading...</span>
                            ) : (
                                <span className="font-bold text-blue-400">Rp {pricing?.toLocaleString('id-ID')}</span>
                            )} per request.
                            Pastikan untuk memantau penggunaan API key Anda.
                        </p>
                    </div>
                </div>

                {/* Success/Error Messages */}
                {error && (
                    <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                        <p className="text-red-400">{error}</p>
                    </div>
                )}
                
                {success && (
                    <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                        <p className="text-green-400">{success}</p>
                    </div>
                )}

                <div className="grid gap-8">
                    {/* Create New Key */}
                    <Card className="bg-slate-800/50 border-slate-700">
                        <CardHeader>
                            <CardTitle className="text-white flex items-center gap-2">
                                <Plus className="h-5 w-5 text-pink-400" />
                                Buat API Key Baru
                            </CardTitle>
                            <CardDescription className="text-slate-300">
                                Buat API key baru untuk mengakses layanan chatbot
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label htmlFor="key-name" className="text-slate-300">
                                    Nama API Key
                                </Label>
                                <Input
                                    id="key-name"
                                    value={newKeyName}
                                    onChange={(e) => setNewKeyName(e.target.value)}
                                    placeholder="Masukkan nama untuk API key"
                                    className="bg-slate-700 border-slate-600 text-slate-300 placeholder:text-slate-400"
                                />
                            </div>
                            <Button 
                                onClick={createApiKey}
                                disabled={isCreating || !newKeyName.trim()}
                                className="bg-pink-600 hover:bg-pink-700 text-white"
                            >
                                {isCreating ? "Membuat..." : "Buat API Key"}
                            </Button>
                        </CardContent>
                    </Card>

                    {/* API Keys List */}
                    <Card className="bg-slate-800/50 border-slate-700">
                        <CardHeader>
                            <CardTitle className="text-white flex items-center gap-2">
                                <Key className="h-5 w-5 text-pink-400" />
                                API Keys Anda
                            </CardTitle>
                            <CardDescription className="text-slate-300">
                                Daftar semua API key yang telah Anda buat
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {isLoading ? (
                                <div className="text-center py-8">
                                    <p className="text-slate-400">Memuat API keys...</p>
                                </div>
                            ) : apiKeys.length === 0 ? (
                                <div className="text-center py-8">
                                    <Key className="h-12 w-12 text-slate-600 mx-auto mb-4" />
                                    <p className="text-slate-400">Belum ada API key</p>
                                    <p className="text-slate-500 text-sm">Buat API key pertama Anda di atas</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {apiKeys.map((apiKey) => (
                                        <div
                                            key={apiKey.id}
                                            className="p-4 bg-slate-700/50 rounded-lg border border-slate-600"
                                        >
                                            <div className="flex items-center justify-between mb-3">
                                                <div>
                                                    <h3 className="text-white font-semibold">{apiKey.name}</h3>
                                                    <div className="flex items-center gap-4 mt-1">
                                                        <Badge
                                                            variant={isExpired(apiKey.expiry) ? "destructive" : "secondary"}
                                                            className={isExpired(apiKey.expiry) ? "bg-red-600 text-white" : "bg-green-600 text-white"}
                                                        >
                                                            {isExpired(apiKey.expiry) ? "Expired" : "Active"}
                                                        </Badge>
                                                        <span className="text-slate-400 text-sm flex items-center gap-1">
                                                            <Calendar className="h-3 w-3" />
                                                            Dibuat: {formatDate(apiKey.created_at)}
                                                        </span>
                                                    </div>
                                                </div>
                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent className="bg-slate-800 border-slate-700">
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle className="text-white">
                                                                Hapus API Key
                                                            </AlertDialogTitle>
                                                            <AlertDialogDescription className="text-slate-300">
                                                                Apakah Anda yakin ingin menghapus API key "{apiKey.name}"? 
                                                                Tindakan ini tidak dapat dibatalkan.
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel className="bg-slate-700 text-slate-300 hover:bg-slate-600">
                                                                Batal
                                                            </AlertDialogCancel>
                                                            <AlertDialogAction
                                                                onClick={() => deleteApiKey(apiKey.name)}
                                                                className="bg-red-600 hover:bg-red-700 text-white"
                                                            >
                                                                Hapus
                                                            </AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            </div>
                                            
                                            <div className="space-y-2">
                                                <div>
                                                    <Label className="text-slate-400 text-sm">API Key</Label>
                                                    <div className="flex gap-2 mt-1">
                                                        <Input
                                                            value={apiKey.key}
                                                            readOnly
                                                            className="bg-slate-600 border-slate-500 text-slate-300 font-mono text-sm"
                                                        />
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() => copyToClipboard(apiKey.key)}
                                                            className="border-slate-600 text-slate-500 hover:bg-slate-700"
                                                        >
                                                            <Copy className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </div>
                                                
                                                <div className="flex items-center gap-1 text-slate-400 text-sm">
                                                    <Clock className="h-3 w-3" />
                                                    Expired: {formatDate(apiKey.expiry)}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Top Up Saldo Dialog */}
                {isTopUpOpen && (
                    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
                        <div className="bg-slate-800 border border-slate-700 rounded-lg shadow-lg p-6 w-full max-w-md">
                            <div className="flex flex-col space-y-2 text-center sm:text-left mb-4">
                                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                                    <Wallet className="h-5 w-5 text-green-400" />
                                    Top Up Saldo
                                </h2>
                                <p className="text-sm text-slate-300">
                                    Pilih nominal yang ingin Anda top up untuk menggunakan layanan API
                                </p>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-3 my-4">
                                {[5000, 10000, 25000, 50000].map((amount) => (
                                    <Button
                                        key={amount}
                                        onClick={() => topUpSaldo(amount)}
                                        disabled={isTopingUp}
                                        className="bg-slate-700 hover:bg-green-600 text-slate-300 hover:text-white border border-slate-600 hover:border-green-500 transition-all"
                                    >
                                        Rp {amount.toLocaleString('id-ID')}
                                    </Button>
                                ))}
                            </div>
                            
                            {isTopingUp && (
                                <div className="text-center py-2">
                                    <p className="text-slate-400 text-sm">Memproses top up...</p>
                                </div>
                            )}
                            
                            <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 mt-4">
                                <Button
                                    variant="outline"
                                    className="bg-slate-700 text-slate-300 hover:bg-slate-600 mt-2 sm:mt-0"
                                    disabled={isTopingUp}
                                    onClick={() => setIsTopUpOpen(false)}
                                >
                                    Batal
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
