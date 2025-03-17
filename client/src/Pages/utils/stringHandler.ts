function removePadding(str: string): string {
  // Check if the string is empty or undefined
  if (!str) {
    return str;
  }

  // Check if the string starts with '0x'
  if (str.startsWith('0x')) {
    // Find the index of the first non-zero character after '0x'
    let i = 2;
    while (i < str.length && str[i] === '0') {
      i++;
    }

    // If all characters after '0x' are zeros, return '0x0'
    if (i === str.length) {
      return '0x0';
    }

    // Return '0x' followed by the rest of the string starting from the first non-zero character
    return '0x' + str.slice(i);
  }

  // If the string doesn't start with '0x', return it unchanged
  return str;
}

export { removePadding };
