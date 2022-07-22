import React from 'react';
import Image from 'next/image';

import images from '../assets';

const Empty = ({ title, subtitle }) => (
  <div className="flexCenter flex-col border-t dark:border-nft-black-1 border-nft-gray-1 sm:py-8 py-16">
    <Image
      src={images.empty}
      alt="empty box"
      objectFit="contain"
      width={250}
    />
    <h1 className="font-bold text-3xl font-poppins leading-70">{title}</h1>
    <p className="font-normal text-xl font-poppins leading-30">{subtitle}</p>

  </div>
);

export default Empty;
