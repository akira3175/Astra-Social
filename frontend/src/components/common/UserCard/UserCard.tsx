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
}

const baseActionClass =
    "inline-flex items-center justify-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-60";

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
}) => {
    const displayName = `${user.lastName} ${user.firstName}`.trim();
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
        "group rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition",
        "hover:-translate-y-1 hover:shadow-lg",
        "cursor-pointer",
        isLoading ? "pointer-events-none opacity-70" : "",
        variant === "friend"
            ? "flex min-h-[240px] basis-full flex-col gap-3 sm:basis-[calc(50%-0.5rem)] lg:basis-[calc(33.333%-0.75rem)] xl:basis-[calc(25%-0.75rem)]"
            : "flex items-start gap-4",
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
                            className={`${baseActionClass} min-w-[100px] bg-gradient-to-r from-indigo-600 to-violet-600 text-white hover:from-indigo-700 hover:to-violet-700`}
                            onClick={handlePrimaryClick}
                            disabled={isLoading}
                        >
                            {isLoading ? <span className={spinnerClass} /> : "Kết bạn"}
                        </button>
                        <button
                            className={`${baseActionClass} bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-700`}
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
                            className={`${baseActionClass} min-w-[100px] bg-gradient-to-r from-indigo-600 to-violet-600 text-white hover:from-indigo-700 hover:to-violet-700`}
                            onClick={handlePrimaryClick}
                            disabled={isLoading}
                        >
                            {isLoading ? <span className={spinnerClass} /> : "Chấp nhận"}
                        </button>
                        <button
                            className={`${baseActionClass} bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-700`}
                            onClick={handleSecondaryClick}
                            disabled={isLoading}
                        >
                            Từ chối
                        </button>
                    </div>
                );

            case "friend":
                return (
                    <div className="mt-auto flex w-full items-center justify-between gap-2" ref={dropdownRef}>
                        <button
                            className={`${baseActionClass} flex-1 bg-gradient-to-r from-indigo-600 to-violet-600 text-white hover:from-indigo-700 hover:to-violet-700`}
                            onClick={handlePrimaryClick}
                        >
                            Nhắn tin
                        </button>
                        <button
                            className={`${baseActionClass} px-3 text-lg bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-700`}
                            onClick={handleDropdownToggle}
                        >
                            ⋮
                        </button>
                        {showDropdown && (
                            <div className="absolute right-0 top-full z-20 mt-2 min-w-[150px] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl">
                                <button
                                    className="block w-full px-4 py-3 text-left text-sm text-slate-700 transition hover:bg-slate-100"
                                    onClick={handleUnfriendClick}
                                >
                                    Hủy kết bạn
                                </button>
                                <button
                                    className="block w-full px-4 py-3 text-left text-sm text-red-500 transition hover:bg-red-50"
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
                            className={`${baseActionClass} bg-red-50 text-red-500 hover:bg-red-500 hover:text-white`}
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
                        className={`${baseActionClass} mt-2 bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white`}
                        onClick={handlePrimaryClick}
                    >
                        Kết bạn
                    </button>
                );
        }
    };

    return (
        <div className={cardClassName} onClick={onClick}>
            <div className={variant === "friend" ? "relative self-start" : "relative shrink-0"}>
                <Avatar src={user.avatarUrl || undefined} width={56} height={56}>
                    {displayName[0]?.toUpperCase() || "U"}
                </Avatar>
                {user.isVerified && (
                    <span className="absolute bottom-0 right-0 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-indigo-500 text-[11px] text-white">
                        ✓
                    </span>
                )}
            </div>

            <div className={variant === "friend" ? "w-full min-w-0" : "min-w-0 flex-1 pt-1"}>
                <div className="mb-1 truncate text-base font-semibold text-slate-800">{displayName}</div>
                <div className="mb-2 text-sm text-slate-500">@{user.username}</div>
                {user.bio && (
                    <div className="mb-2 line-clamp-2 text-sm leading-6 text-slate-700">{user.bio}</div>
                )}
                {user.mutualFriends && user.mutualFriends > 0 && (
                    <div className="text-sm font-medium text-indigo-600">{user.mutualFriends} bạn chung</div>
                )}
            </div>

            {renderActions()}
        </div>
    );
};

export default UserCard;
