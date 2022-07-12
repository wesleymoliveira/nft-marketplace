export const shortenAddress = (address) => (
  `${address.substring(0, 6)}...${address.substring(address.length - 4)}`
);
