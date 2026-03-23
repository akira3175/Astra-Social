import { useEffect, useRef, useCallback } from 'react';

/**
 * Smart polling hook — auto-adjusts interval based on activity.
 * When there's new data → polls faster (active interval).
 * When idle → polls slower (idle interval).
 * 
 * Can be swapped to WebSocket later by replacing this hook with useWebSocket.
 */
export function usePolling(
    callback: () => Promise<boolean>, // returns true if new data was found
    activeInterval: number = 3000,    // 3s when active
    idleInterval: number = 8000,      // 8s when idle
    enabled: boolean = true
) {
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const isActiveRef = useRef(false);
    const mountedRef = useRef(true);

    const poll = useCallback(async () => {
        if (!mountedRef.current || !enabled) return;

        try {
            const hasNew = await callback();
            isActiveRef.current = hasNew;
        } catch (e) {
            // Silently fail — will retry on next interval
        }

        if (!mountedRef.current) return;

        const nextInterval = isActiveRef.current ? activeInterval : idleInterval;
        timerRef.current = setTimeout(poll, nextInterval);
    }, [callback, activeInterval, idleInterval, enabled]);

    useEffect(() => {
        mountedRef.current = true;

        if (enabled) {
            // Start first poll after a short delay
            timerRef.current = setTimeout(poll, 1000);
        }

        return () => {
            mountedRef.current = false;
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
        };
    }, [poll, enabled]);

    // Manual trigger for immediate poll
    const triggerPoll = useCallback(() => {
        if (timerRef.current) clearTimeout(timerRef.current);
        poll();
    }, [poll]);

    return { triggerPoll };
}

export default usePolling;
