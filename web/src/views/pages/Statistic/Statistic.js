/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component } from 'react';
import { Table, Divider, Tag, Icon, Button } from 'antd';

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
        title: 'khối lượng (gam)',
        dataIndex: 'weight',
        key: 'weight',
    },
    {
        title: 'Phân loại',
        dataIndex: 'type',
        key: 'type',
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

const data = [
    {
        key: '1',
        name: 'Quả cam',
        id: 32,
        type: 'fruit',
        weight: 45.6,
    },
    {
        key: '2',
        name: 'Quả cam',
        id: 42,
        type: 'fruit',
        weight: 45.6,
    },
    {
        key: '3',
        name: 'Quả cam',
        id: 32,
        type: 'fruit',
        weight: 45.6,
    },
];

const Statistic = () => {
    return <Table style={{ height: '100%' }} columns={columns} dataSource={data} />;
};

export default Statistic;
