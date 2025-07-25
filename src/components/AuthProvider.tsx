"use client"

import { AuthManager } from '@/lib/auth';
import { useEffect } from 'react';

export default function AuthProvider({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        // Initialize proactive token refresh
        AuthManager.setupProactiveRefresh();
    }, []);

    return <>{children}</>;
}
