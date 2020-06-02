type QueryParams<T extends { [key in string]: any }> = {
    schema?: string;
    table: string;
    columns?: Array<keyof T>;
    limit?: number;
    offset?: number;
};

type WhereFunction<T> = (valueRefSet: Set<T>, args: T[]) => string;

type WhereCondition<T> = {
    [P in keyof T]?: WhereCondition<T[P]> | T[P] | WhereFunction<T[P]> | Array<T[P]>;
};

type OrderCondition<T> = {
    [P in keyof T]?: T[P] extends object ? OrderCondition<T[P]> : 'ASC' | 'DESC';
};

export { QueryParams, WhereFunction, WhereCondition, OrderCondition };
