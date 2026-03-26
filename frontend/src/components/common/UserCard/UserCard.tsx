import React, { useEffect, useRef, useState } from "react";
import { Avatar } from "../../ui";

export interface UserCardData {
    id: number;
    username: string;
    firstName: string;
    lastName: string;
    avatarUrl: string | null;
    bio: string | null;
    isVerified?: boolean;
    mutualFriends?: number;
    friendshipStatus?: string;
}

export type UserCardVariant = "default" | "suggestion" | "request" | "friend" | "blocked";

export interface UserCardProps {
    user: UserCardData;
    onClick?: () => void;
    variant?: UserCardVariant;
    onPrimaryAction?: () => void;
    onSecondaryAction?: () => void;
    onBlock?: () => void;
    isLoading?: boolean;
    showAction?: boolean;
    primaryActionLabel?: string;
    primaryActionDisabled?: boolean;
}

const baseActionClass =
    "inline-flex items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-[14px] font-semibold whitespace-nowrap transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-60";

const spinnerClass =
    "h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white";

/**
 * Reusable User Card Component with multiple variants
 * - default: Single action button
 * - suggestion: "Kết bạn" + "Xóa" buttons
 * - request: "Chấp nhận" + "Từ chối" buttons
 * - friend: "Nhắn tin" + dropdown menu
 * - blocked: "Bỏ chặn" button
 */
