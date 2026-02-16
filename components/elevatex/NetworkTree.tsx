import React from 'react';
import { cn } from "@/lib/utils";

interface Referral {
    id: string;
    referredId: string;
    referrerId: string;
    level: number;
    status: string;
    createdAt: string;
    user?: {
        fullName: string;
        email?: string;
        avatar?: string;
    };
    children?: Referral[];
}

interface NetworkTreeProps {
    data: Referral[];
    level?: number;
    onNodeClick?: (node: Referral) => void;
}

export function NetworkTree({ data, level = 1, onNodeClick }: NetworkTreeProps) {
    if (!data || data.length === 0) return null;

    return (
        <div className="flex flex-col items-center">
            <div className="flex gap-4 relative pt-4">
                {/* Connector line for siblings */}
                {data.length > 1 && (
                    <div className="absolute top-0 left-[20%] right-[20%] h-0.5 bg-[#47f0d1]/30 translate-y-4"></div>
                )}

                {data.map((node, idx) => (
                    <div key={idx} className="flex flex-col items-center relative">
                        {/* Vertical connector from parent */}
                        <div className="h-4 w-0.5 bg-[#47f0d1]/30 -mt-4 mb-1"></div>

                        {/* Node UI */}
                        <div
                            onClick={() => onNodeClick?.(node)}
                            className={cn(
                                "w-20 h-auto min-h-[5rem] rounded-xl bg-[#131321] border p-2 relative mb-2 flex flex-col items-center justify-center gap-1 transition-all hover:scale-105 hover:border-[#47f0d1] group z-10 cursor-pointer active:scale-95",
                                node.status === 'active' ? "border-[#47f0d1]/40 shadow-[0_0_10px_rgba(71,240,209,0.1)]" : "border-white/10 opacity-70"
                            )}
                        >
                            {/* Avatar */}
                            <div className={cn(
                                "w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold",
                                node.status === 'active' ? "bg-[#47f0d1]/20 text-[#47f0d1]" : "bg-slate-800 text-slate-400"
                            )}>
                                {node.user?.fullName?.charAt(0) || "U"}
                            </div>

                            <span className="text-[9px] text-center font-bold text-white leading-tight line-clamp-2 w-full break-words">
                                {node.user?.fullName || "User"}
                            </span>

                            <div className={cn(
                                "absolute -top-2 -right-2 border w-5 h-5 rounded-md flex items-center justify-center text-[8px] font-bold",
                                node.status === 'active' ? "bg-slate-900 border-[#47f0d1]/30 text-[#47f0d1]" : "bg-slate-800 border-white/10 text-slate-500"
                            )}>
                                L{level}
                            </div>

                            {/* Hover Tooltip (Simple) - Keeping for desktop */}
                            <div className="hidden md:block absolute bottom-full mb-2 bg-slate-900 border border-white/20 p-2 rounded-lg text-[10px] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20 shadow-xl">
                                <p className="text-[#47f0d1] font-bold">{node.user?.email || "No Email"}</p>
                                <p className="text-slate-400">Joined: {new Date(node.createdAt).toLocaleDateString()}</p>
                            </div>
                        </div>

                        {/* Recursively Render Children */}
                        {node.children && node.children.length > 0 ? (
                            <NetworkTree data={node.children} level={level + 1} onNodeClick={onNodeClick} />
                        ) : null}
                    </div>
                ))}
            </div>
        </div>
    );
}
