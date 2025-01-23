interface GetUserLocationProps {
    setUserLocation: (value: { latitude: string; longitude: string }) => void;
    emptyErrors: Record<string, boolean>;
    setEmptyErrors: (value: Record<string, boolean>) => void;
}

export function getUserLocation({ setUserLocation, emptyErrors, setEmptyErrors }: GetUserLocationProps) {
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
