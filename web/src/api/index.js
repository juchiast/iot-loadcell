import { it } from 'date-fns/locale';

const GLOBAL_ID = 'globalId';
const ITEMS = 'items';

if (localStorage.getItem(GLOBAL_ID) == null) {
    localStorage.setItem(GLOBAL_ID, '0');
    localStorage.setItem(ITEMS, JSON.stringify([]));
}

const clearData = () => {
    localStorage.setItem(GLOBAL_ID, '0');
    localStorage.setItem(ITEMS, JSON.stringify([]));
};

const getDataItems = () => {
    return JSON.parse(localStorage.getItem(ITEMS));
};

const getGlobalId = () => {
    console.log('xxx 820 id: ', JSON.parse(localStorage.getItem(GLOBAL_ID)));
    return JSON.parse(localStorage.getItem(GLOBAL_ID));
};

const putItem = (item) => {
    const data = JSON.parse(localStorage.getItem(ITEMS));
    console.log('xxx 800 data: ', data, item);
    localStorage.setItem(GLOBAL_ID, JSON.stringify(item.id));
    data.push(item);
    localStorage.setItem(ITEMS, JSON.stringify(data));
};

export default {
    getGlobalId,
    getDataItems,
    putItem,
    clearData,
};
