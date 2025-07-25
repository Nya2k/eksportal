"use client"

import FloatingNavbar from "@/components/FloatingNavbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ExternalLink, Globe, MessageCircle, TrendingUp, Zap } from "lucide-react"

const features = [
    {
        icon: MessageCircle,
        title: "Asisten AI Cerdas",
        description: "Dapatkan jawaban instan tentang regulasi ekspor, dokumentasi, dan peluang pasar internasional.",
    },
    {
        icon: Globe,
        title: "Panduan Khusus Negara",
        description: "Terima saran yang disesuaikan untuk ekspor ke negara tertentu dengan wawasan pasar lokal.",
    },
    {
        icon: TrendingUp,
        title: "Analisis Tren Pasar",
        description: "Tetap update dengan tren ekspor terbaru dan permintaan produk di pasar internasional.",
    },
]

export default function ChatbotPage() {
    const handleTelegramRedirect = () => {
        window.open("https://t.me/IndoEksporbot", "_blank")
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
            <FloatingNavbar />

            <div className="container mx-auto px-4 py-12 pt-28">
                {/* Hero Section */}
                <section className="text-center mb-16">
                    <div className="max-w-4xl mx-auto">
                        <div className="mb-8">
                            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-pink-600 to-pink-700 rounded-full mb-6">
                                <MessageCircle className="h-10 w-10 text-white" />
                            </div>
                        </div>
                        <h1 className="text-5xl font-bold text-white mb-6">Asisten Ekspor Bertenaga AI</h1>
                        <p className="text-xl text-slate-300 mb-8">
                            Pendamping cerdas Anda untuk menavigasi peluang ekspor Indonesia. Dapatkan panduan instan tentang
                            regulasi, tren pasar, dan strategi bisnis melalui Telegram.
                        </p>
                        <Button
                            size="lg"
                            onClick={handleTelegramRedirect}
                            className="bg-pink-600 hover:bg-pink-700 text-white px-8 py-4 text-lg"
                        >
                            <MessageCircle className="mr-3 h-6 w-6" />
                            Mulai Chat di Telegram
                            <ExternalLink className="ml-3 h-5 w-5" />
                        </Button>
                    </div>
                </section>

                {/* Features Section */}
                <section className="mb-16">
                    <h2 className="text-3xl font-bold text-white text-center mb-12">Apa yang Bisa Dibantu Asisten Kami?</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        {features.map((feature, index) => (
                            <Card key={index} className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-colors">
                                <CardHeader className="text-center">
                                    <div className="mx-auto w-12 h-12 bg-pink-600 rounded-full flex items-center justify-center mb-4">
                                        <feature.icon className="h-6 w-6 text-white" />
                                    </div>
                                    <CardTitle className="text-white">{feature.title}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <CardDescription className="text-slate-300 text-center">{feature.description}</CardDescription>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </section>

                {/* How It Works Section */}
                <section className="mb-16">
                    <Card className="bg-slate-800/30 border-slate-700 max-w-4xl mx-auto">
                        <CardHeader className="text-center">
                            <CardTitle className="text-3xl text-white font-bold -mb-6">Cara Menggunakan</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-8">
                            <div className="grid md:grid-cols-3 gap-8">
                                <div className="text-center">
                                    <div className="w-12 h-12 bg-pink-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-lg">
                                        1
                                    </div>
                                    <h3 className="text-white font-semibold mb-2">Klik Tombol</h3>
                                    <p className="text-slate-300 text-sm">Klik &quot;Mulai Chat di Telegram&quot; untuk membuka bot kami</p>
                                </div>
                                <div className="text-center">
                                    <div className="w-12 h-12 bg-pink-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-lg">
                                        2
                                    </div>
                                    <h3 className="text-white font-semibold mb-2">Ajukan Pertanyaan</h3>
                                    <p className="text-slate-300 text-sm">Tanyakan tentang kode HS, negara tujuan, atau regulasi ekspor</p>
                                </div>
                                <div className="text-center">
                                    <div className="w-12 h-12 bg-pink-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-lg">
                                        3
                                    </div>
                                    <h3 className="text-white font-semibold mb-2">Dapatkan Panduan</h3>
                                    <p className="text-slate-300 text-sm">Terima rekomendasi dan wawasan</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </section>

                {/* Example Questions Section */}
                <section className="mb-16">
                    <h2 className="text-3xl font-bold text-white text-center mb-8">Contoh Pertanyaan yang Bisa Ditanyakan</h2>
                    <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                        <Card className="bg-slate-800/50 border-slate-700">
                            <CardContent className="p-6">
                                <div className="flex items-start gap-3">
                                    <div className="w-2 h-2 bg-pink-400 rounded-full mt-2 flex-shrink-0"></div>
                                    <p className="text-slate-300">&quot;Apa saja persyaratan ekspor produk kelapa ke Belanda?&quot;</p>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="bg-slate-800/50 border-slate-700">
                            <CardContent className="p-6">
                                <div className="flex items-start gap-3">
                                    <div className="w-2 h-2 bg-pink-400 rounded-full mt-2 flex-shrink-0"></div>
                                    <p className="text-slate-300">&quot;Produk apa yang sedang populer diekspor ke Amerika Serikat?&quot;</p>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="bg-slate-800/50 border-slate-700">
                            <CardContent className="p-6">
                                <div className="flex items-start gap-3">
                                    <div className="w-2 h-2 bg-pink-400 rounded-full mt-2 flex-shrink-0"></div>
                                    <p className="text-slate-300">&quot;Apa itu kode HS 6109 dan potensi ekspornya?&quot;</p>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="bg-slate-800/50 border-slate-700">
                            <CardContent className="p-6">
                                <div className="flex items-start gap-3">
                                    <div className="w-2 h-2 bg-pink-400 rounded-full mt-2 flex-shrink-0"></div>
                                    <p className="text-slate-300">&quot;Bagaimana cara mendapatkan sertifikat halal untuk ekspor makanan?&quot;</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="text-center">
                    <Card className="bg-gradient-to-r from-pink-600/20 to-slate-800/50 border-pink-600/30 max-w-3xl mx-auto">
                        <CardHeader>
                            <CardTitle className="text-3xl text-white mb-4">Siap Memulai Ekspor?</CardTitle>
                            <CardDescription className="text-slate-300 text-lg">
                                Mulailah perjalanan ekspor Anda dengan platform panduan ekspor cerdas yang dirancang khusus untuk UMKM Indonesia.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <Button
                                size="lg"
                                onClick={handleTelegramRedirect}
                                className="bg-pink-600 hover:bg-pink-700 text-white px-8 py-3"
                            >
                                <Zap className="mr-2 h-5 w-5" />
                                Mulai Perjalanan Ekspor Anda
                                <ExternalLink className="ml-2 h-4 w-4" />
                            </Button>
                        </CardContent>
                    </Card>
                </section>
            </div>
        </div>
    )
}
