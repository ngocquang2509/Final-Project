import React from "react";
import styles from "./Home.module.css";
import banner from '../../assets/banner.png'

const Home = () => {
  return (
    <div className={styles.pageContainer}>
      <section className={styles.hero}>
        <h1>Manage your wife xD</h1>
        <div className={styles.paragraph}></div>
        <div className={styles.imgContainer}>
          <img
            src={banner}
            alt="invoicing-app"
          />
        </div>
      </section>
    </div>
  );
};

export default Home;
