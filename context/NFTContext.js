import React, { useEffect, useState } from 'react';
import Web3Modal from 'web3modal';
import { ethers } from 'ethers';
import axios from 'axios';
import { create as ipfsHttpClient } from 'ipfs-http-client';

import { MarketAddress, MarketABI } from './constants';

const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0');

const fetchContract = (providerOrSigner) => new ethers.Contract(MarketAddress, MarketABI, providerOrSigner);

export const NFTContext = React.createContext();
export const NFTProvider = ({ children }) => {
  const [currentAccount, setCurrentAccount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const nftCurrency = 'ETH';

  const checkIfWalletIsConnected = async () => {
    if (!window.ethereum) {
      alert('Please install MetaMask to use this app');
    }

    const accounts = await window.ethereum.request({ method: 'eth_accounts' });

    if (accounts.length) {
      setCurrentAccount(accounts[0]);
    } else {
      console.log('No accounts found');
    }
  };

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert('Please install MetaMask to use this app');
    }
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });

    setCurrentAccount(accounts[0]);
    window.location.reload();
  };

  const uploadToIPFS = async (file) => {
    try {
      setIsLoading(true);
      const added = await client.add({ content: file });
      const url = `https://ipfs.infura.io/ipfs/${added.path}`;
      setIsLoading(false);
      return url;
    } catch (error) {
      console.log('Error uploading file to IPFS', error);
    }
  };

  const createSale = async (fileUrl, formInputPrice, isReselling, id) => {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    const price = ethers.utils.parseUnits(formInputPrice, 'ether');
    const contract = fetchContract(signer);

    const listingPrice = await contract.getListingPrice();

    const transaction = !isReselling
      ? await contract.createToken(fileUrl, price, { value: listingPrice.toString() })
      : await contract.resellToken(id, price, { value: listingPrice.toString() });

    setIsLoading(true);
    await transaction.wait();
    setIsLoading(false);
  };

  const createNFT = async (formInput, fileUrl, router) => {
    const { name, description, price } = formInput;

    if (!name || !description || !price || !fileUrl) {
      alert('Please fill in all fields');
    }

    const data = JSON.stringify({ name, description, image: fileUrl });

    try {
      const added = await client.add(data);
      const url = `https://ipfs.infura.io/ipfs/${added.path}`;
      await createSale(url, price);
      router.push('/');
    } catch (error) {
      console.log('Error creating NFT', error);
    }
  };

  const fetchNFTs = async () => {
    const provider = new ethers.providers.JsonRpcProvider();
    const contract = fetchContract(provider);

    const data = await contract.fetchMarketItems();

    setIsLoading(true);
    const items = await Promise.all(data.map(async (item) => {
      const tokenURI = await contract.tokenURI(item.tokenId);
      const { data: { image, name, description } } = await axios.get(tokenURI);
      const price = ethers.utils.formatUnits(item.price.toString(), 'ether');

      setIsLoading(false);
      return {
        price,
        tokenId: item.tokenId.toNumber(),
        seller: item.seller,
        owner: item.owner,
        image,
        name,
        description,
        tokenURI,
      };
    }));

    return items;
  };

  const fetchMyNftsOrListedNfts = async (type) => {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    setIsLoading(true);

    const contract = fetchContract(signer);

    const data = type === 'fetchItemsListed' ? await contract.fetchItemsListed() : await contract.fetchMyNFTs();

    const items = await Promise.all(data.map(async (item) => {
      const tokenURI = await contract.tokenURI(item.tokenId);
      const { data: { image, name, description } } = await axios.get(tokenURI);
      const price = ethers.utils.formatUnits(item.price.toString(), 'ether');

      return {
        price,
        tokenId: item.tokenId.toNumber(),
        seller: item.seller,
        owner: item.owner,
        image,
        name,
        description,
        tokenURI,
      };
    }));
    setIsLoading(false);
    return items;
  };

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  const buyNFT = async (nft) => {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(MarketAddress, MarketABI, signer);

    const price = ethers.utils.parseUnits(nft.price.toString(), 'ether');
    const transaction = await contract.createMarketSale(nft.tokenId, { value: price });

    setIsLoading(true);
    await transaction.wait();
    setIsLoading(false);
  };

  return (
    <NFTContext.Provider value={{ nftCurrency, connectWallet, currentAccount, uploadToIPFS, createNFT, fetchNFTs, fetchMyNftsOrListedNfts, buyNFT, createSale, isLoading }}>
      {children}
    </NFTContext.Provider>
  );
};
