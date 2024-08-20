import { Space, Table, Tag, Button } from 'antd';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom/cjs/react-router-dom.min';
const columns = [
    {
        title: 'ID',
        dataIndex: '_id',
        key: '_id',
    },
    {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        render: (text) => <a>{text}</a>,
    },
    {
        title: 'Phone',
        dataIndex: 'phone',
        key: 'phone',
    },
    {
        title: 'Email',
        dataIndex: 'email',
        key: 'email',
    },
    {
        title: 'Action',
        key: 'action',
        render: (_, record) => (
            <Space size="middle">
                <Link to={`/user/${record._id}`}>Edit</Link>
                <Button type="primary" danger>
                    Delete
                </Button>
            </Space>
        ),
    },
];

const deleteUser = (id) => {
    axios.delete(`/user/delete/${id}`)
        .then(response => {
            console.log(response.data);
        })
        .catch(error => {
            console.error(error);
        });
}

const Users = () => {
    const [data, setData] = useState([]);
    useEffect(() => {
        axios.get('/user/all')
            .then(response => {
                setData(response.data.filter(user => user.role === 0));
            })
            .catch(error => {
                console.error(error);
            });
    }, []);

    return (
        <Table columns={columns} dataSource={data} />
    )
};
export default Users;