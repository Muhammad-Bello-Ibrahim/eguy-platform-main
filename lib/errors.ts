import { NextResponse } from 'next/server';

/**
 * Base application error class
 */
export class AppError extends Error {
    constructor(
        public message: string,
        public statusCode: number = 500,
        public code?: string,
        public details?: any
    ) {
        super(message);
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}

/**
 * Validation error - 400
 */
export class ValidationError extends AppError {
    constructor(message: string, details?: any) {
        super(message, 400, 'VALIDATION_ERROR', details);
    }
}

/**
 * Authentication error - 401
 */
export class AuthenticationError extends AppError {
    constructor(message: string = 'Authentication required') {
        super(message, 401, 'AUTH_ERROR');
    }
}

/**
 * Authorization error - 403
 */
export class AuthorizationError extends AppError {
    constructor(message: string = 'Access denied') {
        super(message, 403, 'AUTHORIZATION_ERROR');
    }
}

/**
 * Not found error - 404
 */
export class NotFoundError extends AppError {
    constructor(resource: string) {
        super(`${resource} not found`, 404, 'NOT_FOUND');
    }
}

/**
 * Database error - 500
 */
export class DatabaseError extends AppError {
    constructor(operation: string, details?: any) {
        super(`Database operation failed: ${operation}`, 500, 'DB_ERROR', details);
    }
}

/**
 * External API error - 502
 */
export class ExternalAPIError extends AppError {
    constructor(service: string, details?: any) {
        super(`External service error: ${service}`, 502, 'EXTERNAL_API_ERROR', details);
    }
}

/**
 * Insufficient balance error - 400
 */
export class InsufficientBalanceError extends AppError {
    constructor(required: number, available: number) {
        super(
            `Insufficient balance. Required: ₦${required}, Available: ₦${available}`,
            400,
            'INSUFFICIENT_BALANCE',
            { required, available }
        );
    }
}

/**
 * Structured error logger
 */
export function logError(error: Error | AppError, context?: Record<string, any>) {
    const errorData = {
        message: error.message,
        name: error.name,
        stack: error.stack,
        timestamp: new Date().toISOString(),
        ...(error instanceof AppError && {
            statusCode: error.statusCode,
            code: error.code,
            details: error.details,
        }),
        ...context,
    };

    console.error('[ERROR]', JSON.stringify(errorData, null, 2));

    // In production, send to error tracking service (Sentry, LogRocket, etc.)
    if (process.env.NODE_ENV === 'production' && process.env.ERROR_TRACKING_ENABLED === 'true') {
        // Example: Sentry.captureException(error, { contexts: { custom: context } });
    }

    return errorData;
}

/**
 * API error response formatter
 */
export function formatErrorResponse(error: Error | AppError) {
    if (error instanceof AppError) {
        return {
            error: error.message,
            code: error.code,
            ...(process.env.NODE_ENV === 'development' && error.details && { details: error.details }),
        };
    }

    // Don't expose internal errors in production
    return {
        error: process.env.NODE_ENV === 'production'
            ? 'An unexpected error occurred'
            : error.message,
    };
}

/**
 * Handle API errors and return formatted response
 */
export function handleApiError(
    error: Error | AppError,
    context?: Record<string, any>
) {
    logError(error, context);

    const statusCode = error instanceof AppError ? error.statusCode : 500;
    return NextResponse.json(
        formatErrorResponse(error),
        { status: statusCode }
    );
}

/**
 * Async wrapper for API route handlers with automatic error handling
 */
export function withErrorHandling<T extends (...args: any[]) => Promise<any>>(
    handler: T,
    context?: Record<string, any>
): T {
    return (async (...args: Parameters<T>) => {
        try {
            return await handler(...args);
        } catch (error) {
            return handleApiError(error as Error, context);
        }
    }) as T;
}
