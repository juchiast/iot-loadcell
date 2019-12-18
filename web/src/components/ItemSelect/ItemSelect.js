import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Select, Tooltip, Input } from 'antd';
import PRODUCTS from '../../Utils/Product';
import './ItemSelect.scss';

const { Option } = Select;
const { Search } = Input;

class ItemSelect extends Component {
    constructor(props) {
        super(props);
        const { item } = this.props;
        this.state = {
            ...item,
        };
    }

    onTypeChange = (value) => {
        const itemKey = Object.keys(PRODUCTS[value].items)[0];
        const selectedItem = {
            typeKey: value,
            typeName: PRODUCTS[value].title,
            itemKey,
            ...PRODUCTS[value].items[itemKey],
        };

        this.setState({ ...selectedItem });

        const { onSelect } = this.props;
        onSelect(selectedItem);
    };

    onNameChange = (value) => {
        const { typeName, typeKey } = this.state;
        const selectedItem = {
            typeKey,
            typeName,
            itemKey: value,
            ...PRODUCTS[typeKey].items[value],
        };
        const { onSelect } = this.props;
        this.setState({ ...selectedItem });

        onSelect(selectedItem);
    };

    render() {
        const { typeKey, itemKey } = this.state;
        return (
            <div style={{ position: 'absolute', top: 15, left: 10 }}>
                <Search
                    placeholder="Tìm kiếm sản phẩm"
                    onSearch={(value) => console.log('Search: ', value)}
                    style={{ width: 200 }}
                />
                <Tooltip title="Loại">
                    <Select defaultValue={typeKey} value={typeKey} onChange={this.onTypeChange}>
                        {Object.keys(PRODUCTS).map((type) => (
                            <Option value={type} key={`type_${type}`}>
                                {PRODUCTS[type].title}
                            </Option>
                        ))}
                    </Select>
                </Tooltip>
                <Tooltip title="Tên sản phẩm">
                    <Select defaultValue={itemKey} value={itemKey} onChange={this.onNameChange}>
                        {Object.keys(PRODUCTS[typeKey].items).map((v) => (
                            <Option value={v} key={`nameItem_${v}`}>
                                {PRODUCTS[typeKey].items[v].name}
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
