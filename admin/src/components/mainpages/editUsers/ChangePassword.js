import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { EyeTwoTone, EyeInvisibleOutlined } from '@ant-design/icons';
import { Button, Input, Space, Typography } from 'antd';
const { Text } = Typography;


function ChangePassword() {

    const [passwordVisible, setPasswordVisible] = React.useState(false);

    const { id } = useParams();
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        setErrorMessage('');
        setSuccessMessage('');
    }, [newPassword, confirmPassword]);

    const handleSubmit = (event) => {
        event.preventDefault();
        if (newPassword === '' || confirmPassword === '') {
            setErrorMessage('Please fill out all fields.');
        } else if (newPassword !== confirmPassword) {
            setErrorMessage('Passwords do not match.');
        } else {
            axios
                .patch(`/user/${id}/resetpassword`, {
                    newPassword: newPassword,
                })
                .then((response) => {
                    setSuccessMessage('Password updated successfully.');
                })
                .catch((error) => {
                    setErrorMessage('Error updating password.');
                });
        }
    };

    return (
        <div>
            <Space direction="vertical">
                <Input.Password
                    placeholder="New password"
                    iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                    value={newPassword}
                    onChange={(event) => setNewPassword(event.target.value)}
                />
                <Input.Password
                    placeholder="Confirm password"
                    iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                />
                <Button block onClick={handleSubmit}>Submit</Button>
                <Text type="danger">{errorMessage && <div>{errorMessage}</div>}</Text>
                <Text type="success">{successMessage && <div>{successMessage}</div>}</Text>
            </Space>
        </div>
    );
}

export default ChangePassword;
