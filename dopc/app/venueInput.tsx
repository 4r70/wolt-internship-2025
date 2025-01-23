import styles from "@/styles/calculator.module.css";

interface VenueInputProps {
    venueSlug: string;
    setVenueSlug: (value: string) => void;
    venueError: boolean;
    emptyErrors: Record<string, boolean>;
    setEmptyErrors: (value: Record<string, boolean>) => void;
}

export default function venueInput({
    venueSlug,
    setVenueSlug,
    venueError,
    emptyErrors,
    setEmptyErrors,
}: VenueInputProps) {
    return (
        <div className={styles.inputWrapper}>
            <input
                id="venueSlug"
                data-test-id="venueSlug"
                className={styles.input}
                placeholder=""
                value={venueSlug}
                onChange={(e) => {
                    setVenueSlug(e.target.value);
                    if (emptyErrors.venueSlug) {
                        setEmptyErrors({
                            ...emptyErrors,
                            venueSlug: false,
                        });
                    }
                }}
            />
            <label className={styles.innerLabel} htmlFor="venueSlug">
                Venue slug
            </label>
            {venueError && (
                <p className={styles.errorMessage}>
                    Venue was not found, check the spelling.
                </p>
            )}
            {emptyErrors.venueSlug && (
                <p className={styles.errorMessage}>This field is required.</p>
            )}
        </div>
    );
}
