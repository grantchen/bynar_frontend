import Payment from "payment";

function clearNumber(value = "") {
    return value.replace(/\D+/g, "");
}

export function formatCreditCardNumber(value) {
    if (!value) {
        return value;
    }

    const issuer = Payment.fns.cardType(value);
    const clearValue = clearNumber(value);
    let nextValue;

    switch (issuer) {
        case "amex":
            nextValue = `${clearValue.slice(0, 4)} ${clearValue.slice(
                4,
                10
            )} ${clearValue.slice(10, 15)}`;
            break;
        case "dinersclub":
            nextValue = `${clearValue.slice(0, 4)} ${clearValue.slice(
                4,
                10
            )} ${clearValue.slice(10, 14)}`;
            break;
        default:
            nextValue = `${clearValue.slice(0, 4)} ${clearValue.slice(
                4,
                8
            )} ${clearValue.slice(8, 12)} ${clearValue.slice(12, 19)}`;
            break;
    }

    return nextValue.trim();
}

export function formatCVC(value, prevValue, allValues = {}) {
    const clearValue = clearNumber(value);
    let maxLength = 4;

    if (allValues.number) {
        const issuer = Payment.fns.cardType(allValues.number);
        maxLength = issuer === "amex" ? 4 : 3;
    }

    return clearValue.slice(0, maxLength);
}

export function formatExpirationDate(value) {
    const clearValue = clearNumber(value);

    if (clearValue.length >= 3) {
        return `${clearValue.slice(0, 2)}/${clearValue.slice(2, 4)}`;
    }

    return clearValue;
}

export function formatFormData(data) {
    return Object.keys(data).map((d) => `${d}: ${data[d]}`);
}

export function removeNullEntries(obj) {
    return Object.fromEntries(
        Object.entries(obj).filter(([_, v]) => v !== null)
    );
}

export function mergeQueryParams(prevPrams, newParams) {
    let newQueryParams = {};
    for (let key of prevPrams.keys()) {
        newQueryParams[key] = prevPrams.get(key);
    }
    newQueryParams = {
        ...newQueryParams,
        ...newParams,
    };
    return newQueryParams;
}

export function omitQueryParams(prevParams, omitKeys) {
    let newQueryParams = {};
    for (let key of prevParams.keys()) {
        if (!omitKeys.includes(key)) {
            newQueryParams[key] = prevParams.get(key);
        }
    }
    return newQueryParams;
}

export const getAutoSizedColumnWidth = (rows, accessor, headerText) => {
    const maxWidth = 400;
    const minWidth = 58;
    const letterSpacing = 10;
    const cellLength = Math.max(
        ...rows.map((row) => (`${row[accessor]}` || "").length),
        headerText.length,
        10
    );
    if (cellLength <= 3) {
        return minWidth;
    }
    return Math.min(maxWidth, cellLength * letterSpacing + 16);
};
