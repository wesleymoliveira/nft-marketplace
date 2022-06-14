import { ThemeProvider } from 'next-themes';
import Script from 'next/script';

import { Footer, Navbar } from '../components';
import '../styles/globals.css';

const MyApp = ({ Component, pageProps }) => (
  <ThemeProvider attribute="class">
    <Navbar />
    <div className="dark:bg-nft-dark bg-white min-h-screen">
      <Component {...pageProps} />
      <Footer />
    </div>
    <Script src="https://kit.fontawesome.com/a31ca613f9.js" crossOrigin="anonymous" />
  </ThemeProvider>
);

export default MyApp;
