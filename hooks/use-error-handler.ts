'use client';

import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

interface UseErrorHandlerReturn {
    error: string | null;
    handleError: (err: Error | string, options?: ErrorHandlerOptions) => void;
    clearError: () => void;
    isError: boolean;
}

interface ErrorHandlerOptions {
    showToast?: boolean;
    toastTitle?: string;
    logToConsole?: boolean;
}

/**
 * Custom hook for consistent error handling across components
 * 
 * @example
 * const { error, handleError, clearError } = useErrorHandler();
 * 
 * try {
 *   await someAsyncOperation();
 * } catch (err) {
 *   handleError(err);
 * }
 */
export function useErrorHandler(): UseErrorHandlerReturn {
    const [error, setError] = useState<string | null>(null);
    const { toast } = useToast();

    const handleError = useCallback((
        err: Error | string,
        options: ErrorHandlerOptions = {}
    ) => {
        const {
            showToast = true,
            toastTitle = 'Error',
            logToConsole = true,
        } = options;

        const message = typeof err === 'string' ? err : err.message;
        setError(message);

        if (showToast) {
            toast({
                title: toastTitle,
                description: message,
                variant: 'destructive',
            });
        }

        if (logToConsole) {
            console.error('[Client Error]:', {
                message,
                error: err,
                timestamp: new Date().toISOString(),
            });
        }
    }, [toast]);

    const clearError = useCallback(() => {
        setError(null);
    }, []);

    return {
        error,
        handleError,
        clearError,
        isError: error !== null,
    };
}

/**
 * Hook for handling async operations with automatic error handling
 * 
 * @example
 * const { execute, loading, error } = useAsyncHandler(async () => {
 *   return await api.fetchData();
 * });
 */
export function useAsyncHandler<T>(
    asyncFn: () => Promise<T>,
    options: ErrorHandlerOptions = {}
) {
    const [loading, setLoading] = useState(false);
    const { error, handleError, clearError } = useErrorHandler();

    const execute = useCallback(async (): Promise<T | null> => {
        clearError();
        setLoading(true);

        try {
            const result = await asyncFn();
            return result;
        } catch (err) {
            handleError(err as Error, options);
            return null;
        } finally {
            setLoading(false);
        }
    }, [asyncFn, clearError, handleError, options]);

    return {
        execute,
        loading,
        error,
        clearError,
    };
}
