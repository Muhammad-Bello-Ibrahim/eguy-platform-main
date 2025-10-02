"use client";
import { useState, useEffect } from "react";
import { WalletCard } from "@/components/dashboard/wallet-card";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { TransactionHistory } from "@/components/dashboard/transaction-history";
import { DepositModal } from "@/components/dashboard/deposit-modal";
import { WithdrawModal } from "@/components/dashboard/withdraw-modal";
import { AirtimeModal } from "@/components/payments/airtime-modal";
import { DataModal } from "@/components/payments/data-modal";
import { BillsModal } from "@/components/payments/bills-modal";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
	ProfileIcon,
	EyeOffIcon,
	AddMoneyIcon,
	AirtimeIcon,
	DataIcon,
	ElectricityIcon,
	ExamPinIcon,
	ReferEarnIcon
} from "@/components/ui/material-dashboard-icons";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
		// Draggable WhatsApp icon state
		const [waPos, setWaPos] = useState({ x: 32, y: 32 });
		const [dragging, setDragging] = useState(false);
		const [offset, setOffset] = useState({ x: 0, y: 0 });
		const [previewPos, setPreviewPos] = useState<{ x: number; y: number } | null>(null);
			const router = useRouter();
			// Role-based redirect
			useEffect(() => {
				if (typeof window !== "undefined") {
					// Try to get user from sessionStorage, fallback to /api/user if not present
					let user = null;
					try {
						user = JSON.parse(window.sessionStorage.getItem("user") || "null");
					} catch {}
					if (!user) {
						fetch("/api/user")
							.then((res) => res.json())
							.then((data) => {
								if (data.user) {
									window.sessionStorage.setItem("user", JSON.stringify(data.user));
									if (data.user.role === "admin" && window.location.pathname !== "/admin") {
										router.replace("/admin");
									}
								}
							});
					} else if (user.role === "admin" && window.location.pathname !== "/admin") {
						router.replace("/admin");
					}
				}
			}, [router]);

		const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
			setDragging(true);
			setOffset({
				x: e.clientX - waPos.x,
				y: e.clientY - waPos.y,
			});
			setPreviewPos({ x: waPos.x, y: waPos.y });
		};
		const handleMouseUp = (e?: MouseEvent) => {
			setDragging(false);
			if (e && previewPos) {
				setWaPos(previewPos);
				setPreviewPos(null);
			}
		};
		const handleMouseMove = (e: MouseEvent) => {
			if (dragging) {
				const previewX = e.clientX - offset.x;
				const previewY = window.innerHeight - e.clientY - 28;
				setPreviewPos({ x: previewX, y: previewY });
			}
		};

		useEffect(() => {
			if (dragging) {
				const mouseUpHandler = (e: MouseEvent) => handleMouseUp(e);
				document.addEventListener("mousemove", handleMouseMove);
				document.addEventListener("mouseup", mouseUpHandler);
				return () => {
					document.removeEventListener("mousemove", handleMouseMove);
					document.removeEventListener("mouseup", mouseUpHandler);
				};
			}
		}, [dragging, offset, previewPos]);

	const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
	const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
	const [isAirtimeModalOpen, setIsAirtimeModalOpen] = useState(false);
	const [isDataModalOpen, setIsDataModalOpen] = useState(false);
	const [isBillsModalOpen, setIsBillsModalOpen] = useState(false);
	const [refreshKey, setRefreshKey] = useState(0);
	const [receiptOpen, setReceiptOpen] = useState(false);
	const [selectedTx, setSelectedTx] = useState(null);
	const [verifyingDeposit, setVerifyingDeposit] = useState(false);
	const handleTransactionSuccess = () => {
		setRefreshKey((prev) => prev + 1);
	};
	const handleWithdrawSuccess = () => {
		setRefreshKey((prev) => prev + 1);
	};

	// Paystack verification logic
	useEffect(() => {
		const params = new URLSearchParams(window.location.search);
		const reference = params.get("reference") || params.get("trxref");
		if (reference && !verifyingDeposit) {
			setVerifyingDeposit(true);
			// Get userId from session API
			fetch("/api/user")
				.then((res) => res.json())
				.then((data) => {
					if (data.user && data.user.id) {
						fetch("/api/wallet/deposit/verify", {
							method: "POST",
							headers: { "Content-Type": "application/json" },
							body: JSON.stringify({ reference, userId: data.user.id }),
						})
							.then((res) => res.json())
							.then(() => {
								setRefreshKey((prev) => prev + 1);
								// Remove reference from URL
								const url = new URL(window.location.href);
								url.searchParams.delete("reference");
								url.searchParams.delete("trxref");
								window.history.replaceState({}, document.title, url.pathname);
							})
							.finally(() => setVerifyingDeposit(false));
					}
				});
		}
	}, [verifyingDeposit]);

	const [firstName, setFirstName] = useState<string>("");
	useEffect(() => {
		fetch("/api/user")
			.then((res) => res.json())
			.then((data) => {
				if (data.user && data.user.username) {
					const username = data.user.username.trim();
					const nameParts = username.split(" ");
					setFirstName(nameParts.length > 0 && nameParts[0] ? nameParts[0] : username);
				}
			});
	}, []);

	return (
		<div className="dashboard-root min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex flex-col items-center p-4 pb-24" style={{ position: 'relative' }}>
			{/* Draggable Floating WhatsApp Support Icon */}
			<div
				style={{
					position: "fixed",
					left: dragging && previewPos ? previewPos.x : waPos.x,
					bottom: dragging && previewPos ? previewPos.y : waPos.y,
					zIndex: 1000,
					background: "#25D366",
					borderRadius: "50%",
					width: "56px",
					height: "56px",
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
					cursor: dragging ? "grabbing" : "grab",
					userSelect: "none",
				}}
				onMouseDown={handleMouseDown}
				aria-label="Contact Support on WhatsApp"
			>
				<a
					href="https://wa.me/+2347011911909"
					target="_blank"
					rel="noopener noreferrer"
					title="Chat with support on WhatsApp"
					style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "100%", height: "100%" }}
				>
					<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
						<circle cx="16" cy="16" r="16" fill="#25D366" />
						<path d="M22.5 9.5C21.1 8.1 19.2 7.3 17.2 7.3C12.7 7.3 9 11 9 15.5C9 16.7 9.3 17.9 9.8 19L8.5 23.5L13.1 22.2C14.1 22.7 15.2 23 16.4 23C20.9 23 24.6 19.3 24.6 14.8C24.6 12.8 23.9 10.9 22.5 9.5ZM16.4 21.5C15.4 21.5 14.4 21.2 13.5 20.7L13.2 20.5L10.7 21.2L11.4 18.7L11.2 18.4C10.7 17.5 10.4 16.5 10.4 15.5C10.4 12.1 13.2 9.3 16.6 9.3C18.3 9.3 19.9 10 21.1 11.2C22.3 12.4 23 14 23 15.7C23 19.1 20.2 21.9 16.8 21.9C16.7 21.9 16.5 21.9 16.4 21.9V21.5ZM19.2 17.2C19.1 17.1 18.2 16.7 18.1 16.6C18 16.5 17.9 16.5 17.8 16.5C17.7 16.5 17.6 16.5 17.5 16.6C17.4 16.7 17.1 17.1 17 17.2C16.9 17.3 16.8 17.3 16.7 17.3C16.6 17.3 16.5 17.3 16.4 17.3C15.7 17.3 14.8 16.7 14.3 16.2C13.8 15.7 13.2 14.8 13.2 14.1C13.2 14 13.2 13.9 13.3 13.8C13.4 13.7 13.5 13.6 13.6 13.5C13.7 13.4 13.8 13.3 13.9 13.2C14 13.1 14.1 13 14.2 13C14.3 13 14.4 13 14.5 13C14.6 13 14.7 13 14.8 13.1C14.9 13.2 15.2 13.6 15.3 13.7C15.4 13.8 15.5 13.9 15.6 14C15.7 14.1 15.8 14.2 15.9 14.3C16 14.4 16.1 14.5 16.2 14.6C16.3 14.7 16.4 14.8 16.5 14.9C16.6 15 16.7 15.1 16.8 15.2C16.9 15.3 17 15.4 17.1 15.5C17.2 15.6 17.3 15.7 17.4 15.8C17.5 15.9 17.6 16 17.7 16.1C17.8 16.2 17.9 16.3 18 16.4C18.1 16.5 18.2 16.6 18.3 16.7C18.4 16.8 18.5 16.9 18.6 17C18.7 17.1 18.8 17.2 18.9 17.3C19 17.4 19.1 17.5 19.2 17.6C19.3 17.7 19.4 17.8 19.5 17.9C19.6 18 19.7 18.1 19.8 18.2C19.9 18.3 20 18.4 20.1 18.5C20.2 18.6 20.3 18.7 20.4 18.8C20.5 18.9 20.6 19 20.7 19.1C20.8 19.2 20.9 19.3 21 19.4C21.1 19.5 21.2 19.6 21.3 19.7C21.4 19.8 21.5 19.9 21.6 20C21.7 20.1 21.8 20.2 21.9 20.3C22 20.4 22.1 20.5 22.2 20.6C22.3 20.7 22.4 20.8 22.5 20.9C22.6 21 22.7 21.1 22.8 21.2C22.9 21.3 23 21.4 23.1 21.5C23.2 21.6 23.3 21.7 23.4 21.8C23.5 21.9 23.6 22 23.7 22.1C23.8 22.2 23.9 22.3 24 22.4C24.1 22.5 24.2 22.6 24.3 22.7C24.4 22.8 24.5 22.9 24.6 23" fill="#fff"/>
					</svg>
				</a>
			</div>
			{/* Top Section: Home & Time (greeting removed) */}
			{/* Wallet Card - Real balance */}
			<div className="w-full max-w-md mx-auto mb-4">
				<WalletCard
					onDeposit={() => setIsDepositModalOpen(true)}
					onWithdraw={() => {}}
					onTransfer={() => {}}
					key={refreshKey}
				/>
			</div>
			<div className="grid grid-cols-2 gap-2 mb-10 w-full max-w-md mx-auto">
				<Button
					className="w-full p-3 rounded-xl bg-green-600 text-white font-semibold hover:bg-green-800 transition text-base flex items-center justify-center gap-2"
					onClick={() => setIsDepositModalOpen(true)}
				>
					<AddMoneyIcon size={22} />
					<span className="text-sm md:text-base">Add Money</span>
				</Button>
				<Button
					className="w-full py-3 rounded-xl text-green-700 bg-white font-semibold border border-green-200 hover:bg-green-800 transition text-base flex items-center justify-center gap-2"
					onClick={() => setIsWithdrawModalOpen(true)}
				>
					<span className="text-sm md:text-base">Transfer</span>
				</Button>
			</div>
			{/* Quick Actions - flat grid, icon and label only, no shadow/box */}
			<div className="w-full max-w-md mx-auto mb-6 h-full">
				<div className="grid grid-cols-3 gap-y-8 gap-x-2 text-center">
					<div className="flex flex-col items-center cursor-pointer" onClick={() => setIsAirtimeModalOpen(true)}>
						<AirtimeIcon size={32} className="mb-1" />
						<span className="text-xs mt-1">Airtime</span>
					</div>
					<div className="flex flex-col items-center cursor-pointer" onClick={() => setIsDataModalOpen(true)}>
						<DataIcon size={32} className="mb-1" />
						<span className="text-xs mt-1">Data</span>
					</div>
					<div className="flex flex-col items-center cursor-pointer" onClick={() => setIsBillsModalOpen(true)}>
						<ElectricityIcon size={32} className="mb-1" />
						<span className="text-xs mt-1">Electricity</span>
					</div>
					<div className="flex flex-col items-center cursor-pointer">
						<ExamPinIcon size={32} className="mb-1" />
						<span className="text-xs mt-1">Cable</span>
					</div>
					<div className="flex flex-col items-center cursor-pointer">
						<ExamPinIcon size={32} className="mb-1" />
						<span className="text-xs mt-1">Exam Pin</span>
					</div>
					<div className="flex flex-col items-center cursor-pointer">
						<ReferEarnIcon size={32} className="mb-1" />
						<span className="text-xs mt-1">Refer & Earn</span>
					</div>
				</div>
			</div>
			{/* Transaction History - live data */}
			<div className="w-full max-w-md mx-auto mt-6 rounded-2xl p-0 mb-6">
				<TransactionHistory refreshKey={refreshKey} />
			</div>
			{/* Modals */}
			<DepositModal
				isOpen={isDepositModalOpen}
				onClose={() => setIsDepositModalOpen(false)}
				onSuccess={handleTransactionSuccess}
			/>
			<AirtimeModal
				isOpen={isAirtimeModalOpen}
				onClose={() => setIsAirtimeModalOpen(false)}
				onSuccess={handleTransactionSuccess}
			/>
			<DataModal
				isOpen={isDataModalOpen}
				onClose={() => setIsDataModalOpen(false)}
				onSuccess={handleTransactionSuccess}
			/>
			<BillsModal
				isOpen={isBillsModalOpen}
				onClose={() => setIsBillsModalOpen(false)}
				onSuccess={handleTransactionSuccess}
			/>
			{/* Withdraw Modal */}
			<WithdrawModal
				isOpen={isWithdrawModalOpen}
				onClose={() => setIsWithdrawModalOpen(false)}
				onSuccess={handleWithdrawSuccess}
			/>
		</div>
	);
}