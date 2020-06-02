import { WhereFunction } from './types';
import { addValueToReferenceSet } from './utils';

/** IN(arg1, arg2, ...) */
export const In = <T extends number | string>(args: T[]): WhereFunction<T> => {
    return function (valueRefSet: Set<T>) {
        const refs = args.map((arg) => `$${addValueToReferenceSet(arg, valueRefSet)}`);
        return `IN (${refs.join(',')})`;
    };
};

/** @description Does the left JSON value contain the right JSON path/value entries at the top level?
 * @example '{"a":1, "b":2}'::jsonb `@>` '{"b":2}'::jsonb // true
 */
export const LeftContain = <T>(arg: T): WhereFunction<T> => {
    return function (valueRefSet: Set<any>) {
        const ref = addValueToReferenceSet(JSON.stringify(arg), valueRefSet);
        return `@> $${ref}`;
    };
};

/** @description Are the left JSON path/value entries contained at the top level within the right JSON value?
 * @example '{"b":2}'::jsonb `<@` '{"a":1, "b":2}'::jsonb // true
 */
export const RightContain = <T>(arg: T): WhereFunction<T> => {
    return function (valueRefSet: Set<any>) {
        const ref = addValueToReferenceSet(JSON.stringify(arg), valueRefSet);
        return `<@ ${ref}`;
    };
};
