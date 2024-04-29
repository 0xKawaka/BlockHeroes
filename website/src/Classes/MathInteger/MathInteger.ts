export default function truncOrRoundDecimalPoint(number: number) {
  if(Math.round(number) - number < 0.0000000000001) {
    return Math.round(number)
  }
  return Math.trunc(number)
}