import React, { useState, useEffect, useContext } from 'react'
import { useParams } from 'react-router-dom'
import { GlobalState } from '../../../GlobalState'
import axios from 'axios'
import { Button, Space, Modal } from 'antd';

function OrderDetails() {

    const { id, status } = useParams();
    const state = useContext(GlobalState)
    const [history] = state.userAPI.history;
    console.log('state', state)
    console.log('history', history)
    const [orderDetails, setOrderDetails] = useState([])

    const params = useParams()

    useEffect(() => {
        if (params.id) {
            history.forEach(item => {
                if (item._id === params.id) setOrderDetails(item)
            })
        }
    }, [params.id, history])

    const updateStatusUser = async () => {
        try {
            const response = await axios.put("/api/payment/status", {
                id: id,
                status: 4,
            });
            console.log(response.data); // log the response data to the console
        } catch (err) {
            console.error(err); // log any errors to the console
        }
    }

    // Modal
    const [open, setOpen] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [modalText, setModalText] = useState('Bạn chắc chắn muốn hủy đơn hàng này?');
    const showModal = () => {
        setOpen(true);
    };
    const handleOk = () => {
        setModalText('Đang xử lý...');
        setConfirmLoading(true);
        setTimeout(() => {
            setOpen(false);
            setConfirmLoading(false);
        }, 2000);
        updateStatusUser();
        setOrderDetails({ ...orderDetails, status: 4 })
    };
    const handleCancel = () => {
        console.log('Clicked cancel button');
        setOpen(false);
    };


    if (orderDetails.length === 0) return null;

    return (
        <div className="history-page">
            <table>
                <thead>
                    <tr>
                        <th>Tên</th>
                        <th>Địa Chỉ</th>
                        <th>Mã Bưu Chính</th>
                        <th>Mã Quốc Gia</th>
                        <th>Trạng Thái</th>
                        <th>Hành Động</th>
                    </tr>
                </thead>
                <tbody>
                    <tr key={orderDetails._id}>
                        <td>{orderDetails.name}</td>
                        <td>{orderDetails.address.line1 + " - " + orderDetails.address.city}</td>
                        <td>{orderDetails.address.postal_code}</td>
                        <td>{orderDetails.address.country_code}</td>
                        <td>{orderDetails.status === 0 ? "Đang xử lý" : orderDetails.status === 1 ? "Đã xác nhận" : orderDetails.status === 2 ? "Đang giao" : orderDetails.status === 3 ? "Đã giao" : "Đã hủy"}</td>
                        <td>
                            {
                                orderDetails.status === 0 &&
                                // <button className="del-btn" onClick={updateStatusUser}>Hủy Đơn</button>
                                // <Button type="primary" danger onClick={updateStatusUser}>
                                //     Hủy đơn
                                // </Button>
                                <>
                                    <Button type="primary" onClick={showModal} danger>
                                        Hủy Đơn
                                    </Button>
                                    <Modal
                                        title="Bạn chắc chắn chứ?"
                                        open={open}
                                        onOk={handleOk}
                                        confirmLoading={confirmLoading}
                                        onCancel={handleCancel}
                                    >
                                        <p>{modalText}</p>
                                    </Modal>
                                </>
                            }
                        </td>
                    </tr>
                </tbody>
            </table>

            <table style={{ margin: "30px 0px" }}>
                <thead>
                    <tr>
                        <th></th>
                        <th>Sản Phẩm</th>
                        <th>Số Lượng</th>
                        <th>Giá Tiền</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        orderDetails.cart.map(item => (
                            <tr key={item._id}>
                                <td><img src={item.images.url} alt="" /></td>
                                <td>{item.title}</td>
                                <td>{item.quantity}</td>
                                <td>$ {item.price * item.quantity}</td>
                            </tr>
                        ))
                    }

                </tbody>
            </table>
        </div>
    )
}

export default OrderDetails
