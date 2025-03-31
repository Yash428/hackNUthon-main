
// Safely apply toFixed to a value that might be a string or number
export const safeToFixed = (value: any, digits: number = 2): string => {
  if (typeof value === 'number') {
    return value.toFixed(digits);
  } else if (typeof value === 'string' && !isNaN(parseFloat(value))) {
    return parseFloat(value).toFixed(digits);
  }
  return String(value);
};
