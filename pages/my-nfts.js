import React, { useState, useEffect, useContext } from 'react';
import Image from 'next/image';

import { NFTContext } from '../context/NFTContext';
import { Loader, NFTCard, Banner, SearchBar, Empty } from '../components';
import images from '../assets';
import { shortenAddress } from '../utils/shortenAddress';

const MyNFTs = () => {
  const [nfts, setNfts] = useState([{ image: images.nft1, tokenId: '', name: '', description: '', price: '', owner: '', seller: '', tokenURI: '' }]);
  const [nftsCopy, setNftsCopy] = useState([]);
  const [activeSelect, setActiveSelect] = useState('Recently Added');

  const { fetchMyNftsOrListedNfts, currentAccount, isLoading } = useContext(NFTContext);

  useEffect(() => {
    fetchMyNftsOrListedNfts('fetchMyNFTs').then((items) => {
      setNfts(items);
      setNftsCopy(items);
    });
  }, []);

  if (!currentAccount) {
    return (
      <Empty
        title="MetaMask is not connected"
        subtitle="Please connect your wallet to see your listed NFTs"
      />
    );
  }

  useEffect(() => {
    const sortedNfts = [...nfts];

    switch (activeSelect) {
      case 'Price (low to high)':
        setNfts(sortedNfts.sort((a, b) => a.price - b.price));
        break;
      case 'Price (high to low)':
        setNfts(sortedNfts.sort((a, b) => b.price - a.price));
        break;
      case 'Recently added':
        setNfts(sortedNfts.sort((a, b) => b.tokenId - a.tokenId));
        break;
      default:
        setNfts(sortedNfts);
        break;
    }
  }, [activeSelect]);

  if (isLoading) {
    return (
      <div className="flexStart min-h-screen">
        <Loader />
      </div>
    );
  }

  const onHandleSearch = (search) => {
    const filteredNfts = nfts.filter((nft) => nft.name.toLowerCase().includes(search.toLowerCase()));

    if (filteredNfts.lenght === 0) {
      setNfts(nftsCopy);
    } else {
      setNfts(filteredNfts);
    }
  };

  const onClearSearch = () => {
    if (nftsCopy.length) {
      setNfts(nftsCopy);
    }
  };

  return (
    <div className="w-full flex justify-start items-center flex-col min-h-screen">
      <div className="w-full flexCenter flex-col">
        <Banner name="Your NFTs" childStyles="text-center mb-4" parentStyles="h-80 justify-center" />

        <div className="flexCenter flex-col -mt-20 z-0">
          <div className="flexCenter w-40 h-40 sm:w-36 sm:h-36 p-1 bg-nft-black-2 rounded-full">
            <Image src={images.creator1} className="rounded-full object-cover" objectFit="cover" />
          </div>
          <p className="font-poppins dark:text-white text-nft-black-1 font-semibold text-2xl mt-6">
            {shortenAddress(currentAccount)}
          </p>

        </div>

      </div>

      { !isLoading && !nftsCopy.length ? (
        <Empty title="Your wallet is empty :(" subtitle="Find hot bids on the marketplace" />
      ) : (
        <>
          <div className="sm:px-4 pt-12 px-12 w-full minmd:w-4/5 flexCenter ">
            <div className="flex-1 w-full flex flex-row sm:flex-col px-4 xs:px-0 minlg:p-8">
              <SearchBar
                activeSelect={activeSelect}
                setActiveSelect={setActiveSelect}
                handleSearch={onHandleSearch}
                clearSearch={onClearSearch}
              />
            </div>
          </div>
          <div className="sm:px-4 pb-12 px-12 w-full minmd:w-4/5 flexCenter flex-col">
            <div className="mt-3 w-full flex flex-wrap">
              {nfts.map((nft) => (
                <NFTCard key={nft.tokenId} nft={nft} onProfilePage />
              ))}
            </div>
          </div>
        </>
      ) }
    </div>
  );
};

export default MyNFTs;
