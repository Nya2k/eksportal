"use client"

import FloatingNavbar from "@/components/FloatingNavbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import ConfirmationDialog from "@/components/ui/confirmation-dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AuthManager } from "@/lib/auth"
import { DollarSign, Loader2, Settings, Shield } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

interface UserProfile {
    name: string;
    email: string;
    saldo: number;
    is_staff: boolean;
}

interface PricingData {
    current_price: number;
    description: string;
    last_updated: string;
    updated_by: string;
}

export default function AdminPage() {
    const router = useRouter()
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isAuthorized, setIsAuthorized] = useState(false)
    const [currentPricing, setCurrentPricing] = useState<PricingData | null>(null)
    const [newPrice, setNewPrice] = useState("")
    const [newDescription, setNewDescription] = useState("")
    const [isUpdating, setIsUpdating] = useState(false)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")
    const [showUpdateConfirm, setShowUpdateConfirm] = useState(false)

    useEffect(() => {
        checkAuthAndFetchData()
    }, [router])

    const checkAuthAndFetchData = async () => {
        const token = localStorage.getItem('token')
        const isStaffFromStorage = localStorage.getItem('is_staff')
        
        if (!token) {
            router.push('/login')
            return
        }

        if (isStaffFromStorage === 'false') {
            router.push('/')
            return
        }

        if (isStaffFromStorage === 'true') {
            setIsAuthorized(true)
            setIsLoading(false)
            await fetchCurrentPricing()
            return
        }

        try {
            // if localStorage is null
            const profileResponse = await AuthManager.apiRequest(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/profile/`)
            
            if (profileResponse.ok) {
                const profileData = await profileResponse.json()
                const profile = {
                    name: profileData.data?.name || "",
                    email: profileData.data?.email || "",
                    saldo: profileData.data?.saldo || 0,
                    is_staff: profileData.data?.is_staff || false
                }
                setUserProfile(profile)

                localStorage.setItem('is_staff', profile.is_staff.toString())

                if (!profile.is_staff) {
                    // User is not staff, redirect to home
                    router.push('/')
                    return
                }

                setIsAuthorized(true)
                await fetchCurrentPricing()
            } else {
                router.push('/login')
            }
        } catch (err) {
            console.error('Auth check failed:', err)
            router.push('/login')
        } finally {
            setIsLoading(false)
        }
    }

    const fetchCurrentPricing = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/chatbot/pricing/`)
            
            if (response.ok) {
                const data = await response.json()
                setCurrentPricing(data.data)
                setNewPrice(data.data?.current_price?.toString() || "")
                setNewDescription(data.data?.description || "")
            } else {
                setError("Gagal memuat pricing saat ini")
            }
        } catch (err) {
            setError("Terjadi kesalahan saat memuat pricing")
        }
    }

    const handleUpdatePricing = async () => {
        if (!newPrice.trim() || !newDescription.trim()) {
            setError("Harga dan deskripsi tidak boleh kosong")
            return
        }

        const priceNumber = parseInt(newPrice)
        if (isNaN(priceNumber) || priceNumber <= 0) {
            setError("Harga harus berupa angka positif")
            return
        }

        setIsUpdating(true)
        setError("")
        
        try {
            const response = await AuthManager.apiRequest(`${process.env.NEXT_PUBLIC_API_URL}/api/chatbot/pricing/`, {
                method: 'POST',
                body: JSON.stringify({
                    request_price: priceNumber,
                    description: newDescription.trim()
                }),
            })

            if (response.ok) {
                setSuccess("Pricing berhasil diperbarui!")
                setShowUpdateConfirm(false)
                await fetchCurrentPricing()
            } else {
                const errorData = await response.json()
                setError(errorData.message || "Gagal memperbarui pricing")
            }
        } catch (err) {
            setError("Terjadi kesalahan saat memperbarui pricing")
        } finally {
            setIsUpdating(false)
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

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
                <div className="flex items-center gap-3 text-white">
                    <Loader2 className="h-6 w-6 animate-spin" />
                    <span>Memuat...</span>
                </div>
            </div>
        )
    }

    if (!isAuthorized) {
        return null
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
            <FloatingNavbar />

            <div className="container mx-auto px-4 py-8 pt-28">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-4">
                        <Shield className="h-8 w-8 text-orange-400" />
                        <h1 className="text-4xl font-bold text-white">Admin Panel</h1>
                    </div>
                    <p className="text-xl text-slate-300">
                        Kelola pengaturan sistem dan pricing API
                    </p>
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
                    {/* Current Pricing Info */}
                    <Card className="bg-slate-800/50 border-slate-700">
                        <CardHeader>
                            <CardTitle className="text-white flex items-center gap-2">
                                <DollarSign className="h-5 w-5 text-green-400" />
                                Pricing Saat Ini
                            </CardTitle>
                            <CardDescription className="text-slate-300">
                                Informasi pricing yang sedang aktif
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {currentPricing ? (
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-slate-400">Harga per Request:</span>
                                        <span className="text-green-400 font-bold text-lg">
                                            Rp {currentPricing.current_price.toLocaleString('id-ID')}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-start">
                                        <span className="text-slate-400">Deskripsi:</span>
                                        <span className="text-slate-300 text-right max-w-xs">
                                            {currentPricing.description}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-slate-400">Terakhir Diperbarui:</span>
                                        <span className="text-slate-300">
                                            {formatDate(currentPricing.last_updated)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-slate-400">Diperbarui Oleh:</span>
                                        <span className="text-slate-300">{currentPricing.updated_by}</span>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-slate-400">Gagal memuat pricing saat ini</p>
                            )}
                        </CardContent>
                    </Card>

                    {/* Update Pricing */}
                    <Card className="bg-slate-800/50 border-slate-700">
                        <CardHeader>
                            <CardTitle className="text-white flex items-center gap-2">
                                <Settings className="h-5 w-5 text-orange-400" />
                                Perbarui Pricing
                            </CardTitle>
                            <CardDescription className="text-slate-300">
                                Ubah harga dan deskripsi untuk layanan API
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label htmlFor="new-price" className="text-slate-300">
                                    Harga Baru (Rp)
                                </Label>
                                <Input
                                    id="new-price"
                                    type="number"
                                    value={newPrice}
                                    onChange={(e) => setNewPrice(e.target.value)}
                                    placeholder="Masukkan harga baru"
                                    className="bg-slate-700 border-slate-600 text-slate-300 placeholder:text-slate-400"
                                />
                            </div>
                            <div>
                                <Label htmlFor="new-description" className="text-slate-300">
                                    Deskripsi Perubahan
                                </Label>
                                <Input
                                    id="new-description"
                                    value={newDescription}
                                    onChange={(e) => setNewDescription(e.target.value)}
                                    placeholder="Masukkan deskripsi perubahan harga"
                                    className="bg-slate-700 border-slate-600 text-slate-300 placeholder:text-slate-400"
                                />
                            </div>
                            <Button 
                                onClick={() => setShowUpdateConfirm(true)}
                                disabled={isUpdating || !newPrice.trim() || !newDescription.trim()}
                                className="bg-orange-600 hover:bg-orange-700 text-white"
                            >
                                {isUpdating ? (
                                    <>
                                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                        Memperbarui...
                                    </>
                                ) : (
                                    "Perbarui Pricing"
                                )}
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Update Confirmation Dialog */}
            <ConfirmationDialog
                isOpen={showUpdateConfirm}
                onClose={() => setShowUpdateConfirm(false)}
                onConfirm={handleUpdatePricing}
                title="Konfirmasi Perubahan Pricing"
                description={`Apakah Anda yakin ingin mengubah harga menjadi Rp ${parseInt(newPrice || "0").toLocaleString('id-ID')}? Perubahan ini akan mempengaruhi semua pengguna.`}
                confirmText="Perbarui"
                cancelText="Batal"
            />
        </div>
    )
}
