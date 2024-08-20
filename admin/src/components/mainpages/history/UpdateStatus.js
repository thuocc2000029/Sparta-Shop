import { useState } from "react";
import { useParams, useHistory } from 'react-router-dom';
import axios from "axios";

function OrderStatusChanger({ orderId, currentStatus }) {

    const goBack = useHistory();


    const { id, status } = useParams();
    const [newStatus, setNewStatus] = useState(status);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleStatusChange = async () => {
        // console.log({ id, newStatus, currentStatus })
        try {
            const response = await axios.put("/api/payment/status", {
                id: id,
                status: newStatus,
            });
            // const response = await axios.put(`/payment/${id}/status`, {
            //     status: newStatus,
            // });
            setSuccessMessage('Status updated successfully.');
            goBack.push("/history");

            console.log(response.data); // log the response data to the console
        } catch (error) {
            setErrorMessage('Error updating status.');
            console.error(error); // log any errors to the console
        }
    };

    return (
        <div>
            <select value={newStatus} onChange={(e) => setNewStatus(e.target.value)}>
                <option value={0}>Đang xử lý</option>
                <option value={1}>Đã xác nhận</option>
                <option value={2}>Đang vận chuyển</option>
                <option value={3}>Đã giao</option>
                <option value={4}>Đã hủy</option>
            </select>
            <button onClick={handleStatusChange}>Lưu thay đổi</button>
            {errorMessage && <div>{errorMessage}</div>}
            {successMessage && <div>{successMessage}</div>}
        </div>
    );
}

export default OrderStatusChanger;