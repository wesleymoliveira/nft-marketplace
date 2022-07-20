import React, { useState, useEffect, useContext } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';

import { NFTContext } from '../context/NFTContext';
import { Loader, Button, Modal, PaymentBodyCmp } from '../components';
import images from '../assets';
import { shortenAddress } from '../utils/shortenAddress';

const NFTDetails = () => {
  const router = useRouter();
  const [nft, setNft] = useState({ image: images.nft1, tokenId: '', name: '', description: '', price: '', owner: '', seller: '', tokenURI: '' });
  const [isLoading, setIsLoading] = useState(true);
  const [paymentModal, setPaymentModal] = useState(false);
  const [successModal, setSuccessModal] = useState(false);

  const { nftCurrency, currentAccount, buyNFT } = useContext(NFTContext);

  useEffect(() => {
    if (!router.isReady) return;

    setNft(router.query);

    setIsLoading(false);
  }, [router.isReady]);

  if (isLoading) { <Loader />; }

  const checkout = async () => {
    await buyNFT(nft);

    setPaymentModal(false);
    setSuccessModal(true);
  };

  return (
    <div className="relative flex justify-center md:flex-col min-h-screen">
      <div className="relative flex-1 flexCenter sm:px-4 p-12 border-r md:border-r-0 md:border-b dark:border-nft-black-1 border-nft-gray-1">
        <div className="relative w-557 minmd:w-2/3 minmd:h-2/3 sm:w-full sm:h-300 h-557 ">
          <Image src={nft.image} objectFit="cover" className=" rounded-xl shadow-lg" layout="fill" />
        </div>
      </div>
      <div className="flex-1 justify-start sm:px-4 p-12 sm:pb-4">
        <div className="flex flex-row sm:flex-col">
          <h2 className="font-poppins dark:text-white text-nft-black-1 font-semibold text-2xl minlg:text-3xl">{nft.name}</h2>
        </div>
        <div className="mt-10">
          <p className="font-poppins dark:text-white text-nft-black-1 text-xs minlg:text-base font-normal">Creator</p>
          <div className="flex flex-row items-center mt-3">
            <div className="relative w-12 h-12 minlg:w-20 minlg:h-20 mr-2">
              <Image src={images.creator1} objectFit="cover" className="rounded-full" />
            </div>
            <p className="font-poppins dark:text-white text-nft-black-1 text-sm minlg:text-lg font-semibold">{shortenAddress(nft.seller)}</p>
          </div>
        </div>
        <div className="mt-10 flex flex-col">
          <div className="w-full border-b dark:border-nft-black-1 border-x-nft-gray-1 flex flex-row">
            <p className="font-poppins dark:text-white text-nft-black-1 text-base minlg:text-lg font-medium mb-2">Details</p>
          </div>
          <div className="mt-3">
            <p className="font-poppins dark:text-white text-nft-black-1 text-base font-normal">
              {nft.description}
            </p>
          </div>
        </div>
        <div className="flex flex-row sm:flex-col mt-10">
          {currentAccount === nft.seller.toLowerCase()
            ? (
              <p className="font-poppins dark:text-white text-nft-black-1 font-normal text-base border border-gray p-2">
                You cannot buy your own NFT
              </p>
            )
            : currentAccount === nft.owner.toLowerCase()
              ? (
                <Button
                  btnName="List on Marketplace"
                  btnType="primary"
                  classStyles="mr-5 sm:mr-0 sm:mb-5 rounded-xl"
                  handleClick={() => router.push(`/resell-nft?tokenID=${nft.tokenId}&tokenURI=${nft.tokenURI}`)}
                />
              )
              : (
                <Button
                  btnName={`Buy for ${nft.price} ${nftCurrency}`}
                  btnType="primary"
                  classStyles="mr-5 sm:mr-0 sm:mb-5 rounded-xl"
                  handleClick={() => setPaymentModal(true)}
                />
              )}
        </div>
      </div>
      {paymentModal && (
        <Modal
          header="Check Out"
          body={<PaymentBodyCmp nft={nft} nftCurrency={nftCurrency} />}
          footer={(
            <div className="flex flex-row sm:flex-col">
              <Button
                btnName="Checkout"
                btnType="primary"
                classStyles="mr-5 sm:mr-0 sm:mb-5 rounded-xl"
                handleClick={checkout}
              />
              <Button
                btnName="Cancel"
                btnType="outline"
                classStyles="rounded-lg"
                handleClick={() => setPaymentModal(false)}
              />
            </div>
          )}
          handleClose={() => setPaymentModal(false)}
        />
      )}
      {
        successModal && (
          <Modal
            header="Payment Successfull"
            body={(
              <div className="flexCenter flex-col text-center" onClick={() => setSuccessModal(false)}>
                <div className="relative w-52 h-52">
                  <Image src={nft.image} objectFit="cover" className="rounded-xl shadow-lg" layout="fill" />
                </div>
                <p className="font-poppins dark:text-white text-nft-black-1 font-normal text-base mt-10">
                  You have successfully bought the NFT
                </p>
                <p className="font-poppins dark:text-white text-nft-black-1 text-xl font-semibold mt-2">
                  {nft.name}
                </p>
                <p className="font-poppins dark:text-white text-nft-black-1 font-normal text-base">
                  from
                </p>
                <p className="font-poppins dark:text-white text-nft-black-1 text-lg font-semibold">
                  {shortenAddress(nft.seller)}
                </p>
              </div>
)}
            handleClose={() => setSuccessModal(false)}
            footer={(
              <div className="flexCenter flex-col">
                <Button
                  btnName="Check it out"
                  btnType="primary"
                  classStyles="sm:mr-0 sm:mb-5 rounded-xl"
                  handleClick={() => router.push('/my-nfts')}
                />
              </div>
          )}
          />
        )
      }

    </div>
  );
};

export default NFTDetails;
