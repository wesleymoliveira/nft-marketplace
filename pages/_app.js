import { ThemeProvider } from 'next-themes';
import Script from 'next/script';

import { Footer, Navbar } from '../components';
import { NFTProvider } from '../context/NFTContext';
import '../styles/globals.css';

const MyApp = ({ Component, pageProps }) => (
  <NFTProvider>
    <ThemeProvider attribute="class">
      <div className="dark:bg-nft-dark bg-white min-h-screen">
        <Navbar />
        <div className="pt-65">
          <Component {...pageProps} />

        </div>
        <Footer />
      </div>
      <Script src="https://kit.fontawesome.com/a31ca613f9.js" crossOrigin="anonymous" />
    </ThemeProvider>
  </NFTProvider>
);

export default MyApp;
