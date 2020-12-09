import { WhereFunction } from './types';
import { addValueToReferenceSet, isJson } from './utils';

/**
 * Basic operators
 * Right Operand @type number | string
 */

/** IN(arg1, arg2, ...) */
const In = <T extends number | string>(args: T[]): WhereFunction<T> => {
    return function (valueRefSet: Set<T>) {
        const refs = args.map((arg) => `$${addValueToReferenceSet(arg, valueRefSet)}`);
        return `IN (${refs.join(',')})`;
    };
};

/** NOT IN(arg1, arg2, ...) */
const NotIn = <T extends number | string>(args: T[]): WhereFunction<T> => {
    return function (valueRefSet: Set<T>) {
        const refs = args.map((arg) => `$${addValueToReferenceSet(arg, valueRefSet)}`);
        return `NOT IN (${refs.join(',')})`;
    };
};

/** Equal(arg) or EQ(arg)*/
const Equal = <T extends number | string>(arg: T): WhereFunction<T> => {
    return function (valueRefSet: Set<any>) {
        const ref = addValueToReferenceSet(arg, valueRefSet);
        return `= $${ref}`;
    };
};

/** NotEqual(arg) or NE(arg)*/
const NotEqual = <T extends number | string>(arg: T): WhereFunction<T> => {
    return function (valueRefSet: Set<any>) {
        const ref = addValueToReferenceSet(arg, valueRefSet);
        return `<> $${ref}`;
    };
};

/** Greater(arg) or GT(arg) */
const Greater = <T extends number | string>(arg: T): WhereFunction<T> => {
    return function (valueRefSet: Set<any>) {
        const ref = addValueToReferenceSet(arg, valueRefSet);
        return `> $${ref}`;
    };
};

/** Less(arg) or LT(arg) */
const Less = <T extends number | string>(arg: T): WhereFunction<T> => {
    return function (valueRefSet: Set<any>) {
        const ref = addValueToReferenceSet(arg, valueRefSet);
        return `< $${ref}`;
    };
};

/** GreaterEqual(arg) or GTE(arg) */
const GreaterEqual = <T extends number | string>(arg: T): WhereFunction<T> => {
    return function (valueRefSet: Set<any>) {
        const ref = addValueToReferenceSet(arg, valueRefSet);
        return `>= $${ref}`;
    };
};

/** LessEqual(arg) or LTE(arg) */
const LessEqual = <T extends number | string>(arg: T): WhereFunction<T> => {
    return function (valueRefSet: Set<any>) {
        const ref = addValueToReferenceSet(arg, valueRefSet);
        return `<= $${ref}`;
    };
};

/**
 * Array operators
 * Right Operand @type number[] | string[]
 */

/** 
 * @description Does the left ARRAY value entries equal the right ARRAY values?
 * @example '{a,b,c}' `@>` '{b}' // true
 */
const ArrayEqual = <T extends number[] | string[]>(arg: T): WhereFunction<T> => {
    return function (valueRefSet: Set<any>) {
        const ref = addValueToReferenceSet(`{${arg.join(',')}}`, valueRefSet);
        return `= $${ref}`;
    };
};

/** 
 * @description Does the left ARRAY value entries equal the right ARRAY values?
 * @example '{a,b,c}' `@>` '{b}' // true
 */
const ArrayNotEqual = <T extends number[] | string[]>(arg: T): WhereFunction<T> => {
    return function (valueRefSet: Set<any>) {
        const ref = addValueToReferenceSet(`{${arg.join(',')}}`, valueRefSet);
        return `<> $${ref}`;
    };
};

/** 
 * @description Does the left ARRAY values less than the right ARRAY values?
 * @example ARRAY[1,2,3] < ARRAY[1,2,4]' // true
 */
const ArrayLess = <T extends number[] | string[]>(arg: T): WhereFunction<T> => {
    return function (valueRefSet: Set<any>) {
        const ref = addValueToReferenceSet(`{${arg.join(',')}}`, valueRefSet);
        return `< $${ref}`;
    };
};

/** 
 * @description Does the left ARRAY values greater than the right ARRAY values?
 * @example ARRAY[1,4,3] > ARRAY[1,2,4] // true
 */
const ArrayGreater = <T extends number[] | string[]>(arg: T): WhereFunction<T> => {
    return function (valueRefSet: Set<any>) {
        const ref = addValueToReferenceSet(`{${arg.join(',')}}`, valueRefSet);
        return `> $${ref}`;
    };
};

/** 
 * @description Does the left ARRAY values less than or equal the right ARRAY values?
 * @example ARRAY[1,2,3] <= ARRAY[1,2,3] // true
 */
