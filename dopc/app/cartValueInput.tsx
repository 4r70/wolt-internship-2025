"use client";

import styles from "@/styles/calculator.module.css";

import { useEffect } from "react";

interface CartValueInputProps {
    cartUserValue: string;
    setCartUserValue: (value: string) => void;
    cartUserInputError: boolean;
    setCartUserInputError: (value: boolean) => void;
    cartUserValueError: boolean;
    setCartUserValueError: (value: boolean) => void;
    emptyErrors: Record<string, boolean>;
    setEmptyErrors: (value: Record<string, boolean>) => void;
}

export default function cartValueInput({
    cartUserValue,
    setCartUserValue,
    cartUserInputError,
    setCartUserInputError,
    cartUserValueError,
    setCartUserValueError,
    emptyErrors,
    setEmptyErrors,
}: CartValueInputProps) {
    // allow user only to enter numbers, a dot and some other required keys
    function validateCartUserInput(e: React.KeyboardEvent<HTMLInputElement>) {
        const allowedKeys = [
            "Backspace",
            "ArrowLeft",
            "ArrowRight",
            "Delete",
            "Tab",
            "Enter",
            "Control",
        ];
        if (!/[0-9]|\./.test(e.key) && !allowedKeys.includes(e.key)) {
            e.preventDefault();
            setCartUserInputError(true);
        } else {
            setCartUserInputError(false);
        }
    }

    // allow the value to include only numbers before "." and only two numbers after "."
    function validateCartUserValue(value: string) {
        if (!value) {
            setCartUserValueError(false);
            return;
        }
        if (!/^[0-9]+(\.[0-9]{2})?$/.test(value)) {
            setCartUserValueError(true);
        } else {
            setCartUserValueError(false);
            setCartUserValue(value);
        }
    }

    useEffect(() => {
        validateCartUserValue(cartUserValue);
    }, [cartUserValue]);

    return (
        <div className={styles.inputWrapper}>
            <input
                id="cartValue"
                data-test-id="cartValue"
                type="text"
                className={styles.input}
                placeholder=""
                value={cartUserValue}
                onKeyDown={(e) => {
                    validateCartUserInput(e);
                }}
                onChange={(e) => {
                    {
                        setCartUserValue(e.target.value);
                        if (emptyErrors.cartUserValue) {
                            setEmptyErrors({
                                ...emptyErrors,
                                cartUserValue: false,
                            });
                        }
                    }
                }}
            />
            <label className={styles.innerLabel} htmlFor="cartValue">
                Cart value (EUR)
            </label>
            {cartUserInputError && (
                <p className={styles.errorMessage}>
                    Please input the cart value using only numbers and an optional dot.
                </p>
            )}
            {cartUserValueError && (
                <p className={styles.errorMessage}>
                    The cart value is formatted incorrectly.
                </p>
            )}
            {emptyErrors.cartUserValue && (
                <p className={styles.errorMessage}>This field is required.</p>
            )}
        </div>
    );
}
