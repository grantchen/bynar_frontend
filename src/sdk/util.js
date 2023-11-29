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

export const getAutoSizedColumnWidth = (rows, accessor, headerText, overrideRowValueMaxLength = 0) => {
    const maxWidth = 400;
    const minWidth = 58;
    const letterSpacing = 10;
    const maxValQueue = overrideRowValueMaxLength ? [overrideRowValueMaxLength] : rows.map((row) => (`${row[accessor]}` || "").length)
    const cellLength = Math.max(
        ...maxValQueue,
        headerText.length,
        10
    );
    if (cellLength <= 3) {
        return minWidth;
    }
    return Math.min(maxWidth, cellLength * letterSpacing + 16);
};

export const uuidv4 = () => {
    const randomValues = (c) =>
        typeof crypto !== 'undefined'
            ? crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4))
            : (Math.random() * 16) >> (c / 4);

    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
        (c ^ randomValues(c)).toString(16)
    );
}


export const downloadFile = (url, filename = '') => {
    if (filename.length === 0) filename = url.split('/').pop();
    const req = new XMLHttpRequest();
    req.open('GET', url, true);
    req.responseType = 'blob';
    req.onload = function () {
        const blob = new Blob([req.response], {
            type: 'application/pdf',
        });
        debugger

        const isIE = false || !!document.documentMode;
        if (isIE) {
            window.navigator.msSaveBlob(blob, filename);
        } else {
            const windowUrl = window.URL || window.webkitURL;
            const href = windowUrl.createObjectURL(blob);
            const a = document.createElement('a');
            a.setAttribute('download', filename);
            a.setAttribute('href', href);
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        }
    };
    req.send();
};


// getQueryVariable is a function to get the query variable from the url(handle url containing '+', '=')
export function getQueryVariable(url, variable) {
    const u = new URL(url)
    const query = u.search.substring(1);
    const vars = query.split('&');
    for (let i = 0; i < vars.length; i++) {
        const pair = vars[i].split(/=(.*)/s);
        if (decodeURIComponent(pair[0]) === variable) {
            return decodeURIComponent(pair[1]);
        }
    }
}

export function handleActiveTabCfg(idx) {
    // config hidden or display
    const elem = document.querySelector(`.tab-content-wrapper.tab-content-${idx} .tree-grid-content .tree-grid-wrapper div`);
    if (elem !== null) {
        let gridDisabled = document.getElementsByClassName('GridDisabled')
        let menuMain = document.getElementsByClassName('TSMenuMain')
        if (localStorage.getItem(elem.id) === "true") {
            for (let i = 0; i < gridDisabled.length; i++) {
                gridDisabled[i].style.zIndex = "256";
            }
            for (let i = 0; i < menuMain.length; i++) {
                menuMain[i].style.display = "block";
            }
        } else {
            for (let i = 0; i < gridDisabled.length; i++) {
                gridDisabled[i].style.zIndex = "-99";
            }
            for (let i = 0; i < menuMain.length; i++) {
                menuMain[i].style.display = "none";
            }
        }
    } else {
        let gridDisabled = document.getElementsByClassName('GridDisabled')
        let menuMain = document.getElementsByClassName('TSMenuMain')
        for (let i = 0; i < gridDisabled.length; i++) {
            gridDisabled[i].style.zIndex = "-99";
        }
        for (let i = 0; i < menuMain.length; i++) {
            menuMain[i].style.display = "none";
        }
    }
}
