"use client";

import styles from "@/styles/calculator.module.css";

import { useState, useEffect } from "react";

import { useVenueDetails } from "./hooks/useVenueDetails";
import { getUserLocation } from "./hooks/getUserLocation";

import { calculateDistance } from "./utils/calculateDistance";
import { calculateDeliveryFee } from "./utils/calculateDeliveryFee";
import { calculateSmallOrderSurcharge } from "./utils/calculateSmallOrderSurcharge";

import VenueInput from "./venueInput";
import CartValueInput from "./cartValueInput";
import LocationInput from "./locationInput";

interface DetailsProps {
    setCartValue: (value: number) => void;
    setDeliveryFee: (value: number) => void;
    setDeliveryDistance: (value: number) => void;
    setSmallOrderSurcharge: (value: number) => void;
    setTotal: (value: number) => void;
    setRawValues: (values: Record<string, number>) => void;
}

export default function details({
    setCartValue,
    setDeliveryFee,
    setDeliveryDistance,
    setSmallOrderSurcharge,
    setTotal,
    setRawValues,
}: DetailsProps) {
    const [venueSlug, setVenueSlug] = useState<string>("");
    const [cartUserValue, setCartUserValue] = useState<string>("");
    const [cartUserValueError, setCartUserValueError] =
        useState<boolean>(false);
    const [cartUserInputError, setCartUserInputError] =
        useState<boolean>(false);
    const [userLocation, setUserLocation] = useState<{
        latitude: string;
        longitude: string;
    }>({
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
            <VenueInput
                venueSlug={venueSlug}
                setVenueSlug={setVenueSlug}
                venueError={venueError}
                emptyErrors={emptyErrors}
                setEmptyErrors={setEmptyErrors}
            />
            <CartValueInput
                cartUserValue={cartUserValue}
                setCartUserValue={setCartUserValue}
                cartUserInputError={cartUserInputError}
                setCartUserInputError={setCartUserInputError}
                cartUserValueError={cartUserValueError}
                setCartUserValueError={setCartUserValueError}
                emptyErrors={emptyErrors}
                setEmptyErrors={setEmptyErrors}
            />
            <LocationInput
                userLocation={userLocation}
                setUserLocation={setUserLocation}
                userLatitudeError={userLatitudeError}
                setUserLatitudeError={setUserLatitudeError}
                userLatitudeInputError={userLatitudeInputError}
                setUserLatitudeInputError={setUserLatitudeInputError}
                userLongitudeError={userLongitudeError}
                setUserLongitudeError={setUserLongitudeError}
                userLongitudeInputError={userLongitudeInputError}
                setUserLongitudeInputError={setUserLongitudeInputError}
                emptyErrors={emptyErrors}
                setEmptyErrors={setEmptyErrors}
            />
            <button
                className={styles.secondaryButton}
                data-test-id="getLocation"
                onClick={() =>
                    getUserLocation({
                        setUserLocation,
                        emptyErrors,
                        setEmptyErrors,
                    })
                }
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
