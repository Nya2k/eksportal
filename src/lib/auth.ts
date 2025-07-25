// Token refresh utility
export class AuthManager {
    private static refreshPromise: Promise<string | null> | null = null;

    static async refreshToken(): Promise<string | null> {
        // Prevent multiple simultaneous refresh attempts
        if (this.refreshPromise) {
            return this.refreshPromise;
        }

        this.refreshPromise = this.performRefresh();
        const result = await this.refreshPromise;
        this.refreshPromise = null;
        
        return result;
    }

    private static async performRefresh(): Promise<string | null> {
        try {
            const currentToken = localStorage.getItem('token');
            if (!currentToken) {
                return null;
            }

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/refresh/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${currentToken}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const data = await response.json();
                const newToken = data.data?.access || data.access;
                
                if (newToken) {
                    localStorage.setItem('token', newToken);
                    // Dispatch event to notify components about token refresh
                    window.dispatchEvent(new CustomEvent('tokenRefreshed', { 
                        detail: { token: newToken } 
                    }));
                    return newToken;
                }
            } else if (response.status === 401 || response.status === 403) {
                // Refresh token is also expired, logout user
                this.logout();
                return null;
            }
        } catch (error) {
            console.error('Token refresh failed:', error);
            return null;
        }

        return null;
    }

    static logout() {
        localStorage.removeItem('token');
        window.dispatchEvent(new CustomEvent('userLoggedOut'));
        // Redirect to login page
        window.location.href = '/login';
    }

    // API request wrapper with automatic token refresh
    static async apiRequest(url: string, options: RequestInit = {}): Promise<Response> {
        const token = localStorage.getItem('token');
        
        const requestOptions: RequestInit = {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token ? `Bearer ${token}` : '',
                ...options.headers,
            },
        };

        let response = await fetch(url, requestOptions);

        // If unauthorized, try to refresh token and retry
        if (response.status === 401 || response.status === 403) {
            const newToken = await this.refreshToken();
            
            if (newToken) {
                // Retry request with new token
                requestOptions.headers = {
                    ...requestOptions.headers,
                    'Authorization': `Bearer ${newToken}`,
                };
                response = await fetch(url, requestOptions);
            } else {
                // Refresh failed, logout user
                this.logout();
                throw new Error('Authentication failed');
            }
        }

        return response;
    }

    // Check if token needs refresh (optional: proactive refresh)
    static shouldRefreshToken(token: string): boolean {
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            const exp = payload.exp * 1000; // Convert to milliseconds
            const now = Date.now();
            const timeUntilExpiry = exp - now;
            const refreshThreshold = 15 * 60 * 1000; // 15 minutes before expiry
            
            return timeUntilExpiry < refreshThreshold;
        } catch {
            return true; // If we can't parse, assume it needs refresh
        }
    }

    // Setup proactive token refresh (call this in app initialization)
    static setupProactiveRefresh() {
        const checkAndRefresh = async () => {
            const token = localStorage.getItem('token');
            if (token && this.shouldRefreshToken(token)) {
                await this.refreshToken();
            }
        };

        // Check every 5 minutes
        setInterval(checkAndRefresh, 5 * 60 * 1000);
        
        // Also check on page focus
        window.addEventListener('focus', checkAndRefresh);
    }
}
