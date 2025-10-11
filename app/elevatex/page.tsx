"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DepositModal } from "@/components/dashboard/deposit-modal";
import { WithdrawModal } from "@/components/dashboard/withdraw-modal";
import { Users, TrendingUp, Zap, ArrowLeft } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";

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
	// Accepts yyyy-mm-dd or yyyy-mm-ddTHH:MM:SS
	const d = new Date(dateStr);
	const day = String(d.getDate()).padStart(2, "0");
	const month = String(d.getMonth() + 1).padStart(2, "0");
	const year = String(d.getFullYear()).slice(-2);
	return `${day}${month}${year}`;
}

export default function ElevatexPage() {
	const router = useRouter();
	// ...existing code...
	const [earningHistory, setEarningHistory] = useState<any[]>([]);
	const [earnings, setEarnings] = useState<number>(0);
	const [subscribed, setSubscribed] = useState(false);
	const [treeComplete, setTreeComplete] = useState(false);

	// Fetch earning history and earning balance
	useEffect(() => {
		if (subscribed) {
			fetch("/api/elevatex/earnings/history")
				.then((res) => res.json())
				.then((data) => {
					setEarningHistory(data.history || []);
				});
			fetch("/api/elevatex/earnings")
				.then((res) => res.json())
				.then((data) => {
					setEarnings(data.earnings ?? 0);
				});
		}
	}, [subscribed]);
	const [referralTree, setReferralTree] = useState<any[]>([]);
	const [referralsPerLevel, setReferralsPerLevel] = useState<number[]>([0, 0, 0, 0, 0]);
	const [progressPercent, setProgressPercent] = useState(0);


	// Fetch referral tree for progress bar
	useEffect(() => {
		if (subscribed) {
			fetch("/api/elevatex/referrals")
				.then((res) => res.json())
				.then((data) => {
					setReferralTree(data.referralTree || []);
					// Calculate referrals per level
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
					// Calculate progress percent based on total referrals
					let totalReferrals = perLevel.reduce((sum, n) => sum + n, 0);
					let percent = Math.min((totalReferrals / (5 * 5)) * 100, 100); // 5 levels, 5 per level
					setProgressPercent(percent);
				});
		}
	}, [subscribed]);
	const [showDeposit, setShowDeposit] = useState(false);
	const [showWithdraw, setShowWithdraw] = useState(false);
	// Mock user and tree data for UI demonstration

	// ...existing code...
	const [directReferrals, setDirectReferrals] = useState([
		{ name: "User 1", level: 1, spillover: false },
		{ name: "User 2", level: 1, spillover: false },
		{ name: "User 3", level: 1, spillover: true },
		{ name: "User 4", level: 1, spillover: false },
		{ name: "User 5", level: 1, spillover: false },
	]);

	const [balance, setBalance] = useState<number>(0);
	const [isLoading, setIsLoading] = useState(true);
	const [referralCode, setReferralCode] = useState<string>("");
	const [activating, setActivating] = useState(false);
	const referralLink = referralCode ? `https://eguy.app/signup?ref=${referralCode}` : "";
	const [copied, setCopied] = useState(false);
	const handleCopyReferral = () => {
		navigator.clipboard.writeText(referralLink);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};

	useEffect(() => {
		fetch("/api/wallet/balance")
			.then((res) => res.json())
			.then((data) => {
				if (typeof data.balance === "number") {
					setBalance(data.balance);
				}
			})
			.finally(() => setIsLoading(false));
		// Fetch referral code and activation status
		fetch("/api/user")
			.then((res) => res.json())
			.then((data) => {
				if (data.user) {
					setSubscribed(!!data.user.elevatexActivated);
					if (data.user.referralCode) setReferralCode(data.user.referralCode);
				}
			});
	}, []);

	const handleActivateElevatex = async () => {
		setActivating(true);
		const res = await fetch("/api/elevatex/activate", { method: "POST" });
		const data = await res.json();
		if (data.success) {
			setSubscribed(true);
			setReferralCode(data.referralCode);
			// Refresh balance after activation
			fetch("/api/wallet/balance")
				.then((res) => res.json())
				.then((data) => {
					if (typeof data.balance === "number") {
						setBalance(data.balance);
					}
				});
		} else {
			alert(data.error || "Activation failed");
		}
		setActivating(false);
	}

	if (isLoading) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center">
				<div className="space-y-4 w-full max-w-md">
					<Skeleton className="h-10 w-2/3 rounded-xl" />
					<Skeleton className="h-8 w-full rounded-xl" />
					<Skeleton className="h-8 w-full rounded-xl" />
					<Skeleton className="h-8 w-1/2 rounded-xl" />
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
			{/* Header */}
			<header className="sticky top-0 z-40 py-4 bg-white/80 backdrop-blur-sm border-b border-slate-200">
				<div className="container mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex items-center justify-between">
						<button
							onClick={() => router.back()}
							className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
						>
							<ArrowLeft className="w-5 h-5" />
							<span className="font-medium">Back</span>
						</button>
						<h1 className="text-xl font-bold text-slate-900">ElevateX</h1>
						<div className="w-20"></div>
					</div>
				</div>
			</header>

			{/* Main Content */}
			<main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24">
				{/* Wallet Card - Updated theme */}
				<Card className="bg-gradient-to-r from-blue-500 to-purple-600 border-none rounded-2xl p-6 mb-6 max-w-md mx-auto">
					<div className="flex flex-col gap-4">
						<div className="flex items-center justify-between">
							<span className="text-lg font-semibold text-white tracking-wide">Balance</span>
						</div>
						<div className="flex items-center justify-between">
							<div className="text-3xl md:text-4xl font-extrabold tracking-tight text-white">
								₦{balance.toLocaleString()}
							</div>
						</div>
						{subscribed && (
							<div className="bg-white/20 rounded-xl px-3 py-2">
								<div className="text-sm font-medium text-white/80 mb-1">ElevateX Earnings</div>
								<div className="text-xl font-bold text-white">₦{earnings.toLocaleString()}</div>
							</div>
						)}
						{!subscribed ? (
							<Button
								className="w-full mt-4 bg-white text-blue-600 hover:bg-slate-100 font-semibold"
								onClick={handleActivateElevatex}
								disabled={activating || balance < 1000}
							>
								{activating ? "Activating..." : "Activate ElevateX"}
							</Button>
						) : (
							<div className="grid grid-cols-2 gap-3 mt-4">
								<Button
									className="bg-white/20 hover:bg-white/30 text-white border border-white/30 rounded-xl py-3 font-semibold"
									onClick={() => setShowDeposit(true)}
								>
									<span>Add Funds</span>
								</Button>
								<Button
									className="bg-white/20 hover:bg-white/30 text-white border border-white/30 rounded-xl py-3 font-semibold"
									onClick={() => setShowWithdraw(true)}
								>
									<span>Withdraw</span>
								</Button>
							</div>
						)}
					</div>
					{/* Deposit Modal */}
					<DepositModal
						isOpen={showDeposit}
						onClose={() => setShowDeposit(false)}
						onSuccess={() => {
							setShowDeposit(false);
							// Refresh balance after deposit
							fetch("/api/wallet/balance")
								.then((res) => res.json())
								.then((data) => {
									if (typeof data.balance === "number") {
										setBalance(data.balance);
									}
								});
						}}
					/>
					{/* Withdraw Modal */}
					<WithdrawModal
						isOpen={showWithdraw}
						onClose={() => setShowWithdraw(false)}
						onSuccess={() => {
							setShowWithdraw(false);
							// Refresh balance after withdrawal
							fetch("/api/wallet/balance")
								.then((res) => res.json())
								.then((data) => {
									if (typeof data.balance === "number") {
										setBalance(data.balance);
									}
								});
						}}
					/>
				</Card>

				{/* Tree Levels - Single Horizontal Bar for All Levels */}
				<Card className="bg-white/80 backdrop-blur-sm border-slate-200 shadow-lg mb-6 max-w-md mx-auto">
					<CardHeader className="pb-3">
						<CardTitle className="flex items-center gap-2 text-slate-900">
							<Users className="w-5 h-5" />
							Referral Progress
						</CardTitle>
					</CardHeader>
					<CardContent className="pt-0">
						{/* Icons above each segment */}
						<div className="flex w-full justify-between mb-2 px-1">
							{[1, 2, 3, 4, 5].map((level) => {
								// Mock progress for each level
								const referralCount = [5, 10, 25, 50, 100][level - 1];
								const userCount = Math.min(referralCount, level === 1 ? directReferrals.length : referralCount);
								const iconColor = userCount === referralCount ? "text-green-600" : "text-gray-400";
								return (
									<div key={level} className="flex flex-col items-center w-1/5">
										<Users className={`h-6 w-6 ${iconColor}`} />
									</div>
								);
							})}
						</div>
						{/* Single horizontal progress bar divided into 5 segments */}
						{/* Progress bar with proportional logic */}
						<div className="w-full h-3 bg-slate-200 rounded-full flex overflow-hidden relative mb-2">
							{/* Filled bar proportional to total referrals */}
							<div className="absolute top-0 left-0 h-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full" style={{ width: `${progressPercent}%` }}></div>
							{/* Segments for each level */}
							{[1, 2, 3, 4, 5].map((level, idx) => (
								<div
									key={level}
									className="h-3"
									style={{ width: "20%", background: "transparent" }}
								></div>
							))}
						</div>
						{/* Points for referrals in incomplete levels */}
						<div className="w-full flex justify-between mt-1 px-1 mb-2">
							{[1, 2, 3, 4, 5].map((level, idx) => (
								<span key={level} className="w-1/5 flex justify-center">
									{referralsPerLevel[idx] > 0 && referralsPerLevel[idx] < 5 && (
										<span className="inline-block w-2 h-2 bg-yellow-400 rounded-full"></span>
									)}
								</span>
							))}
						</div>
						{/* Level names below each segment */}
						<div className="flex w-full justify-between px-1">
							{[1, 2, 3, 4, 5].map((level) => (
								<span key={level} className="text-xs font-semibold text-slate-600 w-1/5 text-center">Level {level}</span>
							))}
						</div>
					</CardContent>
				</Card>

				{/* Referral Link - single row with copy icon */}
				{subscribed && referralCode && (
					<Card className="bg-white/80 backdrop-blur-sm border-slate-200 shadow-lg mb-6 max-w-md mx-auto">
						<CardContent className="p-4">
							<div className="flex items-center gap-2">
								<span className="font-mono text-sm flex-1 bg-slate-50 px-3 py-2 rounded-lg">{referralLink}</span>
								<Button size="sm" variant="outline" onClick={handleCopyReferral} className="shrink-0">
									{copied ? "Copied!" : "Copy"}
								</Button>
							</div>
						</CardContent>
					</Card>
				)}

				{/* Earning History */}
				<Card className="bg-white/80 backdrop-blur-sm border-slate-200 shadow-lg max-w-md mx-auto">
					<CardHeader className="pb-3">
						<CardTitle className="flex items-center gap-2 text-slate-900">
							<TrendingUp className="w-5 h-5" />
							Earning History
						</CardTitle>
					</CardHeader>
					<CardContent className="pt-0">
						{earningHistory.length === 0 ? (
							<div className="text-center py-8 text-slate-500">
								<p>No earnings yet.</p>
							</div>
						) : (
							<div className="space-y-3">
								{earningHistory.map((tx: any, idx: number) => (
									<div key={idx} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
										{/* User icon: first letter of referred user's name */}
										<div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
											<span className="text-blue-700 font-bold text-lg">{tx.referredUserName?.charAt(0).toUpperCase() || "?"}</span>
										</div>
										<div className="flex-1 min-w-0">
											<div className="font-medium text-sm text-slate-900">{tx.referredUserName || "Unknown"}</div>
											<div className="text-xs text-slate-500">Level {tx.level}</div>
										</div>
										<div className="text-right">
											<div className="text-sm font-bold text-green-600">₦{tx.amount}</div>
											<div className="text-xs text-slate-400">
												{tx.date ? formatDDMMYY(tx.date) : tx.date}
											</div>
										</div>
									</div>
								))}
							</div>
						)}
					</CardContent>
				</Card>
			</main>
		</div>
	);
}
