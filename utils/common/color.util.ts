export const int32ToRGB = (int: number) => {
  const R = '00' + Math.floor(int / (256 * 256)).toString(16)
  const G = '00' + (Math.floor(int / 256) % 256).toString(16)
  const B = '00' + (int % 256).toString(16)

  return (R.slice(-2) + G.slice(-2) + B.slice(-2)).toUpperCase()
}
