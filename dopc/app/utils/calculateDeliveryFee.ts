export function calculateDeliveryFee(distance: number, setDeliveryFee: (fee: number) => void, distanceRanges: { min: number; max: number; a: number; b: number }[], deliveryBaseFee: number) {
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