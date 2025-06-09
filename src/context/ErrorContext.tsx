// src/context/ErrorContext.tsx
import React, { createContext, useState, useContext, ReactNode } from 'react';

interface ErrorContextType {
    errorMessage: string | null;
    showError: (message: string) => void;
    hideError: () => void;
}

const ErrorContext = createContext<ErrorContextType | undefined>(undefined);

export const useError = () => {
    const context = useContext(ErrorContext);
    if (!context) {
        throw new Error('useError must be used within an ErrorProvider');
    }
    return context;
};

interface ErrorProviderProps {
    children: ReactNode;
}

export const ErrorProvider: React.FC<ErrorProviderProps> = ({ children }) => {
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const showError = (message: string) => {
        setErrorMessage(message);
        // Automatically hide the error after some time
        setTimeout(() => {
            setErrorMessage(null);
        }, 5000); // 5 seconds
    };

    const hideError = () => {
        setErrorMessage(null);
    };

    const value = {
        errorMessage,
        showError,
        hideError,
    };

    return (
        <ErrorContext.Provider value={value}>
            {children}
        </ErrorContext.Provider>
    );
}; 