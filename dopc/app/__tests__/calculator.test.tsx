import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import Calculator from "../calculator";
import { calculateDeliveryFee } from "../utils/calculateDeliveryFee";
import { calculateDistance } from "../utils/calculateDistance";
import { calculateSmallOrderSurcharge } from "../utils/calculateSmallOrderSurcharge";

describe("Delivery Order Price Calculator", () => {
    render(<Calculator />);

    test("every input renders", () => {
        expect(screen.getByTestId("venueSlug")).toBeInTheDocument();
        expect(screen.getByTestId("cartValue")).toBeInTheDocument();
        expect(screen.getByTestId("userLatitude")).toBeInTheDocument();
        expect(screen.getByTestId("userLongitude")).toBeInTheDocument();
        expect(screen.getByTestId("getLocation")).toBeInTheDocument();
        expect(
            screen.getByTestId("calculateDeliveryPrice")
        ).toBeInTheDocument();
    });

    const venueSlugInput = screen.getByTestId("venueSlug");
    const cartValueInput = screen.getByTestId("cartValue");
    const latitudeInput = screen.getByTestId("userLatitude");
    const longitudeInput = screen.getByTestId("userLongitude");

    describe("CartValueInput Component", () => {
        test("input stays empty when user enters invalid characters", async () => {
            await userEvent.type(cartValueInput, "a");
            await userEvent.type(cartValueInput, "!");
            expect(cartValueInput).toHaveValue("");
            expect(
                screen.getByText(
                    "Please input the cart value using only numbers and an optional dot."
                )
            ).toBeInTheDocument();
        });

        test("invalid values", async () => {
            await userEvent.clear(cartValueInput);
            await userEvent.type(cartValueInput, "test-fail");
            expect(cartValueInput).toHaveValue("");
            expect(
                screen.getByText(
                    "Please input the cart value using only numbers and an optional dot."
                )
            ).toBeInTheDocument();

            await userEvent.clear(cartValueInput);
            await userEvent.type(cartValueInput, "10.");
            expect(
                screen.getByText("The cart value is formatted incorrectly.")
            ).toBeInTheDocument();

            await userEvent.clear(cartValueInput);
            await userEvent.type(cartValueInput, "10.222");
            expect(
                screen.getByText("The cart value is formatted incorrectly.")
            ).toBeInTheDocument();
        });

        test("valid values", async () => {
            await userEvent.clear(cartValueInput);
            await userEvent.type(cartValueInput, "10");
            expect(
                screen.queryByText(
                    "Please input the cart value using only numbers and an optional dot."
                )
            ).toBeNull();
            expect(
                screen.queryByText("The cart value is formatted incorrectly.")
            ).toBeNull();

            await userEvent.type(cartValueInput, "10.99");
            expect(
                screen.queryByText(
                    "Please input the cart value using only numbers and an optional dot."
                )
            ).toBeNull();
            expect(
                screen.queryByText("The cart value is formatted incorrectly.")
            ).toBeNull();
        });
    });

    describe("LocationInput Component", () => {
        describe("Latitude input", () => {
            test("input stays empty when user enters invalid characters", async () => {
                await userEvent.type(latitudeInput, "a");
                await userEvent.type(latitudeInput, "!");
                expect(latitudeInput).toHaveValue("");
                expect(
                    screen.getByText(
                        "Please input the latitude using only numbers from -90 to 90 and an optional dot."
                    )
                ).toBeInTheDocument();
            });

            test("invalid values", async () => {
                await userEvent.type(latitudeInput, "test-fail");
                expect(
                    screen.getByText(
                        "Please input the latitude using only numbers from -90 to 90 and an optional dot."
                    )
                ).toBeInTheDocument();

                await userEvent.clear(latitudeInput);
                await userEvent.type(latitudeInput, "91");
                expect(
                    screen.getByText("Latitude format is invalid.")
                ).toBeInTheDocument();

                await userEvent.clear(latitudeInput);
                await userEvent.type(latitudeInput, "54.");
                expect(
                    screen.getByText("Latitude format is invalid.")
                ).toBeInTheDocument();

                await userEvent.clear(latitudeInput);
                await userEvent.type(latitudeInput, "90.001");
                expect(
                    screen.getByText("Latitude format is invalid.")
                ).toBeInTheDocument();

                await userEvent.clear(latitudeInput);
                await userEvent.type(latitudeInput, "-91");
                expect(
                    screen.getByText("Latitude format is invalid.")
                ).toBeInTheDocument();
            });

            test("valid values", async () => {
                await userEvent.clear(latitudeInput);
                await userEvent.type(latitudeInput, "59");
                expect(
                    screen.queryByText(
                        "Please input the latitude using only numbers from -90 to 90 and an optional dot."
                    )
                ).toBeNull();
                expect(
                    screen.queryByText("Latitude format is invalid.")
                ).toBeNull();

                await userEvent.clear(latitudeInput);
                await userEvent.type(latitudeInput, "59.25123");
                expect(
                    screen.queryByText(
                        "Please input the latitude using only numbers from -90 to 90 and an optional dot."
                    )
                ).toBeNull();
                expect(
                    screen.queryByText("Latitude format is invalid.")
                ).toBeNull();

                await userEvent.clear(latitudeInput);
                await userEvent.type(latitudeInput, "-55.23515");
                expect(
                    screen.queryByText(
                        "Please input the latitude using only numbers from -90 to 90 and an optional dot."
                    )
                ).toBeNull();
                expect(
                    screen.queryByText("Latitude format is invalid.")
                ).toBeNull();
            });
        });

        describe("Longitude input", () => {
            test("invalid values", async () => {
                await userEvent.type(longitudeInput, "test-fail");
                expect(
                    screen.getByText(
                        "Please input the longitude using only numbers from -180 to 180 and an optional dot."
                    )
                ).toBeInTheDocument();

                await userEvent.clear(longitudeInput);
                await userEvent.type(longitudeInput, "181");
                expect(
                    screen.getByText("Longitude format is invalid.")
                ).toBeInTheDocument();

                await userEvent.clear(longitudeInput);
                await userEvent.type(longitudeInput, "24.");
                expect(
                    screen.getByText("Longitude format is invalid.")
                ).toBeInTheDocument();

                await userEvent.clear(longitudeInput);
                await userEvent.type(longitudeInput, "180.001");
                expect(
                    screen.getByText("Longitude format is invalid.")
                ).toBeInTheDocument();

                await userEvent.clear(longitudeInput);
                await userEvent.type(longitudeInput, "-181");
                expect(
                    screen.getByText("Longitude format is invalid.")
                ).toBeInTheDocument();
            });

            test("valid values", async () => {
                await userEvent.clear(longitudeInput);
                await userEvent.type(longitudeInput, "24");
                expect(
                    screen.queryByText(
                        "Please input the longitude using only numbers from -180 to 180 and an optional dot."
                    )
                ).toBeNull();
                expect(
                    screen.queryByText("Longitude format is invalid.")
                ).toBeNull();

                await userEvent.clear(longitudeInput);
                await userEvent.type(longitudeInput, "24.53617");
                expect(
                    screen.queryByText(
                        "Please input the longitude using only numbers from -180 to 180 and an optional dot."
                    )
                ).toBeNull();
                expect(
                    screen.queryByText("Longitude format is invalid.")
                ).toBeNull();

                await userEvent.clear(longitudeInput);
                await userEvent.type(longitudeInput, "-24.22215");
                expect(
                    screen.queryByText(
                        "Please input the longitude using only numbers from -180 to 180 and an optional dot."
                    )
                ).toBeNull();
                expect(
                    screen.queryByText("Longitude format is invalid.")
                ).toBeNull();
            });
        });
    });

    describe("CalculateDeliveryPrice Button", () => {
        test("empty inputs show errors", async () => {
            await userEvent.clear(venueSlugInput);
            await userEvent.clear(cartValueInput);
            await userEvent.clear(latitudeInput);
            await userEvent.clear(longitudeInput);

            const calculateButton = screen.getByTestId(
                "calculateDeliveryPrice"
            );
            await userEvent.click(calculateButton);
            expect(
                screen.getAllByText("This field is required.").length
            ).toBeGreaterThanOrEqual(4);
        });

        test("shows error message with coordinates that are too far", async () => {
            await userEvent.clear(venueSlugInput);
            await userEvent.clear(cartValueInput);
            await userEvent.clear(latitudeInput);
            await userEvent.clear(longitudeInput);

            await userEvent.type(
                venueSlugInput,
                "home-assignment-venue-tallinn"
            );
            await userEvent.type(cartValueInput, "10");
            await userEvent.type(latitudeInput, "59.9");
            await userEvent.type(longitudeInput, "24.9");

            const calculateButton = screen.getByTestId(
                "calculateDeliveryPrice"
            );
            await userEvent.click(calculateButton);

            expect(
                screen.getByText(
                    "Delivery cannot be calculated, the delivery distance is too long."
                )
            ).toBeInTheDocument();
        });

        test("correct inputs show success message", async () => {
            await userEvent.clear(venueSlugInput);
            await userEvent.clear(cartValueInput);
            await userEvent.clear(latitudeInput);
            await userEvent.clear(longitudeInput);

            await userEvent.type(
                venueSlugInput,
                "home-assignment-venue-tallinn"
            );
            await userEvent.type(cartValueInput, "10");
            await userEvent.type(latitudeInput, "59.43694");
            await userEvent.type(longitudeInput, "24.76962");

            const calculateButton = screen.getByTestId(
                "calculateDeliveryPrice"
            );
            await userEvent.click(calculateButton);

            expect(
                screen.getByText("Delivery price calculated successfully!")
            ).toBeInTheDocument();
        });
    });

    describe("PriceBreakdown Component", () => {
        test("every field renders", () => {
            expect(
                screen.getByTestId("breakdownCartValue")
            ).toBeInTheDocument();
            expect(
                screen.getByTestId("smallOrderSurcharge")
            ).toBeInTheDocument();
            expect(screen.getByTestId("deliveryDistance")).toBeInTheDocument();
            expect(screen.getByTestId("deliveryFee")).toBeInTheDocument();
            expect(screen.getByTestId("total")).toBeInTheDocument();
        });
    });

    describe("calculateDeliveryFee Function", () => {
        test("calculates delivery fee correctly", () => {
            const distanceRanges = [
                {
                    min: 0,
                    max: 500,
                    a: 0,
                    b: 0,
                    flag: null,
                },
                {
                    min: 500,
                    max: 1000,
                    a: 100,
                    b: 1,
                    flag: null,
                },
                {
                    min: 1000,
                    max: 0,
                    a: 0,
                    b: 0,
                    flag: null,
                },
            ];

            const fee = calculateDeliveryFee(
                600,
                jest.fn(),
                distanceRanges,
                199
            );
            expect(fee).toBe(359 / 100);
        });

        test("calculates delivery fee impossible", () => {
            const distanceRanges = [
                {
                    min: 0,
                    max: 500,
                    a: 0,
                    b: 0,
                    flag: null,
                },
                {
                    min: 500,
                    max: 1000,
                    a: 100,
                    b: 1,
                    flag: null,
                },
                {
                    min: 1000,
                    max: 0,
                    a: 0,
                    b: 0,
                    flag: null,
                },
            ];

            const fee = calculateDeliveryFee(
                1200,
                jest.fn(),
                distanceRanges,
                199
            );
            expect(fee).toBe(0);
        });
    });

    describe("calculateDistance Function", () => {
        test("calculates distance correctly", () => {
            const lat1 = 59.43694;
            const lon1 = 24.76962;
            const lat2 = 59.4385937;
            const lon2 = 24.7513679;
            const distance = calculateDistance(lat1, lon1, lat2, lon2);
            expect(distance).toBe(1048.223406355464);
        });
    });

    describe("calculateSmallOrderSurcharge Function", () => {
        test("calculates surcharge correctly", () => {
            const surcharge = calculateSmallOrderSurcharge(
                1000,
                "5",
                jest.fn()
            );
            expect(surcharge).toBe(5.00);
        });

        test("calculates NO surcharge", () => {
            const setSmallOrderSurcharge = jest.fn();
            const surcharge = calculateSmallOrderSurcharge(
                1000,
                "10",
                setSmallOrderSurcharge
            );
            expect(surcharge).toBe(0);
        });
    });
});
