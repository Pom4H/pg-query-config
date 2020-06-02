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

export { addValueToReferenceSet };
