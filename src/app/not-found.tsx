import Link from 'next/link'
import styles from '../assets/css/notfound.module.css'


export default function NotFound() {
  return (
    <div className={styles.notpageContainer}>
      <div className={styles.face}>
        <div className={styles.band}>
          <div className={styles.red}></div>
          <div className={styles.white}></div>
          <div className={styles.blue}></div>
        </div>
        <div className={styles.eyes}></div>
        <div className={styles.dimples}></div>
        <div className={styles.mouth}></div>
      </div>

      <h1 className={styles.notpageH1}>Oops! Something went wrong!</h1>
      <div className={styles.notpageBtn}>
        <Link href="/">Return to Home</Link>
      </div>
    </div>
  )
}