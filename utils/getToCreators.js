
function compareValues(key, order = 'asc') {
  return function innerSort(a, b) {
    if (!Object.prototype.hasOwnProperty.call(a, key) || !Object.prototype.hasOwnProperty.call(b, key)) {
      // property doesn't exist on either object
      return 0;
    }

    const varA = (typeof a[key] === 'string')
      ? a[key].toUpperCase() : a[key];
    const varB = (typeof b[key] === 'string')
      ? b[key].toUpperCase() : b[key];

    let comparison = 0;
    if (varA > varB) {
      comparison = 1;
    } else if (varA < varB) {
      comparison = -1;
    }
    return (
      (order === 'desc') ? (comparison * -1) : comparison
    );
  };
}

export const getTopCreators = (nfts) => {
  const topCreators = nfts.reduce((creatorObj, nft) => {
    const obj = creatorObj;
    (obj[nft.seller] = creatorObj[nft.seller] || []).push(nft);

    return obj;
  }, {});

  const reducedCreators = Object.entries(topCreators).map((creator) => {
    const seller = creator[0];
    const sum = creator[1].map((nft) => Number(nft.price)).reduce((prev, curr) => prev + curr, 0);

    return ({ seller, sum });
  });

  // order descending by 'sum' key
  return reducedCreators.sort(compareValues('sum', 'desc'));
};
