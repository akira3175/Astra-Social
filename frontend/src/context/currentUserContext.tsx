import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { tokenService } from "../services/tokenService";
import { getMyProfile, transformUserProfile } from "../services/userService";
import type { User } from "../types/user";

interface CurrentUserContextType {
    currentUser: User | null;
    setCurrentUser: (user: User | null) => void;
    isLoading: boolean;
    error: string | null;
    refreshUser: () => Promise<void>;
    clearUser: () => void;
}

const CurrentUserContext = createContext<CurrentUserContextType | undefined>(undefined);

export const CurrentUserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchUserProfile = useCallback(async () => {
        // Check if we have tokens before trying to fetch
        if (!tokenService.hasTokens()) {
            setIsLoading(false);
            setCurrentUser(null);
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const response = await getMyProfile();

            if (response.success && response.data) {
                const user = transformUserProfile(response.data);
                setCurrentUser(user);
            } else {
                setCurrentUser(null);
                setError(response.message || "Failed to load user profile");
            }
        } catch (err: any) {
            console.error("Error fetching user profile:", err);
            setCurrentUser(null);

            // If unauthorized, tokens may be invalid
            if (err?.response?.status === 401) {
                setError("Session expired. Please login again.");
            } else {
                setError("Failed to load user profile");
            }
        } finally {
            setIsLoading(false);
        }
    }, []);

    const refreshUser = useCallback(async () => {
        await fetchUserProfile();
    }, [fetchUserProfile]);

    const clearUser = useCallback(() => {
        setCurrentUser(null);
        setError(null);
    }, []);

    // Fetch user profile on mount (if tokens exist)
    useEffect(() => {
        fetchUserProfile();
    }, [fetchUserProfile]);

    // Listen for storage changes (e.g., login/logout in another tab)
    useEffect(() => {
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === "access_token") {
                if (e.newValue) {
                    fetchUserProfile();
                } else {
                    clearUser();
                }
            }
        };

        window.addEventListener("storage", handleStorageChange);
        return () => window.removeEventListener("storage", handleStorageChange);
    }, [fetchUserProfile, clearUser]);

    return (
        <CurrentUserContext.Provider
            value={{
                currentUser,
                setCurrentUser,
                isLoading,
                error,
                refreshUser,
                clearUser,
            }}
        >
            {children}
        </CurrentUserContext.Provider>
    );
};

export const useCurrentUser = () => {
    const context = useContext(CurrentUserContext);
    if (context === undefined) {
        return null;
    }
    return context;
};

// Re-export User type for convenience
export type { User } from "../types/user";
