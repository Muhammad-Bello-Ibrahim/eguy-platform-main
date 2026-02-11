"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowRight, Check, Smartphone, Wallet, Zap, Droplets, GraduationCap, ArrowRightLeft, Rocket, Mail, Menu, X, ChevronRight, Wifi, Lightbulb, Droplet, BookOpen, Banknote, ShieldCheck, Phone, CreditCard, WifiOff, Home as HomeIcon, Wifi as WifiIcon, Send, Award, PhoneCall, UserPlus, ArrowUpRight, Plus, ArrowDown, ArrowUp, CheckCircle } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

const features = [
  {
    icon: <Lightbulb className="w-6 h-6 text-amber-500" />,
    title: "Electricity Bills",
    description: "Pay electricity bills for all providers instantly. Never experience power interruptions again.",
    color: "from-amber-500 to-orange-600"
  },
  {
    icon: <Droplet className="w-6 h-6 text-cyan-500" />,
    title: "Water Bills",
    description: "Convenient water bill payments for all major providers across regions.",
    color: "from-cyan-500 to-blue-600"
  },
  {
    icon: <PhoneCall className="w-6 h-6 text-blue-500" />,
    title: "Airtime & Data",
    description: "Instant top-up for all networks. Stay connected with our seamless recharge services.",
    color: "from-blue-500 to-blue-600"
  },
  {
    icon: <Wifi className="w-6 h-6 text-emerald-500" />,
    title: "Data Bundles",
    description: "Affordable data plans for all networks. Browse, stream and stay connected.",
    color: "from-green-500 to-emerald-600"
  },
  {
    icon: <BookOpen className="w-6 h-6 text-purple-500" />,
    title: "Exam Pins",
    description: "Purchase WAEC, NECO, and other examination pins instantly.",
    color: "from-purple-500 to-indigo-600"
  },
  {
    icon: <Send className="w-6 h-6 text-pink-500" />,
    title: "Bank Transfers",
    description: "Send and receive money to any bank account instantly with minimal charges.",
    color: "from-pink-500 to-rose-600"
  },
  {
    icon: <Award className="w-6 h-6 text-violet-500" />,
    title: "ElevateX",
    description: "Exclusive benefits and rewards for our premium users.",
    color: "from-violet-500 to-purple-600"
  }
]

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Freelancer",
    content: "eGuy has transformed how I manage my finances. The instant transfers save me hours every week!",
    avatar: "/avatar1.jpg"
  },
  {
    name: "Michael Chen",
    role: "Small Business Owner",
    content: "The analytics dashboard gives me clear insights into my business finances. Highly recommended!",
    avatar: "/avatar2.jpg"
  },
  {
    name: "Amina Okafor",
    role: "Student",
    content: "Sending money home has never been easier. The app is intuitive and lightning fast.",
    avatar: "/avatar3.jpg"
  }
]

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [currentTestimonial, setCurrentTestimonial] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Navigation */}
      <motion.nav 
        className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white/90 backdrop-blur-md shadow-sm py-3' : 'bg-transparent py-6'}`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div className="container mx-auto px-4 flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-2 group">
            <motion.div 
              className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center shadow-lg group-hover:shadow-blue-200 transition-all duration-300"
              whileHover={{ rotate: 10, scale: 1.05 }}
            >
              <Wallet className="w-5 h-5 text-white" />
            </motion.div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">eGuy</span>
          </Link>
          
          <div className="hidden md:flex items-center space-x-1">
            {['Features', 'How It Works', 'Pricing'].map((item) => (
              <Link 
                key={item}
                href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
                className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors font-medium text-sm rounded-lg hover:bg-gray-50"
              >
                {item}
              </Link>
            ))}
          </div>
          
          <div className="hidden md:flex items-center space-x-3">
            <Link href="/signin" className="px-4 py-2 text-gray-700 hover:text-blue-600 font-medium text-sm">
              Sign In
            </Link>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link 
                href="/signup" 
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-5 py-2.5 rounded-xl font-medium text-sm transition-all shadow-lg hover:shadow-blue-200"
              >
                Get Started
              </Link>
            </motion.div>
          </div>
          
          <button 
            className="md:hidden p-2 text-gray-700 hover:text-blue-600 focus:outline-none"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
        
        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div 
              className="md:hidden bg-white border-t border-gray-100 shadow-lg"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="px-4 py-3 space-y-2">
                {['Features', 'How It Works', 'Pricing'].map((item) => (
                  <Link
                    key={item}
                    href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
                    className="block px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item}
                  </Link>
                ))}
                <div className="pt-2 border-t border-gray-100">
                  <Link
                    href="/signin"
                    className="block px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/signup"
                    className="block mt-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-3 rounded-lg font-medium text-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Get Started
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Hero Section */}
      <section className="pt-24 pb-16 md:pt-32 md:pb-24 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col lg:flex-row items-center">
            <motion.div 
              className="lg:w-1/2 text-center lg:text-left mb-12 lg:mb-0"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                <Badge className="mb-6 bg-gradient-to-r from-blue-50 to-purple-50 text-blue-600 border border-blue-100 px-4 py-1.5 text-sm font-medium inline-flex items-center shadow-sm">
                  <span className="relative flex h-2 w-2 mr-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                  </span>
                  ⚡ Instant Delivery on All Services
                </Badge>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                  Your One-Stop Utility
                  <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Payment Solution
                  </span>
                </h1>
                <p className="text-lg md:text-xl text-gray-600 mb-10 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                  Instant airtime, data, electricity bills, water bills, exam pins, and bank transfers - all with 99.9% uptime and the most competitive rates in Nigeria.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <motion.div 
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Link 
                      href="/signup" 
                      className="inline-flex items-center justify-center bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl font-medium text-lg transition-all shadow-lg hover:shadow-blue-200"
                    >
                      Get Started Free
                      <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </motion.div>
                  <motion.div 
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Link 
                      href="#how-it-works" 
                      className="inline-flex items-center justify-center bg-white border-2 border-gray-200 hover:border-blue-300 text-gray-800 px-8 py-4 rounded-xl font-medium text-lg transition-all hover:shadow-md group"
                    >
                      How It Works
                      <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </motion.div>
                </div>
                <div className="mt-8 flex flex-wrap justify-center lg:justify-start gap-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <div className="flex -space-x-2 mr-2">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white"></div>
                      ))}
                    </div>
                    <span>Trusted by 50,000+ users</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                    <span>99.9% Uptime</span>
                  </div>
                </div>
              </motion.div>
            </motion.div>
            
            <motion.div 
              className="lg:w-1/2 relative"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
            >
              <div className="relative max-w-md mx-auto">
                <div className="absolute -top-6 -left-6 w-64 h-64 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
                <div className="absolute -bottom-8 right-0 w-64 h-64 bg-purple-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
                <div className="absolute -bottom-8 left-20 w-64 h-64 bg-pink-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
                
                <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                      <div className="text-sm text-gray-500">Current Balance</div>
                      <div className="w-10 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
                    </div>
                    <div className="text-3xl font-bold text-gray-900 mb-1">₦1,234,500.00</div>
                    <div className="text-sm text-green-600 font-medium flex items-center">
                      <span>+2.5% from last month</span>
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </div>
                    
                    <div className="mt-8 grid grid-cols-3 gap-4">
                      {['Send', 'Request', 'Pay'].map((action, i) => (
                        <motion.button
                          key={action}
                          whileHover={{ y: -5, scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="flex flex-col items-center justify-center p-3 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all"
                        >
                          <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center mb-2">
                            {action === 'Send' && <ArrowRight className="w-5 h-5 text-blue-500" />}
                            {action === 'Request' && <ArrowRight className="w-5 h-5 text-purple-500 transform rotate-180" />}
                            {action === 'Pay' && <Wallet className="w-5 h-5 text-green-500" />}
                          </div>
                          <span className="text-sm font-medium text-gray-700">{action}</span>
                        </motion.button>
                      ))}
                    </div>
                    
                    <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-500">Recent Transaction</span>
                        <span className="text-xs text-blue-600 font-medium">View All</span>
                      </div>
                      <div className="space-y-3">
                        {['Spotify', 'Netflix', 'Amazon'].map((service, i) => (
                          <div key={i} className="flex items-center justify-between">
                            <div className="flex items-center">
                              <div className="w-8 h-8 rounded-lg bg-gray-200 flex items-center justify-center mr-3">
                                <div className="w-5 h-5 bg-gray-300 rounded"></div>
                              </div>
                              <div>
                                <div className="text-sm font-medium text-gray-900">{service}</div>
                                <div className="text-xs text-gray-500">Today</div>
                              </div>
                            </div>
                            <div className="text-sm font-medium">-₦{[5000, 8000, 15000][i].toLocaleString()}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4">
          <motion.div 
            className="max-w-3xl mx-auto text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Badge className="mb-4 bg-gradient-to-r from-blue-50 to-purple-50 text-blue-600 border border-blue-100 px-4 py-1.5 text-sm font-medium shadow-sm">
              Our Core Services
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Essential Utility Services, Simplified</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">Experience the convenience of managing all your utility needs in one secure platform with instant delivery and 24/7 support</p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="group h-full border-0 bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300 hover:border-transparent hover:-translate-y-1">
                  <CardHeader className="pb-0">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform`}>
                      {feature.icon}
                    </div>
                    <CardTitle className="text-xl font-bold text-gray-900 mb-2">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-6">{feature.description}</p>
                    <div className="flex items-center text-sm font-medium text-blue-600 group-hover:text-blue-700 transition-colors">
                      Learn more
                      <ArrowRight className="w-4 h-4 ml-1.5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
          
          {/* Testimonials */}
          <div className="mt-24 max-w-4xl mx-auto">
            <motion.div 
              className="text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Badge className="mb-4 bg-purple-50 text-purple-600 border border-purple-100 px-4 py-1.5 text-sm font-medium">
                Testimonials
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Loved by Thousands</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">Join our community of satisfied users who trust us with their finances</p>
            </motion.div>
            
            <div className="relative h-64">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentTestimonial}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.5 }}
                  className="absolute inset-0 bg-white rounded-2xl shadow-lg p-8 flex flex-col justify-between"
                >
                  <div className="text-2xl md:text-3xl font-medium text-gray-800 leading-tight mb-6">
                    "{testimonials[currentTestimonial].content}"
                  </div>
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-full bg-gray-200 mr-4"></div>
                    <div>
                      <div className="font-bold text-gray-900">{testimonials[currentTestimonial].name}</div>
                      <div className="text-gray-600 text-sm">{testimonials[currentTestimonial].role}</div>
                    </div>
                    <div className="ml-auto flex space-x-2">
                      {testimonials.map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setCurrentTestimonial(i)}
                          className={`w-2.5 h-2.5 rounded-full transition-colors ${i === currentTestimonial ? 'bg-blue-600' : 'bg-gray-300'}`}
                          aria-label={`Go to testimonial ${i + 1}`}
                        />
                      ))}
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section className="py-16 bg-gray-50 overflow-hidden">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Badge className="mb-4 bg-gradient-to-r from-blue-50 to-purple-50 text-blue-600 border border-blue-100 px-4 py-1.5 text-sm font-medium shadow-sm">
              Trusted Partners
            </Badge>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Network of Trusted Partners</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">We partner with leading service providers to bring you the best utility services in Nigeria</p>
          </motion.div>

          <div className="relative
            before:absolute before:left-0 before:top-0 before:bottom-0 before:w-24 before:bg-gradient-to-r before:from-gray-50 before:to-transparent before:z-10
            after:absolute after:right-0 after:top-0 after:bottom-0 after:w-24 after:bg-gradient-to-l after:from-gray-50 after:to-transparent after:z-10">
            
            {/* First Carousel */}
            <div className="flex space-x-8 py-6 animate-scroll whitespace-nowrap">
              {[
                { src: '/mtn.jpeg', alt: 'MTN' },
                { src: '/airtel.jpeg', alt: 'Airtel' },
                { src: '/glo.jpeg', alt: 'Glo' },
                { src: '/9mobile.jpeg', alt: '9mobile' },
                { src: '/dstv.jpeg', alt: 'DSTV' },
                { src: '/gotv.jpeg', alt: 'GOTV' },
                { src: '/StarTimes.jpeg', alt: 'StarTimes' },
                { src: '/placeholder-logo.png', alt: 'WAEC' },
                { src: '/placeholder-logo.png', alt: 'NECO' },
                { src: '/placeholder-logo.png', alt: 'JAMB' },
                { src: '/placeholder-logo.png', alt: 'Paystack' },
              ].map((logo, index) => (
                <motion.div 
                  key={`${logo.alt}-${index}`}
                  className="inline-flex items-center justify-center h-20 w-40 bg-white rounded-lg shadow-sm p-4 mx-2"
                  whileHover={{ scale: 1.05, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)' }}
                >
                  <img 
                    src={logo.src} 
                    alt={logo.alt} 
                    className="h-12 w-auto max-w-full object-contain"
                  />
                </motion.div>
              ))}
            </div>

            {/* Second Carousel (duplicate for seamless looping) */}
            <div className="flex space-x-8 py-6 animate-scroll whitespace-nowrap" aria-hidden="true">
              {[
                { src: '/mtn.jpeg', alt: 'MTN' },
                { src: '/airtel.jpeg', alt: 'Airtel' },
                { src: '/glo.jpeg', alt: 'Glo' },
                { src: '/9mobile.jpeg', alt: '9mobile' },
                { src: '/dstv.jpeg', alt: 'DSTV' },
                { src: '/gotv.jpeg', alt: 'GOTV' },
                { src: '/StarTimes.jpeg', alt: 'StarTimes' },
                { src: '/placeholder-logo.png', alt: 'WAEC' },
                { src: '/placeholder-logo.png', alt: 'NECO' },
                { src: '/placeholder-logo.png', alt: 'JAMB' },
                { src: '/placeholder-logo.png', alt: 'Paystack' },
              ].map((logo, index) => (
                <div 
                  key={`${logo.alt}-dup-${index}`}
                  className="inline-flex items-center justify-center h-20 w-40 bg-white rounded-lg shadow-sm p-4 mx-2"
                >
                  <img 
                    src={logo.src} 
                    alt="" 
                    className="h-12 w-auto max-w-full object-contain"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        <style jsx global>{`
          @keyframes scroll {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(calc(-100% - 2rem));
            }
          }
          .animate-scroll {
            animation: scroll 40s linear infinite;
          }
          .animate-scroll:hover {
            animation-play-state: paused;
          }
        `}</style>
      </section>

      {/* How to Use Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Badge className="mb-4 bg-gradient-to-r from-blue-50 to-purple-50 text-blue-600 border border-blue-100 px-4 py-1.5 text-sm font-medium shadow-sm">
              Simple Steps
            </Badge>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How to Use eGuy</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">Get started in minutes and enjoy seamless transactions with our easy-to-use platform</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <UserPlus className="w-8 h-8 text-blue-500" />,
                step: "1",
                title: "Create an Account",
                description: "Sign up in less than a minute. No lengthy forms, just the essentials."
              },
              {
                icon: <Wallet className="w-8 h-8 text-purple-500" />,
                step: "2",
                title: "Fund Your Wallet",
                description: "Add money to your wallet using any of our secure payment methods."
              },
              {
                icon: <Zap className="w-8 h-8 text-amber-500" />,
                step: "3",
                title: "Start Transacting",
                description: "Buy airtime, pay bills, or send money instantly to anyone, anywhere."
              }
            ].map((item, index) => (
              <motion.div 
                key={index}
                className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center mb-6">
                  {item.icon}
                </div>
                <span className="text-2xl font-bold text-gray-300 mb-2 block">{item.step}</span>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ElevateX Section */}
      <section className="py-20 bg-gradient-to-r from-indigo-50 to-purple-50">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="flex flex-col md:flex-row items-center">
              <motion.div 
                className="md:w-1/2 mb-10 md:mb-0 md:pr-10"
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <Badge className="mb-4 bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-600 border border-indigo-100 px-4 py-1.5 text-sm font-medium shadow-sm">
                  ElevateX
                </Badge>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">The Future of Digital Banking</h2>
                <p className="text-lg text-gray-700 mb-6">
                  ElevateX is our premium digital banking solution that gives you more control over your finances with advanced features and exclusive benefits.
                </p>
                <ul className="space-y-3 mb-8">
                  {[
                    "Higher transaction limits",
                    "Lower fees on all transactions",
                    "Priority customer support",
                    "Exclusive investment opportunities",
                    "Multi-currency accounts"
                  ].map((feature, i) => (
                    <li key={i} className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
                  Learn More About ElevateX
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </motion.div>
              <motion.div 
                className="md:w-1/2"
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="bg-white p-6 rounded-2xl shadow-xl">
                  <div className="bg-gray-100 rounded-lg p-4 mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-sm text-gray-500">Available Balance</p>
                        <p className="text-2xl font-bold">₦250,000.00</p>
                      </div>
                      <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                        <Wallet className="w-5 h-5 text-indigo-600" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <Button className="bg-indigo-600 hover:bg-indigo-700">
                        <Plus className="w-4 h-4 mr-2" /> Add Money
                      </Button>
                      <Button variant="outline">
                        <ArrowUpRight className="w-4 h-4 mr-2" /> Send
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
                          <ArrowDown className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <p className="font-medium">Salary</p>
                          <p className="text-sm text-gray-500">Today, 9:45 AM</p>
                        </div>
                      </div>
                      <p className="font-semibold text-green-600">+₦150,000</p>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center mr-3">
                          <ArrowUp className="w-5 h-5 text-red-600" />
                        </div>
                        <div>
                          <p className="font-medium">Airtime</p>
                          <p className="text-sm text-gray-500">Yesterday, 2:30 PM</p>
                        </div>
                      </div>
                      <p className="font-semibold text-red-600">-₦1,000</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Download App Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 md:p-12 overflow-hidden relative">
            <div className="relative z-10 max-w-2xl">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Download the eGuy App</h2>
              <p className="text-lg text-blue-100 mb-8">
                Take control of your finances on the go. Download our mobile app for a faster, more convenient experience.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button className="bg-white text-blue-700 hover:bg-blue-50 h-12 px-6 rounded-lg">
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3.609 1.814L13.792 12 3.61 22.186a1.8 1.8 0 0 1-.5-.9v-18.57a1.8 1.8 0 0 1 .5-.9zM6.65 2.5l10.15 8.5-10.15 8.5V2.5zm5.1 18.29l7.54-6.35a1.2 1.2 0 0 0 0-1.88l-7.54-6.35v14.58z"/>
                  </svg>
                  <div className="text-left">
                    <p className="text-xs">Get it on</p>
                    <p className="font-semibold">Google Play</p>
                  </div>
                </Button>
                <Button className="bg-black text-white hover:bg-gray-800 h-12 px-6 rounded-lg">
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.7 8.4c-.8.4-1.5.9-2.1 1.6-.7.7-1.1 1.6-1.2 2.6 0 .1 0 .3.1.5.1.2.2.3.3.4.2.1.4.2.6.2.1 0 .3 0 .4-.1.8-.3 1.5-.7 2.1-1.4.7-.7 1.1-1.6 1.2-2.6 0-.2 0-.4-.1-.5-.1-.2-.2-.3-.4-.4-.2-.1-.4-.1-.6-.1-.2 0-.3 0-.5.1zM12.7 10.6c0-1.3.4-2.4 1.1-3.3.6-.8 1.4-1.3 2.4-1.5.1 0 .2-.1.3-.1.2 0 .3-.1.4-.3.1-.2.1-.4 0-.6-.1-.2-.2-.3-.4-.4-.2 0-.3-.1-.5-.1-1.4.1-2.6.7-3.6 1.6-1 .9-1.5 2-1.6 3.3 0 .2 0 .4.1.6.1.2.2.3.4.4.2.1.4.1.6 0 .2-.1.3-.2.4-.4 0-.1.1-.2.1-.3z"/>
                    <path d="M16.2 17.7c-.8.3-1.6.5-2.4.5-1.1 0-2.1-.3-3.1-.8-1-.5-1.8-1.2-2.5-2.1-.7-.9-1.2-1.9-1.5-3.1-.3-1.2-.2-2.4.1-3.6.1-.4.3-.8.5-1.2.2-.4.5-.7.8-1 .1-.1.1-.2.1-.3 0-.1 0-.3-.1-.4-.1-.1-.2-.1-.3-.1-.5 0-1 .1-1.5.3-.4.2-.8.5-1.1.9-.3.4-.6.8-.8 1.3-.5 1.1-.8 2.3-.8 3.5 0 1.3.3 2.5.9 3.6.6 1.1 1.4 2 2.4 2.7 1 .7 2.1 1.2 3.3 1.5 1.2.3 2.5.3 3.7 0 .4-.1.8-.3 1.2-.5.4-.2.7-.5 1-.8.1-.1.2-.2.3-.3.1-.1.1-.3 0-.4-.1-.1-.2-.1-.3-.1-.2 0-.3.1-.4.2-.2.3-.5.6-.9.8z"/>
                  </svg>
                  <div className="text-left">
                    <p className="text-xs">Download on the</p>
                    <p className="font-semibold">App Store</p>
                  </div>
                </Button>
              </div>
            </div>
            <div className="hidden md:block absolute right-0 top-1/2 transform -translate-y-1/2 w-1/3">
              <img 
                src="/phone-mockup.png" 
                alt="eGuy Mobile App" 
                className="w-full h-auto max-h-96 object-contain"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 -skew-y-3 transform origin-top-left"></div>
        <div className="relative container mx-auto px-4">
          <motion.div 
            className="max-w-4xl mx-auto text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Experience the Future of Utility Payments</h2>
            <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
              Join thousands of satisfied customers who trust eGuy for all their utility payment needs. Fast, secure, and reliable - every time.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-2xl mx-auto">
              <motion.div 
                className="w-full"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input 
                    type="tel" 
                    placeholder="Enter your phone number" 
                    className="pl-12 pr-4 py-6 bg-white/10 border-white/20 text-white placeholder-blue-200 h-auto text-base focus:ring-2 focus:ring-white/50 focus:border-transparent"
                  />
                </div>
              </motion.div>
              <motion.div 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button 
                  size="lg" 
                  className="w-full sm:w-auto bg-white text-blue-600 hover:bg-gray-100 h-auto px-8 py-5 text-base font-medium rounded-xl shadow-xl"
                >
                  Get Started Free
                </Button>
              </motion.div>
            </div>
            <p className="mt-4 text-sm text-blue-100">
              No credit card required • Cancel anytime
            </p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400">
        <div className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
            <div className="md:col-span-4">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                  <Wallet className="w-5 h-5 text-white" />
                </div>
                <span className="text-2xl font-bold text-white">eGuy</span>
              </div>
              <p className="mb-6 text-gray-400">
                Empowering you with modern financial tools to take control of your money and build a better future.
              </p>
              <div className="flex space-x-4">
                <a 
                  href="#facebook" 
                  className="w-10 h-10 rounded-full bg-blue-600 hover:bg-blue-700 flex items-center justify-center text-white transition-colors"
                  aria-label="Facebook"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-facebook">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                  </svg>
                </a>
                <a 
                  href="#twitter" 
                  className="w-10 h-10 rounded-full bg-sky-500 hover:bg-sky-600 flex items-center justify-center text-white transition-colors"
                  aria-label="Twitter"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-twitter">
                    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/>
                  </svg>
                </a>
                <a 
                  href="#instagram" 
                  className="w-10 h-10 rounded-full bg-gradient-to-r from-pink-600 to-amber-500 hover:from-pink-700 hover:to-amber-600 flex items-center justify-center text-white transition-colors"
                  aria-label="Instagram"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-instagram">
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                  </svg>
                </a>
                <a 
                  href="#linkedin" 
                  className="w-10 h-10 rounded-full bg-blue-700 hover:bg-blue-800 flex items-center justify-center text-white transition-colors"
                  aria-label="LinkedIn"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-linkedin">
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                    <rect width="4" height="12" x="2" y="9"/>
                    <circle cx="4" cy="4" r="2"/>
                  </svg>
                </a>
                <a 
                  href="#whatsapp" 
                  className="w-10 h-10 rounded-full bg-green-500 hover:bg-green-600 flex items-center justify-center text-white transition-colors"
                  aria-label="WhatsApp"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-message-circle">
                    <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22l5.9-2a8.9 8.9 0 0 0 0-4z"/>
                  </svg>
                </a>
              </div>
            </div>
            
            <div className="md:col-span-2">
              <h3 className="text-white font-medium text-lg mb-6">Product</h3>
              <ul className="space-y-3">
                {['Features', 'Pricing', 'Security', 'API', 'Integrations'].map((item) => (
                  <li key={item}>
                    <Link 
                      href={`#${item.toLowerCase()}`} 
                      className="hover:text-white transition-colors flex items-center group"
                    >
                      <ChevronRight className="w-4 h-4 mr-1 text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="md:col-span-2">
              <h3 className="text-white font-medium text-lg mb-6">Company</h3>
              <ul className="space-y-3">
                {['About Us', 'Careers', 'Blog', 'Press', 'Contact'].map((item) => (
                  <li key={item}>
                    <Link 
                      href={`#${item.toLowerCase().replace(/\s+/g, '-')}`} 
                      className="hover:text-white transition-colors flex items-center group"
                    >
                      <ChevronRight className="w-4 h-4 mr-1 text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="md:col-span-4">
              <h3 className="text-white font-medium text-lg mb-6">Stay Updated</h3>
              <p className="mb-4">Subscribe to our newsletter for the latest updates and news.</p>
              <div className="flex">
                <Input 
                  type="email" 
                  placeholder="Your email address" 
                  className="rounded-r-none border-r-0 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <Button className="bg-blue-600 hover:bg-blue-700 rounded-l-none px-6">
                  Subscribe
                </Button>
              </div>
              <p className="mt-2 text-sm text-gray-500">
                We respect your privacy. Unsubscribe at any time.
              </p>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-500">
              © {new Date().getFullYear()} eGuy Technologies. All rights reserved.
            </p>
            <div className="flex flex-wrap justify-center md:justify-end gap-4 mt-4 md:mt-0">
              {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((item) => (
                <Link 
                  key={item}
                  href={`#${item.toLowerCase().replace(/\s+/g, '-')}`} 
                  className="text-sm text-gray-500 hover:text-white transition-colors"
                >
                  {item}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </footer>
      
      {/* Back to top button */}
      <motion.button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-6 right-6 w-12 h-12 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg flex items-center justify-center text-white hover:shadow-xl transition-all duration-300"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        aria-label="Back to top"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
        </svg>
      </motion.button>
    </div>
  )
}