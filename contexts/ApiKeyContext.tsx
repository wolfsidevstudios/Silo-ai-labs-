import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';

const API_KEY_STORAGE_KEY = 'gemini_api_key';

interface ApiKeyContextType {
    apiKey: string | null;
    setApiKey: (key: string | null) => void;
}

export const ApiKeyContext = createContext<ApiKeyContextType | undefined>(undefined);

export const ApiKeyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [apiKey, setApiKeyInternal] = useState<string | null>(() => {
        try {
            return localStorage.getItem(API_KEY_STORAGE_KEY);
        } catch (error) {
            console.error("Could not read API key from localStorage", error);
            return null;
        }
    });

    const setApiKey = (key: string | null) => {
        const trimmedKey = key?.trim() || null;
        setApiKeyInternal(trimmedKey);
        try {
            if (trimmedKey) {
                localStorage.setItem(API_KEY_STORAGE_KEY, trimmedKey);
            } else {
                localStorage.removeItem(API_KEY_STORAGE_KEY);
            }
        } catch (error) {
            console.error("Could not save API key to localStorage", error);
        }
    };

    useEffect(() => {
        const handleStorageChange = (event: StorageEvent) => {
            if (event.key === API_KEY_STORAGE_KEY) {
                setApiKeyInternal(event.newValue);
            }
        };
        window.addEventListener('storage', handleStorageChange);
        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    const value = { apiKey, setApiKey };

    return (
        <ApiKeyContext.Provider value={value}>
            {children}
        </ApiKeyContext.Provider>
    );
};

export const useApiKey = (): ApiKeyContextType => {
    const context = useContext(ApiKeyContext);
    if (context === undefined) {
        throw new Error('useApiKey must be used within an ApiKeyProvider');
    }
    return context;
};
