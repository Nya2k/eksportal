"use client"

import FloatingNavbar from "@/components/FloatingNavbar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Code, Copy, Key } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"

const endpoints = [
    {
        method: "POST",
        endpoint: "/api/chatbot/ask/",
        parameters: [
            { name: "question", type: "string", required: true, description: "Pertanyaan yang akan ditanyakan ke chatbot", example: "Apa itu ekspor barang?" },
            { name: "file", type: "string($binary)", required: false, description: "Upload file opsional (hanya PNG, JPG, JPEG, PDF)", example: "file.pdf" },
        ],
        headers: [
            { name: "X-API-KEY", type: "string", required: true, description: "API Key yang didapat dari register key di web" },
            { name: "Content-Type", type: "string", required: true, description: "multipart/form-data untuk upload file" }
        ],
        requestExample: {
            type: "multipart/form-data",
            fields: {
                question: "Apa itu ekspor barang?",
                file: "(binary file data)"
            }
        },
        responseExample: {
            status: 200,
            message: "Success",
            timestamp: "2025-07-26T01:54:50.230367+07:00",
            data: {
                response: {
                    output: "Ekspor barang adalah kegiatan mengeluarkan barang dari daerah pabean Indonesia ke luar negeri.\\n\\nDalam peraturan Indonesia, ekspor barang berarti aktivitas pengiriman atau penjualan barang dari wilayah Indonesia ke negara lain dengan memenuhi persyaratan dan ketentuan yang berlaku, seperti prosedur kepabeanan dan dokumen ekspor.\\n\\nPelaku ekspor disebut *eksportir* dan harus memenuhi syarat dokumen ekspor, seperti:\\n- Pemberitahuan Ekspor Barang\\n- dokumen pelengkap lain\\n\\nKegiatan ekspor diawasi oleh pemerintah, misalnya Kementerian Perdagangan, dengan tujuan:\\n- mendukung perdagangan internasional\\n- menambah devisa negara\\n- menjaga pertumbuhan ekonomi"
                },
                saldo_info: "Saldo berhasil dipotong 2500. Sisa saldo: 32500",
                webhook_success: true
            }
        }
    },
];

export default function ApiDocsPage() {
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [copiedText, setCopiedText] = useState("")

    const copyToClipboard = (text: string, type: string) => {
        navigator.clipboard.writeText(text)
        setCopiedText(type)
        setTimeout(() => setCopiedText(""), 2000)
    }

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
                                                Respons dikembalikan dalam format JSON
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
                                                            className="p-3 bg-slate-700/50 rounded"
                                                        >
                                                            <div className="flex items-center gap-2 mb-1">
                                                                <code className="text-pink-400 text-sm">{param.name}</code>
                                                                <span className="text-slate-400 text-sm">({param.type})</span>
                                                                {param.required && (
                                                                    <Badge variant="destructive" className="text-xs">
                                                                        Wajib
                                                                    </Badge>
                                                                )}
                                                            </div>
                                                            <p className="text-slate-300 text-sm mb-2">{param.description}</p>
                                                            {param.example && (
                                                                <div>
                                                                    <span className="text-slate-400 text-xs">Contoh:</span>
                                                                    <code className="bg-slate-600 text-green-400 px-2 py-1 rounded text-xs ml-2">
                                                                        {param.example}
                                                                    </code>
                                                                </div>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <p className="text-slate-400 text-sm italic">Tidak perlu request body</p>
                                            )}

                                            {/* Request Example */}
                                            {endpoint.requestExample && (
                                                <div className="mt-4">
                                                    <h5 className="text-white font-semibold mb-3">Contoh Request Body</h5>
                                                    <div className="bg-slate-900 p-4 rounded-lg">
                                                        <div className="text-slate-400 text-xs mb-2">Content-Type: {endpoint.requestExample.type}</div>
                                                        <pre className="text-slate-300 text-sm overflow-x-auto">
{Object.entries(endpoint.requestExample.fields).map(([key, value]) => 
`${key}: ${typeof value === 'string' && value.includes('(') ? value : `"${value}"`}`
).join('\n')}
                                                        </pre>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Response Example */}
                                            {endpoint.responseExample && (
                                                <div className="mt-4">
                                                    <h5 className="text-white font-semibold mb-3">Contoh Response</h5>
                                                    <div className="bg-slate-900 p-4 rounded-lg">
                                                        <pre className="text-slate-300 text-sm overflow-x-auto">
{JSON.stringify(endpoint.responseExample, null, 2)}
                                                        </pre>
                                                    </div>
                                                </div>
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
                                            <div className="flex items-center justify-between mb-3">
                                                <h4 className="text-white font-semibold">cURL - Pertanyaan Teks</h4>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => copyToClipboard(`curl -X 'POST' \\
  'http://43.157.211.42:8000/api/chatbot/ask/' \\
  -H 'accept: */*' \\
  -H 'X-API-Key: YOUR_API_KEY_HERE' \\
  -H 'Authorization: Bearer YOUR_JWT_TOKEN_HERE' \\
  -H 'Content-Type: multipart/form-data' \\
  -F 'question=Apa itu ekspor barang?' \\
  -F 'file='`, "curl1")}
                                                    className="border-slate-600 text-slate-400 hover:bg-slate-700"
                                                >
                                                    <Copy className="h-3 w-3 mr-1" />
                                                    {copiedText === "curl1" ? "Disalin!" : "Salin"}
                                                </Button>
                                            </div>
                                            <pre className="bg-slate-900 text-slate-300 p-4 rounded-lg text-sm overflow-x-auto">
{`curl -X 'POST' \\
  'http://43.157.211.42:8000/api/chatbot/ask/' \\
  -H 'accept: */*' \\
  -H 'X-API-Key: YOUR_API_KEY_HERE' \\
  -H 'Authorization: Bearer YOUR_JWT_TOKEN_HERE' \\
  -H 'Content-Type: multipart/form-data' \\
  -F 'question=Apa itu ekspor barang?' \\
  -F 'file='`}
                                            </pre>
                                        </div>

                                        <div>
                                            <h4 className="text-white font-semibold mb-3">JavaScript (Fetch API)</h4>
                                            <pre className="bg-slate-900 text-slate-300 p-4 rounded-lg text-sm overflow-x-auto">
{`const formData = new FormData();
formData.append('question', 'Apa itu ekspor barang?');
formData.append('file', ''); // kosong jika tidak ada file

const response = await fetch('http://43.157.211.42:8000/api/chatbot/ask/', {
  method: 'POST',
  headers: {
    'X-API-Key': 'YOUR_API_KEY_HERE',
  },
  body: formData
});
`}
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
