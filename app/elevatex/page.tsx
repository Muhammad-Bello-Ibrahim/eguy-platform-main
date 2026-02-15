"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
	TrendingUp, Users, Zap, Wallet, ArrowRight, Copy, CheckCircle2,
	AlertCircle, ArrowUpRight, ArrowDownLeft, Layers, Crown, Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DepositModal } from "@/components/dashboard/deposit-modal";
import { WithdrawModal } from "@/components/dashboard/withdraw-modal";
import { useToast } from "@/components/ui/use-toast";
import { Progress } from "@/components/ui/progress";

// Format time to 12-hour
function format12Hour(timeStr: string) {
	const [hour, minute] = timeStr.split(":");
	let h = parseInt(hour, 10);
	const ampm = h >= 12 ? "PM" : "AM";
	h = h % 12;
	if (h === 0) h = 12;
	return `${h}:${minute} ${ampm}`;
}

// Format date to ddmmyy
function formatDDMMYY(dateStr: string) {
	const d = new Date(dateStr);
	const day = String(d.getDate()).padStart(2, "0");
	const month = String(d.getMonth() + 1).padStart(2, "0");
	const year = String(d.getFullYear()).slice(-2);
	return `${day}/${month}/${year}`;
}

const formatCurrency = (amount: number) => {
	return new Intl.NumberFormat('en-NG', {
		style: 'currency',
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
	const [referralTree, setReferralTree] = useState<any[]>([]);
	const [referralsPerLevel, setReferralsPerLevel] = useState<number[]>([0, 0, 0, 0, 0]);
	const [progressPercent, setProgressPercent] = useState(0);

	const referralLink = referralCode ? `${window.location.origin}/register?ref=${referralCode}` : "";
	const [copied, setCopied] = useState(false);

	const handleCopyReferral = () => {
		navigator.clipboard.writeText(referralLink);
		setCopied(true);
		toast({ title: "Copied!", description: "Referral link copied to clipboard" });
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
			// Fetch user status
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

	// Fetch ElevateX data when subscribed
	useEffect(() => {
		if (subscribed) {
			// Transactions
			setTransactionsLoading(true);
			fetch("/api/elevatex/transactions")
				.then((res) => res.json())
				.then((data) => {
					setElevatexTransactions(data.transactions || []);
				})
				.catch((error) => console.error("Failed to fetch ElevateX transactions:", error))
				.finally(() => setTransactionsLoading(false));

			// Referrals
			fetch("/api/elevatex/referrals")
				.then((res) => res.json())
				.then((data) => {
					setReferralTree(data.referralTree || []);
					let perLevel = [0, 0, 0, 0, 0];
					let current = data.referralTree;
					for (let i = 0; i < 5; i++) {
						if (Array.isArray(current) && current.length > 0) {
							perLevel[i] = current.length;
							current = current[0].children;
						} else {
							break;
						}
					}
					setReferralsPerLevel(perLevel);
					let totalReferrals = perLevel.reduce((sum, n) => sum + n, 0);
					let percent = Math.min((totalReferrals / (5 * 5)) * 100, 100);
					setProgressPercent(percent);
				})
				.catch((error) => console.error("Failed to fetch referrals:", error));
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
			<div className="min-h-screen bg-slate-50 flex items-center justify-center">
				<div className="flex flex-col items-center gap-4">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
					<p className="text-slate-500 font-medium">Loading ElevateX...</p>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-slate-50/50 pb-20">
			{/* Hero Section */}
			<div className="bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-800 text-white pb-32 pt-12 px-4 relative overflow-hidden">
				<div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
					<div className="absolute top-10 left-10 w-64 h-64 bg-purple-500 rounded-full blur-3xl"></div>
					<div className="absolute bottom-10 right-10 w-96 h-96 bg-indigo-500 rounded-full blur-3xl"></div>
				</div>

				<div className="container max-w-5xl mx-auto relative z-10">
					<div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
						<div>
							<div className="flex items-center gap-2 mb-2">
								<Badge className="bg-white/10 hover:bg-white/20 text-white border-0 backdrop-blur-md">
									<Sparkles className="w-3 h-3 mr-1 text-yellow-400" /> 2026 Edition
								</Badge>
							</div>
							<h1 className="text-3xl md:text-5xl font-bold mb-2 tracking-tight">
								Elevate<span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">X</span>
							</h1>
							<p className="text-indigo-200 text-lg max-w-lg">
								Unlock exponential growth with our advanced referral system. Join the elite network today.
							</p>
						</div>

						{subscribed && (
							<div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-4 flex items-center gap-4 min-w-[200px]">
								<div className="p-3 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl shadow-lg">
									<Crown className="w-6 h-6 text-white" />
								</div>
								<div>
									<p className="text-xs text-indigo-200 uppercase tracking-wider font-medium">Current Status</p>
									<p className="text-xl font-bold">Active Member</p>
								</div>
							</div>
						)}
					</div>
				</div>
			</div>

			<div className="container max-w-5xl mx-auto px-4 -mt-24 relative z-20 space-y-6">

				{/* Main Action Card */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
				>
					<Card className="border-0 shadow-xl overflow-hidden bg-white">
						<CardContent className="p-0">
							<div className="grid md:grid-cols-2">
								<div className="p-8 bg-gradient-to-br from-indigo-50 to-white">
									<div className="flex items-center gap-3 mb-6">
										<div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
											<Wallet className="w-5 h-5" />
										</div>
										<div>
											<p className="text-sm font-medium text-slate-500">Wallet Balance</p>
											<h3 className="text-2xl font-bold text-slate-900">{formatCurrency(balance)}</h3>
										</div>
									</div>

									<div className="space-y-3">
										<Button
											className="w-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-200"
											onClick={() => setShowDeposit(true)}
											size="lg"
										>
											<ArrowDownLeft className="w-4 h-4 mr-2" /> Add Funds
										</Button>
										<Button
											variant="outline"
											className="w-full border-indigo-200 text-indigo-700 hover:bg-indigo-50"
											onClick={() => setShowWithdraw(true)}
											size="lg"
										>
											<ArrowUpRight className="w-4 h-4 mr-2" /> Withdraw
										</Button>
									</div>
								</div>

								<div className="p-8 bg-slate-50 border-t md:border-t-0 md:border-l border-slate-100 flex flex-col justify-center">
									{!subscribed ? (
										<div className="text-center">
											<div className="mx-auto w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
												<Zap className="w-8 h-8 text-yellow-600" />
											</div>
											<h3 className="text-xl font-bold text-slate-900 mb-2">Activate Membership</h3>
											<p className="text-slate-500 mb-6 text-sm">
												Start earning referral bonuses and unlock premium features for just ₦1,000.
											</p>
											<Button
												onClick={handleActivateElevatex}
												disabled={activating || balance < 1000}
												className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white border-0"
												size="lg"
											>
												{activating ? "Activating..." : "Join ElevateX Now"}
											</Button>
											{balance < 1000 && (
												<p className="text-xs text-red-500 mt-2 flex items-center justify-center">
													<AlertCircle className="w-3 h-3 mr-1" /> Insufficient balance
												</p>
											)}
										</div>
									) : (
										<div>
											<div className="flex items-center gap-3 mb-6">
												<div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
													<TrendingUp className="w-5 h-5" />
												</div>
												<div>
													<p className="text-sm font-medium text-slate-500">Total Earnings</p>
													<h3 className="text-2xl font-bold text-slate-900">{formatCurrency(earnings)}</h3>
												</div>
											</div>
											<div className="bg-white rounded-xl p-4 border border-slate-200">
												<div className="flex items-center justify-between mb-2">
													<span className="text-sm font-medium text-slate-600">Referral Link</span>
													<Button variant="ghost" size="icon" className="h-6 w-6" onClick={handleCopyReferral}>
														{copied ? <CheckCircle2 className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4 text-slate-400" />}
													</Button>
												</div>
												<div className="bg-slate-50 p-2 rounded-lg border border-slate-100 truncate text-xs font-mono text-slate-500">
													{referralLink || "Loading..."}
												</div>
											</div>
										</div>
									)}
								</div>
							</div>
						</CardContent>
					</Card>
				</motion.div>

				{subscribed && (
					<>
						<div className="grid md:grid-cols-2 gap-6">
							{/* Network Progress */}
							<motion.div
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.5, delay: 0.1 }}
							>
								<Card className="h-full border-slate-100 shadow-lg">
									<CardHeader>
										<CardTitle className="flex items-center gap-2">
											<Layers className="w-5 h-5 text-indigo-600" /> Network Progress
										</CardTitle>
										<CardDescription>Your 5-level referral tree status</CardDescription>
									</CardHeader>
									<CardContent>
										<div className="mb-6">
											<div className="flex justify-between items-end mb-2">
												<span className="text-3xl font-bold text-indigo-600">{Math.round(progressPercent)}%</span>
												<span className="text-sm text-slate-500 font-medium">{referralsPerLevel.reduce((a, b) => a + b, 0)} / 25 Total Members</span>
											</div>
											<Progress value={progressPercent} className="h-3 bg-indigo-100" />
										</div>

										<div className="space-y-4">
											{[1, 2, 3, 4, 5].map((level, idx) => (
												<div key={level} className="flex items-center justify-between group">
													<div className="flex items-center gap-3">
														<div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${referralsPerLevel[idx] > 0 ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
															L{level}
														</div>
														<div className="flex flex-col">
															<span className="text-sm font-medium text-slate-700">Level {level}</span>
															<span className="text-xs text-slate-400">Target: 5 Members</span>
														</div>
													</div>
													<Badge variant="outline" className={`${referralsPerLevel[idx] === 5 ? 'bg-green-50 text-green-700 border-green-200' : 'bg-slate-50 text-slate-600 border-slate-200'}`}>
														{referralsPerLevel[idx]}/5
													</Badge>
												</div>
											))}
										</div>
									</CardContent>
								</Card>
							</motion.div>

							{/* Recent Transactions */}
							<motion.div
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.5, delay: 0.2 }}
							>
								<Card className="h-full border-slate-100 shadow-lg">
									<CardHeader>
										<CardTitle className="flex items-center gap-2">
											<Zap className="w-5 h-5 text-yellow-500" /> Recent Activity
										</CardTitle>
										<CardDescription>Latest earnings and withdrawals</CardDescription>
									</CardHeader>
									<CardContent>
										{transactionsLoading ? (
											<div className="flex justify-center py-8">
												<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-300"></div>
											</div>
										) : elevatexTransactions.length === 0 ? (
											<div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-200">
												<p className="text-slate-500 text-sm">No transactions yet</p>
											</div>
										) : (
											<div className="space-y-4">
												{elevatexTransactions.slice(0, 5).map((tx: any, i: number) => (
													<div key={i} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors border border-slate-100">
														<div className="flex items-center gap-3">
															<div className={`w-10 h-10 rounded-full flex items-center justify-center ${tx.type === 'earning' || tx.type === 'referral_bonus' ? 'bg-green-100 text-green-600' :
																tx.type === 'activation' ? 'bg-blue-100 text-blue-600' : 'bg-orange-100 text-orange-600'
																}`}>
																{tx.type === 'earning' || tx.type === 'referral_bonus' ? <TrendingUp className="w-5 h-5" /> :
																	tx.type === 'activation' ? <Zap className="w-5 h-5" /> : <ArrowRight className="w-5 h-5" />}
															</div>
															<div>
																<p className="text-sm font-semibold text-slate-800">
																	{tx.type === 'earning' ? 'Commission' :
																		tx.type === 'referral_bonus' ? 'Referral Bonus' :
																			tx.type.charAt(0).toUpperCase() + tx.type.slice(1)}
																</p>
																<p className="text-xs text-slate-500">{tx.createdAt ? formatDDMMYY(tx.createdAt) : tx.date}</p>
															</div>
														</div>
														<span className={`font-bold text-sm ${tx.type === 'earning' || tx.type === 'referral_bonus' ? 'text-green-600' : 'text-slate-600'
															}`}>
															{tx.type === 'earning' || tx.type === 'referral_bonus' ? '+' : '-'} {formatCurrency(Math.abs(tx.amount))}
														</span>
													</div>
												))}
												{elevatexTransactions.length > 5 && (
													<Button variant="ghost" className="w-full text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50" size="sm">
														View All History
													</Button>
												)}
											</div>
										)}
									</CardContent>
								</Card>
							</motion.div>
						</div>
					</>
				)}
			</div>

			{/* Modals */}
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
