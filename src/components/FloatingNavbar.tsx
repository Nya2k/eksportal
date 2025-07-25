"use client"

import { LogOut, User, Wallet } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ConfirmationDialog from "./ui/confirmation-dialog";

interface UserProfile {
    name: string;
    saldo: number;
}

export default function FloatingNavbar() {
    const router = useRouter()
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)

    useEffect(() => {
        const fetchProfile = async () => {
            const token = localStorage.getItem('token')
            if (!token) return

            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/profile/`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                })

                if (response.ok) {
                    const data = await response.json()
                    setUserProfile({
                        name: data.data?.name || "",
                        saldo: data.data?.saldo || 0
                    })
                    setIsLoggedIn(true)
                } else {
                    const errorText = await response.text()
                    console.error("Error response:", errorText)
                }
            } catch (error) {
                console.error('Failed to fetch profile:', error)
            }
        }

        fetchProfile()

        const handleRefreshProfile = () => {
            fetchProfile()
        }

        window.addEventListener('refreshProfile', handleRefreshProfile)

        return () => {
            window.removeEventListener('refreshProfile', handleRefreshProfile)
        }
    }, [])

    const handleLogout = () => {
        localStorage.removeItem('token')
        setUserProfile(null)
        setIsLoggedIn(false)
        setShowLogoutConfirm(false)
        router.push('/login')
    }

    const handleLogoutClick = () => {
        setShowLogoutConfirm(true)
    }

    return (
        <>
            <header className="fixed top-4 left-4 right-4 z-50 border border-slate-700 bg-slate-900/80 backdrop-blur-md rounded-2xl shadow-2xl">
            <div className="container mx-auto px-6 py-4">
                <div className="flex items-center justify-between">
                    <Link href="/" className="text-2xl font-bold text-white hover:text-pink-400 transition-colors">
                        Eksportal
                    </Link>
                    <div className="flex items-center gap-6">
                        <nav className="flex gap-6">
                            <Link href="/api-docs" className="text-slate-300 hover:text-pink-400 transition-colors">
                                Dokumentasi API
                            </Link>
                            {isLoggedIn && (
                                <Link href="/api-keys" className="text-slate-300 hover:text-pink-400 transition-colors">
                                    API Keys
                                </Link>
                            )}
                            <Link href="/chatbot" className="text-slate-300 hover:text-pink-400 transition-colors">
                                Asisten AI
                            </Link>
                        </nav>

                        {isLoggedIn && userProfile ? (
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2 bg-slate-800/50 rounded-lg px-3 py-2">
                                    <Wallet className="h-4 w-4 text-green-400" />
                                    <span className="text-slate-300 text-sm">Rp {userProfile.saldo.toLocaleString('id-ID')}</span>
                                </div>
                                <div className="flex items-center gap-2 bg-slate-800/50 rounded-lg px-3 py-2">
                                    <User className="h-4 w-4 text-pink-400" />
                                    <span className="text-slate-300 text-sm">{userProfile.name}</span>
                                </div>
                                <button 
                                    onClick={handleLogoutClick}
                                    className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
                                >
                                    <LogOut className="h-4 w-4" />
                                    Keluar
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-4">
                                <Link href="/login" className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg transition-colors">
                                    Masuk
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>

        <ConfirmationDialog
            isOpen={showLogoutConfirm}
            onClose={() => setShowLogoutConfirm(false)}
            onConfirm={handleLogout}
            title="Konfirmasi Keluar"
            description="Apakah Anda yakin ingin keluar dari akun?"
            confirmText="Keluar"
            cancelText="Batal"
        />
        </>
    )
}
