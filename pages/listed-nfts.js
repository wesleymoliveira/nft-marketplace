import React, { useState, useEffect, useContext } from 'react';
import { NFTContext } from '../context/NFTContext';
import { Empty, Loader, NFTCard } from '../components';

const ListedNFTs = () => {
  const [nfts, setNfts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { fetchMyNftsOrListedNfts } = useContext(NFTContext);

  useEffect(() => {
    setIsLoading(true);
    fetchMyNftsOrListedNfts('fetchItemsListed').then((items) => {
      setNfts(items);
      setIsLoading(false);
    });
  }, []);

  if (isLoading) {
    return (
      <div className="flexStart min-h-screen">
        <Loader />
      </div>
    );
  }

  if (!isLoading && nfts.length === 0) {
    return (
      <Empty title={'You don\'t have NFTs listed for sale.'} />
    );
  }

  return (
    <div className="flex justify-center sm:px-4 p-12 min-h-screen">
      <div className="w-full minmd:w-4/5">
        <div className="mt-4">
          <h2 className="font-poppins mt-2 ml-4 sm:ml-2 dark:text-white text-nft-black-1 text-2xl font-semibold">
            My NFTs listed for sale
          </h2>
          <div className="mt-3 w-full flex flex-wrap justify-start md:justify-center">
            {nfts.map((nft) => <NFTCard key={nft.tokenId} nft={nft} />)}

          </div>
        </div>

      </div>
    </div>
  );
};

export default ListedNFTs;