const UserCard: React.FC<UserCardProps> = ({
    user,
    onClick,
    variant = "default",
    onPrimaryAction,
    onSecondaryAction,
    onBlock,
    isLoading = false,
    showAction = true,
    primaryActionLabel,
    primaryActionDisabled = false,
}) => {
    const displayName = `${user.lastName} ${user.firstName}`.trim() || user.username;
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowDropdown(false);
            }
        };

        if (showDropdown) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [showDropdown]);

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

    const handleDropdownToggle = (e: React.MouseEvent) => {
        e.stopPropagation();
        setShowDropdown((prev) => !prev);
    };

    const handleBlockClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        setShowDropdown(false);
        onBlock?.();
    };

    const handleUnfriendClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        setShowDropdown(false);
        onSecondaryAction?.();
    };

    const cardClassName = [
        "group relative rounded-[20px] border border-slate-100 bg-white p-5 shadow-sm transition-all duration-300",
        "hover:-translate-y-1.5 hover:shadow-[0_12px_30px_rgb(0,0,0,0.08)]",
        "cursor-pointer",
        isLoading ? "pointer-events-none opacity-70" : "",
        variant === "friend"
            ? "flex min-h-[250px] w-full flex-col gap-4"
            : "flex items-start w-full gap-4",
    ]
        .filter(Boolean)
        .join(" ");

    const renderActions = () => {
        if (!showAction) return null;

        switch (variant) {
            case "suggestion":
                return (
                    <div className="mt-2 flex items-center gap-2">
                        <button
                            className={`${baseActionClass} min-w-[100px] bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 bg-[length:200%_auto] text-white shadow-md shadow-indigo-500/20 hover:bg-[position:right_center] hover:shadow-lg hover:shadow-indigo-500/30 active:scale-[0.98]`}
                            onClick={handlePrimaryClick}
                            disabled={isLoading}
                        >
                            {isLoading ? <span className={spinnerClass} /> : "Kết bạn"}
                        </button>
                        <button
                            className={`${baseActionClass} bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-800 active:scale-[0.98] ring-1 ring-inset ring-slate-200/60`}
                            onClick={handleSecondaryClick}
                            disabled={isLoading}
                        >
                            Xóa
                        </button>
                    </div>
                );

            case "request":
                return (
                    <div className="mt-2 flex items-center gap-2">
                        <button
                            className={`${baseActionClass} min-w-[100px] bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 bg-[length:200%_auto] text-white shadow-md shadow-indigo-500/20 hover:bg-[position:right_center] hover:shadow-lg hover:shadow-indigo-500/30 active:scale-[0.98]`}
                            onClick={handlePrimaryClick}
                            disabled={isLoading}
                        >
                            {isLoading ? <span className={spinnerClass} /> : "Chấp nhận"}
                        </button>
                        <button
                            className={`${baseActionClass} bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-800 active:scale-[0.98] ring-1 ring-inset ring-slate-200/60`}
                            onClick={handleSecondaryClick}
                            disabled={isLoading}
                        >
                            Từ chối
                        </button>
                    </div>
                );

            case "friend":
                return (
                    <div className="relative mt-auto flex w-full items-stretch justify-between gap-2.5" ref={dropdownRef}>
                        <button
                            className={`${baseActionClass} flex-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 bg-[length:200%_auto] text-white shadow-md shadow-indigo-500/20 hover:bg-[position:right_center] hover:shadow-lg hover:shadow-indigo-500/30 active:scale-[0.98]`}
                            onClick={handlePrimaryClick}
                        >
                            Nhắn tin
                        </button>
                        <button
                            className={`${baseActionClass} px-3 text-lg bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-800 active:scale-[0.98] ring-1 ring-inset ring-slate-200/60`}
                            onClick={handleDropdownToggle}
                        >
                            ⋮
                        </button>
                        {showDropdown && (
                            <div className="absolute right-0 top-[110%] z-50 min-w-[160px] origin-top-right overflow-hidden rounded-2xl border border-slate-100 bg-white p-1.5 shadow-[0_10px_40px_rgba(0,0,0,0.1)] outline-none">
                                <button
                                    className="block w-full rounded-xl px-4 py-2.5 text-left text-[14px] font-medium text-slate-700 transition-colors hover:bg-slate-50 hover:text-indigo-600"
                                    onClick={handleUnfriendClick}
                                >
                                    Hủy kết bạn
                                </button>
                                <button
                                    className="block w-full rounded-xl px-4 py-2.5 text-left text-[14px] font-medium text-red-600 transition-colors hover:bg-red-50"
                                    onClick={handleBlockClick}
                                >
                                    Chặn
                                </button>
                            </div>
                        )}
                    </div>
                );

            case "blocked":
                return (
                    <div className="mt-2 flex items-center gap-2">
                        <button
                            className={`${baseActionClass} bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 active:scale-[0.98]`}
                            onClick={handlePrimaryClick}
                            disabled={isLoading}
                        >
                            {isLoading ? <span className={spinnerClass} /> : "Bỏ chặn"}
                        </button>
                    </div>
                );

            default:
                return (
                    <button
                        className={`${baseActionClass} mt-2 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 hover:text-indigo-700 active:scale-[0.98] disabled:bg-slate-50 disabled:text-slate-500`}
                        onClick={handlePrimaryClick}
                        disabled={isLoading || primaryActionDisabled}
                    >
                        {isLoading ? <span className={spinnerClass} style={{ borderColor: "rgb(79 70 229 / 0.3)", borderTopColor: "rgb(79 70 229)" }} /> : primaryActionLabel || "Kết bạn"}
                    </button>
                );
        }
    };

    return (
        <div className={cardClassName} onClick={onClick}>
            <div className={variant === "friend" ? "relative self-start" : "relative shrink-0"}>
                <div className="rounded-full ring-4 ring-slate-50/50">
                    <Avatar src={user.avatarUrl || undefined} width={64} height={64}>
                        {displayName[0]?.toUpperCase() || "U"}
                    </Avatar>
                </div>
                {user.isVerified && (
                    <span className="absolute bottom-0.5 right-0.5 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-indigo-500 text-[11px] text-white shadow-sm">
                        ✓
                    </span>
                )}
            </div>

            <div className={variant === "friend" ? "w-full min-w-0" : "min-w-0 flex-1 pt-1"}>
                <div className="mb-0.5 truncate text-[17px] font-bold tracking-tight text-slate-800">{displayName}</div>
                <div className="mb-2.5 text-[13px] font-medium text-slate-400">@{user.username}</div>
                {user.bio && (
                    <div className="mb-3 line-clamp-2 text-[14px] leading-relaxed text-slate-600">{user.bio}</div>
                )}
                {user.mutualFriends !== undefined && (
                    <div className="text-[13px] font-semibold text-indigo-500/90">{user.mutualFriends} bạn chung</div>
                )}
            </div>

            {renderActions()}
        </div>
    );
};

export default UserCard;
