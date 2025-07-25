"use client"

import FloatingNavbar from "@/components/FloatingNavbar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Code, Copy, Key } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"

const endpoints = [
    {
        method: "POST",
        endpoint: "/api/chatbot/ask/",
        description: "Kirim pesan ke chatbot ekspor",
        parameters: [
            { name: "name", type: "string", required: true, description: "Prompt dari pengguna" },
        ],
        headers: [
            { name: "X-API-KEY", type: "string", required: true, description: "API Key yang didapat dari register key di web" }
        ]
    },
];

export default function ApiDocsPage() {
    const [isLoggedIn, setIsLoggedIn] = useState(false)

    useEffect(() => {
        const checkAuth = () => {
            const token = localStorage.getItem('token')
            setIsLoggedIn(!!token)
        }
        
        checkAuth()
        
        // Listen for storage changes (login/logout events)
        window.addEventListener('storage', checkAuth)
        return () => window.removeEventListener('storage', checkAuth)
    }, [])
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
            <FloatingNavbar />

            <div className="container mx-auto px-4 py-8 pt-28">
                {/* Hero Section */}
                <section className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-white mb-4">Dokumentasi API</h1>
                    <p className="text-xl text-slate-300 max-w-3xl mx-auto">
                        Integrasikan layanan <strong>Eksportal</strong> ke dalam aplikasi Anda. Akses rekomendasi
                        ekspor, tren pasar, dan panduan regulasi dengan mudah.
                    </p>
                </section>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* API Key Section */}
                    <div className="lg:col-span-1">
                        <Card className="bg-slate-800/50 border-slate-700 sticky top-8">
                            <CardHeader>
                                <CardTitle className="text-white flex items-center gap-2">
                                    <Key className="h-5 w-5 text-pink-400" />
                                    Kelola API Key
                                </CardTitle>
                                <CardDescription className="text-slate-300">
                                    Buat dan kelola API key Anda untuk mengakses layanan Eksportal.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {isLoggedIn ? (
                                    <Link href="/api-keys">
                                        <Button className="w-full bg-pink-600 hover:bg-pink-700 text-white">
                                            Kelola API Key
                                        </Button>
                                    </Link>
                                ) : (
                                    <Link href="/register">
                                        <Button className="w-full bg-pink-600 hover:bg-pink-700 text-white">
                                            Buat Akun Developer
                                        </Button>
                                    </Link>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Documentation Content */}
                    <div className="lg:col-span-2">
                        <Tabs defaultValue="overview" className="space-y-6">
                            <TabsList className="bg-slate-800 border-slate-700">
                                <TabsTrigger value="overview" className="data-[state=active]:bg-pink-600">
                                    Ringkasan
                                </TabsTrigger>
                                <TabsTrigger value="endpoints" className="data-[state=active]:bg-pink-600">
                                    Endpoint
                                </TabsTrigger>
                                <TabsTrigger value="examples" className="data-[state=active]:bg-pink-600">
                                    Contoh
                                </TabsTrigger>
                            </TabsList>

                            <TabsContent value="overview" className="space-y-6">
                                <Card className="bg-slate-800/50 border-slate-700">
                                    <CardHeader>
                                        <CardTitle className="text-white">Memulai</CardTitle>
                                        <CardDescription className="text-slate-300">
                                            Pelajari cara mengintegrasikan API Eksportal
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div>
                                            <h4 className="text-white font-semibold mb-2">Base URL</h4>
                                            <code className="bg-slate-700 text-pink-400 px-3 py-1 rounded text-sm">
                                                http://43.157.211.42:8000
                                            </code>
                                        </div>
                                        <div>
                                            <h4 className="text-white font-semibold mb-2">Autentikasi</h4>
                                            <code className="bg-slate-700 text-slate-300 px-3 py-1 rounded text-sm block">
                                                X-API-KEY: API_KEY_ANDA
                                            </code>
                                        </div>
                                        <div>
                                            <h4 className="text-white font-semibold mb-2">Format Respons</h4>
                                            <p className="text-slate-300 text-sm">
                                                Respons dikembalikan dalam format JSON dengan struktur yang konsisten
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            <TabsContent value="endpoints" className="space-y-6">
                                {endpoints.map((endpoint, index) => (
                                    <Card key={index} className="bg-slate-800/50 border-slate-700">
                                        <CardHeader>
                                            <div className="flex items-center gap-3">
                                                <Badge
                                                    variant={endpoint.method === "GET" ? "secondary" : "default"}
                                                    className={endpoint.method === "GET" ? "bg-green-600 text-white" : "bg-pink-600 text-white"}
                                                >
                                                    {endpoint.method}
                                                </Badge>
                                                <code className="text-pink-400 text-sm">{endpoint.endpoint}</code>
                                            </div>
                                            <CardDescription className="text-slate-300">{endpoint.description}</CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            {/* Headers (optional) */}
                                            {Array.isArray(endpoint.headers) && endpoint.headers.length > 0 && (
                                                <div className="mb-4">
                                                    <h5 className="text-white font-semibold mb-2">Headers</h5>
                                                    <div className="space-y-2">
                                                        {endpoint.headers.map((header, idx) => (
                                                            <div
                                                                key={idx}
                                                                className="flex items-center justify-between p-2 bg-slate-700/50 rounded"
                                                            >
                                                                <div>
                                                                    <code className="text-pink-400 text-sm">{header.name}</code>
                                                                    <span className="text-slate-400 text-sm ml-2">({header.type})</span>
                                                                    {header.required && (
                                                                        <Badge variant="destructive" className="ml-2 text-xs">
                                                                            Wajib
                                                                        </Badge>
                                                                    )}
                                                                </div>
                                                                <p className="text-slate-300 text-sm">{header.description}</p>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Request Body */}
                                            <h5 className="text-white font-semibold mb-3">Request Body</h5>
                                            {Array.isArray(endpoint.parameters) && endpoint.parameters.length > 0 ? (
                                                <div className="space-y-2">
                                                    {endpoint.parameters.map((param, idx) => (
                                                        <div
                                                            key={idx}
                                                            className="flex items-center justify-between p-2 bg-slate-700/50 rounded"
                                                        >
                                                            <div>
                                                                <code className="text-pink-400 text-sm">{param.name}</code>
                                                                <span className="text-slate-400 text-sm ml-2">({param.type})</span>
                                                                {param.required && (
                                                                    <Badge variant="destructive" className="ml-2 text-xs">
                                                                        Wajib
                                                                    </Badge>
                                                                )}
                                                            </div>
                                                            <p className="text-slate-300 text-sm">{param.description}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <p className="text-slate-400 text-sm italic">Tidak perlu request body</p>
                                            )}
                                        </CardContent>
                                    </Card>
                                ))}
                            </TabsContent>

                            <TabsContent value="examples" className="space-y-6">
                                <Card className="bg-slate-800/50 border-slate-700">
                                    <CardHeader>
                                        <CardTitle className="text-white flex items-center gap-2">
                                            <Code className="h-5 w-5 text-pink-400" />
                                            Contoh Kode
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        <div>
                                            <h4 className="text-white font-semibold mb-3">Contoh Request ke Chatbot</h4>
                                            <pre className="bg-slate-900 text-slate-300 p-4 rounded-lg text-sm overflow-x-auto">
                                                {`curl -X POST https://t.me/IndoEksporbot \\
-H "X-API-KEY: API_KEY_ANDA" \\
-H "Content-Type: application/json" \\
-d '{
    "name": "Apa saja syarat ekspor ke Jepang?"
}'`}
                                            </pre>
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>
            </div>
        </div>
    );
}
