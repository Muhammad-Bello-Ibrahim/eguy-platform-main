"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
	TrendingUp, Wallet, ArrowRight, Copy, CheckCircle2,
	Zap, Share2, Bell, Link as LinkIcon, Layers, Crown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { DepositModal } from "@/components/dashboard/deposit-modal";
import { WithdrawModal } from "@/components/dashboard/withdraw-modal";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

// Format currency
const formatCurrency = (amount: number) => {
	return new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: 'USD',
		// The design shows $, but logic might be NGN. Sticking to logic if it was NGN, 
		// but the design explicitly shows $. I will use NGN as per previous context 
		// or keep it generic. The design says $42,890.50. 
		// The previous code had NGN. I will stick to NGN for consistency with the rest of the app 
		// unless strictly forced. The Stitch design might be generic.
		// Let's stick to NGN but maybe use the styling.
		currency: 'NGN',
		minimumFractionDigits: 0,
		maximumFractionDigits: 0,
	}).format(amount);
};

export default function ElevatexPage() {
	const router = useRouter();
	const { toast } = useToast();
	const [balance, setBalance] = useState<number>(0);
	const [earnings, setEarnings] = useState<number>(0);
	const [isLoading, setIsLoading] = useState(true);
	const [subscribed, setSubscribed] = useState(false);
	const [referralCode, setReferralCode] = useState<string>("");
	const [activating, setActivating] = useState(false);
	const [showDeposit, setShowDeposit] = useState(false);
	const [showWithdraw, setShowWithdraw] = useState(false);

	// ElevateX specific data
	const [elevatexTransactions, setElevatexTransactions] = useState<any[]>([]);
	const [transactionsLoading, setTransactionsLoading] = useState(false);
	const [referralTree, setReferralTree] = useState<any[]>([]); // Dynamic tree data

	const referralLink = referralCode ? `${window.location.origin}/register?ref=${referralCode}` : "";
	const [copied, setCopied] = useState(false);

	const handleCopyReferral = () => {
		navigator.clipboard.writeText(referralCode || ""); // Copy code or link
		setCopied(true);
		toast({ title: "Copied!", description: "Referral code copied to clipboard" });
		setTimeout(() => setCopied(false), 2000);
	};

	const fetchWalletBalance = async () => {
		try {
			const res = await fetch("/api/wallet/balance");
			const data = await res.json();
			if (typeof data.balance === "number") {
				setBalance(data.balance);
			}
		} catch (error) {
			console.error("Failed to fetch balance", error);
		}
	};

	useEffect(() => {
		const init = async () => {
			await fetchWalletBalance();
			try {
				const res = await fetch("/api/user");
				const data = await res.json();
				if (data.user) {
					setSubscribed(!!data.user.elevatexActivated);
					if (data.user.referralCode) setReferralCode(data.user.referralCode);
				}
			} catch (error) {
				console.error("Failed to fetch user", error);
			} finally {
				setIsLoading(false);
			}
		};
		init();
	}, []);

	useEffect(() => {
		if (subscribed) {
			setTransactionsLoading(true);
			fetch("/api/elevatex/transactions")
				.then((res) => res.json())
				.then((data) => {
					setElevatexTransactions(data.transactions || []);
				})
				.finally(() => setTransactionsLoading(false));

			// Fetch referrals for tree
			fetch("/api/elevatex/referrals")
				.then((res) => res.json())
				.then((data) => {
					setReferralTree(data.referralTree || []);
				});
		}
	}, [subscribed]);

	// Calculate dynamic earnings
	useEffect(() => {
		if (elevatexTransactions.length > 0) {
			const totalEarnings = elevatexTransactions
				.filter((tx: any) => tx.type === 'earning' || tx.type === 'referral_bonus')
				.reduce((sum: number, tx: any) => sum + (tx.amount || 0), 0);
			setEarnings(totalEarnings);
		}
	}, [elevatexTransactions]);

	const handleActivateElevatex = async () => {
		setActivating(true);
		try {
			const res = await fetch("/api/elevatex/activate", { method: "POST" });
			const data = await res.json();
			if (data.success) {
				setSubscribed(true);
				setReferralCode(data.referralCode);
				await fetchWalletBalance();
				toast({ title: "Success!", description: "Welcome to ElevateX!" });
			} else {
				toast({ title: "Activation Failed", description: data.error || "Could not activate ElevateX", variant: "destructive" });
			}
		} catch (error) {
			toast({ title: "Error", description: "Something went wrong", variant: "destructive" });
		} finally {
			setActivating(false);
		}
	}

	if (isLoading) {
		return (
			<div className="min-h-screen bg-[#131321] flex items-center justify-center">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#47f0d1]"></div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-[#131321] text-slate-100 pb-24 font-sans selection:bg-[#47f0d1] selection:text-[#131321]">
			{/* Custom Header for ElevateX */}
			<header className="px-6 pt-14 pb-4 sticky top-0 z-40 bg-[#131321]/80 backdrop-blur-lg flex justify-between items-center border-b border-white/5">
				<div className="flex items-center gap-3">
					<div className="w-10 h-10 rounded-full border-2 border-[#47f0d1]/50 p-0.5">
						{/* Placeholder Avatar */}
						<div className="w-full h-full rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold">
							U
						</div>
					</div>
					<div>
						<h1 className="text-sm font-bold tracking-tight text-white">ElevateX</h1>
						<div className="flex items-center gap-1.5">
							<span className="w-1.5 h-1.5 rounded-full bg-[#47f0d1] animate-pulse"></span>
							<p className="text-[10px] text-[#47f0d1] font-bold uppercase tracking-widest">Network Live</p>
						</div>
					</div>
				</div>
				<div className="flex gap-2">
					<button className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors">
						<Share2 className="w-5 h-5 text-slate-300" />
					</button>
					<button className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors" onClick={() => router.push('/notifications')}>
						<Bell className="w-5 h-5 text-slate-300" />
					</button>
				</div>
			</header>

			<main className="px-5 pt-6 space-y-6">
				{/* Invite Code Section */}
				{subscribed && (
					<div className="bg-[#47f0d1]/10 border border-[#47f0d1]/20 rounded-2xl p-4 flex items-center justify-between">
						<div className="flex items-center gap-3">
							<div className="bg-[#47f0d1]/20 p-2 rounded-lg">
								<LinkIcon className="w-4 h-4 text-[#47f0d1]" />
							</div>
							<div>
								<p className="text-[10px] text-[#47f0d1]/70 uppercase font-bold tracking-wider">Invite Code</p>
								<p className="text-xs font-mono font-bold text-white">{referralCode || "generating..."}</p>
							</div>
						</div>
						<button
							onClick={handleCopyReferral}
							className="bg-[#47f0d1] text-[#131321] px-4 py-2 rounded-xl text-xs font-black uppercase tracking-tight flex items-center gap-2 active:scale-95 transition-transform hover:bg-[#34dcb9]"
						>
							{copied ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
							<span>{copied ? "Copied" : "Copy"}</span>
						</button>
					</div>
				)}

				{/* Wallet Card */}
				<section className="relative bg-gradient-to-br from-[#47f0d1]/20 to-transparent border border-[#47f0d1]/30 rounded-[2rem] p-6 overflow-hidden">
					<div className="absolute inset-0 shadow-[0_0_40px_rgba(71,240,209,0.1)] pointer-events-none"></div>
					<div className="flex justify-between items-start mb-6 relative z-10">
						<div>
							<p className="text-slate-400 text-xs font-medium uppercase tracking-widest mb-1">Wallet Balance</p>
							<div className="flex items-baseline gap-1">
								<h2 className="text-3xl font-bold tracking-tight text-white">{formatCurrency(balance)}</h2>
							</div>
						</div>
					</div>

					<div className="flex gap-3 mb-6 relative z-10">
						<button
							onClick={() => setShowWithdraw(true)}
							className="flex-1 bg-white text-[#131321] py-3 rounded-2xl font-bold text-sm shadow-xl active:scale-95 transition-all hover:bg-slate-100"
						>
							Withdraw
						</button>
						<button
							onClick={() => setShowDeposit(true)}
							className="flex-1 bg-[#47f0d1]/10 text-[#47f0d1] border border-[#47f0d1]/20 py-3 rounded-2xl font-bold text-sm active:scale-95 transition-all hover:bg-[#47f0d1]/20"
						>
							Fund
						</button>
					</div>

					<div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10 relative z-10">
						<div className="space-y-1">
							<p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Total Earnings</p>
							<p className="text-xl font-bold text-white">{formatCurrency(earnings)}</p>
						</div>
						<div className="space-y-1 text-right">
							<p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Growth Rank</p>
							<div className="flex items-center justify-end gap-2">
								<span className="text-lg font-black italic text-[#47f0d1] tracking-tighter uppercase">{subscribed ? "Member" : "Guest"}</span>
								{subscribed && <Zap className="w-4 h-4 text-[#47f0d1] fill-current" />}
							</div>
						</div>
					</div>
				</section>

				{/* Activation Call to Action (if not subscribed) */}
				{!subscribed && (
					<div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-2xl p-6 text-center">
						<div className="w-12 h-12 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
							<Crown className="w-6 h-6 text-yellow-500" />
						</div>
						<h3 className="text-lg font-bold text-white mb-2">Activate Membership</h3>
						<p className="text-sm text-slate-400 mb-4">Unlock earnings and premium features for ₦1,000.</p>
						<Button
							onClick={handleActivateElevatex}
							disabled={activating || balance < 1000}
							className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-bold"
						>
							{activating ? "Activating..." : "Join Now"}
						</Button>
					</div>
				)}

				{/* Network Hierarchy Visualization */}
				{subscribed && (
					<section className="relative pt-4">
						<div className="flex items-center justify-between mb-8 px-2">
							<h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Network View</h3>
							<span className="text-[10px] bg-white/10 px-2 py-0.5 rounded text-white/60">Live</span>
						</div>

						<div className="flex flex-col items-center">
							{/* Root Node (User) */}
							<div className="relative z-10">
								<div className="w-20 h-20 rounded-2xl bg-[#131321] border-4 border-[#47f0d1] p-1 relative shadow-[0_0_30px_rgba(71,240,209,0.2)] flex items-center justify-center">
									<span className="text-2xl font-bold text-white">You</span>
									<div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-[#47f0d1] text-[#131321] px-3 py-1 rounded-full text-[9px] font-black italic shadow-lg">CORE</div>
								</div>
								<div className="h-12 w-0.5 bg-[#47f0d1] mx-auto"></div>
							</div>

							{/* Direct Referrals (L1) */}
							<div className="w-full relative">
								<div className="absolute top-0 left-[15%] right-[15%] h-0.5 bg-[#47f0d1]/30"></div>

								<div className="flex justify-center gap-4 mt-0.5">
									{/* Map through first 3 referrals or show placeholders */}
									{(referralTree.length > 0 ? referralTree.slice(0, 3) : [1, 2, 3]).map((ref, idx) => (
										<div key={idx} className="flex flex-col items-center">
											<div className="h-6 w-0.5 bg-[#47f0d1]/30"></div>
											<div className={cn(
												"w-16 h-16 rounded-2xl bg-[#131321] border p-1 relative mb-2 flex items-center justify-center",
												referralTree[idx] ? "border-[#47f0d1]/40" : "border-white/10 dashed opacity-50"
											)}>
												<span className="text-xs text-slate-500">{referralTree[idx] ? "Ref" : "Empty"}</span>
												{referralTree[idx] && (
													<div className="absolute -top-2 -right-2 bg-slate-900 border border-white/20 w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-bold text-[#47f0d1]">L1</div>
												)}
											</div>
										</div>
									))}
								</div>
							</div>
						</div>
					</section>
				)}

				{/* Recent Activity Section */}
				<section className="space-y-4">
					<div className="flex justify-between items-center px-1">
						<h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Recent Activity</h3>
						<button className="text-[#47f0d1] text-[10px] font-bold uppercase">View All</button>
					</div>

					<div className="space-y-3">
						{transactionsLoading ? (
							<div className="text-center py-4 text-slate-500 text-xs">Loading activity...</div>
						) : elevatexTransactions.length === 0 ? (
							<div className="text-center py-8 border border-white/10 rounded-2xl bg-white/5">
								<p className="text-slate-400 text-sm">No recent activity</p>
							</div>
						) : (
							elevatexTransactions.slice(0, 5).map((tx, i) => (
								<div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center justify-between hover:bg-white/10 transition-colors">
									<div className="flex items-center gap-3">
										<div className={cn(
											"w-10 h-10 rounded-xl flex items-center justify-center",
											tx.type === 'earning' ? "bg-[#47f0d1]/10 text-[#47f0d1]" : "bg-white/5 text-slate-400"
										)}>
											{tx.type === 'earning' ? <Layers className="w-5 h-5" /> : <Wallet className="w-5 h-5" />}
										</div>
										<div>
											<p className="text-xs font-bold text-white">
												{tx.type === 'earning' ? 'Network Commission' :
													tx.type === 'referral_bonus' ? 'Referral Bonus' :
														tx.type === 'withdrawal' ? 'Wallet Withdrawal' : 'Transaction'}
											</p>
											<p className="text-[10px] text-slate-500 capitalize">{tx.status || 'Completed'}</p>
										</div>
									</div>
									<div className="text-right">
										<p className={cn(
											"text-sm font-bold",
											tx.type === 'earning' || tx.type === 'referral_bonus' ? "text-[#47f0d1]" : "text-white"
										)}>
											{(tx.type === 'earning' || tx.type === 'referral_bonus') ? '+' : '-'}
											{formatCurrency(tx.amount)}
										</p>
										<p className="text-[10px] text-slate-500">
											{tx.createdAt ? new Date(tx.createdAt).toLocaleDateString() : 'Recent'}
										</p>
									</div>
								</div>
							))
						)}
					</div>
				</section>
			</main>

			<DepositModal
				isOpen={showDeposit}
				onClose={() => setShowDeposit(false)}
				onSuccess={() => {
					setShowDeposit(false);
					fetchWalletBalance();
					toast({ title: "Deposit Successful", description: "Your wallet has been funded." });
				}}
			/>
			<WithdrawModal
				isOpen={showWithdraw}
				onClose={() => setShowWithdraw(false)}
				onSuccess={() => {
					setShowWithdraw(false);
					fetchWalletBalance();
					toast({ title: "Withdrawal Successful", description: "Funds have been processed." });
				}}
			/>
		</div>
	);
}

