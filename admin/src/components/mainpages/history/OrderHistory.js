import React, { useContext, useEffect } from 'react'
import { GlobalState } from '../../../GlobalState'
import { Link } from 'react-router-dom'
import axios from 'axios'

function OrderHistory() {
    const state = useContext(GlobalState)
    const [history, setHistory] = state.userAPI.history
    const [isAdmin] = state.userAPI.isAdmin
    const [token] = state.token


    useEffect(() => {
        if (token) {
            const getHistory = async () => {
                if (isAdmin) {
                    const res = await axios.get('/api/payment', {
                        headers: { Authorization: token }
                    })
                    setHistory(res.data)
                } else {
                    const res = await axios.get('/user/history', {
                        headers: { Authorization: token }
                    })
                    setHistory(res.data)
                }
            }
            getHistory()
        }
    }, [token, isAdmin, setHistory])
    return (
        <div className="history-page">
            <h2>Lịch sử dặt hàng</h2>

            <h4>Ban đang có {history.length} đơn hàng</h4>

            <table>
                <thead>
                    <tr>
                        <th>Payment ID</th>
                        <th>Ngày Mua</th>
                        <th>Trạng thái</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {
                        history.reverse().map(items => (
                            <tr key={items._id}>
                                <td>{items.paymentID}</td>
                                <td>{new Date(items.createdAt).toLocaleDateString()}</td>
                                <td><Link to={`/history/${items._id}/status/${items.status}`}>{
                                    items.status === 0
                                        ? "Đang xử lý"
                                        : items.status === 1
                                            ? "Đã xác nhận"
                                            : items.status === 2
                                                ? "Đang vận chuyển"
                                                : items.status === 3
                                                    ? "Đã giao"
                                                    : "Đã hủy"
                                }</Link></td>
                                <td><Link to={`/history/${items._id}`}>Chi Tiết</Link></td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
        </div>
    )
}

export default OrderHistory
