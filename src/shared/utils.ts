export const chunkArray = (array, chunkSize = 10) => {
  const chunks = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    const chunk = array.slice(i, i + chunkSize);
    chunks.push(chunk);
  }
  return chunks;
};

export const keys = <T>(obj: T): (keyof T)[] => {
  const k: (keyof T)[] = [];
  for (const key in obj) k.push(key);
  return k;
};

export const omit = <DataType>(
  object: DataType,
  keysToFilter: (keyof DataType)[],
) => {
  const result = {} as DataType;
  const activeKeys = keys(object).filter((key) => !keysToFilter.includes(key));
  for (const key of activeKeys) {
    result[key] = object[key];
  }
  return result;
};
