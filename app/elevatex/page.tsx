"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DepositModal } from "@/components/dashboard/deposit-modal";
import { WithdrawModal } from "@/components/dashboard/withdraw-modal";
import { Users, TrendingUp, Zap } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

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
			<div className="min-h-screen flex items-center justify-center">
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
			<div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex flex-col items-center p-4 pb-24">
			{/* Top Section: Home & Time */}

			{/* Wallet Card - Green theme, Material style */}
			<div className="w-full max-w-md mx-auto bg-green-600 rounded-3xl p-6 mb-4 flex flex-col gap-2 relative">
				<div className="flex items-center gap-2">
					<span className="text-lg font-bold text-white">Balance</span>
				</div>
				<div className="flex items-center justify-between mt-2">
					<div className="flex items-center gap-6 justify-between">
						<span className="text-3xl font-extrabold text-white tracking-wide">
							{isLoading ? <span className="animate-pulse text-green-100">Loading...</span> : `₦${balance.toLocaleString()}`}
						</span>
						{subscribed && (
							<div className="flex flex-col items-center bg-yellow-900/20 px-2 py-1 rounded-xl">
								<span className="text-xs font-semibold text-white muted mb-0.5">Earnings</span>
								<span className="text-sm font-bold text-white ">₦{earnings.toLocaleString()}</span>
							</div>
						)}
					</div>

				</div>
				{!subscribed ? (
					<Button
						className="w-full mt-4 bg-white text-green-700 font-semibold"
						onClick={handleActivateElevatex}
						disabled={activating || balance < 1000}
					>
						{activating ? "Activating..." : "Activate ElevateX"}
					</Button>
				) : (
					<div className="grid grid-cols-2 gap-2 mt-4">
						<Button
							className="w-full p-3 rounded-xl bg-white text-green-700 font-semibold border border-green-200 hover:bg-green-800 hover:text-white transition text-base flex items-center justify-center gap-2"
							onClick={() => setShowDeposit(true)}
						>
							<span className="text-sm md:text-base">Add Funds</span>
						</Button>
						<Button
							className="w-full py-3 rounded-xl text-green-700 bg-white font-semibold border border-green-200 hover:bg-green-800 hover:text-white transition text-base flex items-center justify-center gap-2"
							onClick={() => setShowWithdraw(true)}
						>
							<span className="text-sm md:text-base">Withdraw</span>
						</Button>
					</div>
				)}
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
			</div>

			{/* Tree Levels - Single Horizontal Bar for All Levels */}
			<div className="w-full max-w-md mx-auto mb-6 flex flex-col items-center">
				{/* Icons above each segment */}
				<div className="flex w-full justify-between mb-1 px-1">
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
				<div className="w-full h-2 bg-gray-200 rounded-full flex overflow-hidden relative">
					{/* Filled bar proportional to total referrals */}
					<div className="absolute top-0 left-0 h-2 bg-green-600 rounded-full" style={{ width: `${progressPercent}%` }}></div>
					{/* Segments for each level */}
					{[1, 2, 3, 4, 5].map((level, idx) => (
						<div
							key={level}
							className="h-2"
							style={{ width: "20%", background: "transparent" }}
						></div>
					))}
				</div>
				{/* Points for referrals in incomplete levels */}
				<div className="w-full flex justify-between mt-1 px-1">
					{[1, 2, 3, 4, 5].map((level, idx) => (
						<span key={level} className="w-1/5 flex justify-center">
							{referralsPerLevel[idx] > 0 && referralsPerLevel[idx] < 5 && (
								<span className="inline-block w-2 h-2 bg-yellow-400 rounded-full"></span>
							)}
						</span>
					))}
				</div>
				{/* Level names below each segment */}
				<div className="flex w-full justify-between mt-1 px-1">
					{[1, 2, 3, 4, 5].map((level) => (
						<span key={level} className="text-xs font-semibold text-muted-foreground w-1/5 text-center">Level {level}</span>
					))}
				</div>
			</div>

			{/* Referral Link - single row with copy icon */}
			{subscribed && referralCode && (
				<div className="w-full max-w-md mx-auto mb-6 flex items-center gap-2 bg-white rounded-xl px-4 py-3 shadow">
					<span className="font-mono text-xs flex-1">{referralLink}</span>
					<Button size="sm" variant="outline" onClick={handleCopyReferral}>
						{copied ? "Copied!" : "Copy"}
					</Button>
				</div>
			)}

			{/* Earning History */}
			<div className="w-full max-w-md mx-auto mt-6 rounded-2xl p-0 mb-6">
				<div className="flex items-center justify-between px-2 pt-2 pb-1">
					<span className="text-base font-semibold text-muted-foreground mt-2">Earning History</span>
					<span className="text-xs text-muted-foreground">Recent</span>
				</div>
				<ul className="divide-y divide-gray-200">
					{earningHistory.length === 0 ? (
						<li className="px-2 py-3 text-xs text-gray-400">No earnings yet.</li>
					) : earningHistory.map((tx: any, idx: number) => (
						<li key={idx} className="flex items-center px-2 py-3 gap-2">
							{/* User icon: first letter of referred user's name */}
							<div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-2">
								<span className="text-green-700 font-bold text-lg">{tx.referredUserName?.charAt(0).toUpperCase() || "?"}</span>
							</div>
							<div className="flex-1">
								<div className="font-medium text-sm">{tx.referredUserName || "Unknown"}</div>
								<div className="text-xs text-gray-500">Level {tx.level}, email: {tx.referredUserEmail || "Unknown"}</div>
							</div>
							<div className="text-xs text-green-700 font-bold">₦{tx.amount}</div>
							<div className="text-xs text-gray-400 ml-2">{tx.time}</div>
							<div className="flex flex-col items-end ml-2">
								<span className="text-xs text-gray-500">
									{tx.time ? format12Hour(tx.time) : "--:--"}
								</span>
								<span className="text-xs text-gray-400">
									{tx.date ? formatDDMMYY(tx.date) : tx.date}
								</span>
							</div>
						</li>
					))}
				</ul>
			</div>
		</div>
	);
}
