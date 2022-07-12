
import { useState, useEffect, useRef, useContext } from 'react';
import Image from 'next/image';
import { useTheme } from 'next-themes';
import { Banner, CreatorCard, NFTCard } from '../components';

import images from '../assets';
import { makeFakeId } from '../utils/makeFakeId';
import { NFTContext } from '../context/NFTContext';

const Home = () => {
  const parentRef = useRef(null);
  const scrollRef = useRef(null);
  const [hideButtons, setHideButtons] = useState(false);
  const { fetchNFTs } = useContext(NFTContext);
  const [nfts, setNfts] = useState([]);

  useEffect(() => {
    fetchNFTs().then((items) => {
      setNfts(items);
    });
  }, []);

  const handleScroll = (direction) => {
    const { current } = scrollRef;

    const scrollAmount = window.innerWidth > 1800 ? 270 : 210;

    if (direction === 'left') {
      current.scrollLeft -= scrollAmount;
    } else {
      current.scrollLeft += scrollAmount;
    }
  };

  const { theme } = useTheme();

  const isScrollable = () => {
    const { current } = scrollRef;
    const { current: parent } = parentRef;

    if (current?.scrollWidth >= parent?.offsetWidth) {
      setHideButtons(false);
    } else {
      setHideButtons(true);
    }
  };

  useEffect(() => {
    isScrollable();
    window.addEventListener('resize', isScrollable);

    return () => {
      window.removeEventListener('resize', isScrollable);
    };
  });

  return (

    <div className="flex justify-center sm:px-4 p-12">
      <div className="w-full minmd:w-4/5">
        <Banner parentStyles="justify-start mb-6 h-72 sm:h-60 p-12 xs:p-4 xs:h-44 rounded-3xl" childStyles="md:text-4xl sm: text-2xl xs:text-x1 text-left" name="Discover, collect, and sell extraordinary NFTs" />
        <div>
          <h1 className="font-poppins dark:text-white text-nft-black-1 text-2xl minlg:text-4xl font-semibold ml-4 xs:ml-0">Top Sellers</h1>
          <div className="relative flex-1 max-w-full flex mt-3" ref={parentRef}>
            <div className="flex flex-row w-max overflow-x-scroll no-scrollbar select-none" ref={scrollRef}>
              {[6, 7, 8, 9, 10].map((i) => (
                <CreatorCard
                  key={`creator-${i}`}
                  rank={i}
                  creatorImage={images[`creator${i}`]}
                  creatorAddress={`0x${makeFakeId(3)}...${makeFakeId(4)}`}
                  creatorEths={10 - i * 0.5}
                />
              ))}
              {!hideButtons && (
                <>
                  <div className="absolute w-8 h-8 minlg:w-12 minlg:h-12 top-45 cursor-pointer left-0" onClick={() => handleScroll('left')}>
                    <Image src={images.left} layout="fill" objectFit="contain" alt="left_arrow" className={theme === 'light' && 'filter invert'} />
                  </div>
                  <div className="absolute w-8 h-8 minlg:w-12 minlg:h-12 top-45 cursor-pointer right-0" onClick={() => handleScroll('right')}>
                    <Image src={images.right} layout="fill" objectFit="contain" alt="right_arrow" className={theme === 'light' && 'filter invert'} />
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
        {nfts.length > 0 && (
          <div className="mt-10">
            <div className="flexBetween mx-4 xs:mx-0 minlg:mx-8 sm:flex-col sm:items-start">
              <h1 className="flex-1 font-poppins dark:text-white text-nft-black-1 text-2xl minlg:text-4xl font-semibold sm:mb-4">Hot Bids</h1>
              <div>
                {/* TODO add search bar */}
                SearchBar
              </div>
            </div>

            <div className="mt-3 w-full flex flex-wrap justify-start md:justify-center">
              {nfts.map((nft) => (

                <NFTCard
                  key={`nft-${nft.tokenId}`}
                  nft={nft}
                />
              ))}

            </div>
          </div>
        )}
      </div>
    </div>

  );
};

export default Home;
