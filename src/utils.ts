const addValueToReferenceSet = (value: number | string, referenceSet: Set<number | string>): number => {
    let reference;
    if (referenceSet.has(value)) {
        reference = [...referenceSet].indexOf(value) + 1;
    } else {
        referenceSet.add(value);
        reference = referenceSet.size;
    }
    return reference;
};

const isArrayOfObjects = (arg: any[]): arg is object[] => {
    return arg.some(entry => typeof entry === 'object');
}

const isJson = (arg: number | number[] | string | string[] | object | object[]): arg is object | object[] => {
    return Array.isArray(arg) && isArrayOfObjects(arg) || typeof arg === 'object';
}

export { addValueToReferenceSet, isJson };

