const wrapToDoubleQuote = (str: string) =>
    str
        .split('.')
        .map((str) => str === '*' ? str : `"${str}"`)
        .join('.');

export { wrapToDoubleQuote };
