"use client";

import styles from "./page.module.css";

import { ChangeEvent, use, useEffect, useState } from "react";

export default function Home() {
    const [venueSlug, setVenueSlug] = useState<string>("");
    const [venueSlugError, setVenueSlugError] = useState<boolean>(false);
    const [cartUserValue, setCartUserValue] = useState<string>("");
    const [cartUserValueError, setCartUserValueError] =
        useState<boolean>(false);
    const [cartUserInputError, setCartUserInputError] =
        useState<boolean>(false);
    const [userLocation, setUserLocation] = useState<Record<string, string>>({
        latitude: "",
        longitude: "",
    });
    const [venueLocation, setVenueLocation] = useState<Record<string, number>>({
        latitude: 0,
        longitude: 0,
    });
    const [userLatitudeError, setUserLatitudeError] = useState<boolean>(false);
    const [userLatitudeInputError, setUserLatitudeInputError] =
        useState<boolean>(false);
    const [userLongitudeError, setUserLongitudeError] =
        useState<boolean>(false);
    const [userLongitudeInputError, setUserLongitudeInputError] =
        useState<boolean>(false);
    const [cartValue, setCartValue] = useState<number>(0);
    const [deliveryBaseFee, setDeliveryBaseFee] = useState<number>(0);
    const [deliveryFee, setDeliveryFee] = useState<number>(0);
    const [deliveryDistance, setDeliveryDistance] = useState<number>(0);
    const [deliveryDistanceError, setDeliveryDistanceError] =
        useState<boolean>(false);
    const [distanceRanges, setDistanceRanges] = useState<
        Array<{ min: number; max: number; a: number; b: number; flag: null }>
    >([]);
    const [smallOrderMinimumNoSurcharge, setSmallOrderMinimumNoSurcharge] =
        useState<number>(0);
    const [smallOrderSurcharge, setSmallOrderSurcharge] = useState<number>(0);
    const [total, setTotal] = useState<number>(0);

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

    // function to convert degrees to radians
    function deg2rad(deg: number) {
        return deg * (Math.PI / 180);
    }

    // haversine formula for calculating distance between two geographical coordinates https://stackoverflow.com/a/27943/17492171
    function haverSineFormula(
        lat1: number,
        lon1: number,
        lat2: number,
        lon2: number
    ) {
        var R = 6371; // Radius of the earth in km
        var degLat = deg2rad(lat2 - lat1);
        var degLon = deg2rad(lon2 - lon1);
        var a =
            Math.sin(degLat / 2) * Math.sin(degLat / 2) +
            Math.cos(deg2rad(lat1)) *
                Math.cos(deg2rad(lat2)) *
                Math.sin(degLon / 2) *
                Math.sin(degLon / 2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var d = R * c; // Distance in km
        d = d * 1000; // Distance in meters

        return d;
    }

    function calculateDeliveryFee(distance: number) {
        let fee = 0;
        distanceRanges.forEach((range) => {
            if (range.max !== 0) {
                if (distance >= range.min && distance < range.max) {
                    fee =
                        deliveryBaseFee +
                        range.a +
                        Math.round((range.b * distance) / 10);
                }
            } else {
                if (distance < range.min) {
                    fee =
                        deliveryBaseFee +
                        range.a +
                        Math.round((range.b * distance) / 10);
                }
            }
        });
        setDeliveryFee(fee / 100);
        return fee / 100;
    }

    function calculateSmallOrderSurcharge() {
        if (smallOrderMinimumNoSurcharge / 100 > parseFloat(cartUserValue)) {
            const surcharge =
                smallOrderMinimumNoSurcharge / 100 - parseFloat(cartUserValue);
            setSmallOrderSurcharge(surcharge);
            return surcharge;
        }
        setSmallOrderSurcharge(0);
        return 0;
    }

    function calculateDeliveryPrice() {
        setDeliveryDistanceError(false);

        const deliveryDistance = haverSineFormula(
            parseFloat(userLocation.latitude),
            parseFloat(userLocation.longitude),
            venueLocation.latitude,
            venueLocation.longitude
        );

        const deliveryFee = calculateDeliveryFee(deliveryDistance);
        if (deliveryFee === 0) {
            setDeliveryDistanceError(true);
            return
        }

        setDeliveryDistance(Math.round(deliveryDistance))

        const cartValue = parseFloat(cartUserValue);
        setCartValue(cartValue);

        const surcharge = calculateSmallOrderSurcharge();

        const total = cartValue + deliveryFee + surcharge;
        setTotal(total);
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
                                        Venue was not found, check the spelling.
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
                                        The cart value is formatted incorrectly.
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
                                        onChange={(e) =>
                                            setUserLocation({
                                                ...userLocation,
                                                latitude: e.target.value,
                                            })
                                        }
                                    />
                                    <label
                                        className={styles.innerLabel}
                                        htmlFor="userLatitude"
                                    >
                                        User latitude
                                    </label>
                                    {userLatitudeInputError && (
                                        <p className={styles.errorMessage}>
                                            Input the latitude using only
                                            numbers <br /> from -90 to 90 and an
                                            optional dot.
                                        </p>
                                    )}
                                    {userLatitudeError && (
                                        <p className={styles.errorMessage}>
                                            Latitude format is invalid.
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
                                        onChange={(e) =>
                                            setUserLocation({
                                                ...userLocation,
                                                longitude: e.target.value,
                                            })
                                        }
                                    />
                                    <label
                                        className={styles.innerLabel}
                                        htmlFor="userLongitude"
                                    >
                                        User longitude
                                    </label>
                                    {userLongitudeInputError && (
                                        <p className={styles.errorMessage}>
                                            Input the longitude using only
                                            numbers <br /> from -180 to 180 and
                                            an optional dot.
                                        </p>
                                    )}
                                    {userLongitudeError && (
                                        <p className={styles.errorMessage}>
                                            Longitude format is invalid.
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
                            {deliveryDistanceError && (<p className={styles.errorMessage}>Delivery cannot be calculated, the delivery distance is too long.</p>)}
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
