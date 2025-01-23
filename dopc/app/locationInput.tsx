"use client";

import styles from "@/styles/calculator.module.css";

import { useEffect } from "react";

interface LocationInputProps {
    userLocation: {
        latitude: string;
        longitude: string;
    };
    setUserLocation: (value: { latitude: string; longitude: string }) => void;
    userLatitudeError: boolean;
    setUserLatitudeError: (value: boolean) => void;
    userLatitudeInputError: boolean;
    setUserLatitudeInputError: (value: boolean) => void;
    userLongitudeError: boolean;
    setUserLongitudeError: (value: boolean) => void;
    userLongitudeInputError: boolean;
    setUserLongitudeInputError: (value: boolean) => void;
    emptyErrors: Record<string, boolean>;
    setEmptyErrors: (value: Record<string, boolean>) => void;
}

export default function locationInput({
    userLocation,
    setUserLocation,
    userLatitudeError,
    setUserLatitudeError,
    userLatitudeInputError,
    setUserLatitudeInputError,
    userLongitudeError,
    setUserLongitudeError,
    userLongitudeInputError,
    setUserLongitudeInputError,
    emptyErrors,
    setEmptyErrors,
}: LocationInputProps) {
    function validateUserChangeLatitude(latitude: string) {
        if (!latitude) {
            setUserLatitudeError(false);
            return;
        }
        // regex for matching correct latitudes from -90 to 90 and everything inbetween. accepts a point and numbers after that.
        const latitudeRegex = /^-?(90(\.0+)?|([0-9]|[1-8][0-9])(\.\d+)?)$/;
        if (!latitudeRegex.test(latitude)) {
            setUserLatitudeError(true);
        } else {
            setUserLatitudeError(false);
            setUserLocation({
                ...userLocation,
                latitude: latitude,
            });
        }
    }

    useEffect(() => {
        validateUserChangeLatitude(userLocation.latitude);
    }, [userLocation.latitude]);

    function validateUserChangeLongitude(longitude: string) {
        if (!longitude) {
            setUserLongitudeError(false);
            return;
        }
        // regex for matching correct longitudes from -180 to 180 and everything inbetween. accepts a point and numbers after that.
        const longitudeRegex =
            /^-?([0-9](\.\d+)?|[1-9][0-9](\.\d+)?|1[0-7][0-9](\.\d+)?|180(\.0+)?)$/;
        if (!longitudeRegex.test(longitude)) {
            setUserLongitudeError(true);
        } else {
            setUserLongitudeError(false);
            setUserLocation({
                ...userLocation,
                longitude: longitude,
            });
        }
    }

    useEffect(() => {
        validateUserChangeLongitude(userLocation.longitude);
    }, [userLocation.longitude]);

    function validateUserChangeCoordinatesInput(
        e: React.KeyboardEvent<HTMLInputElement>,
        setError: (value: boolean) => void
    ) {
        const allowedKeys = [
            "Backspace",
            "ArrowLeft",
            "ArrowRight",
            "Delete",
            "Tab",
            "Enter",
            "Control",
        ];
        if (!/[0-9]|\.|\-/.test(e.key) && !allowedKeys.includes(e.key)) {
            e.preventDefault();
            setError(true);
        } else {
            setError(false);
        }
    }

    return (
        <div className={styles.inputRow}>
            <div className={styles.inputWrapper}>
                <input
                    id="userLatitude"
                    data-test-id="userLatitude"
                    type="text"
                    className={styles.input}
                    placeholder=""
                    value={userLocation.latitude}
                    onKeyDown={(e) =>
                        validateUserChangeCoordinatesInput(
                            e,
                            setUserLatitudeInputError
                        )
                    }
                    onChange={(e) => {
                        setUserLocation({
                            ...userLocation,
                            latitude: e.target.value,
                        });
                        if (emptyErrors.userLatitude) {
                            setEmptyErrors({
                                ...emptyErrors,
                                userLatitude: false,
                            });
                        }
                    }}
                />
                <label className={styles.innerLabel} htmlFor="userLatitude">
                    User latitude
                </label>
                {userLatitudeInputError && (
                    <p className={styles.errorMessage}>
                        Input the latitude using only numbers <br /> from -90 to
                        90 and an optional dot.
                    </p>
                )}
                {userLatitudeError && (
                    <p className={styles.errorMessage}>
                        Latitude format is invalid.
                    </p>
                )}
                {emptyErrors.userLatitude && (
                    <p className={styles.errorMessage}>
                        This field is required.
                    </p>
                )}
            </div>
            <div className={styles.inputWrapper}>
                <input
                    id="userLongitude"
                    data-test-id="userLongitude"
                    type="text"
                    className={styles.input}
                    placeholder=""
                    value={userLocation.longitude}
                    onKeyDown={(e) =>
                        validateUserChangeCoordinatesInput(
                            e,
                            setUserLongitudeInputError
                        )
                    }
                    onChange={(e) => {
                        setUserLocation({
                            ...userLocation,
                            longitude: e.target.value,
                        });
                        if (emptyErrors.userLongitude) {
                            setEmptyErrors({
                                ...emptyErrors,
                                userLongitude: false,
                            });
                        }
                    }}
                />
                <label className={styles.innerLabel} htmlFor="userLongitude">
                    User longitude
                </label>
                {userLongitudeInputError && (
                    <p className={styles.errorMessage}>
                        Input the longitude using only numbers <br /> from -180
                        to 180 and an optional dot.
                    </p>
                )}
                {userLongitudeError && (
                    <p className={styles.errorMessage}>
                        Longitude format is invalid.
                    </p>
                )}
                {emptyErrors.userLongitude && (
                    <p className={styles.errorMessage}>
                        This field is required.
                    </p>
                )}
            </div>
        </div>
    );
}
