import { wrap } from './wrappers';
import { In } from './operators';

const createCondition = (object: Record<string, any>): Map<string, number | string | Function> => {
    const conditionMap = new Map();
    for (const prop in object) {
        if (Array.isArray(object[prop])) {
            conditionMap.set(prop, In(object[prop]));
        } else if (typeof object[prop] === 'object') {
            createJsonCondition(wrap(prop), object[prop], conditionMap);
        } else if (object[prop]) {
            conditionMap.set(prop, object[prop]);
        }
    }
    return conditionMap;
};

const createJsonCondition = (key: string, object: any, conditionMap: Map<string, number | string | Function>) => {
    for (const prop in object) {
        if (Array.isArray(object[prop])) {
            conditionMap.set(`${key}->>'${prop}'`, In(object[prop]));
        } else if (typeof object[prop] === 'object') {
            createJsonCondition(`${key}->'${prop}'`, object[prop], conditionMap);
        } else if (object[prop]) {
            conditionMap.set(`${key}->>'${prop}'`, object[prop]);
        }
    }
};

export { createCondition };
