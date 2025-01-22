export function calculateSmallOrderSurcharge(smallOrderMinimumNoSurcharge: number, cartUserValue: string, setSmallOrderSurcharge: (surcharge: number) => void) {
    if (smallOrderMinimumNoSurcharge / 100 > parseFloat(cartUserValue)) {
        const surcharge =
            smallOrderMinimumNoSurcharge / 100 - parseFloat(cartUserValue);
        console.log(surcharge);
        setSmallOrderSurcharge(parseFloat(surcharge.toFixed(2)));
        return parseFloat(surcharge.toFixed(2));
    }
    setSmallOrderSurcharge(0);
    return 0;
}
