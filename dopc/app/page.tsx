import styles from "./page.module.css";

import ArrowDownIcon from "@/icons/arrowDown";

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
                                <input
                                    id="venueSlug"
                                    data-test-id="venueSlug"
                                    className={styles.input}
                                    placeholder=""
                                />
                                <label
                                    className={styles.innerLabel}
                                    htmlFor="venueSlug"
                                >
                                    Venue slug
                                </label>
                            </div>
                            <div className={styles.inputWrapper}>
                                <input
                                    id="cartValue"
                                    data-test-id="cartValue"
                                    type="text"
                                    className={styles.input}
                                    placeholder=""
                                />
                                <label
                                    className={styles.innerLabel}
                                    htmlFor="cartValue"
                                >
                                    Cart value (EUR)
                                </label>
                            </div>
                            <div className={styles.inputRow}>
                                <div className={styles.inputWrapper}>
                                    <input
                                        id="userLatitude"
                                        data-test-id="userLatitude"
                                        type="text"
                                        className={styles.input}
                                        placeholder=""
                                    />
                                    <label
                                        className={styles.innerLabel}
                                        htmlFor="userLatitude"
                                    >
                                        User latitude
                                    </label>
                                </div>
                                <div className={styles.inputWrapper}>
                                    <input
                                        id="userLongitude"
                                        data-test-id="userLongitude"
                                        type="text"
                                        className={styles.input}
                                        placeholder=""
                                    />
                                    <label
                                        className={styles.innerLabel}
                                        htmlFor="userLongitude"
                                    >
                                        User longitude
                                    </label>
                                </div>
                            </div>
                            <button
                                className={styles.secondaryButton}
                                data-test-id="getLocation"
                            >
                                Get location
                            </button>
                            <button className={styles.primaryButton}>
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
                                    <dd className={styles.priceBreakdownValue}>
                                        0.00€
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
                                    <dd className={styles.priceBreakdownValue}>
                                        0.00€
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
                                    <dd className={styles.priceBreakdownValue}>
                                        0.00km
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
                                    <dd className={styles.priceBreakdownValue}>
                                        0.00€
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
                                    >
                                        0.00€
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
