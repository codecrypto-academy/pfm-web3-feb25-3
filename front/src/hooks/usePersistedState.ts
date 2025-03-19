import { useState, useEffect } from 'react';

export function usePersistedState<T>(key: string, initialValue: T) {
    // Inicializar el estado
    const [state, setState] = useState<T>(() => {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            console.error('Error recuperando el estado:', error);
            return initialValue;
        }
    });

    // Actualizar localStorage cuando el estado cambie
    useEffect(() => {
        try {
            localStorage.setItem(key, JSON.stringify(state));
        } catch (error) {
            console.error('Error guardando el estado:', error);
        }
    }, [key, state]);

    return [state, setState] as const;
}