const isWrappable = (str: string) => /^[A-Za-z0-9]/.test(str);
const wrapToDoubleQuote = (str: string) =>
    str
        .split('.')
        .map((str) => str === '*' ? str : `"${str}"`)
        .join('.');

export const wrap = (str: string) => isWrappable(str) ? wrapToDoubleQuote(str) : str;
