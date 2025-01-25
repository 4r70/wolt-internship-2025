import "@testing-library/jest-dom";
import {
    cleanup,
    fireEvent,
    render,
    screen,
    waitFor,
} from "@testing-library/react";

import VenueInput from "../venueInput";

describe("VenueInput Component", () => {
    const mockProps = {
        venueSlug: "",
        setVenueSlug: jest.fn(),
        venueError: false,
        emptyErrors: {},
        setEmptyErrors: jest.fn(),
    };

    afterEach(() => {
        cleanup();
    });

    test("renders input field", () => {
        render(<VenueInput {...mockProps} />);

        const input = screen.getByTestId("venueSlug");
        expect(input).toBeInTheDocument();
    });

    test("displays venue not found error", () => {
        const newProps = {
            ...mockProps,
            venueError: true,
        };
        render(<VenueInput {...newProps} />);

        expect(
            screen.getByText("Venue was not found, check the spelling.")
        ).toBeInTheDocument();
    });
});
