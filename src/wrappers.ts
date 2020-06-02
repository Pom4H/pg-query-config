const hasUpperCase = (str: string) => str.match(/[A-Z]/);
const hasLine = (str: string) => str.match(/[-]/);
const wrapToDoubleQuote = (str: string) =>
    str
        .split('.')
        .map((str) => `"${str}"`)
        .join('.');

const wrap = (str: string) => (hasUpperCase(str) && !hasLine(str) ? wrapToDoubleQuote(str) : str);

export { wrap };
