export class StringUtil {
  public static formatChainToHex(value: Number) {
    return `0x${value.toString()}`;
  }

  public static ethToWeiHex(ethValue: number): string {
    const weiValue = ethValue * Math.pow(10, 18);
    const weiHex = '0x' + weiValue.toString(16);
    return weiHex;
  }

  public static transactionHash(value: string) {
    const regex = /^0x[0-9a-f]{64}$/i;
    return regex.test(value);
  }
}
