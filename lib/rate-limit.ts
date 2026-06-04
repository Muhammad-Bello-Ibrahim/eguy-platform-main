import { NextRequest, NextResponse } from "next/server";
import { Database } from "@/lib/database";

type RateLimitConfig = {
  action: string;
  maxHits: number;
  windowMs: number;
};

export async function withRateLimit(
  req: NextRequest,
  config: RateLimitConfig,
  handler: () => Promise<NextResponse>
) {
  try {
    // Extract IP from standard headers
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0] ||
      req.headers.get("x-real-ip") ||
      "127.0.0.1";

    const { allowed, remaining } = await Database.checkRateLimit(
      ip,
      config.action,
      config.maxHits,
      config.windowMs
    );

    if (!allowed) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        {
          status: 429,
          headers: {
            "Retry-After": String(Math.ceil(config.windowMs / 1000)),
            "X-RateLimit-Limit": String(config.maxHits),
            "X-RateLimit-Remaining": String(remaining),
          },
        }
      );
    }

    const response = await handler();
    response.headers.set("X-RateLimit-Limit", String(config.maxHits));
    response.headers.set("X-RateLimit-Remaining", String(remaining));
    return response;
  } catch (error) {
    console.error(`Rate limit error [${config.action}]:`, error);
    // Fail open if the rate limiter itself throws an error, or fail closed?
    // Failing open is safer for availability, but we log the error.
    return handler();
  }
}
