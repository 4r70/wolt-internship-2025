"use client";

import styles from "@/styles/calculator.module.css";

import { useState } from "react";

import Details from "./details";
import Breakdown from "./priceBreakdown";

export default function calculator() {
    const [cartValue, setCartValue] = useState<number>(0);
    const [deliveryFee, setDeliveryFee] = useState<number>(0);
    const [deliveryDistance, setDeliveryDistance] = useState<number>(0);
    const [smallOrderSurcharge, setSmallOrderSurcharge] = useState<number>(0);
    const [total, setTotal] = useState<number>(0);
    const [rawValues, setRawValues] = useState<Record<string, number>>({
        cartValue: 0,
        smallOrderSurcharge: 0,
        deliveryDistance: 0,
        deliveryFee: 0,
        total: 0,
    });

    return (
        <div className={styles.calculatorTile}>
            <h1 className={styles.title}>Delivery Order Price Calculator</h1>
            <div className={styles.calculatorWrapper}>
                <Details
                    setCartValue={setCartValue}
                    setDeliveryFee={setDeliveryFee}
                    setDeliveryDistance={setDeliveryDistance}
                    setSmallOrderSurcharge={setSmallOrderSurcharge}
                    setTotal={setTotal}
                    setRawValues={setRawValues}
                />
                <Breakdown
                    rawValues={rawValues}
                    cartValue={cartValue}
                    smallOrderSurcharge={smallOrderSurcharge}
                    deliveryDistance={deliveryDistance}
                    deliveryFee={deliveryFee}
                    total={total}
                />
            </div>
        </div>
    );
}
