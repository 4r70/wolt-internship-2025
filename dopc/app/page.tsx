import Image from "next/image";
import styles from "./page.module.css";

export default function Home() {
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
                                <label htmlFor="venue-slug">Venue slug</label>
                                <input id="venue-slug" type="text" />
                            </div>
                            <div className={styles.inputWrapper}>
                                <label htmlFor="cart-value">
                                    Cart value (EUR)
                                </label>
                                <input id="cart-value" type="number" />
                            </div>
                            <div className={styles.inputWrapper}>
                                <label htmlFor="user-latitude">
                                    User latitude
                                </label>
                                <input id="user-latitude" type="number" />
                            </div>
                            <div className={styles.inputWrapper}>
                                <label htmlFor="user-longitude">
                                    User longitude
                                </label>
                                <input id="user-longitude" type="number" />
                            </div>
                            <button className={styles.secondaryButton}>Get location</button>
                            <button className={styles.primaryButton}>Calculate delivery price</button>
                        </div>
                        <div className={styles.priceBreakdownWrapper}>
                            <h2 className={styles.subtitle}>Price breakdown</h2>
                            <dl className={styles.priceBreakdown}>
                                <dt
                                    className={styles.priceBreakdownDescription}
                                >
                                    Cart value
                                </dt>
                                <dd className={styles.priceBreakdownValue}>
                                    0.00 EUR
                                </dd>
                                <dt
                                    className={styles.priceBreakdownDescription}
                                >
                                    Delivery fee
                                </dt>
                                <dd className={styles.priceBreakdownValue}>
                                    0.00 EUR
                                </dd>
                                <dt
                                    className={styles.priceBreakdownDescription}
                                >
                                    Delivery distance
                                </dt>
                                <dd className={styles.priceBreakdownValue}>
                                    0.00 km
                                </dd>
                                <dt
                                    className={styles.priceBreakdownDescription}
                                >
                                    Small order surcharge
                                </dt>
                                <dd className={styles.priceBreakdownValue}>
                                    0.00 EUR
                                </dd>
                                <dt
                                    className={
                                        styles.priceBreakdownDescriptionTotal
                                    }
                                >
                                    Total
                                </dt>
                                <dd className={styles.priceBreakdownValueTotal}>
                                    0.00 EUR
                                </dd>
                            </dl>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
