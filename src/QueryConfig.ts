import { QueryParams, WhereCondition, OrderCondition, isNullableCondition } from './types';
import { createCondition } from './conditions';
import { addValueToReferenceSet } from './utils';
import { wrap } from './wrappers';

export class QueryConfig<T extends { [key in string]: any }> {
    // make api for subqueries in the future
    public sqlCommand: string;
    private readonly schema?: string;
    private readonly table: string;
    private columnSet: Set<string>;
    private joinSet: Set<string>;
    private whereSet: Set<string>;
    private orderSet: Set<string>;
    private limit?: number;
    private offset?: number;

    private valueRefSet: Set<number | string>;

    constructor({ schema, table, columns = ['*'], limit, offset }: QueryParams<T>) {
        this.schema = schema;
        this.table = table;
        this.sqlCommand = 'SELECT';
        this.columnSet = new Set(columns as Array<string>);
        this.joinSet = new Set();
        this.whereSet = new Set();
        this.orderSet = new Set();
        this.limit = limit;
        this.offset = offset;

        this.valueRefSet = new Set();
    }

    public select(column: keyof T | Array<keyof T>) {
        if (typeof column === 'object') {
            this.columnSet = new Set(column as string[]);
        } else if (typeof column === 'string') {
            this.columnSet = new Set([column]);
        }
        return this;
    }

    public join(table: string, condition: string) {
        this.joinSet.add(`JOIN ${table} ON ${condition}`);
        return this;
    }

    public leftJoin(table: string, condition: string) {
        this.joinSet.add(`LEFT JOIN ${table} ON ${condition}`);
        return this;
    }

    public rightJoin(table: string, condition: string) {
        this.joinSet.add(`RIGHT JOIN ${table} ON ${condition}`);
        return this;
    }

    public where(whereCondition: WhereCondition<T>) {
        const conditions = this.buildWhereConditions(whereCondition);
        for (const condition of conditions) {
            this.whereSet.add(condition);
        }
        return this;
    }

    public orWhere(whereConditions: WhereCondition<T>[]) {
        const orWhereSets = new Set(whereConditions.map((condition) => new Set(this.buildWhereConditions(condition))));
        const orWhereSql = [...orWhereSets].map((set) => [...set].join(' AND ')).join(' OR ');
        this.whereSet.add(`(${orWhereSql})`);
        return this;
    }

    public order(orderCondition: OrderCondition<T>) {
        const orderConditions = this.buildOrderConditions(orderCondition);
        for (const condition of orderConditions) {
            this.orderSet.add(condition);
        }
        return this;
    }

    private buildWhereConditions(whereCondition: WhereCondition<T>): string[] {
        const whereConditions: string[] = [];
        const whereConditionMap = createCondition(whereCondition);
        for (const [column, value] of whereConditionMap) {
            const col = wrap(column);
            if (typeof value === 'function') {
                const fnValue = value(this.valueRefSet);
                if (isNullableCondition(value)) {
                    if (fnValue) {
                        whereConditions.push(`(${col} ${fnValue} OR ${col} ${value.nullableCondition})`);
                    } else {
                        whereConditions.push(`${col} ${value.nullableCondition}`);
                    }
                } else {
                    whereConditions.push(`${col} ${fnValue}`);
                }
            } else if (value === null) {
                whereConditions.push(`${col} IS NULL`);
            } else {
                whereConditions.push(`${col} = $${addValueToReferenceSet(value, this.valueRefSet)}`);
            }
        }
        return whereConditions;
    }

    public get text(): string {
        return [
            this.sqlCommand,
            this.sqlColumns,
            this.sqlFrom,
            this.sqlJoin,
            this.sqlWhere,
            this.sqlOrder,
            this.sqlLimit,
            this.sqlOffset,
        ]
            .filter((sql) => sql)
            .join(' ');
    }

    public get values(): any[] {
        return [...this.valueRefSet];
    }

    private buildOrderConditions(orderCondition: OrderCondition<T>): string[] {
        const orderConditions: string[] = [];
        for (const column in orderCondition) {
            const value = orderCondition[column];
            if (typeof value === 'object') {
                this.buildOrderConditions(value as OrderCondition<T>);
            } else {
                orderConditions.push(`${wrap(column)} ${value}`);
            }
        }
        return orderConditions;
    }

    private get sqlColumns(): string {
        return [...this.columnSet].map(wrap).join(',');
    }

    private get sqlFrom(): string {
        return this.schema ? `FROM ${this.schema}.${this.table}` : `FROM ${this.table}`;
    }

    private get sqlJoin(): string | undefined {
        return this.joinSet.size ? [...this.joinSet].join(' ') : undefined;
    }

    private get sqlWhere(): string | undefined {
        return this.whereSet.size ? `WHERE ${[...this.whereSet].join(' AND ')}` : undefined;
    }

    private get sqlOrder(): string | undefined {
        return this.orderSet.size ? `ORDER BY ${[...this.orderSet].join(',')}` : undefined;
    }

    private get sqlLimit(): string | undefined {
        return this.limit ? `LIMIT ${this.limit}` : undefined;
    }

    private get sqlOffset(): string | undefined {
        return this.offset ? `OFFSET ${this.offset}` : undefined;
    }
}
