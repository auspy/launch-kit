import { NextResponse } from "next/server";

/**
 * Create a configurable logout handler
 * @param {Object} config - Configuration object
 * @param {Object} config.cookie - Cookie configuration
 * @param {Function} config.onLogout - Custom logout handler
 * @param {Function} config.onError - Custom error handler
 */
export function createLogoutHandler(config = {}) {
  const {
    cookie = {},
    onLogout,
    onError
  } = config;

  const cookieConfig = {
    name: 'auth_token',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0, // Expire immediately
    ...cookie
  };

  return async function logoutHandler(request) {
    try {
      // Custom logout processing
      if (onLogout) {
        await onLogout(request);
      }

      const response = NextResponse.json(
        { message: "Logged out successfully" },
        { status: 200 }
      );

      // Clear the auth cookie
      response.cookies.set({
        ...cookieConfig,
        value: '',
      });

      return response;
    } catch (error) {
      console.error("[Logout] Error:", error.message);
      
      // Custom error handling
      if (onError) {
        return await onError(error);
      }

      return NextResponse.json(
        {
          error: "Logout failed",
          message: error.message,
        },
        { status: 500 }
      );
    }
  };
}

// Default handler for backward compatibility
export const POST = createLogoutHandler();