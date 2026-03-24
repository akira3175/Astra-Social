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
            className={`group relative flex flex-col gap-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm transition hover:shadow-md cursor-pointer ${isLoading ? "pointer-events-none opacity-70" : ""}`}
            onClick={onClick}
        >
            <div className="flex items-start gap-3">
                <div className="relative shrink-0">
                    <Avatar src={user.avatarUrl || undefined} width={48} height={48}>
                        {displayName[0]?.toUpperCase() || "U"}
                    </Avatar>
                    {user.isVerified && (
                        <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full border-2 border-white bg-indigo-500 text-[9px] text-white">
                            ✓
                        </span>
                    )}
                </div>

                <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-semibold text-slate-800 transition group-hover:text-indigo-600">
                        {displayName}
                    </div>
                    <div className="truncate text-xs text-slate-500">@{user.username}</div>
                    <div className="mt-1 text-[11px] font-medium text-indigo-500">
                        {user.mutualFriends || 0} bạn chung
                    </div>
                </div>
            </div>

            <div className="flex flex-col gap-2">
                <button
                    className="flex w-full items-center justify-center rounded-xl bg-indigo-600 py-2 text-xs font-semibold text-white transition hover:bg-indigo-700 active:scale-95 disabled:opacity-70"
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
                    className="flex w-full items-center justify-center rounded-xl bg-slate-100 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-200 active:scale-95 disabled:opacity-70"
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
