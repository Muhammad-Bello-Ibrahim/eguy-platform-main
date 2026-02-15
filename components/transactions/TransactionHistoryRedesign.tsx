<!DOCTYPE html>

<html class="dark" lang="en"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>eGuy Transaction History</title>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/icon?family=Material+Icons+Round" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<script id="tailwind-config">
        tailwind.config = {
            darkMode: "class",
            theme: {
                extend: {
                    colors: {
                        "primary": "#47f0d1",
                        "background-light": "#f6f8f8",
                        "background-dark": "#10221e", // Optimized for the specified deep fintech dark
                        "card-dark": "#1a2e2a",
                    },
                    fontFamily: {
                        "display": ["Manrope", "sans-serif"]
                    },
                    borderRadius: {
                        "DEFAULT": "1rem",
                        "lg": "2rem",
                        "xl": "3rem",
                        "2xl": "4rem",
                        "full": "9999px"
                    },
                },
            },
        }
    </script>
<style>
        body {
            font-family: 'Manrope', sans-serif;
            -webkit-tap-highlight-color: transparent;
        }
        .hide-scrollbar::-webkit-scrollbar {
            display: none;
        }
        .hide-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
        }
        .ios-blur {
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
        }
    </style>
<style>
    body {
      min-height: max(884px, 100dvh);
    }
  </style>
  </head>
