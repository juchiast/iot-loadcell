/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component } from 'react';
import { Table, Button } from 'antd';
import Api from '../../../api';

const columns = [
    {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
        render: (text) => <a>{text}</a>,
    },
    {
        title: 'Tên',
        dataIndex: 'name',
        key: 'name',
        render: (text) => <a>{text}</a>,
    },
    {
        title: 'khối lượng(gam)',
        dataIndex: 'weight',
        key: 'weight',
    },
    {
        title: 'Phân loại',
        dataIndex: 'type',
        key: 'type',
    },
    {
        title: 'Thời gian cân',
        dataIndex: 'measureTime',
        key: 'measureTime',
    },
    {
        title: 'Tại',
        dataIndex: 'createdAt',
        key: 'createdAt',
    },
    {
        title: 'Hành động',
        key: 'action',
        render: (text, record) => (
            <span>
                <Button type="danger" shape="circle" icon="delete" />
            </span>
        ),
    },
];

const getData = () => {
    const data = Api.getDataItems();
    console.log('xxx 799 data ', data);
    const mappingData = data && data.map((item) => ({ ...item, key: item.id }));
    return mappingData;
};

const Statistic = () => {
    const data = getData();
    console.log('xxx 700 data: ', data);
    return (
        <div style={{ height: '100%' }}>
            <Table
                style={{ height: '100%', paddingBottom: 15 }}
                columns={columns}
                dataSource={data}
            />
            <Button
                type="danger"
                icon="delete"
                onClick={() => {
                    Api.clearData();
                }}
                style={{ bottom: 10 }}
            >
                Xóa tất cả
            </Button>
        </div>
    );
};

export default Statistic;
