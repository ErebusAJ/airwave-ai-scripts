import React from 'react';
import { useError } from '@/context/ErrorContext';
import { Info, X } from 'lucide-react';

const ApiError = () => {
    const { errorMessage, hideError } = useError();

    if (!errorMessage) {
        return null;
    }

    return (
        <div className="fixed bottom-5 right-5 z-50 max-w-sm w-full">
            <div className="bg-red-500 text-white rounded-lg shadow-lg p-4 flex items-start space-x-3 animate-fade-in-up">
                <div className="flex-shrink-0 pt-0.5">
                    <Info className="h-5 w-5" />
                </div>
                <div className="flex-1">
                    <p className="text-sm font-semibold">An error occurred</p>
                    <p className="text-sm mt-1">{errorMessage}</p>
                </div>
                <div className="flex-shrink-0">
                    <button
                        onClick={hideError}
                        className="p-1 rounded-full hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-white"
                        aria-label="Close error message"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ApiError; 