<body class="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display selection:bg-primary/30">
<!-- Mobile Container -->
<div class="max-w-md mx-auto min-h-screen relative flex flex-col pb-24 shadow-2xl shadow-black/50">
<!-- Sticky Header Section -->
<header class="sticky top-0 z-50 bg-background-light/80 dark:bg-background-dark/80 ios-blur pt-8 pb-4 px-6 border-b border-slate-200 dark:border-primary/10">
<div class="flex items-center justify-between mb-6">
<button class="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 dark:bg-card-dark text-slate-600 dark:text-primary transition-transform active:scale-90">
<span class="material-icons-round">chevron_left</span>
</button>
<h1 class="text-xl font-extrabold tracking-tight">Transactions</h1>
<button class="w-10 h-10 flex items-center justify-center rounded-full bg-primary/10 text-primary transition-transform active:scale-90">
<span class="material-icons-round">file_download</span>
</button>
</div>
<!-- Search Bar -->
<div class="relative group">
<span class="material-icons-round absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 group-focus-within:text-primary transition-colors">search</span>
<input class="w-full bg-slate-100 dark:bg-card-dark border-none rounded-full py-3.5 pl-12 pr-4 text-sm font-medium focus:ring-2 focus:ring-primary/40 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500" placeholder="Search by name, service or amount" type="text"/>
</div>
<!-- Filter Chips -->
<div class="flex gap-2 mt-5 overflow-x-auto hide-scrollbar -mx-2 px-2">
<button class="px-6 py-2 rounded-full bg-primary text-background-dark text-xs font-bold whitespace-nowrap transition-all shadow-lg shadow-primary/20">All</button>
<button class="px-6 py-2 rounded-full bg-slate-100 dark:bg-card-dark text-slate-600 dark:text-slate-300 text-xs font-semibold whitespace-nowrap hover:bg-slate-200 dark:hover:bg-primary/20 transition-all">Inflow</button>
<button class="px-6 py-2 rounded-full bg-slate-100 dark:bg-card-dark text-slate-600 dark:text-slate-300 text-xs font-semibold whitespace-nowrap hover:bg-slate-200 dark:hover:bg-primary/20 transition-all">Outflow</button>
<button class="px-6 py-2 rounded-full bg-slate-100 dark:bg-card-dark text-slate-600 dark:text-slate-300 text-xs font-semibold whitespace-nowrap hover:bg-slate-200 dark:hover:bg-primary/20 transition-all">Service</button>
<button class="px-6 py-2 rounded-full bg-slate-100 dark:bg-card-dark text-slate-600 dark:text-slate-300 text-xs font-semibold whitespace-nowrap hover:bg-slate-200 dark:hover:bg-primary/20 transition-all">Cards</button>
</div>
</header>
<!-- Transaction List -->
<main class="flex-1 px-6 pt-4">
<!-- Date Group: Today -->
<div class="mb-8">
<h3 class="text-xs font-extrabold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 mb-4 px-1">Today</h3>
<div class="space-y-3">
<!-- Row: Inflow -->
<div class="flex items-center p-4 bg-white dark:bg-card-dark/40 border border-slate-100 dark:border-primary/5 rounded-lg active:scale-[0.98] transition-all cursor-pointer">
<div class="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary shrink-0">
<span class="material-icons-round">south_west</span>
</div>
<div class="ml-4 flex-1">
<h4 class="text-[15px] font-bold text-slate-800 dark:text-slate-100">Referral Bonus</h4>
<p class="text-[12px] font-medium text-slate-500 dark:text-slate-400 mt-0.5">02:14 PM • Rewards</p>
</div>
<div class="text-right">
<span class="text-[16px] font-extrabold text-primary">+$20.00</span>
</div>
</div>
<!-- Row: Service -->
<div class="flex items-center p-4 bg-white dark:bg-card-dark/40 border border-slate-100 dark:border-primary/5 rounded-lg active:scale-[0.98] transition-all cursor-pointer">
<div class="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 shrink-0">
<span class="material-icons-round">wifi_tethering</span>
</div>
<div class="ml-4 flex-1">
<h4 class="text-[15px] font-bold text-slate-800 dark:text-slate-100">MTN Data Purchase</h4>
<p class="text-[12px] font-medium text-slate-500 dark:text-slate-400 mt-0.5">11:30 AM • Services</p>
</div>
<div class="text-right">
<span class="text-[16px] font-extrabold text-slate-800 dark:text-slate-100">-$5.50</span>
</div>
</div>
<!-- Row: Outflow -->
<div class="flex items-center p-4 bg-white dark:bg-card-dark/40 border border-slate-100 dark:border-primary/5 rounded-lg active:scale-[0.98] transition-all cursor-pointer">
<div class="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 shrink-0">
<span class="material-icons-round">north_east</span>
</div>
<div class="ml-4 flex-1">
<h4 class="text-[15px] font-bold text-slate-800 dark:text-slate-100">Transfer to Bank</h4>
<p class="text-[12px] font-medium text-slate-500 dark:text-slate-400 mt-0.5">09:12 AM • Transfers</p>
</div>
<div class="text-right">
<span class="text-[16px] font-extrabold text-slate-800 dark:text-slate-100">-$100.00</span>
</div>
</div>
</div>
</div>
<!-- Date Group: Yesterday -->
<div class="mb-8">
<h3 class="text-xs font-extrabold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 mb-4 px-1">Yesterday</h3>
<div class="space-y-3">
<!-- Row: Inflow -->
<div class="flex items-center p-4 bg-white dark:bg-card-dark/40 border border-slate-100 dark:border-primary/5 rounded-lg active:scale-[0.98] transition-all cursor-pointer">
<div class="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary shrink-0">
<span class="material-icons-round">account_balance_wallet</span>
</div>
<div class="ml-4 flex-1">
<h4 class="text-[15px] font-bold text-slate-800 dark:text-slate-100">Wallet Deposit</h4>
<p class="text-[12px] font-medium text-slate-500 dark:text-slate-400 mt-0.5">05:45 PM • Funding</p>
</div>
<div class="text-right">
<span class="text-[16px] font-extrabold text-primary">+$550.00</span>
</div>
</div>
<!-- Row: Service -->
<div class="flex items-center p-4 bg-white dark:bg-card-dark/40 border border-slate-100 dark:border-primary/5 rounded-lg active:scale-[0.98] transition-all cursor-pointer">
<div class="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 shrink-0">
<span class="material-icons-round">phone_android</span>
</div>
<div class="ml-4 flex-1">
<h4 class="text-[15px] font-bold text-slate-800 dark:text-slate-100">Glo Airtime Purchase</h4>
<p class="text-[12px] font-medium text-slate-500 dark:text-slate-400 mt-0.5">04:20 PM • Services</p>
</div>
<div class="text-right">
<span class="text-[16px] font-extrabold text-slate-800 dark:text-slate-100">-$2.00</span>
</div>
</div>
<!-- Row: Card -->
<div class="flex items-center p-4 bg-white dark:bg-card-dark/40 border border-slate-100 dark:border-primary/5 rounded-lg active:scale-[0.98] transition-all cursor-pointer">
<div class="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 shrink-0">
<span class="material-icons-round">credit_card</span>
</div>
<div class="ml-4 flex-1">
<h4 class="text-[15px] font-bold text-slate-800 dark:text-slate-100">Netflix Subscription</h4>
<p class="text-[12px] font-medium text-slate-500 dark:text-slate-400 mt-0.5">01:00 AM • Entertainment</p>
</div>
<div class="text-right">
<span class="text-[16px] font-extrabold text-slate-800 dark:text-slate-100">-$15.99</span>
</div>
</div>
</div>
</div>
<!-- Date Group: 12 Nov -->
<div class="mb-8">
<h3 class="text-xs font-extrabold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 mb-4 px-1">12 November</h3>
<div class="space-y-3 opacity-60">
<div class="flex items-center p-4 bg-white dark:bg-card-dark/40 border border-slate-100 dark:border-primary/5 rounded-lg">
<div class="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary shrink-0">
<span class="material-icons-round">south_west</span>
</div>
<div class="ml-4 flex-1">
<h4 class="text-[15px] font-bold text-slate-800 dark:text-slate-100">Cashback Reward</h4>
<p class="text-[12px] font-medium text-slate-500 dark:text-slate-400 mt-0.5">10:45 PM • Rewards</p>
</div>
<div class="text-right">
<span class="text-[16px] font-extrabold text-primary">+$1.25</span>
</div>
</div>
</div>
</div>
</main>
<!-- Premium Bottom Navigation -->
<nav class="fixed bottom-0 left-0 right-0 max-w-md mx-auto h-20 bg-white/90 dark:bg-background-dark/90 ios-blur border-t border-slate-200 dark:border-primary/10 flex items-center justify-around px-4">
<button class="flex flex-col items-center gap-1 group">
<span class="material-icons-round text-slate-400 dark:text-slate-500 group-hover:text-primary transition-colors">grid_view</span>
<span class="text-[10px] font-bold text-slate-400 dark:text-slate-500 group-hover:text-primary uppercase tracking-wider">Home</span>
</button>
<button class="flex flex-col items-center gap-1 group">
<span class="material-icons-round text-primary shadow-primary/40">history</span>
<span class="text-[10px] font-bold text-primary uppercase tracking-wider">Activity</span>
</button>
<div class="relative -top-6">
<button class="w-14 h-14 rounded-full bg-primary text-background-dark flex items-center justify-center shadow-xl shadow-primary/30 border-4 border-white dark:border-background-dark">
<span class="material-icons-round text-3xl">add</span>
</button>
</div>
<button class="flex flex-col items-center gap-1 group">
<span class="material-icons-round text-slate-400 dark:text-slate-500 group-hover:text-primary transition-colors">credit_card</span>
<span class="text-[10px] font-bold text-slate-400 dark:text-slate-500 group-hover:text-primary uppercase tracking-wider">Cards</span>
</button>
<button class="flex flex-col items-center gap-1 group">
<span class="material-icons-round text-slate-400 dark:text-slate-500 group-hover:text-primary transition-colors">person_outline</span>
<span class="text-[10px] font-bold text-slate-400 dark:text-slate-500 group-hover:text-primary uppercase tracking-wider">Profile</span>
</button>
</nav>
</div>
<!-- Floating Background Elements for Premium feel -->
<div class="fixed top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none overflow-hidden -z-10">
<div class="absolute top-[-10%] right-[-10%] w-[300px] h-[300px] bg-primary/5 rounded-full blur-[100px]"></div>
<div class="absolute bottom-[5%] left-[-20%] w-[400px] h-[400px] bg-primary/5 rounded-full blur-[120px]"></div>
</div>
</body></html>