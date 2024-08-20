import React, { useState, useEffect, useContext } from 'react'
import { useParams } from 'react-router-dom'
import { GlobalState } from '../../../GlobalState'

function OrderDetails() {
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


    if (orderDetails.length === 0) return null;

    return (
        <div className="history-page">
            <table>
                <thead>
                    <tr>
                        <th>Trạng Thái</th>
                        <th>Tên</th>
                        <th>Địa Chỉ</th>
                        <th>Mã Bưu Chính</th>
                        <th>Mã Quốc Gia</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>
                            {
                                orderDetails.status === 0
                                    ? "Processing"
                                    : orderDetails.status === 1
                                        ? "Confirmed"
                                        : orderDetails.status === 2
                                            ? "Shipping"
                                            : orderDetails.status === 3
                                                ? "Delivered"
                                                : "Cancelled"
                            }
                        </td>
                        <td>{orderDetails.name}</td>
                        <td>{orderDetails.address.line1 + " - " + orderDetails.address.city}</td>
                        <td>{orderDetails.address.postal_code}</td>
                        <td>{orderDetails.address.country_code}</td>
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
