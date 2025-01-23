import styles from '@/styles/page.module.css';

import Calculator from "./calculator"

export default function Home() {
    return (
        <div className={styles.page}>
            <main className={styles.main}>
                <Calculator />
            </main>
        </div>
    );
}
