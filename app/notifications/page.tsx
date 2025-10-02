import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Bell } from "lucide-react";

const notifications = [
  { id: 1, title: "Deposit Successful", desc: "Your deposit of ₦2,000 was successful.", date: "2025-09-17" },
  { id: 2, title: "Referral Bonus", desc: "You earned ₦200 from Fatima Bello.", date: "2025-09-16" },
  { id: 3, title: "Withdrawal Processed", desc: "Your withdrawal of ₦1,000 has been processed.", date: "2025-09-15" },
  { id: 4, title: "ElevateX Activation", desc: "Your ElevateX account is now active.", date: "2025-09-14" },
  { id: 5, title: "New Referral", desc: "Chinedu Okafor joined your network.", date: "2025-09-13" },
];

export default function NotificationsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex flex-col items-center p-4 pb-24">
      <div className="w-full max-w-md mx-auto flex flex-col gap-6">
        <Card className="mb-4">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-6 w-6 text-green-600" /> Notifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="divide-y divide-gray-200">
              {notifications.map((note) => (
                <li key={note.id} className="flex items-center px-2 py-4 gap-2">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-2">
                    <Bell className="h-5 w-5 text-green-700" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-sm">{note.title}</div>
                    <div className="text-xs text-gray-500">{note.desc}</div>
                  </div>
                  <div className="text-xs text-gray-400 ml-2">{note.date}</div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
