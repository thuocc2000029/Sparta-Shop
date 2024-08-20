import { Descriptions, Spin } from 'antd';
import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';




const EditUsers = () => {

    // const state = useContext(GlobalState)
    // const [user] = state.userAPI.user
    // const [isLoading, setIsLoading] = useState(true);
    // const params = useParams();
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const { id } = useParams();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.get(`/user/${id}`);
                setUser(response.data.user);
                setIsLoading(false);
            } catch (error) {
                console.error(error.message);
                setIsLoading(false);
            }
        };

        fetchUser();
    }, [id]);

    // useEffect(() => {
    //     if (params.id) {
    //         axios.get(`/user/${params.id}`)
    //             .then(response => {
    //                 console.log(response.data);
    //                 setIsLoading(false);
    //             }
    //             )
    //             .catch(error => {
    //                 console.error(error);
    //             }
    //             );
    //     }
    // }, [params.id]);


    return (
        <div>
            {isLoading ? (
                <Spin />
            ) : (
                <Descriptions Descriptions title="User Info" layout="vertical" >
                    <Descriptions.Item label="UserName">{user.name}</Descriptions.Item>
                    <Descriptions.Item label="Telephone">{user.phone}</Descriptions.Item>
                    <Descriptions.Item label="Live">{user.email}</Descriptions.Item>
                    <Descriptions.Item label="Address" span={2}>
                        No. 18, Wantang Road, Xihu District, Hangzhou, Zhejiang, China
                    </Descriptions.Item>
                    <Descriptions.Item label="Password"><Link to={`/user/${user._id}/reset-password`}> Đổi mật khẩu</Link></Descriptions.Item>
                </Descriptions >
            )}
        </div>



    )
};

export default EditUsers;