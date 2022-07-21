import React, { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';

import Image from 'next/image';
import images from '../assets';

const SearchBar = ({ activeSelect, setActiveSelect, handleSearch, clearSearch }) => {
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const [toggle, setToggle] = useState(false);
  const { theme } = useTheme();

  // controll many re-renders
  useEffect(() => {
    const timeout = setTimeout(() => {
      setSearch(debouncedSearch);
    }, 500);

    return () => {
      clearTimeout(timeout);
    };
  }, [debouncedSearch]);

  useEffect(() => {
    if (search) {
      handleSearch(search);
    } else {
      clearSearch();
    }
  }, [search]);

  return (
    <>

      <div className="flex-1 flexCenter dark:bg-nft-black-2 bg-white border dark:border-nft-black-2 border-nft-gray-2 px-4 rounded-md py-3">
        <Image src={images.search} alt="search" width={20} height={20} objectFit="contain" className={theme === 'light' && 'filter invert'} />
        <input type="text" value={debouncedSearch} placeholder="search NFT here..." onChange={(e) => setDebouncedSearch(e.target.value)} className="dark:bg-nft-black-2 bg-white mx-4 w-full text-nft-black-1 font-normal outline-none text-xs dark:text-white" />
      </div>
      <div onClick={() => setToggle((prev) => !prev)} className="relative flexBetween ml-4 sm:ml-0 sm:mt-2 min-w-190 cursor-pointer  dark:bg-nft-black-2 bg-white border dark:border-nft-black-2 border-nft-gray-2 px-4 rounded-md">
        <p className="font-poppins dark:text-white text-nft-black-1 font-normal text-xs">{activeSelect}</p>
        <Image src={images.arrow} alt="arrow down" width={15} height={15} objectFit="contain" className={theme === 'light' && 'filter invert'} />
        {
        toggle && (
          <div className="absolute top-full left-0 right-0 w-full mt-3 z-10 dark:bg-nft-black-2 bg-white border dark:border-nft-black-2 border-nft-gray-2 py-3 rounded-md px-4">
            {['Recently added', 'Price (low to high)', 'Price (high to low)'].map((option) => (
              <p className="font-poppins dark:text-white text-nft-black-1 font-normal text-xs my-3 cursor-pointer">
                <span
                  className="font-poppins dark:text-white text-nft-black-1 font-normal text-xs"
                  onClick={() => setActiveSelect(option)}
                  key={option}
                >
                  {option}
                </span>
              </p>
            ))}
          </div>
        )
      }
      </div>
    </>
  );
};

export default SearchBar;
