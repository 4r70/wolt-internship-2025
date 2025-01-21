"use client";

import styles from "./page.module.css";

import { ChangeEvent, use, useEffect, useState } from "react";

export default function Home() {
    const [venueSlug, setVenueSlug] = useState("");
    const [venueSlugError, setVenueSlugError] = useState(false);
    const [cartUserValue, setCartUserValue] = useState("");
    const [cartUserValueError, setCartUserValueError] = useState(false);
    const [cartUserInputError, setCartUserInputError] = useState(false);
    const [userLocation, setUserLocation] = useState({
        latitude: "",
        longitude: "",
    });
    const [userFormattedLocation, setUserFormattedLocation] = useState({
        latitude: 0,
        longitude: 0,
    });
    const [venueLocation, setVenueLocation] = useState({
        latitude: 0,
        longitude: 0,
    });
    const [userLatitudeError, setUserLatitudeError] = useState(false);
    const [userLongitudeError, setUserLongitudeError] = useState(false);
    const [cartValue, setCartValue] = useState(0);
    const [deliveryBaseFee, setDeliveryBaseFee] = useState(0);
    const [deliveryFee, setDeliveryFee] = useState(0);
    const [deliveryDistance, setDeliveryDistance] = useState(0);
    const [distanceRanges, setDistanceRanges] = useState([]);
    const [smallOrderMinimumNoSurcharge, setSmallOrderMinimumNoSurcharge] =
        useState(0);
    const [smallOrderSurcharge, setSmallOrderSurcharge] = useState(0);
    const [total, setTotal] = useState(0);

    // Provides a debounce for the user input so that the API call is not made on every keystroke
    function useDebounce(value: string, delay: number) {
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

    const debouncedVenueSlug = useDebounce(venueSlug, 500);
    useEffect(() => {
        getVenueDetails(debouncedVenueSlug);
    }, [debouncedVenueSlug]);
    useEffect(() => {
        setVenueSlugError(false);
    }, [venueSlug]);

    async function getVenueDetails(venueSlug: string) {
        // fetch coordinates
        if (!venueSlug) return;
        try {
            const staticResponse = await fetch(
                `https://consumer-api.development.dev.woltapi.com/home-assignment-api/v1/venues/${venueSlug}/static`
            );
            if (!staticResponse.ok) {
                throw new Error(
                    `Static API error: ${staticResponse.statusText}`
                );
            }
            const staticData = await staticResponse.json();

            if (staticData?.venue_raw?.location?.coordinates?.length === 2) {
                setVenueLocation({
                    latitude: staticData.venue_raw.location.coordinates[1],
                    longitude: staticData.venue_raw.location.coordinates[0],
                });
            } else {
                throw new Error("Invalid location data from the static API.");
            }

            // fetch other data
            const dynamicResponse = await fetch(
                `https://consumer-api.development.dev.woltapi.com/home-assignment-api/v1/venues/${venueSlug}/dynamic`
            );
            if (!dynamicResponse.ok) {
                throw new Error(
                    `Dynamic API error: ${dynamicResponse.statusText}`
                );
            }
            const dynamicData = await dynamicResponse.json();

            const deliverySpecs = dynamicData?.venue_raw?.delivery_specs;
            if (deliverySpecs) {
                setSmallOrderMinimumNoSurcharge(
                    deliverySpecs.order_minimum_no_surcharge
                );
                setDeliveryBaseFee(deliverySpecs.delivery_pricing.base_price);
                setDistanceRanges(
                    deliverySpecs.delivery_pricing.distance_ranges
                );
            } else {
                throw new Error("Invalid delivery data from the dynamic API.");
            }

            setVenueSlugError(false);
        } catch (error: any) {
            setVenueSlugError(true);
            console.error(
                "Error fetching venue details:",
                error.message || error
            );
        }
    }

    console.log(smallOrderMinimumNoSurcharge, deliveryBaseFee, distanceRanges);

    // useEffect(() => {
    //     if (!cartValue) return;
    //     if (!smallOrderMinimumNoSurcharge) return;

    //     if (cartValue > smallOrderMinimumNoSurcharge) {
    //         setSmallOrderSurcharge(0);
    //     } else {
    //         const difference = smallOrderMinimumNoSurcharge - cartValue;
    //         setSmallOrderSurcharge(differermnce)
    //     }
    // }, [cartValue, smallOrderMinimumNoSurcharge]);

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
            setUserFormattedLocation({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
            });
        });
    }

    function userChangeLatitude(latitude: string) {}

    function userChangeLongitude(longitude: string) {}

    function formatCartUserValue(cartValue: string) {}

    function calculateDeliveryPrice() {
        // calculcate cart value
        // setCartValue(formatCartUserValue(cartUserValue));
        // calculate delivery fee
        // calculate delivery distance
        // calculate small order surcharge
        // calculate total
    }

    return (
        <div className={styles.page}>
            <main className={styles.main}>
                <div className={styles.calculatorTile}>
                    <h1 className={styles.title}>
                        Delivery Order Price Calculator
                    </h1>
                    <div className={styles.calculatorWrapper}>
                        <div className={styles.detailsWrapper}>
                            <h2 className={styles.subtitle}>Details</h2>
                            <div className={styles.inputWrapper}>
                                <input
                                    id="venueSlug"
                                    data-test-id="venueSlug"
                                    className={styles.input}
                                    placeholder=""
                                    value={venueSlug}
                                    onChange={(e) =>
                                        setVenueSlug(e.target.value)
                                    }
                                />
                                <label
                                    className={styles.innerLabel}
                                    htmlFor="venueSlug"
                                >
                                    Venue slug
                                </label>
                                {venueSlugError && (
                                    <p className={styles.errorMessage}>
                                        Venue was not found, check the spelling
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
                                        setCartUserValue(e.target.value);
                                    }}
                                />
                                <label
                                    className={styles.innerLabel}
                                    htmlFor="cartValue"
                                >
                                    Cart value (EUR)
                                </label>
                                {cartUserInputError && (
                                    <p className={styles.errorMessage}>
                                        Input the cart value using only numbers
                                        and an optional dot.
                                    </p>
                                )}
                                {cartUserValueError && (
                                    <p className={styles.errorMessage}>
                                        The cart value is formatted incorrectly
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
                                        onChange={(e) =>
                                            userChangeLatitude(e.target.value)
                                        }
                                    />
                                    <label
                                        className={styles.innerLabel}
                                        htmlFor="userLatitude"
                                    >
                                        User latitude
                                    </label>
                                    {userLatitudeError && (
                                        <p className={styles.errorMessage}>
                                            Latitude format is invalid
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
                                        onChange={(e) =>
                                            userChangeLongitude(e.target.value)
                                        }
                                    />
                                    <label
                                        className={styles.innerLabel}
                                        htmlFor="userLongitude"
                                    >
                                        User longitude
                                    </label>
                                    {userLongitudeError && (
                                        <p className={styles.errorMessage}>
                                            Longitude format is invalid
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
                            <button
                                className={styles.primaryButton}
                                onClick={() => calculateDeliveryPrice()}
                            >
                                Calculate delivery price
                            </button>
                        </div>
                        <div className={styles.priceBreakdownWrapper}>
                            <h2 className={styles.subtitle}>Price breakdown</h2>
                            <dl className={styles.priceBreakdown}>
                                <div className={styles.priceBreakdownRow}>
                                    <dt
                                        className={
                                            styles.priceBreakdownDescription
                                        }
                                    >
                                        Cart value
                                    </dt>
                                    <dd
                                        className={styles.priceBreakdownValue}
                                        data-raw-value="0"
                                    >
                                        {cartValue} €
                                    </dd>
                                </div>
                                <div className={styles.priceBreakdownRow}>
                                    <dt
                                        className={
                                            styles.priceBreakdownDescription
                                        }
                                    >
                                        Small order surcharge
                                    </dt>
                                    <dd
                                        className={styles.priceBreakdownValue}
                                        data-raw-value="0"
                                    >
                                        {smallOrderSurcharge} €
                                    </dd>
                                </div>
                                <div className={styles.priceBreakdownRow}>
                                    <dt
                                        className={
                                            styles.priceBreakdownDescription
                                        }
                                    >
                                        Delivery distance
                                    </dt>
                                    <dd
                                        className={styles.priceBreakdownValue}
                                        data-raw-value="0"
                                    >
                                        {deliveryDistance} m
                                    </dd>
                                </div>
                                <div className={styles.priceBreakdownRow}>
                                    <dt
                                        className={
                                            styles.priceBreakdownDescription
                                        }
                                    >
                                        Delivery fee
                                    </dt>
                                    <dd
                                        className={styles.priceBreakdownValue}
                                        data-raw-value="0"
                                    >
                                        {deliveryFee} €
                                    </dd>
                                </div>
                                <div className={styles.priceBreakdownRow}>
                                    <dt
                                        className={
                                            styles.priceBreakdownDescriptionTotal
                                        }
                                    >
                                        Total
                                    </dt>
                                    <dd
                                        className={
                                            styles.priceBreakdownValueTotal
                                        }
                                        data-raw-value="0"
                                    >
                                        {total} €
                                    </dd>
                                </div>
                            </dl>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
