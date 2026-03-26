import React from "react";
import { Avatar } from "../../../components/ui";
import type { UserCardData } from "../../../components/common/UserCard/UserCard";

interface HomeFriendSuggestionCardProps {
    user: UserCardData;
    onClick?: () => void;
    onPrimaryAction?: () => void;
    onSecondaryAction?: () => void;
    isLoading?: boolean;
}

const HomeFriendSuggestionCard: React.FC<HomeFriendSuggestionCardProps> = ({
    user,
    onClick,
    onPrimaryAction,
    onSecondaryAction,
    isLoading = false,
}) => {
    const displayName = `${user.lastName} ${user.firstName}`.trim() || user.username;

    const handlePrimaryClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!isLoading) {
            onPrimaryAction?.();
        }
    };

    const handleSecondaryClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!isLoading) {
            onSecondaryAction?.();
        }
    };

    return (
        <div 
            className={`group relative flex min-h-[200px] w-full flex-col gap-3 rounded-[20px] border border-slate-100 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_24px_rgb(0,0,0,0.06)] cursor-pointer ${isLoading ? "pointer-events-none opacity-70" : ""}`}
            onClick={onClick}
        >
            <div className="flex items-start gap-3">
                <div className="relative shrink-0 rounded-full ring-4 ring-slate-50/50">
                    <Avatar src={user.avatarUrl || undefined} width={48} height={48}>
                        {displayName[0]?.toUpperCase() || "U"}
                    </Avatar>
                    {user.isVerified && (
                        <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full border-2 border-white bg-indigo-500 text-[9px] text-white shadow-sm">
                            ✓
                        </span>
                    )}
                </div>

                <div className="min-w-0 flex-1 pt-0.5">
                    <div className="truncate text-[15px] font-bold tracking-tight text-slate-800 transition group-hover:text-indigo-600">
                        {displayName}
                    </div>
                    <div className="truncate text-[12px] font-medium text-slate-400">@{user.username}</div>
                    <div className="mt-1 text-[12px] font-semibold text-indigo-500/90">
                        {user.mutualFriends || 0} bạn chung
                    </div>
                </div>
            </div>

            <div className="mt-1 flex flex-col gap-2">
                <button
                    className="flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 bg-[length:200%_auto] py-2.5 text-[13px] font-semibold text-white shadow-sm shadow-indigo-500/20 transition-all duration-300 hover:bg-[position:right_center] hover:shadow-md hover:shadow-indigo-500/30 active:scale-95 disabled:opacity-70"
                    onClick={handlePrimaryClick}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    ) : (
                        "Kết bạn"
                    )}
                </button>
                <button
                    className="flex w-full items-center justify-center rounded-xl bg-slate-50 py-2.5 text-[13px] font-semibold text-slate-600 ring-1 ring-inset ring-slate-200/60 transition-all duration-300 hover:bg-slate-100 hover:text-slate-800 active:scale-95 disabled:opacity-70"
                    onClick={handleSecondaryClick}
                    disabled={isLoading}
                >
                    Xóa
                </button>
            </div>
        </div>
    );
};

export default HomeFriendSuggestionCard;
