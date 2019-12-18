/* eslint-disable global-require */
const PRODUCTS = {
    vegas: {
        title: 'Rau củ',
        items: {
            rauCai: {
                name: 'Rau cải',
                price: 7000,
                img: require('../assets/raucai.png'),
            },
            rauNgot: {
                name: 'Rau ngót',
                price: 5000,
                img: require('../assets/raungot.png'),
            },
            carrot: {
                name: 'Cà rốt',
                price: 13000,
                img: require('../assets/carrot.png'),
            },
        },
    },
    fruit: {
        title: 'Trái cây',
        items: {
            banana: {
                name: 'Chuối',
                price: 12000,
                img: require('../assets/chuoi.png'),
            },
            orange: {
                name: 'Cam',
                price: 20000,
                img: require('../assets/cam.png'),
            },
            waterLemon: {
                name: 'Bưởi',
                price: 23000,
                img: require('../assets/buoi.png'),
            },
        },
    },

    // meet: [
    //     { kobeBeef: 'Thịt bò Kobe' },
    //     { pigDui: 'Thịt heo đùi' },
    //     { pigBaChi: 'Thịt heo ba chỉ' },
    //     { chicken: 'Thịt gà' },
    // ],
};

export default PRODUCTS;
