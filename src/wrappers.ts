const wrapToDoubleQuote = (str: string) =>
    str
        .split('.')
        .map((str) => `"${str}"`)
        .join('.');

export { wrapToDoubleQuote };
