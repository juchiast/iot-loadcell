import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Layout, Select, Tooltip, Card, Input, Form, Button } from 'antd';
import PRODUCTS from '../../Utils/Product';
import './ItemSelect.scss';

const { Option } = Select;
const { Content } = Layout;
const { Meta } = Card;
const { Search } = Input;

const DumpData = {
    vegas: [{ rauCai: 'Rau cải' }, { rauNgot: 'Rau ngót' }, { carrot: 'Cà rốt' }],
    fruit: [{ banana: 'Chuối' }, { orange: 'Cam' }, { waterLemon: 'Bưởi' }],
    meet: [
        { kobeBeef: 'Thịt bò Kobe' },
        { pigDui: 'Thịt heo đùi' },
        { pigBaChi: 'Thịt heo ba chỉ' },
        { chicken: 'Thịt gà' },
    ],
};

class ItemSelect extends Component {
    constructor(props) {
        super(props);
        this.state = {
            typeItem: 'vegas',
            nameItem: Object.keys(DumpData.vegas[0])[0],
        };
    }

    onTypeChange = (value) => {
        const { onSelect } = this.props;

        const typeItem = value;
        const nameItem = Object.keys(DumpData[value][0])[0];
        this.setState({ typeItem, nameItem });
        // console.log('xxx type change: ', Object.keys(DumpData[value][0])[0]);

        onSelect(typeItem, nameItem);
    };

    onNameChange = (value) => {
        const { onSelect } = this.props;
        const { typeItem } = this.state;

        const nameItem = value;
        this.setState({ nameItem });

        onSelect(typeItem, nameItem);
    };

    render() {
        const { typeItem, nameItem } = this.state;
        return (
            <div>
                <Search
                    placeholder="Tìm kiếm sản phẩm"
                    onSearch={(value) => console.log(value)}
                    style={{ width: 200 }}
                />
                <Tooltip title="Loại">
                    <Select defaultValue={typeItem} onChange={this.onTypeChange}>
                        <Option value="vegas">Rau củ</Option>
                        <Option value="fruit">Trái cây</Option>
                        <Option value="meet">Thịt</Option>
                    </Select>
                </Tooltip>
                <Tooltip title="Tên sản phẩm">
                    <Select defaultValue={nameItem} value={nameItem} onChange={this.onNameChange}>
                        {DumpData[typeItem].map((v) => (
                            <Option key={`nameItem_${new Date()}`} value={Object.keys(v)[0]}>
                                {v[Object.keys(v)[0]]}
                            </Option>
                        ))}
                    </Select>
                </Tooltip>
            </div>
        );
    }
}

ItemSelect.propTypes = {
    onSelect: PropTypes.func.isRequired,
};

export default ItemSelect;
