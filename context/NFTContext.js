import React, { useEffect, useState } from 'react';
import Web3Modal from 'web3modal';
import { ethers } from 'ethers';
import axios from 'axios';

import { MarketAddress, MarketABI } from './constants';

export const NFTContext = React.createContext();
export const NFTProvider = ({ children }) => {
  const nftCurrency = 'ETH';

  return (
    <NFTContext.Provider value={{ nftCurrency }}>
      {children}
    </NFTContext.Provider>
  );
};
