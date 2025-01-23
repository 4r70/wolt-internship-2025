"use client";

import styles from "@/styles/calculator.module.css";

import { useState, useEffect } from "react";

import { useVenueDetails } from "./hooks/useVenueDetails";

import { calculateDistance } from "./utils/calculateDistance";
import { calculateDeliveryFee } from "./utils/calculateDeliveryFee";
import { calculateSmallOrderSurcharge } from "./utils/calculateSmallOrderSurcharge";

interface DetailsProps {
    setCartValue: (value: number) => void;
    setDeliveryFee: (value: number) => void;
    setDeliveryDistance: (value: number) => void;
    setSmallOrderSurcharge: (value: number) => void;
    setTotal: (value: number) => void;
    setRawValues: (values: Record<string, number>) => void;
}

export default function details({ setCartValue, setDeliveryFee, setDeliveryDistance, setSmallOrderSurcharge, setTotal, setRawValues }: DetailsProps) {
    const [venueSlug, setVenueSlug] = useState<string>("");
    const [cartUserValue, setCartUserValue] = useState<string>("");
    const [cartUserValueError, setCartUserValueError] =
        useState<boolean>(false);
    const [cartUserInputError, setCartUserInputError] =
        useState<boolean>(false);
    const [userLocation, setUserLocation] = useState<Record<string, string>>({
        latitude: "",
        longitude: "",
    });
    const [userLatitudeError, setUserLatitudeError] = useState<boolean>(false);
    const [userLatitudeInputError, setUserLatitudeInputError] =
        useState<boolean>(false);
    const [userLongitudeError, setUserLongitudeError] =
        useState<boolean>(false);
    const [userLongitudeInputError, setUserLongitudeInputError] =
        useState<boolean>(false);
    const [deliveryDistanceError, setDeliveryDistanceError] =
        useState<boolean>(false);
    const [emptyErrors, setEmptyErrors] = useState<Record<string, boolean>>({});
    const [success, setSuccess] = useState<boolean>(false);

    const {
        venueLocation,
        deliverySpecs,
        error: venueError,
    } = useVenueDetails(venueSlug);

    // allow user only to enter numbers, a dot and some other required keys
    function validateCartUserInput(e: React.KeyboardEvent<HTMLInputElement>) {
        const allowedKeys = [
            "Backspace",
            "ArrowLeft",
            "ArrowRight",
            "Delete",
            "Tab",
            "Enter",
            "Control",
        ];
        if (!/[0-9]|\./.test(e.key) && !allowedKeys.includes(e.key)) {
            e.preventDefault();
            setCartUserInputError(true);
        } else {
            setCartUserInputError(false);
        }
    }

    // allow the value to include only numbers before "." and only two numbers after "."
    function validateCartUserValue(value: string) {
        if (!value) {
            setCartUserValueError(false);
            return;
        }
        if (!/^[0-9]+(\.[0-9]{2})?$/.test(value)) {
            setCartUserValueError(true);
        } else {
            setCartUserValueError(false);
            setCartUserValue(value);
        }
    }

    useEffect(() => {
        validateCartUserValue(cartUserValue);
    }, [cartUserValue]);

    function getUserLocation() {
        navigator.geolocation.getCurrentPosition((position) => {
            setUserLocation({
                latitude: position.coords.latitude.toString(),
                longitude: position.coords.longitude.toString(),
            });
            const newEmptyErrors = { ...emptyErrors };
            if (newEmptyErrors.userLatitude) {
                newEmptyErrors.userLatitude = false;
            }
            if (newEmptyErrors.userLongitude) {
                newEmptyErrors.userLongitude = false;
            }
            setEmptyErrors(newEmptyErrors);
        });
    }

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

    function calculateDeliveryPrice() {
        setDeliveryDistanceError(false);
        const newEmptyErrors = { ...emptyErrors };

        const errorFields = [
            { field: venueSlug, errorKey: "venueSlug" },
            { field: cartUserValue, errorKey: "cartUserValue" },
            { field: userLocation.latitude, errorKey: "userLatitude" },
            { field: userLocation.longitude, errorKey: "userLongitude" },
        ];

        errorFields.forEach(({ field, errorKey }) => {
            newEmptyErrors[errorKey] = !field;
        });

        setEmptyErrors(newEmptyErrors);

        if (Object.values(newEmptyErrors).includes(true)) {
            return;
        }

        const deliveryDistance = calculateDistance(
            parseFloat(userLocation.latitude),
            parseFloat(userLocation.longitude),
            venueLocation.latitude,
            venueLocation.longitude
        );

        const deliveryFee = calculateDeliveryFee(
            deliveryDistance,
            setDeliveryFee,
            deliverySpecs.distanceRanges,
            deliverySpecs.deliveryBaseFee
        );
        if (deliveryFee === 0) {
            setDeliveryDistanceError(true);
            return;
        }

        setDeliveryDistance(Math.round(deliveryDistance));

        const cartValue = parseFloat(cartUserValue);
        setCartValue(cartValue);

        const surcharge = calculateSmallOrderSurcharge(
            deliverySpecs.smallOrderMinimumNoSurcharge,
            cartUserValue,
            setSmallOrderSurcharge
        );

        const total = parseFloat(
            (cartValue + deliveryFee + surcharge).toFixed(2)
        );
        setTotal(total);
        setRawValues({
            cartValue: cartValue * 100,
            smallOrderSurcharge: surcharge * 100,
            deliveryDistance: deliveryDistance,
            deliveryFee: deliveryFee * 100,
            total: total * 100,
        });
        setSuccess(true);
    }

    useEffect(() => {
        if (success) {
            setTimeout(() => {
                setSuccess(false);
            }, 2000);
        }
    }, [success]);

    return (
        <div className={styles.detailsWrapper}>
            <h2 className={styles.subtitle}>Details</h2>
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
                    <p className={styles.errorMessage}>
                        This field is required.
                    </p>
                )}
            </div>
            <div className={styles.inputWrapper}>
                <input
                    id="cartValue"
                    data-test-id="cartValue"
                    type="text"
                    className={styles.input}
                    placeholder=""
                    value={cartUserValue}
                    onKeyDown={(e) => {
                        validateCartUserInput(e);
                    }}
                    onChange={(e) => {
                        {
                            setCartUserValue(e.target.value);
                            if (emptyErrors.cartUserValue) {
                                setEmptyErrors({
                                    ...emptyErrors,
                                    cartUserValue: false,
                                });
                            }
                        }
                    }}
                />
                <label className={styles.innerLabel} htmlFor="cartValue">
                    Cart value (EUR)
                </label>
                {cartUserInputError && (
                    <p className={styles.errorMessage}>
                        Input the cart value using only numbers and an optional
                        dot.
                    </p>
                )}
                {cartUserValueError && (
                    <p className={styles.errorMessage}>
                        The cart value is formatted incorrectly.
                    </p>
                )}
                {emptyErrors.cartUserValue && (
                    <p className={styles.errorMessage}>
                        This field is required.
                    </p>
                )}
            </div>
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
                            Input the latitude using only numbers <br /> from
                            -90 to 90 and an optional dot.
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
                    <label
                        className={styles.innerLabel}
                        htmlFor="userLongitude"
                    >
                        User longitude
                    </label>
                    {userLongitudeInputError && (
                        <p className={styles.errorMessage}>
                            Input the longitude using only numbers <br /> from
                            -180 to 180 and an optional dot.
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
            <button
                className={styles.secondaryButton}
                data-test-id="getLocation"
                onClick={() => getUserLocation()}
            >
                Get location
            </button>
            <div className={styles.successWrapper}>
                <button
                    className={styles.primaryButton}
                    onClick={() => calculateDeliveryPrice()}
                >
                    Calculate delivery price
                </button>
                <p
                    className={`${styles.successMessage} ${
                        success ? styles.successMessageVisible : ""
                    }`}
                >
                    Delivery price calculated successfully!
                </p>
            </div>
            {deliveryDistanceError && (
                <p className={styles.errorMessage}>
                    Delivery cannot be calculated, the delivery distance is too
                    long.
                </p>
            )}
        </div>
    );
}
