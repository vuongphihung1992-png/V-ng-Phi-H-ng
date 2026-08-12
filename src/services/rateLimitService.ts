// Client-side Rate Limiter Abstraction to prevent spamming
class RateLimitService {
  private attempts: Map<string, number[]> = new Map();

  checkRateLimit(key: string, limit: number = 5, windowMs: number = 60000): { allowed: boolean; remaining: number; retryAfterSec?: number } {
    const now = Date.now();
    const timestamps = (this.attempts.get(key) || []).filter((t) => now - t < windowMs);

    if (timestamps.length >= limit) {
      const oldest = timestamps[0];
      const retryAfterSec = Math.ceil((oldest + windowMs - now) / 1000);
      return { allowed: false, remaining: 0, retryAfterSec };
    }

    timestamps.push(now);
    this.attempts.set(key, timestamps);
    return { allowed: true, remaining: limit - timestamps.length };
  }
}

export const rateLimitService = new RateLimitService();
