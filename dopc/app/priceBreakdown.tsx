import styles from "@/styles/calculator.module.css";

interface BreakdownProps {
    rawValues: Record<string, number>;
    cartValue: number;
    smallOrderSurcharge: number;
    deliveryDistance: number;
    deliveryFee: number;
    total: number;
}

export default function priceBreakdown({
    rawValues,
    cartValue,
    smallOrderSurcharge,
    deliveryDistance,
    deliveryFee,
    total,
}: BreakdownProps) {
    return (
        <div className={styles.priceBreakdownWrapper}>
            <h2 className={styles.subtitle}>Price breakdown</h2>
            <dl className={styles.priceBreakdown}>
                <div className={styles.priceBreakdownRow}>
                    <dt className={styles.priceBreakdownDescription}>
                        Cart value
                    </dt>
                    <dd
                        className={styles.priceBreakdownValue}
                        data-raw-value={rawValues.cartValue}
                    >
                        {cartValue} €
                    </dd>
                </div>
                <div className={styles.priceBreakdownRow}>
                    <dt className={styles.priceBreakdownDescription}>
                        Small order surcharge
                    </dt>
                    <dd
                        className={styles.priceBreakdownValue}
                        data-raw-value={rawValues.smallOrderSurcharge}
                    >
                        {smallOrderSurcharge} €
                    </dd>
                </div>
                <div className={styles.priceBreakdownRow}>
                    <dt className={styles.priceBreakdownDescription}>
                        Delivery distance
                    </dt>
                    <dd
                        className={styles.priceBreakdownValue}
                        data-raw-value={rawValues.deliveryDistance}
                    >
                        {deliveryDistance} m
                    </dd>
                </div>
                <div className={styles.priceBreakdownRow}>
                    <dt className={styles.priceBreakdownDescription}>
                        Delivery fee
                    </dt>
                    <dd
                        className={styles.priceBreakdownValue}
                        data-raw-value={rawValues.deliveryFee}
                    >
                        {deliveryFee} €
                    </dd>
                </div>
                <div className={styles.priceBreakdownRow}>
                    <dt className={styles.priceBreakdownDescriptionTotal}>
                        Total
                    </dt>
                    <dd
                        className={styles.priceBreakdownValueTotal}
                        data-raw-value={rawValues.total}
                    >
                        {total} €
                    </dd>
                </div>
            </dl>
        </div>
    );
}
