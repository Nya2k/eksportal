"use client"

import FloatingNavbar from "@/components/FloatingNavbar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, BookOpen, ListOrdered, MessageCircle, TrendingUp } from "lucide-react"
import Link from "next/link"

const popularHSCodes = [
  { code: "0801", description: "Kelapa, kacang Brazil dan jambu mete", countries: ["Amerika Serikat", "Belanda", "Jerman"] },
  { code: "1511", description: "Minyak kelapa sawit dan fraksinya", countries: ["India", "Tiongkok", "Belanda"] },
  { code: "4011", description: "Ban pneumatik baru dari karet", countries: ["Amerika Serikat", "Jerman", "Australia"] },
  { code: "6109", description: "Kaos oblong, singlet dan rompi", countries: ["Amerika Serikat", "Jerman", "Jepang"] },
  { code: "2709", description: "Minyak petroleum dan minyak yang diperoleh dari mineral mengandung bitumen, mentah", countries: ["Singapura", "Tiongkok", "Korea Selatan"] },
  { code: "9403", description: "Mebel lainnya dan bagian-bagiannya", countries: ["Amerika Serikat", "Jepang", "Australia"] },
]

const exportTips = [
  {
    title: "Pahami Kode HS Produk Anda",
    description:
      "Mengetahui kode HS (Harmonized System) yang tepat untuk produk Anda sangat penting untuk kelancaran ekspor, penentuan tarif, dan kepatuhan dokumen.",
    icon: ListOrdered,
  },
  {
    title: "Memahami Regulasi Ekspor",
    description:
      "Pelajari tentang perizinan ekspor, persyaratan dokumen, dan standar kepatuhan untuk perdagangan internasional.",
    icon: BookOpen,
  },
  {
    title: "Riset Pasar & Tren Global",
    description:
      "Temukan produk mana yang sedang diminati di negara tertentu dan identifikasi peluang ekspor yang menguntungkan.",
    icon: TrendingUp,
  },
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <FloatingNavbar />

      {/* Hero Section */}
      <section className="py-5 px-4 pt-32">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">Eksportal</h1>
          <p className="text-xl text-slate-300 mb-8 max-w-3xl mx-auto">
            Platform untuk membantu UMKM Indonesia menemukan peluang ekspor, regulasi, dan tren pasar
            dengan panduan cerdas dan otomatisasi yang mudah digunakan.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/chatbot">
              <Button size="lg" className="bg-pink-600 hover:bg-pink-700 text-white px-8 py-3">
                Mulai Ekspor Sekarang <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/api-docs">
              <Button
                size="lg"
                variant="outline"
                className="border-slate-600 text-slate-300 hover:bg-slate-800 px-8 py-3 bg-transparent hover:text-pink-500"
              >
                Lihat Dokumentasi API
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Popular HS Codes Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Produk Ekspor Unggulan Indonesia</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularHSCodes.map((item, index) => (
              <Card key={index} className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-colors">
                <CardHeader>
                  <CardTitle className="text-pink-400 text-lg">Kode HS: {item.code}</CardTitle>
                  <CardDescription className="text-slate-300">{item.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    <p className="text-sm text-slate-400 mb-2">Negara tujuan populer:</p>
                    {item.countries.map((country, idx) => (
                      <Badge key={idx} variant="secondary" className="bg-slate-700 text-slate-300 hover:bg-slate-700" >
                        {country}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Export Information Section */}
      <section className="py-16 px-4 bg-slate-800/30">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Panduan Ekspor Terpadu</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {exportTips.map((tip, index) => (
              <Card key={index} className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-colors">
                <CardHeader className="text-center">
                  <div className="mx-auto w-12 h-12 bg-pink-600 rounded-full flex items-center justify-center mb-4">
                    <tip.icon className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-white">{tip.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-slate-300 text-center">{tip.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto text-center">
          <Card className="bg-gradient-to-r from-pink-600/20 to-slate-800/50 border-pink-600/30 max-w-4xl mx-auto">
            <CardHeader>
              <CardTitle className="text-3xl text-white mb-4">Siap Memulai Ekspor?</CardTitle>
              <CardDescription className="text-slate-300 text-lg">
                Dapatkan rekomendasi ekspor yang dipersonalisasi, wawasan pasar terkini, dan panduan regulasi melalui
                asisten AI kami yang terintegrasi dengan Telegram.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <Link href="/chatbot">
                <Button size="lg" className="bg-pink-600 hover:bg-pink-700 text-white px-8 py-3">
                  <MessageCircle className="mr-2 h-5 w-5" />
                  Chat dengan Asisten Ekspor
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-700 bg-slate-900/50 py-8 px-4">
        <div className="container mx-auto text-center">
          <p className="text-slate-400">
            © 2025 Eksportal. Memberdayakan UMKM Indonesia dengan solusi ekspor bertenaga AI.
          </p>
        </div>
      </footer>
    </div>
  )
}
