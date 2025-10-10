// ...existing code...
"use client";
export const dynamic = "force-dynamic"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Wallet, Users, Smartphone, Shield, TrendingUp, Zap, Menu } from "lucide-react"
import { Drawer, DrawerTrigger, DrawerContent, DrawerClose } from "@/components/ui/drawer"
import { useState } from "react"


export default function HomePage() {
  const [open, setOpen] = useState(false);
  return (
    <div className="min-h-screen w-full flex flex-col bg-primary/5">
      {/* Header - transparent, no shadow */}
      <header className="w-full bg-transparent border-0 m-0 p-0 fixed top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between ">
          <div className="flex items-center space-x-2 ml-lg-50">
            <span className="text-3xl font-bold text-primary">eGuy</span>
          </div>
          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-6 text-primary font-medium mr-50">
            <Link href="#features" className="hover:text-[#1A202C] transition">Features</Link>
            <Link href="#pricing" className="hover:text-[#1A202C] transition">Pricing</Link>
            <Link href="#testimonials" className="hover:text-[#1A202C] transition">Testimonials</Link>
            <Link href="/signin" className="hover:text-[#1A202C] transition">Login</Link>
            <Link href="/signup">
              <Button className="bg-primary text-primary-foreground font-bold rounded-full px-6 py-2 text-base hover:bg-primary/90 transition">Register</Button>
            </Link>
          </nav>
          {/* Hamburger for mobile */}
          <div className="md:hidden">
            <Drawer open={open} onOpenChange={setOpen}>
              <DrawerTrigger asChild>
                <button aria-label="Open menu" onClick={() => setOpen(true)} className="p-2 rounded-full text-primary hover:bg-primary/10 focus:outline-none">
                  <Menu size={32} />
                </button>
              </DrawerTrigger>
              <DrawerContent className="bg-white p-6">
                <div className="flex flex-col gap-6 text-primary font-medium">
                  <DrawerClose asChild>
                    <button aria-label="Close menu" onClick={() => setOpen(false)} className="self-end mb-2 p-2 rounded-full text-primary hover:bg-primary/10 focus:outline-none">
                      <Menu size={32} className="rotate-90" />
                    </button>
                  </DrawerClose>
                  <Link href="#features" className="hover:text-[#1A202C] transition" onClick={() => setOpen(false)}>Features</Link>
                  <Link href="#pricing" className="hover:text-[#1A202C] transition" onClick={() => setOpen(false)}>Pricing</Link>
                  <Link href="#testimonials" className="hover:text-[#1A202C] transition" onClick={() => setOpen(false)}>Testimonials</Link>
                  <Link href="/signin" className="hover:text-[#1A202C] transition" onClick={() => setOpen(false)}>Login</Link>
                  <Link href="/signup" onClick={() => setOpen(false)}>
                    <Button className="bg-primary text-primary-foreground font-bold rounded-full px-6 py-2 text-base hover:bg-primary/90 transition w-full">Register</Button>
                  </Link>
                </div>
              </DrawerContent>
            </Drawer>
          </div>
        </div>
      </header>

      {/* 1. Hero Section - two columns */}
  <section className="w-full bg-gradient-to-br from-primary/5 to-secondary/5 py-20 px-4 ">
        <div className="container mx-auto flex flex-col md:flex-row items-stretch justify-between gap-12 mt-24">
          {/* Left column: heading, text, buttons */}
          <div className="flex-1 max-w-xl flex flex-col justify-center min-h-[400px] md:min-h-[500px] ml-50">
            <h1 className="text-5xl md:text-6xl font-extrabold text-foreground mb-6 tracking-tight leading-tight">
              Your Financial Freedom<br />Starts <span className="text-primary">Here</span>
            </h1>
            <p className="text-lg md:text-xl text-[#4A5568] mb-8 font-medium">
              eGuy is your all-in-one fintech platform for wallet services, bill payments, and earning through our ElevateX referral system.
            </p>
            <div className="flex gap-4 mt-6">
              <Link href="/signup">
                <Button size="lg" className="bg-primary text-primary-foreground font-bold rounded-full px-8 py-3 text-lg shadow-md hover:bg-primary/90 transition">Register</Button>
              </Link>
              <Link href="/signin">
                <Button size="lg" variant="outline" className="border-2 border-primary text-primary font-bold rounded-full px-8 py-3 text-lg shadow-md hover:bg-primary hover:text-primary-foreground transition">Login</Button>
              </Link>
            </div>
          </div>
          {/* Right column: eGuy screenshot image */}
          <div className="flex-1 flex items-center justify-center min-h-[400px] md:min-h-[500px]">
            <img
              src="/hero.png"
              alt="eGuy Hero Screenshot"
              className="rounded-2xl object-contain h-[500px] w-auto max-w-xs"
            />
          </div>
        </div>
      </section>

      {/* 2. Partners Slideshow Section */}
      <section className="w-full py-4 bg-primary/5">
        <div className="overflow-hidden relative h-16 flex items-center">
          <div className="w-full h-full flex items-center">
            <div className="flex gap-10 animate-scroll-partners min-w-[200%]">
              {/* Show 4 logos per view, repeat for infinite effect */}
                {/* All images in public folder, repeated for infinite effect */}
                {["/mtn.jpeg","/glo.jpeg","/9mobile.jpeg","/aitel.jpeg","/gotv.jpeg","/StarTimes.jpeg","/dstv.jpeg"].map((src, i) => (
                  <img key={src + i} src={src} alt={src.split('/').pop()?.split('.')[0]} className="h-16 w-auto rounded" />
                ))}
                {/* Repeat for infinite effect */}
                {["/mtn.jpeg","/glo.jpeg","/9mobile.jpeg","/aitel.jpeg","/gotv.jpeg","/StarTimes.jpeg","/dstv.jpeg"].map((src, i) => (
                  <img key={src + 'repeat' + i} src={src} alt={src.split('/').pop()?.split('.')[0]} className="h-16 w-auto rounded" />
                ))}
            </div>
          </div>
        </div>
      </section>
        <style jsx>{`
          .animate-scroll-partners {
            animation: scroll-partners 40s linear infinite;
          }
          @keyframes scroll-partners {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
        `}</style>

      {/* 3. Info Section - two columns (image left, text right) */}
      <section className="w-full bg-gradient-to-br from-primary/5 to-secondary/5 py-20 px-4 ">
        <div className="container mx-auto flex flex-col md:flex-row items-stretch justify-between gap-12">
          {/* Left column: image */}
          <div className="flex-1 flex items-center justify-center min-h-[400px] md:min-h-[500px]">
            <img
              src="/hero.png"
              alt="eGuy Hero Screenshot"
              className="rounded-2xl object-contain h-[500px] w-auto max-w-xs"
            />
          </div>
          {/* Right column: heading, paragraph, button */}
          <div className="flex-1 max-w-xl flex flex-col justify-center min-h-[400px] md:min-h-[500px] mr-50">
            <h1 className="text-4xl md:text-5xl font-extrabold text-foreground mb-4 tracking-tight leading-tight">
              Discover More<br />With eGuy
            </h1>
            <h2 className="text-2xl md:text-3xl font-bold text-primary mb-2">All Your Bills, One Place</h2>
            <p className="text-lg md:text-xl text-[#4A5568] mb-8 font-medium">
              Pay bills, buy airtime, and manage your wallet seamlessly. Experience the convenience and security of a unified fintech platform.
            </p>
            <div className="mt-4">
              <Button size="lg" className="bg-primary text-primary-foreground font-bold rounded-full px-8 py-3 text-lg shadow-md hover:bg-primary/90 transition">Read More</Button>
            </div>
          </div>
        </div>
      </section>
      {/* 4. Features Section - two columns */}
      <section className="w-full bg-gradient-to-br from-primary/5 to-secondary/5 py-20 px-4 ">
        <div className="container mx-auto flex flex-col md:flex-row items-stretch justify-between gap-12">
          {/* Left column: heading, paragraph, feature list */}
          <div className="flex-1 max-w-xl flex flex-col justify-center min-h-[400px] md:min-h-[500px] ml-50">
            <h2 className="text-4xl md:text-5xl font-extrabold text-primary mb-4 leading-tight">
              All-in-One Fintech<br />System Features
            </h2>
            <p className="text-lg md:text-xl text-[#4A5568] mb-4 font-medium">Explore the powerful features that make eGuy your go-to fintech platform.</p>
            <ul className="space-y-6 mb-6">
              <li className="flex items-center gap-4">
                <Wallet className="text-primary w-8 h-8" />
                <span className="text-base md:text-lg font-semibold text-foreground">Multi-purpose Wallet</span>
              </li>
              <li className="flex items-center gap-4">
                <Smartphone className="text-primary w-8 h-8" />
                <span className="text-base md:text-lg font-semibold text-foreground">Airtime & Data Purchase</span>
              </li>
              <li className="flex items-center gap-4">
                <Shield className="text-primary w-8 h-8" />
                <span className="text-base md:text-lg font-semibold text-foreground">Secure Bill Payments</span>
              </li>
            </ul>
            <div>
              <Button size="lg" className="bg-primary text-primary-foreground font-bold rounded-full px-8 py-3 text-lg shadow-md hover:bg-primary/90 transition">Get It Now</Button>
            </div>
          </div>
          {/* Right column: image */}
          <div className="flex-1 flex items-center justify-center min-h-[400px] md:min-h-[500px]">
            <img
              src="/hero.png"
              alt="System Features Image"
              className="rounded-2xl object-contain h-[500px] w-auto max-w-xs"
            />
          </div>
        </div>
      </section>

      {/* 5. ElevateX Section - two columns */}
      <section className="w-full bg-gradient-to-br from-primary/5 to-secondary/5 py-20 px-4 ">
        <div className="container mx-auto flex flex-col md:flex-row items-stretch justify-between gap-12">
          {/* Left column: image */}
          <div className="flex-1 flex items-center justify-center min-h-[400px] md:min-h-[500px]">
            <img
              src="/hero.png"
              alt="ElevateX Image"
              className="rounded-2xl object-contain h-[500px] w-auto max-w-xs"
            />
          </div>
          {/* Right column: heading, paragraph, feature list */}
          <div className="flex-1 max-w-xl flex flex-col justify-center min-h-[400px] md:min-h-[500px] mr-50">
            <h2 className="text-4xl md:text-5xl font-extrabold text-primary mb-4 leading-tight">
              ElevateX Referral<br />System
            </h2>
            <p className="text-lg md:text-xl text-[#4A5568] mb-4 font-medium">Unlock new earning opportunities with ElevateX. Refer friends, grow your network, and earn rewards instantly.</p>
            <ul className="space-y-6 mb-6">
              <li className="flex items-center gap-4">
                <TrendingUp className="text-primary w-8 h-8" />
                <span className="text-base md:text-lg font-semibold text-foreground">Earn on Every Referral</span>
              </li>
              <li className="flex items-center gap-4">
                <Users className="text-primary w-8 h-8" />
                <span className="text-base md:text-lg font-semibold text-foreground">Grow Your Network</span>
              </li>
              <li className="flex items-center gap-4">
                <Zap className="text-primary w-8 h-8" />
                <span className="text-base md:text-lg font-semibold text-foreground">Instant Payouts</span>
              </li>
            </ul>
            <div>
              <a href="/whitepaper.pdf" download>
                <Button size="lg" className="bg-primary text-primary-foreground font-bold rounded-full px-8 py-3 text-lg shadow-md hover:bg-primary/90 transition">Download Whitepaper</Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 6. How It Works Section */}
      <section className="w-full py-20 px-4 bg-primary/5">
        <div className="container mx-auto flex flex-col items-center">
          <div className="mb-10">
            <h2 className="text-4xl md:text-5xl font-extrabold text-primary text-center leading-tight mb-20">
              How It Works<br />Get Started in Minutes
            </h2>
          </div>
          <div className="relative w-full flex justify-center items-center" style={{ minHeight: 340 }}>
            {/* Left side rows */}
            <div className="absolute left-1/2 -translate-x-[180%] top-1/2 -translate-y-1/2 flex flex-col gap-56 h-auto justify-center items-end text-right">
              <div className="flex flex-col items-end gap-2">
                <Shield className="text-primary w-10 h-10 mb-2" />
                <h3 className="font-bold text-lg mb-1 text-primary text-right">Sign Up</h3>
                <p className="text-[#4A5568] max-w-xs text-right">Create your free account in seconds and get started instantly.</p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <Wallet className="text-primary w-10 h-10 mb-2" />
                <h3 className="font-bold text-lg mb-1 text-primary text-right">Fund Wallet</h3>
                <p className="text-[#4A5568] max-w-xs text-right">Deposit money and access all services securely.</p>
              </div>
            </div>
            {/* Center image */}
            <div className="flex flex-col items-center justify-center w-full">
              <img src="/hero.png" alt="How It Works" className="rounded-2xl object-contain h-[500px] w-auto max-w-xs mx-auto" />
            </div>
            {/* Right side rows */}
            <div className="absolute right-1/2 translate-x-[180%] top-1/2 -translate-y-1/2 flex flex-col gap-56 h-auto justify-center items-start">
              <div className="flex flex-col items-start gap-2">
                <Smartphone className="text-primary w-10 h-10 mb-2" />
                <h3 className="font-bold text-lg mb-1 text-primary text-left">Use Services</h3>
                <p className="text-[#4A5568] max-w-xs text-left">Buy airtime, pay bills, and enjoy seamless transactions.</p>
              </div>
              <div className="flex flex-col items-start gap-2">
                <TrendingUp className="text-primary w-10 h-10 mb-2" />
                <h3 className="font-bold text-lg mb-1 text-primary text-left">Start Earning</h3>
                <p className="text-[#4A5568] max-w-xs text-left">Refer friends and earn instantly with ElevateX.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

         {/* 7. Testimonial Section - two columns */}
      <section className="w-full py-20 px-4 bg-primary/5">
        <div className="container mx-auto flex flex-col md:flex-row gap-12 items-stretch">
          {/* Left column: heading and paragraph */}
          <div className="flex-1 flex flex-col justify-center max-w-xl ml-40">
            <h2 className="text-4xl md:text-5xl font-extrabold text-primary mb-4 leading-tight">
              What Our Users Say<br />Real Experiences
            </h2>
            <p className="text-lg md:text-xl text-[#4A5568] mb-6 font-medium">
              Discover how eGuy has transformed the financial lives of our users. From seamless bill payments to instant earnings, our platform is trusted by thousands for its reliability, security, and ease of use. Join the community and experience the difference yourself.
            </p>
          </div>
          {/* Right column: vertical testimonial cards block */}
          <div className="flex-1 flex flex-col gap-2 items-center">
            {/* Card 1 */}
            <div className="bg-white rounded-xl shadow p-4 flex gap-4 w-full max-w-md min-h-[120px]">
              {/* Left: user image */}
              <div className="flex items-center justify-center">
                <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="Jane Doe" className="rounded-full w-16 h-16 object-cover" />
              </div>
              {/* Right: testimonial, username, stars */}
              <div className="flex flex-col justify-between flex-1">
                <p className="text-[#4A5568] mb-2">eGuy made bill payments. I love the instant payouts!</p>
                <div className="mt-2 font-bold text-primary">Jane Doe</div>
                <div className="flex gap-1 mt-2">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-yellow-400">★</span>
                  ))}
                </div>
              </div>
            </div>
            {/* Card 2 - shifted left */}
            <div className="bg-white rounded-xl shadow p-4 flex gap-4 w-full max-w-md min-h-[120px] ml-26">
              <div className="flex items-center justify-center">
                <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="John Smith" className="rounded-full w-16 h-16 object-cover" />
              </div>
              <div className="flex flex-col justify-between flex-1">
                <p className="text-[#4A5568] mb-2">The referral system is a game changer. I earn every week just by inviting friends!</p>
                <div className="mt-2 font-bold text-primary">John Smith</div>
                <div className="flex gap-1 mt-2">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-yellow-400">★</span>
                  ))}
                </div>
              </div>
            </div>
            {/* Card 3 */}
            <div className="bg-white rounded-xl shadow p-4 flex gap-4 w-full max-w-md min-h-[120px]">
              <div className="flex items-center justify-center">
                <img src="https://randomuser.me/api/portraits/women/68.jpg" alt="Amina Yusuf" className="rounded-full w-16 h-16 object-cover" />
              </div>
              <div className="flex flex-col justify-between flex-1">
                <p className="text-[#4A5568] mb-2">Secure, fast, and reliable. eGuy is my go-to for all things fintech!</p>
                <div className="mt-2 font-bold text-primary">Amina Yusuf</div>
                <div className="flex gap-1 mt-2">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-yellow-400">★</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
            {/* 8. Why Choose eGuy Section */}
      <section className="w-full py-20 px-4 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="container mx-auto flex flex-col items-center">
          <h2 className="text-4xl md:text-5xl font-extrabold text-primary mb-4 leading-tight text-center">Why Choose eGuy?</h2>
          <p className="text-lg md:text-xl text-[#4A5568] mb-10 font-medium text-center max-w-2xl">
            eGuy is designed for simplicity, security, and speed. Our platform brings together all your financial needs in one place, with a focus on user experience and reliability. Here’s why thousands trust eGuy for their daily transactions.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 w-full max-w-5xl">
            <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
              <Shield className="text-primary w-10 h-10 mb-4" />
              <h3 className="font-bold text-lg mb-2 text-primary text-center">Secure & Reliable</h3>
              <p className="text-[#4A5568] text-center">Your data and funds are protected with industry-leading security measures.</p>
            </div>
            <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
              <Wallet className="text-primary w-10 h-10 mb-4" />
              <h3 className="font-bold text-lg mb-2 text-primary text-center">All-in-One Wallet</h3>
              <p className="text-[#4A5568] text-center">Manage your money, pay bills, and buy airtime or data from one dashboard.</p>
            </div>
            <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
              <TrendingUp className="text-primary w-10 h-10 mb-4" />
              <h3 className="font-bold text-lg mb-2 text-primary text-center">Instant Earnings</h3>
              <p className="text-[#4A5568] text-center">Earn rewards instantly through our ElevateX referral system.</p>
            </div>
            <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
              <Smartphone className="text-primary w-10 h-10 mb-4" />
              <h3 className="font-bold text-lg mb-2 text-primary text-center">Easy to Use</h3>
              <p className="text-[#4A5568] text-center">Enjoy a simple, intuitive interface designed for everyone.</p>
            </div>
          </div>
        </div>
      </section>
        {/* Footer */}
        <footer className="border-t bg-primary/5 mt-20">
          <div className="container mx-auto px-4 py-8">
            <div className="text-center">
              <div className="flex items-center justify-center space-x-2 mb-4">
                <div className="w-6 h-6 bg-primary rounded flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-xs">eG</span>
                </div>
                <span className="text-lg font-bold text-primary">eGuy</span>
              </div>
              <p className="text-sm text-muted-foreground">© 2024 eGuy. All rights reserved.</p>
            </div>
          </div>
        </footer>
   </div>
  )
}
