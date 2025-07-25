"use client"

import { Bot, FileText, GraduationCap, Key, LogOut, Radio, Shield, Sparkles, TrendingUp, User, Wallet } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ConfirmationDialog from "./ui/confirmation-dialog";
import { Dropdown } from "./ui/dropdown";
import { useToast } from "./ui/toast";

interface UserProfile {
    name: string;
    saldo: number;
    is_staff: boolean;
}

export default function FloatingNavbar() {
    const router = useRouter()
    const { showToast } = useToast()
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
                    const profileData = {
                        name: data.data?.name || "",
                        saldo: data.data?.saldo || 0,
                        is_staff: data.data?.is_staff || false
                    }
                    setUserProfile(profileData)
                    setIsLoggedIn(true)
                    localStorage.setItem('is_staff', profileData.is_staff.toString())
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
        localStorage.removeItem('is_staff')
        setUserProfile(null)
        setIsLoggedIn(false)
        setShowLogoutConfirm(false)
        router.push('/login')
    }

    const handleLogoutClick = () => {
        setShowLogoutConfirm(true)
    }

    const handleComingSoonClick = (featureName: string) => {
        showToast(`Fitur ${featureName} sedang dalam pengembangan dan akan segera hadir!`, 'info')
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
                                <Dropdown
                                    className="-mr-4"
                                    trigger={
                                        <span className="text-slate-300 hover:text-pink-400 transition-colors flex items-center gap-2 text-sm">
                                            <Sparkles className="h-4 w-4" />
                                            Fitur Baru
                                        </span>
                                    }
                                >
                                    <button
                                        onClick={() => handleComingSoonClick('Simulasi Rute Perdagangan')}
                                        className="w-full text-left px-4 py-2 text-slate-300 hover:bg-slate-700 hover:text-pink-400 transition-colors flex items-center gap-3"
                                    >
                                        <TrendingUp className="h-4 w-4" />
                                        <div>
                                            <div className="font-medium">Rute Perdagangan</div>
                                            <div className="text-xs text-slate-400">Simulasi jalur ekspor optimal</div>
                                        </div>
                                    </button>
                                    <button
                                        onClick={() => handleComingSoonClick('Info Perdagangan Terbaru')}
                                        className="w-full text-left px-4 py-2 text-slate-300 hover:bg-slate-700 hover:text-pink-400 transition-colors flex items-center gap-3"
                                    >
                                        <Radio className="h-4 w-4" />
                                        <div>
                                            <div className="font-medium">Info Perdagangan</div>
                                            <div className="text-xs text-slate-400">Berita & update terkini</div>
                                        </div>
                                    </button>
                                    <button
                                        onClick={() => handleComingSoonClick('Blog Edukasi berbasis AI')}
                                        className="w-full text-left px-4 py-2 text-slate-300 hover:bg-slate-700 hover:text-pink-400 transition-colors flex items-center gap-3"
                                    >
                                        <GraduationCap className="h-4 w-4" />
                                        <div>
                                            <div className="font-medium">Blog Edukasi</div>
                                            <div className="text-xs text-slate-400">Panduan berbasis AI</div>
                                        </div>
                                    </button>
                                </Dropdown>

                                <Link href="/chatbot" className="text-slate-300 hover:text-pink-400 transition-colors flex items-center gap-2 text-sm">
                                    <Bot className="h-4 w-4" />
                                    Asisten AI
                                </Link>
                                <Link href="/api-docs" className="text-slate-300 hover:text-pink-400 transition-colors flex items-center gap-2 text-sm">
                                    <FileText className="h-4 w-4" />
                                    Dokumentasi API
                                </Link>
                                {isLoggedIn && (
                                    <Link href="/api-keys" className="text-slate-300 hover:text-pink-400 transition-colors flex items-center gap-2 text-sm">
                                        <Key className="h-4 w-4" />
                                        API Keys
                                    </Link>
                                )}

                                {isLoggedIn && userProfile?.is_staff && (
                                    <Link href="/admin" className="text-slate-300 hover:text-orange-400 transition-colors flex items-center gap-2 text-sm">
                                        <Shield className="h-4 w-4" />
                                        Admin
                                    </Link>
                                )}
                            </nav>

                            {isLoggedIn && userProfile ? (
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-2 bg-slate-800/50 rounded-lg px-3 py-2">
                                        <Wallet className="h-4 w-4 text-green-400" />
                                        <span className="text-slate-300 text-sm">Rp{userProfile.saldo.toLocaleString('id-ID')}</span>
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
