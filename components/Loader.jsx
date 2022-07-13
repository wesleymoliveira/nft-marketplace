import React from 'react';
import Image from 'next/image';

import images from '../assets';

const Loader = () => (
  <div className="flexCenter w-full my-4"><Image src={images.loader} alt="Loader" objectFit="contain" width={100} /></div>
);

export default Loader;
