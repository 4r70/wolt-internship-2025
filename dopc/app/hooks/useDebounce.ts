// Provides a debounce for the user input so that the API call is not made on every keystroke
import { useEffect, useState } from 'react';

export function useDebounce(value: string, delay: number) {
    const [debouncedVenueSlug, setDebouncedVenueSlug] = useState(value);
    useEffect(() => {
        const debounceHandler = setTimeout(() => {
            setDebouncedVenueSlug(value);
        }, delay);

        return () => {
            clearTimeout(debounceHandler);
        };
    }, [value, delay]);
    return debouncedVenueSlug;
}