const ArrayLessEqual = <T extends number[] | string[]>(arg: T): WhereFunction<T> => {
    return function (valueRefSet: Set<any>) {
        const ref = addValueToReferenceSet(`{${arg.join(',')}}`, valueRefSet);
        return `<= $${ref}`;
    };
};

/** 
 * @description Does the right ARRAY values greater than or equal the left ARRAY values?
 * @example ARRAY[1,4,3] >= ARRAY[1,4,3] // true
 */
const ArrayGreaterEqual = <T extends number[] | string[]>(arg: T): WhereFunction<T> => {
    return function (valueRefSet: Set<any>) {
        const ref = addValueToReferenceSet(`{${arg.join(',')}}`, valueRefSet);
        return `>= $${ref}`;
    };
};

/** 
 * @description Does the left ARRAY values contain the right ARRAY values?
 * @example ARRAY[1,4,3] `@>` ARRAY[3,1,3] // true
 */
const ArrayLeftContain = <T extends number[] | string[]>(arg: T): WhereFunction<T> => {
    return function (valueRefSet: Set<any>) {
        const ref = addValueToReferenceSet(`{${arg.join(',')}}`, valueRefSet);
        return `@> $${ref}`;
    };
};

/** 
 * @description Does the right ARRAY values contain the left ARRAY values?
 * @example ARRAY[2,2,7] `<@` ARRAY[1,7,4,2,6] // true
 */
const ArrayRightContain = <T extends number[] | string[]>(arg: T): WhereFunction<T> => {
    return function (valueRefSet: Set<any>) {
        const ref = addValueToReferenceSet(`{${arg.join(',')}}`, valueRefSet);
        return `<@ $${ref}`;
    };
};

/** 
 * @description Does the ARRAY values overlap (have elements in common)?
 * @example ARRAY[1,4,3] && ARRAY[2,1] // true
 */
const ArrayOverlap = <T extends number[] | string[]>(arg: T): WhereFunction<T> => {
    return function (valueRefSet: Set<any>) {
        const ref = addValueToReferenceSet(`{${arg.join(',')}}`, valueRefSet);
        return `&& $${ref}`;
    };
};

/**
 * Json operators
 * Right Operand @type object | object[]
 */

/**
 * @description Are the left JSON path/value entries contained at the top level within the right JSON value?
 * @example '{"a":1, "b":2}'::jsonb `@>` '{"b":2}'::jsonb // true
 */
const JsonLeftContain = <T extends object | object[]>(arg: T): WhereFunction<T> => {
    return function (valueRefSet: Set<any>) {
        const ref = addValueToReferenceSet(JSON.stringify(arg), valueRefSet);
        return `@> $${ref}`;
    };
};

/** 
 * @description Are the left JSON path/value entries contained at the top level within the right JSON value?
 * @example '{"b":2}'::jsonb `<@` '{"a":1, "b":2}'::jsonb // true
 */
const JsonRightContain = <T extends object | object[]>(
    arg: T
): WhereFunction<T> => {
    return function (valueRefSet: Set<any>) {
        const ref = addValueToReferenceSet(JSON.stringify(arg), valueRefSet);
        return `<@ $${ref}`;
    };
};

/**
 * Common operators
 */

/** 
 * @description Are the left values contained in the right values?
 */
const LeftContain = (arg: any) => isJson(arg) ? JsonLeftContain : ArrayLeftContain;
/** 
 * @description Are the right values contained in the left values
 */
const RightContain = (arg: any) => isJson(arg) ? JsonRightContain : ArrayRightContain;

export {
    Equal,
    Equal as eq,
    NotEqual,
    NotEqual as ne,
    Greater,
    Greater as gt,
    Less,
    Less as lt,
    GreaterEqual,
    GreaterEqual as gte,
    LessEqual,
    LessEqual as lte,
    In,
    NotIn
};

export const array = {
    ArrayEqual,
    ae: ArrayEqual,
    ArrayNotEqual,
    ane: ArrayNotEqual,
    ArrayLess,
    al: ArrayLess,
    ArrayGreater,
    ag: ArrayGreater,
    ArrayLessEqual,
    ale: ArrayLessEqual,
    ArrayGreaterEqual,
    age: ArrayGreaterEqual,
    LeftContain: ArrayLeftContain,
    lc: ArrayLeftContain,
    RightContain: ArrayRightContain,
    rc: ArrayRightContain,
    ArrayOverlap,
    ao: ArrayOverlap
};

export const json = {
    LeftContain: JsonLeftContain,
    lc: JsonLeftContain,
    RightContain: JsonRightContain,
    rc: JsonRightContain
};

export {
    LeftContain,
    LeftContain as lc,
    RightContain,
    RightContain as rc
};
