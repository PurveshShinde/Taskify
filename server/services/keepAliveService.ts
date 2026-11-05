import https from 'https';
import http from 'http';

/**
 * Keep-Alive Service for Render.
 * 
 * Render spins down free web services after 15 minutes of inactivity.
 * This service pings the server every 8 minutes to keep it active and responsive.
 */
export const startKeepAliveService = () => {
    const rawServerUrl = process.env.SERVER_URL?.trim();

    // Explicit disable
    if (rawServerUrl === 'false' || process.env.KEEP_ALIVE === 'false') {
        console.log('[KeepAlive] Disabled via environment configuration.');
        return;
    }

    // Determine target URL: custom SERVER_URL, Render auto-injected URL, or other env variables
    const targetUrl =
        (rawServerUrl && rawServerUrl !== '' && rawServerUrl !== 'false' ? rawServerUrl : undefined) ||
        process.env.RENDER_EXTERNAL_URL ||
        process.env.API_URL ||
        process.env.BACKEND_URL;

    // If running locally without a public URL and not on Render, remain idle
    if (!targetUrl || targetUrl.includes('example.com') || targetUrl.includes('your-server')) {
        console.log('[KeepAlive] Idle: Local/placeholder environment detected. Keep-alive pings will activate automatically when deployed on Render.');
        return;
    }

    const pingUrl = targetUrl.endsWith('/') ? `${targetUrl}health` : `${targetUrl}/health`;
    const INTERVAL_MS = 8 * 60 * 1000; // 8 minutes

    console.log(`[KeepAlive] Active. Target: ${pingUrl} (every 8 minutes)`);

    const sendPing = async () => {
        try {
            if (typeof fetch === 'function') {
                const res = await fetch(pingUrl, {
                    method: 'GET',
                    headers: { 'User-Agent': 'Taskify-KeepAlive-Service/1.0' },
                });
                console.log(`[KeepAlive] Ping successful to ${pingUrl} (${res.status} ${res.statusText}) at ${new Date().toISOString()}`);
            } else {
                // Fallback for environments without global fetch
                const client = pingUrl.startsWith('https') ? https : http;
                client.get(pingUrl, (res) => {
                    console.log(`[KeepAlive] Ping successful to ${pingUrl} (${res.statusCode}) at ${new Date().toISOString()}`);
                }).on('error', (err) => {
                    console.warn(`[KeepAlive] Ping error: ${err.message}`);
                });
            }
        } catch (error: any) {
            console.warn(`[KeepAlive] Ping failed: ${error?.message || error}`);
        }
    };

    // Delay the initial ping by 1 minute to allow DB connection and server bootstrap
    const initialTimeout = setTimeout(() => {
        sendPing();
    }, 60 * 1000);

    // Schedule regular 8-minute intervals
    const interval = setInterval(sendPing, INTERVAL_MS);

    // Ensure timers don't block node process shutdown
    if (initialTimeout.unref) initialTimeout.unref();
    if (interval.unref) interval.unref();
};

