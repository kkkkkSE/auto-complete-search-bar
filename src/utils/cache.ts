const EXPIRE_TIME = 1 * 1000 * 60;

export const setCache = ({
  key, cacheKey, cacheValue,
}: {
  key: string;
  cacheKey : string;
  cacheValue: unknown;
}) => {
  const cacheDataString = localStorage.getItem(key);

  const cacheData = cacheDataString ? JSON.parse(cacheDataString) : {};

  const cacheValueString = JSON.stringify(cacheValue);

  try {
    const newCacheData = {
      ...cacheData,
      [cacheKey]: {
        expire: Date.now() + EXPIRE_TIME,
        data: cacheValueString,
      },
    };

    const newCacheDataString = JSON.stringify(newCacheData);

    localStorage.setItem(key, newCacheDataString);
  } catch (e) {
    if (e instanceof Error) {
      throw new Error(e.message);
    }
  }
};

export const getCache = ({
  key, cacheKey,
}: {
  key: string;
  cacheKey: string;
}) => {
  const cacheDataString = localStorage.getItem(key);

  const cacheData = cacheDataString ? JSON.parse(cacheDataString) : {};

  const searchCache = cacheData[cacheKey] || '';

  if (!searchCache) {
    return null;
  }

  if (Date.now() > searchCache.expire) {
    delete cacheData[cacheKey];

    localStorage.setItem(key, JSON.stringify(cacheData));

    return null;
  }

  return JSON.parse(searchCache.data);
};
