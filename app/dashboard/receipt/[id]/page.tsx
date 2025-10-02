import { AirtimeIcon, DataIcon, ElectricityIcon, ExamPinIcon, ReferEarnIcon } from "@/components/ui/material-dashboard-icons";
import { notFound } from "next/navigation";

const mockTransactions = [
  {
    id: "1234567890",
    icon: <AirtimeIcon size={32} className="mb-1 text-green-600" />,
    title: "Airtime Top-up",
    desc: "MTN - ₦500",
    amount: "-₦500",
    details: "Date: 2025-09-17\nRef: 1234567890\nStatus: Successful"
  },
  {
    id: "1234567891",
    icon: <DataIcon size={32} className="mb-1 text-blue-600" />,
    title: "Data Purchase",
    desc: "Glo 2GB",
    amount: "-₦1,200",
    details: "Date: 2025-09-16\nRef: 1234567891\nStatus: Successful"
  },
  {
    id: "1234567892",
    icon: <ElectricityIcon size={32} className="mb-1" style={{ color: '#FF3B30' }} />,
    title: "Electricity Payment",
    desc: "Ikeja Electric",
    amount: "-₦3,000",
    details: "Date: 2025-09-15\nRef: 1234567892\nStatus: Successful"
  },
  {
    id: "1234567893",
    icon: <ExamPinIcon size={32} className="mb-1 text-purple-600" />,
    title: "Exam Pin",
    desc: "WAEC 2025",
    amount: "-₦1,500",
    details: "Date: 2025-09-14\nRef: 1234567893\nStatus: Successful"
  },
  {
    id: "1234567894",
    icon: <ReferEarnIcon size={32} className="mb-1 text-pink-600" />,
    title: "Refer & Earn",
    desc: "Bonus",
    amount: "+₦200",
    details: "Date: 2025-09-13\nRef: 1234567894\nStatus: Successful"
  }
];

export default function ReceiptPage({ params }: { params: { id: string } }) {
  const tx = mockTransactions.find(t => t.id === params.id);
  if (!tx) return notFound();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-green-50 to-green-100">
      <div className="flex-1 flex flex-col justify-center items-center w-full">
        <div className="bg-white rounded-none md:rounded-xl p-8 w-full max-w-md mx-auto shadow-none min-h-[60vh] flex flex-col justify-center">
          <div className="flex items-center gap-2 mb-4 justify-center">
            {tx.icon}
            <span className="font-bold text-2xl">{tx.title}</span>
          </div>
          <div className="text-base text-gray-700 mb-2 text-center">{tx.desc}</div>
          <div className="text-sm whitespace-pre-line text-gray-500 mb-6 text-center">{tx.details}</div>
          <div className="text-xl font-bold text-green-700 mb-8 text-center">Amount: {tx.amount}</div>
        </div>
      </div>
      <div className="w-full max-w-md mx-auto px-4 pb-6">
        <div className="flex gap-4">
          <button className="flex-1 py-3 rounded-xl bg-red-50 text-red-700 font-semibold text-base border border-red-200 hover:bg-red-100 transition-all">Report</button>
          <button className="flex-1 py-3 rounded-xl bg-green-600 text-white font-semibold text-base border border-green-200 hover:bg-green-700 transition-all">Download</button>
        </div>
      </div>
    </div>
  );
}
