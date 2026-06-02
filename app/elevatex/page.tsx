"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
	TrendingUp, Wallet, ArrowRight, Copy, CheckCircle2,
	Zap, Share2, Bell, Link as LinkIcon, Layers, Crown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DepositModal } from "@/components/dashboard/deposit-modal";
import { WithdrawModal } from "@/components/dashboard/withdraw-modal";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { NetworkTree } from "@/components/elevatex/NetworkTree";
import { ElevateXPageSkeleton } from "@/components/elevatex/skeletons";
import { Skeleton } from "@/components/ui/skeleton";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { KeyRound } from "lucide-react";

// Format currency
const formatCurrency = (amount: number) => {
	return new Intl.NumberFormat('en-US', {
		style: 'currency',
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
	const [showPinModal, setShowPinModal] = useState(false);
	const [pin, setPin] = useState("");
	const [rank, setRank] = useState<string>("Guest");

	// ElevateX specific data
	const [elevatexTransactions, setElevatexTransactions] = useState<any[]>([]);
	const [transactionsLoading, setTransactionsLoading] = useState(false);
	const [referralTree, setReferralTree] = useState<any[]>([]); // Dynamic tree data
	// User Details Modal Logic (Moved to Top)
	const [selectedNode, setSelectedNode] = useState<any>(null);

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
					if (data.user.rank) setRank(data.user.rank);
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
		if (pin.length !== 4) {
			toast({ title: "Validation Error", description: "Please enter your 4-digit transaction PIN", variant: "destructive" });
			return;
		}
		setActivating(true);
		try {
			const res = await fetch("/api/elevatex/activate", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ pin }),
			});
			const data = await res.json();
			if (data.success) {
				setSubscribed(true);
				setReferralCode(data.referralCode);
				await fetchWalletBalance();
				setShowPinModal(false);
				setPin("");
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
			<ElevateXPageSkeleton />
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
								<span className="text-lg font-black italic text-[#47f0d1] tracking-tighter uppercase">{rank}</span>
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
							onClick={() => setShowPinModal(true)}
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

						<div className="flex flex-col items-center overflow-x-auto pb-4 pt-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
							{/* Root Node (User) */}
							<div className="relative z-10 flex flex-col items-center">
								<div className="w-20 h-20 rounded-2xl bg-[#131321] border-4 border-[#47f0d1] p-1 relative shadow-[0_0_30px_rgba(71,240,209,0.2)] flex items-center justify-center mb-0 z-20">
									<span className="text-2xl font-bold text-white">You</span>
									<div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-[#47f0d1] text-[#131321] px-3 py-1 rounded-full text-[9px] font-black italic shadow-lg">CORE</div>
								</div>
							</div>

							{/* Recursive Tree */}
							<div className="w-full mt-0">
								<NetworkTree
									data={referralTree}
									onNodeClick={(node) => setSelectedNode(node)}
								/>
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
							<div className="space-y-3">
								{[1, 2, 3].map((i) => (
									<div key={i} className="flex items-center p-4 border border-white/10 rounded-2xl bg-white/5">
										<Skeleton className="w-10 h-10 rounded-xl bg-slate-800 shrink-0" />
										<div className="ml-3 flex-1 space-y-2">
											<Skeleton className="h-3 w-32 bg-slate-800" />
											<Skeleton className="h-2 w-20 bg-slate-800" />
										</div>
										<div className="ml-4 space-y-2 flex flex-col items-end">
											<Skeleton className="h-3 w-16 bg-slate-800" />
											<Skeleton className="h-2 w-12 bg-slate-800" />
										</div>
									</div>
								))}
							</div>
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

			{/* User Details Dialog */}
			<Dialog open={!!selectedNode} onOpenChange={(open) => !open && setSelectedNode(null)}>
				<DialogContent className="w-[90%] max-w-sm rounded-[2rem] bg-[#1a1a2e] border-white/10 p-6 text-white">
					<DialogHeader>
						<DialogTitle className="text-center text-lg font-bold">Member Details</DialogTitle>
					</DialogHeader>

					{selectedNode && (
						<div className="flex flex-col items-center gap-6 py-4">
							<div className="relative">
								<div className="w-20 h-20 rounded-full bg-[#47f0d1]/10 border-2 border-[#47f0d1]/30 flex items-center justify-center text-2xl font-bold text-[#47f0d1]">
									{selectedNode.user?.fullName?.charAt(0) || "U"}
								</div>
								<div className="absolute -bottom-2 -right-2 bg-[#47f0d1] text-[#131321] text-[10px] font-black px-2 py-0.5 rounded-md shadow-lg border border-[#131321]">
									L{selectedNode.level || '?'}
								</div>
							</div>

							<div className="text-center space-y-1">
								<h3 className="text-xl font-bold">{selectedNode.user?.fullName || "Unknown User"}</h3>
								<div className={cn(
									"inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
									selectedNode.status === 'active' ? "bg-[#47f0d1]/10 text-[#47f0d1]" : "bg-slate-500/10 text-slate-400"
								)}>
									<span className={cn("w-1.5 h-1.5 rounded-full", selectedNode.status === 'active' ? "bg-[#47f0d1]" : "bg-slate-400")}></span>
									{selectedNode.status || 'Inactive'}
								</div>
							</div>

							<div className="w-full space-y-3 bg-white/5 rounded-2xl p-4 border border-white/5">
								<div className="flex justify-between items-center py-2 border-b border-white/5 last:border-0">
									<span className="text-xs text-slate-400">Email Address</span>
									<span className="text-xs font-medium text-white">{selectedNode.user?.email || "Hidden"}</span>
								</div>
								<div className="flex justify-between items-center py-2 border-b border-white/5 last:border-0">
									<span className="text-xs text-slate-400">Date Joined</span>
									<span className="text-xs font-medium text-white">
										{selectedNode.createdAt ? new Date(selectedNode.createdAt).toLocaleDateString(undefined, {
											year: 'numeric',
											month: 'long',
											day: 'numeric'
										}) : "Unknown"}
									</span>
								</div>
							</div>
						</div>
					)}
				</DialogContent>
			</Dialog>

			{/* PIN Verification Dialog for Activation */}
			<Dialog open={showPinModal} onOpenChange={(open) => !open && setShowPinModal(false)}>
				<DialogContent className="w-[90%] max-w-sm rounded-[2rem] bg-[#1a1a2e] border-white/10 p-6 text-white">
					<DialogHeader>
						<DialogTitle className="text-center text-lg font-bold">Verify PIN</DialogTitle>
					</DialogHeader>
					<div className="flex flex-col items-center gap-6 py-4">
						<div className="w-16 h-16 bg-[#47f0d1]/10 rounded-full flex items-center justify-center">
							<KeyRound className="w-8 h-8 text-[#47f0d1]" />
						</div>
						<div className="text-center">
							<p className="text-sm text-slate-300">Enter your 4-digit transaction PIN to activate ElevateX membership.</p>
						</div>
						<div className="flex justify-center">
							<InputOTP
								maxLength={4}
								value={pin}
								onChange={(value) => setPin(value)}
							>
								<InputOTPGroup className="gap-3">
									{[0, 1, 2, 3].map((i) => (
										<InputOTPSlot
											key={i}
											index={i}
											className="w-12 h-12 text-xl font-bold border-2 border-white/10 rounded-xl bg-white/5 text-white data-[active=true]:border-[#47f0d1] data-[active=true]:ring-[#47f0d1]/20 transition-all text-center"
										/>
									))}
								</InputOTPGroup>
							</InputOTP>
						</div>
						<Button
							onClick={handleActivateElevatex}
							disabled={activating || pin.length !== 4}
							className="w-full bg-[#47f0d1] hover:bg-[#47f0d1]/90 text-[#131321] font-extrabold py-3 rounded-xl transition-all"
						>
							{activating ? "Activating..." : "Verify & Activate"}
						</Button>
					</div>
				</DialogContent>
			</Dialog>
		</div>
	);
}

