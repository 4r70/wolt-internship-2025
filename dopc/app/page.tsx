import Image from "next/image";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className={styles.calculatorTile}>
          <h1 className={styles.title}>Delivery Order Price Calculator</h1>
          <div className={styles.calculatorWrapper}>
            <h2 className={styles.subtitle}>Details</h2>
            <label htmlFor="venue-slug">Venue slug</label>
            <input id="venue-slug" type="text" />
            <label htmlFor="cart-value">Cart value (EUR)</label>
            <input id="cart-value" type="number" />
            <label htmlFor="user-latitude">User latitude</label>
            <input id="user-latitude" type="number" />
            <label htmlFor="user-longitude">User longitude</label>
            <input id="user-longitude" type="number" />
            <button>Get location</button>
            <button>Calculate delivery price</button>
            <h2 className={styles.subtitle}>Price breakdown</h2>
            <dl className={styles.priceBreakdown}>
            <dt className={styles.priceBreakdownDescription}>Cart value</dt>
            <dd className={styles.priceBreakdownValue}>0.00 EUR</dd>
            <dt className={styles.priceBreakdownDescription}>Delivery fee</dt>
            <dd className={styles.priceBreakdownValue}>0.00 EUR</dd>
            <dt className={styles.priceBreakdownDescription}>Delivery distance</dt>
            <dd className={styles.priceBreakdownValue}>0.00 km</dd>
            <dt className={styles.priceBreakdownDescription}>Small order surcharge</dt>
            <dd className={styles.priceBreakdownValue}>0.00 EUR</dd>
            <dt className={styles.priceBreakdownDescriptionTotal}>Total</dt>
            <dd className={styles.priceBreakdownValueTotal}>0.00 EUR</dd>
            </dl>
          </div>
        </div>
      </main>
    </div>
  );
}
