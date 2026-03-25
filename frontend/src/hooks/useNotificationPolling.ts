import { useState, useCallback, useEffect, useRef } from 'react';
import { getUnreadCount } from '../services/notificationService';
import { usePolling } from './usePolling';

/**
 * Hook for real-time notification badge count.
 * Uses smart polling to keep the unread count updated.
 * Can be used in sidebar/header to show notification badge.
 */
export function useNotificationPolling(userId: number | null) {
    const [unreadCount, setUnreadCount] = useState(0);
    const countRef = useRef(0);

    const pollNotifications = useCallback(async (): Promise<boolean> => {
        if (!userId) return false;

        try {
            const res = await getUnreadCount(userId, false);
            const newCount = res.count || 0;
            const changed = newCount !== countRef.current;
            
            if (changed) {
                countRef.current = newCount;
                setUnreadCount(newCount);
            }
            return changed;
        } catch {
            return false;
        }
    }, [userId]);

    usePolling(pollNotifications, 5000, 15000, !!userId);

    // Initial fetch
    useEffect(() => {
        if (userId) {
            getUnreadCount(userId, false)
                .then(res => {
                    const newCount = res.count || 0;
                    countRef.current = newCount;
                    setUnreadCount(newCount);
                })
                .catch(() => {});
        }
    }, [userId]);

    return { unreadCount, refresh: pollNotifications };
}

export default useNotificationPolling;
