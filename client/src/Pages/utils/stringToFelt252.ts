export default function stringToFelt252(str: string): bigint {
  const maxFelt252 = (2n ** 252n) - 1n; // Maximum value for felt252
  
  // Convert the string to a hexadecimal representation
  let hexString = "0x" + Buffer.from(str, 'utf8').toString('hex');
  
  // Convert the hex string to a BigInt
  let bigIntValue = BigInt(hexString);
  
  // Ensure that it fits within the felt252 range
  if (bigIntValue > maxFelt252) {
    throw new Error("Value exceeds the felt252 limit.");
  }

  return bigIntValue;
}