import { useState, useEffect } from "react";
import { useDebounce } from "./useDebounce";

export function useVenueDetails(venueSlug: string) {
    const [venueLocation, setVenueLocation] = useState<Record<string, number>>({
        latitude: 0,
        longitude: 0,
    });
    const [deliverySpecs, setDeliverySpecs] = useState<{
        smallOrderMinimumNoSurcharge: number;
        deliveryBaseFee: number;
        distanceRanges: [];
    }>({
        smallOrderMinimumNoSurcharge: 0,
        deliveryBaseFee: 0,
        distanceRanges: [],
    });
    const [error, setError] = useState<boolean>(false);

    const debouncedVenueSlug = useDebounce(venueSlug, 500);

    useEffect(() => {
        setError(false);
    }, [venueSlug]);
    console.log(debouncedVenueSlug)
    useEffect(() => {
        if (!debouncedVenueSlug) return;

        async function fetchVenueDetails(debouncedVenueSlug: string) {
            // fetch coordinates
            try {
                const staticResponse = await fetch(
                    `https://consumer-api.development.dev.woltapi.com/home-assignment-api/v1/venues/${debouncedVenueSlug}/static`
                );
                if (!staticResponse.ok) {
                    throw new Error(
                        `Static API error: ${staticResponse.status}`
                    );
                }
                const staticData = await staticResponse.json();

                if (
                    staticData?.venue_raw?.location?.coordinates?.length === 2
                ) {
                    setVenueLocation({
                        latitude: staticData.venue_raw.location.coordinates[1],
                        longitude: staticData.venue_raw.location.coordinates[0],
                    });
                } else {
                    throw new Error(
                        "Invalid location data from the static API."
                    );
                }

                // fetch other data
                const dynamicResponse = await fetch(
                    `https://consumer-api.development.dev.woltapi.com/home-assignment-api/v1/venues/${debouncedVenueSlug}/dynamic`
                );
                if (!dynamicResponse.ok) {
                    throw new Error(
                        `Dynamic API error: ${dynamicResponse.statusText}`
                    );
                }
                const dynamicData = await dynamicResponse.json();

                const deliverySpecs = dynamicData?.venue_raw?.delivery_specs;
                if (deliverySpecs) {
                    setDeliverySpecs({
                        smallOrderMinimumNoSurcharge:
                            deliverySpecs.order_minimum_no_surcharge,
                        deliveryBaseFee:
                            deliverySpecs.delivery_pricing.base_price,
                        distanceRanges:
                            deliverySpecs.delivery_pricing.distance_ranges,
                    });
                } else {
                    throw new Error(
                        "Invalid delivery data from the dynamic API."
                    );
                }

                setError(false);
            } catch (error) {
                setError(true);
                console.error("Error fetching venue details:", error);
            }
        }
        fetchVenueDetails(debouncedVenueSlug);
    }, [debouncedVenueSlug]);

    return { venueLocation, deliverySpecs, error };
}
