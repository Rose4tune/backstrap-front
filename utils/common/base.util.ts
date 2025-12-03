export const isNil = <T>(value: T | nil): value is nil => {
    return value == null;
};

export const isNotNil = <T>(value: T | nil): value is T => !isNil(value);

export const isEmpty = <T>(value: T | nil): value is nil => {
    if (isNil(value)) {
        return true;
    }

    if (typeof value === "string") {
        return value.length === 0;
    }

    if (typeof value === "object") {
        // if (value instanceof Date) {
        //   return !isValidDate(value);
        // }

        /* TODO value.constructor === Object 확인 필요?*/
        return Object.keys(value as unknown as object).length === 0;
    }

    if (Array.isArray(value) && value.length === 0) {
        return true;
    }

    return false;
};

export const isEmptyWithTrim = (value: string | nil): value is nil => {
    return isEmpty(value?.trim());
};

export const isNotEmpty = <T>(value: T | nil): value is T => !isEmpty(value);

export const isNotEmptyWithTrim = (value: string | nil): value is string =>
    !isEmptyWithTrim(value);

export const isJsonString = (str: string) => {
    try {
        let json = JSON.parse(str);
        return (typeof json === 'object');
    } catch (e) {
        return false;
    }
}