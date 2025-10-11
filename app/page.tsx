// ...existing code...
"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ThemeToggle } from "@/components/theme-toggle"
import { Drawer, DrawerTrigger, DrawerContent, DrawerClose } from "@/components/ui/drawer"
import { useState } from "react"
import { Menu, Wallet, Smartphone, Shield, TrendingUp, Users, Zap, ArrowRight, Star, CheckCircle, ChevronRight, Phone, Heart, Globe, Award, Clock, DollarSign, CreditCard, PiggyBank, BarChart3, TrendingDown, Activity } from "lucide-react"

export default function HomePage() {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 via-white to-slate-100 text-slate-900 relative overflow-hidden">
      {/* Human-centric background elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,_rgba(59,130,246,0.03),transparent_50%)] opacity-80"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,_rgba(147,51,234,0.03),transparent_50%)] opacity-80"></div>
      <div className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full mix-blend-multiply filter blur-3xl animate-pulse opacity-70"></div>
      <div className="absolute top-40 right-10 w-96 h-96 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-1000 opacity-70"></div>

      {/* Navigation */}
      <header className="relative z-50 w-full bg-white/80 backdrop-blur-lg border-b border-slate-200 shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">eG</span>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">eGuy</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            <a href="#features" className="text-slate-600 hover:text-slate-900 transition-colors duration-300 font-medium">Features</a>
            <a href="#how-it-works" className="text-slate-600 hover:text-slate-900 transition-colors duration-300 font-medium">How It Works</a>
            <a href="#testimonials" className="text-slate-600 hover:text-slate-900 transition-colors duration-300 font-medium">Reviews</a>
            <a href="#pricing" className="text-slate-600 hover:text-slate-900 transition-colors duration-300 font-medium">Pricing</a>
            <ThemeToggle />
            <Link href="/signin">
              <Button className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold rounded-full px-6 py-2 shadow-lg">
                Sign In
              </Button>
            </Link>
          </nav>

          {/* Mobile Menu */}
          <div className="lg:hidden flex items-center gap-4">
            <ThemeToggle />
            <Drawer open={open} onOpenChange={setOpen}>
              <DrawerTrigger asChild>
                <Button variant="ghost" size="icon" className="text-slate-900 hover:bg-slate-100">
                  <Menu size={24} />
                </Button>
              </DrawerTrigger>
              <DrawerContent className="bg-white border-slate-200">
                <div className="flex flex-col gap-6 p-6">
                  <DrawerClose asChild>
                    <Button variant="ghost" className="self-end">
                      <Menu size={24} className="rotate-90" />
                    </Button>
                  </DrawerClose>
                  <a href="#features" className="text-lg font-medium text-slate-900 hover:text-blue-600 transition-colors py-2" onClick={() => setOpen(false)}>Features</a>
                  <a href="#how-it-works" className="text-lg font-medium text-slate-900 hover:text-blue-600 transition-colors py-2" onClick={() => setOpen(false)}>How It Works</a>
                  <a href="#testimonials" className="text-lg font-medium text-slate-900 hover:text-blue-600 transition-colors py-2" onClick={() => setOpen(false)}>Reviews</a>
                  <a href="#pricing" className="text-lg font-medium text-slate-900 hover:text-blue-600 transition-colors py-2" onClick={() => setOpen(false)}>Pricing</a>
                  <Link href="/signin" onClick={() => setOpen(false)}>
                    <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-full py-3">
                      Sign In
                    </Button>
                  </Link>
                </div>
              </DrawerContent>
            </Drawer>
          </div>
        </div>
      </header>

      {/* Hero Section - Human Centric */}
      <section className="relative w-full py-20 lg:py-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="container mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left side - Content */}
            <div className="text-center lg:text-left">
              <Badge className="mb-6 bg-blue-100 text-blue-700 border-blue-200 px-4 py-2 text-sm font-medium">
                🎉 Join 50,000+ Happy Users
              </Badge>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-slate-900 mb-8 leading-tight">
                Your Money,
                <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
                  Simplified
                </span>
              </h1>

              <p className="text-xl sm:text-2xl text-slate-600 mb-12 leading-relaxed max-w-2xl">
                Experience banking made personal. Send money, pay bills, buy airtime, and grow your savings with the fintech app that understands your needs.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center mb-16">
                <Link href="/signup">
                  <Button size="lg" className="group bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-bold rounded-full px-10 py-4 text-lg shadow-xl transition-all duration-500 hover:scale-105 min-w-[200px]">
                    <span className="mr-2">Start Free Today</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                  </Button>
                </Link>
                <Link href="/signin">
                  <Button size="lg" variant="outline" className="border-2 border-blue-200 text-blue-600 hover:text-white hover:bg-blue-50 font-bold rounded-full px-10 py-4 text-lg shadow-lg transition-all duration-300 min-w-[200px]">
                    I Have an Account
                  </Button>
                </Link>
              </div>

              {/* Trust indicators */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-8 text-sm text-slate-500">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span>Bank-grade security</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span>Instant transactions</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span>24/7 support</span>
                </div>
              </div>
            </div>

            {/* Right side - Phone mockup */}
            <div className="flex items-center justify-center">
              <div className="relative group">
                <div className="absolute -inset-4 bg-gradient-to-r from-blue-400 via-purple-400 to-blue-600 rounded-3xl blur-2xl opacity-20 group-hover:opacity-30 transition-opacity duration-500"></div>
                <div className="relative bg-white rounded-3xl shadow-2xl p-2 transform rotate-3 group-hover:rotate-0 transition-transform duration-500">
                  <div className="bg-slate-900 rounded-2xl p-6 text-white">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-400 rounded-lg flex items-center justify-center">
                          <span className="text-white font-bold text-sm">eG</span>
                        </div>
                        <span className="font-semibold">eGuy</span>
                      </div>
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                        <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      </div>
                    </div>

                    {/* App interface mockup */}
                    <div className="space-y-4">
                      <div className="bg-white/10 rounded-xl p-3">
                        <div className="text-sm opacity-80 mb-1">Balance</div>
                        <div className="text-2xl font-bold">₦125,430</div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="bg-white/10 rounded-lg p-2 text-center">
                          <div className="text-xs opacity-80">Send</div>
                          <ArrowRight className="w-4 h-4 mx-auto mt-1" />
                        </div>
                        <div className="bg-white/10 rounded-lg p-2 text-center">
                          <div className="text-xs opacity-80">Receive</div>
                          <ArrowRight className="w-4 h-4 mx-auto mt-1 rotate-180" />
                        </div>
                      </div>
                      <div className="bg-gradient-to-r from-blue-400 to-purple-400 rounded-xl p-3 text-center">
                        <div className="text-sm font-medium">Quick Actions</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section - Human Touch */}
      <section className="relative w-full py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-6 bg-purple-100 text-purple-700 border-purple-200 px-4 py-2 text-sm font-medium">
              📈 Growing Together
            </Badge>
            <h2 className="text-4xl sm:text-5xl font-extrabold text-slate-900 mb-6">
              Trusted by Real People, <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Like You</span>
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              See why thousands choose eGuy for their daily financial needs
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 max-w-5xl mx-auto">
            {[
              { number: "50K+", label: "Happy Users", color: "from-blue-500 to-blue-600", icon: Users },
              { number: "₦2M+", label: "Processed Daily", color: "from-purple-500 to-purple-600", icon: DollarSign },
              { number: "99.9%", label: "Uptime", color: "from-green-500 to-green-600", icon: Activity },
              { number: "< 30sec", label: "Avg Response", color: "from-orange-500 to-orange-600", icon: Clock }
            ].map((stat, index) => (
              <Card key={index} className="group bg-white/70 backdrop-blur-sm border-slate-200 hover:border-blue-300 transition-all duration-500 hover:scale-105 shadow-lg">
                <CardContent className="p-6 text-center">
                  <div className="flex justify-center mb-4">
                    <div className={`p-3 bg-gradient-to-r ${stat.color} rounded-2xl`}>
                      <stat.icon className="text-white w-6 h-6" />
                    </div>
                  </div>
                  <div className={`text-3xl lg:text-4xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-3 group-hover:scale-110 transition-transform duration-300`}>
                    {stat.number}
                  </div>
                  <div className="text-base font-medium text-slate-600">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section - Comprehensive */}
      <section id="features" className="relative w-full py-24 px-4 sm:px-6 lg:px-8 bg-white overflow-hidden">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-6 bg-blue-100 text-blue-700 border-blue-200 px-4 py-2 text-sm font-medium">
              ⚡ Everything You Need
            </Badge>
            <h2 className="text-4xl sm:text-5xl font-extrabold text-slate-900 mb-6">
              All Your Financial Tools in <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">One App</span>
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              From sending money to friends to paying bills and growing your savings, eGuy makes every financial interaction simple and secure.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
            {/* Feature list */}
            <div className="space-y-8">
              {[
                {
                  icon: Wallet,
                  title: "Smart Wallet Management",
                  description: "Track your spending, set budgets, and manage multiple accounts all in one beautiful interface designed for real people.",
                  color: "text-blue-600"
                },
                {
                  icon: Smartphone,
                  title: "Instant Airtime & Data",
                  description: "Top up your phone or buy data bundles from all Nigerian networks instantly. No more running out of airtime at crucial moments.",
                  color: "text-purple-600"
                },
                {
                  icon: CreditCard,
                  title: "Bill Payments Made Easy",
                  description: "Pay electricity, water, cable TV, and internet bills with just a few taps. Never miss a payment deadline again.",
                  color: "text-green-600"
                },
                {
                  icon: PiggyBank,
                  title: "Automated Savings",
                  description: "Set up automatic savings goals and watch your money grow. Whether saving for a vacation or emergency fund, we've got you covered.",
                  color: "text-orange-600"
                }
              ].map((feature, index) => (
                <Card key={index} className="group bg-gradient-to-r from-white to-slate-50 border-slate-200 hover:border-blue-300 transition-all duration-500 hover:scale-[1.02] shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className={`p-3 bg-gradient-to-r from-slate-100 to-slate-200 rounded-2xl group-hover:scale-110 transition-all duration-300`}>
                        <feature.icon className={`${feature.color} w-6 h-6`} />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors duration-300">
                          {feature.title}
                        </h3>
                        <p className="text-slate-600 leading-relaxed">{feature.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Phone mockup */}
            <div className="flex items-center justify-center">
              <div className="relative group">
                <div className="absolute -inset-4 bg-gradient-to-r from-purple-400 via-blue-400 to-purple-600 rounded-3xl blur-2xl opacity-20 group-hover:opacity-30 transition-opacity duration-500"></div>
                <div className="relative bg-white rounded-3xl shadow-2xl p-2 transform -rotate-2 group-hover:rotate-1 transition-transform duration-500">
                  <div className="bg-slate-900 rounded-2xl p-6 text-white">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-400 rounded-lg flex items-center justify-center">
                          <span className="text-white font-bold text-sm">eG</span>
                        </div>
                        <span className="font-semibold">eGuy</span>
                      </div>
                      <div className="text-xs opacity-70">9:41</div>
                    </div>

                    {/* Transaction history */}
                    <div className="space-y-3">
                      <div className="bg-white/10 rounded-xl p-3">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm opacity-80">Airtime Purchase</span>
                          <span className="text-sm font-medium">-₦1,000</span>
                        </div>
                        <div className="text-xs opacity-60">MTN • Today 2:30 PM</div>
                      </div>
                      <div className="bg-white/10 rounded-xl p-3">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm opacity-80">Money Received</span>
                          <span className="text-sm font-medium text-green-400">+₦5,000</span>
                        </div>
                        <div className="text-xs opacity-60">From John D. • Yesterday</div>
                      </div>
                      <div className="bg-white/10 rounded-xl p-3">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm opacity-80">Bill Payment</span>
                          <span className="text-sm font-medium">-₦2,500</span>
                        </div>
                        <div className="text-xs opacity-60">Electricity • 2 days ago</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works - Step by Step */}
      <section id="how-it-works" className="w-full py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-6 bg-green-100 text-green-700 border-green-200 px-4 py-2 text-sm font-medium">
              🚀 Simple Steps
            </Badge>
            <h2 className="text-4xl sm:text-5xl font-extrabold text-slate-900 mb-6">
              Get Started in <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">3 Easy Steps</span>
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Join thousands of Nigerians who have simplified their financial lives with eGuy
            </p>
          </div>

          <div className="relative max-w-6xl mx-auto">
            {/* Process steps */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              {[
                {
                  step: "01",
                  title: "Create Your Account",
                  desc: "Sign up in seconds with just your phone number and email. No complicated forms or waiting periods.",
                  icon: Users,
                  color: "from-blue-500 to-blue-600"
                },
                {
                  step: "02",
                  title: "Add Money",
                  desc: "Fund your wallet using bank transfer, card, or other payment methods. Money arrives instantly.",
                  icon: Wallet,
                  color: "from-purple-500 to-purple-600"
                },
                {
                  step: "03",
                  title: "Start Using",
                  desc: "Send money, pay bills, buy airtime, and manage your finances. Everything works seamlessly.",
                  icon: Smartphone,
                  color: "from-green-500 to-green-600"
                }
              ].map((item, index) => (
                <Card key={index} className="group bg-white/80 backdrop-blur-sm border-slate-200 hover:border-blue-300 transition-all duration-500 hover:scale-105 shadow-lg relative">
                  <CardContent className="p-8 text-center">
                    <div className="flex justify-center mb-6">
                      <div className={`w-16 h-16 bg-gradient-to-r ${item.color} rounded-2xl flex items-center justify-center shadow-lg`}>
                        <span className="text-white font-bold text-xl">{item.step}</span>
                      </div>
                    </div>
                    <h3 className="font-bold text-xl text-slate-900 mb-4">{item.title}</h3>
                    <p className="text-slate-600 leading-relaxed">{item.desc}</p>
                    {index < 2 && (
                      <div className="hidden md:block absolute -right-4 top-1/2 -translate-y-1/2 text-blue-400">
                        <ChevronRight className="w-6 h-6" />
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Central phone mockup */}
            <div className="flex justify-center">
              <div className="relative group">
                <div className="absolute -inset-4 bg-gradient-to-r from-blue-400 via-purple-400 to-green-400 rounded-3xl blur-2xl opacity-20 group-hover:opacity-30 transition-opacity duration-500"></div>
                <Card className="bg-white/90 backdrop-blur-sm border-slate-200 shadow-xl">
                  <CardContent className="p-8">
                    <div className="bg-slate-900 rounded-2xl p-6 text-white max-w-sm mx-auto">
                      <div className="text-center mb-6">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-purple-400 rounded-xl mx-auto mb-3 flex items-center justify-center">
                          <span className="text-white font-bold">eG</span>
                        </div>
                        <h4 className="font-bold text-lg">Welcome to eGuy!</h4>
                        <p className="text-sm opacity-80">Your financial companion</p>
                      </div>
                      <div className="space-y-3">
                        <div className="bg-white/10 rounded-lg p-3 text-center">
                          <div className="text-sm opacity-80 mb-1">Quick Actions</div>
                          <div className="grid grid-cols-3 gap-2 mt-2">
                            <div className="bg-white/10 rounded p-2 text-center">
                              <ArrowRight className="w-4 h-4 mx-auto mb-1" />
                              <div className="text-xs">Send</div>
                            </div>
                            <div className="bg-white/10 rounded p-2 text-center">
                              <Smartphone className="w-4 h-4 mx-auto mb-1" />
                              <div className="text-xs">Airtime</div>
                            </div>
                            <div className="bg-white/10 rounded p-2 text-center">
                              <CreditCard className="w-4 h-4 mx-auto mb-1" />
                              <div className="text-xs">Bills</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials - Real People */}
      <section id="testimonials" className="relative w-full py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-white to-slate-50 overflow-hidden">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-6 bg-purple-100 text-purple-700 border-purple-200 px-4 py-2 text-sm font-medium">
              💬 Real Stories from Real People
            </Badge>
            <h2 className="text-4xl sm:text-5xl font-extrabold text-slate-900 mb-6">
              See What Our Users <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">Are Saying</span>
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Don't just take our word for it. Here's what real Nigerians are saying about their experience with eGuy.
            </p>
          </div>

          {/* Testimonial cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                name: "Sarah Adebayo",
                role: "Small Business Owner",
                location: "Lagos",
                content: "eGuy has revolutionized how I handle my business payments. The referral system helped me earn extra income while providing excellent service to my customers.",
                rating: 5,
                avatar: "https://randomuser.me/api/portraits/women/44.jpg",
                bgColor: "from-blue-50 to-blue-100"
              },
              {
                name: "Michael Okoro",
                role: "Software Developer",
                location: "Abuja",
                content: "The app is incredibly intuitive and fast. I can send money to family, pay bills, and buy airtime all in seconds. The security features give me complete peace of mind.",
                rating: 5,
                avatar: "https://randomuser.me/api/portraits/men/32.jpg",
                bgColor: "from-purple-50 to-purple-100"
              },
              {
                name: "Grace Nwosu",
                role: "Teacher",
                location: "Port Harcourt",
                content: "As a teacher, I need reliable financial services. eGuy never disappoints. The customer support is excellent, and everything just works as expected.",
                rating: 5,
                avatar: "https://randomuser.me/api/portraits/women/68.jpg",
                bgColor: "from-green-50 to-green-100"
              }
            ].map((testimonial, index) => (
              <Card key={index} className={`group bg-gradient-to-r ${testimonial.bgColor} border-slate-200 hover:border-blue-300 transition-all duration-500 hover:scale-105 shadow-lg relative overflow-hidden`}>
                <CardContent className="p-8">
                  <div className="absolute top-4 right-4 text-yellow-400">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-current" />
                    ))}
                  </div>

                  <div className="flex items-center gap-4 mb-6">
                    <img src={testimonial.avatar} alt={testimonial.name} className="w-16 h-16 rounded-full border-4 border-white shadow-lg" />
                    <div>
                      <div className="font-bold text-lg text-slate-900">{testimonial.name}</div>
                      <div className="text-sm text-slate-600">{testimonial.role}</div>
                      <div className="text-xs text-slate-500">{testimonial.location}</div>
                    </div>
                  </div>

                  <p className="text-slate-700 mb-6 italic leading-relaxed">"{testimonial.content}"</p>

                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Verified User</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section - Simple & Clear */}
      <section id="pricing" className="w-full py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-50 to-purple-50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-6 bg-green-100 text-green-700 border-green-200 px-4 py-2 text-sm font-medium">
              💰 Transparent Pricing
            </Badge>
            <h2 className="text-4xl sm:text-5xl font-extrabold text-slate-900 mb-6">
              Choose Your <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">Perfect Plan</span>
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Start free and upgrade as you grow. No hidden fees, no surprises.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Free Plan */}
            <Card className="bg-white border-slate-200 shadow-lg hover:shadow-xl transition-all duration-500">
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <h3 className="font-bold text-2xl text-slate-900 mb-2">Free</h3>
                  <div className="text-4xl font-bold text-slate-900 mb-2">₦0</div>
                  <div className="text-slate-600">Perfect for getting started</div>
                </div>

                <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-slate-700">Basic wallet features</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-slate-700">₦10,000 daily limit</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-slate-700">Email support</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-slate-700">Basic security features</span>
                  </div>
                </div>

                <Button className="w-full bg-slate-100 text-slate-700 hover:bg-slate-200 font-semibold rounded-full py-3">
                  Get Started Free
                </Button>
              </CardContent>
            </Card>

            {/* Pro Plan */}
            <Card className="group bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-500 scale-105">
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <Badge className="mb-4 bg-white/20 text-white border-white/30 px-3 py-1 text-sm">
                    Most Popular
                  </Badge>
                  <h3 className="font-bold text-2xl mb-2">Pro</h3>
                  <div className="text-4xl font-bold mb-2">₦2,999</div>
                  <div className="opacity-90">Per month</div>
                </div>

                <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-white" />
                    <span>Unlimited transactions</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-white" />
                    <span>₦1,000,000 daily limit</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-white" />
                    <span>Priority support</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-white" />
                    <span>Advanced security features</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-white" />
                    <span>Referral bonuses</span>
                  </div>
                </div>

                <Button className="w-full bg-white text-blue-600 hover:bg-slate-100 font-semibold rounded-full py-3">
                  Start Pro Trial
                </Button>
              </CardContent>
            </Card>

            {/* Enterprise Plan */}
            <Card className="bg-white border-slate-200 shadow-lg hover:shadow-xl transition-all duration-500">
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <h3 className="font-bold text-2xl text-slate-900 mb-2">Enterprise</h3>
                  <div className="text-4xl font-bold text-slate-900 mb-2">₦9,999</div>
                  <div className="text-slate-600">Per month</div>
                </div>

                <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-slate-700">Everything in Pro</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>₦5,000,000 daily limit</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>Dedicated support</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>Custom integrations</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>Advanced analytics</span>
                  </div>
                </div>

                <Button className="w-full bg-slate-100 text-slate-700 hover:bg-slate-200 font-semibold rounded-full py-3">
                  Contact Sales
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Section - Human Touch */}
      <section className="w-full py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-6 bg-orange-100 text-orange-700 border-orange-200 px-4 py-2 text-sm font-medium">
              ❓ Questions & Answers
            </Badge>
            <h2 className="text-4xl sm:text-5xl font-extrabold text-slate-900 mb-6">
              Got Questions? <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">We Have Answers</span>
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Everything you need to know about using eGuy for your financial needs.
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-6">
            {[
              {
                question: "How secure is my money with eGuy?",
                answer: "Your security is our top priority. We use bank-grade encryption, two-factor authentication, and follow all regulatory requirements. Your funds are protected by insurance and our partnership with licensed financial institutions."
              },
              {
                question: "How quickly can I send money?",
                answer: "Money transfers happen instantly within the eGuy network. Bank transfers typically take 2-5 minutes, while card payments are processed immediately. You'll always know the exact timing before confirming any transaction."
              },
              {
                question: "What bills can I pay through eGuy?",
                answer: "You can pay electricity bills (PHED, AEDC, etc.), water bills, cable TV (DSTV, GOtv, StarTimes), internet bills, and many other services. We support all major utility providers across Nigeria."
              },
              {
                question: "How does the referral system work?",
                answer: "Share your unique referral link with friends and family. When they sign up and make their first transaction, you both get rewarded. It's our way of saying thank you for helping us grow our community of happy users."
              }
            ].map((faq, index) => (
              <Card key={index} className="bg-gradient-to-r from-slate-50 to-white border-slate-200 hover:border-orange-300 transition-all duration-300">
                <CardContent className="p-6">
                  <h3 className="font-bold text-lg text-slate-900 mb-3">{faq.question}</h3>
                  <p className="text-slate-600 leading-relaxed">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - Personal Touch */}
      <section className="relative w-full py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-600 to-purple-600 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(255,255,255,0.1),transparent_70%)]"></div>

        <div className="container mx-auto text-center relative z-10">
          <div className="max-w-4xl mx-auto">
            <div className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white font-medium text-sm mb-6">
              <Heart className="w-4 h-4 mr-2" />
              Join 50,000+ Happy Users
            </div>

            <h2 className="text-4xl sm:text-5xl font-extrabold text-white mb-6">
              Ready to Simplify Your <span className="block">Financial Life?</span>
            </h2>

            <p className="text-xl text-blue-100 mb-12 max-w-2xl mx-auto">
              Join thousands of Nigerians who have already discovered the joy of stress-free financial management with eGuy.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signup">
                <Button size="lg" className="group bg-white text-blue-600 hover:bg-slate-100 font-bold rounded-full px-10 py-4 text-lg shadow-2xl transition-all duration-500 hover:scale-105 min-w-[200px]">
                  <span className="mr-2">Start Your Journey</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                </Button>
              </Link>
              <Link href="/signin">
                <Button size="lg" variant="outline" className="border-2 border-white/30 text-white hover:text-blue-600 hover:bg-white font-bold rounded-full px-10 py-4 text-lg shadow-lg transition-all duration-300 min-w-[200px]">
                  Sign In Instead
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer - Comprehensive */}
      <footer className="relative border-t border-slate-200 bg-slate-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-xl">eG</span>
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">eGuy</span>
              </div>
              <p className="text-slate-600 text-lg leading-relaxed mb-6 max-w-md">
                Your trusted fintech partner for seamless payments, smart wallet management, and instant earnings through our innovative referral system. Built for Nigerians, by Nigerians.
              </p>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-sm">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-slate-600">50,000+ Active Users</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-6 text-slate-900">Services</h3>
              <div className="space-y-4">
                {[
                  'Money Transfer',
                  'Bill Payments',
                  'Airtime & Data',
                  'Savings',
                  'Referrals'
                ].map((service) => (
                  <div key={service} className="text-slate-600 hover:text-slate-900 transition-colors duration-300 font-medium">
                    {service}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-6 text-slate-900">Support</h3>
              <div className="space-y-4">
                {[
                  'Help Center',
                  'Contact Us',
                  'Privacy Policy',
                  'Terms of Service',
                  'Security'
                ].map((link) => (
                  <div key={link} className="text-slate-600 hover:text-slate-900 transition-colors duration-300 font-medium">
                    {link}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="border-t border-slate-200 pt-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <p className="text-slate-500 text-center md:text-left">
                © 2024 eGuy. All rights reserved. Built with ❤️ for Nigerians.
              </p>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <span>Secured by</span>
                  <div className="flex items-center gap-1">
                    <Shield className="w-4 h-4 text-blue-500" />
                    <span className="font-medium text-blue-500">Bank-grade Security</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}