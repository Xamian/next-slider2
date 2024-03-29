import Head from 'next/head'
// import Image from 'next/image'
import styles from './Home.module.scss'
import { Game } from '../components/game'

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Max' Slider Game 2</title>
        <meta name="description" content="Stupid little sliding puzzle game." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <Game />
      </main>

      <footer className={styles.footer}>
        <div><a
          href="https://max-it.dk/"
          target="_blank"
        >max-it.dk</a> © 2020-2022</div>
      </footer>
    </div>
  )
}
