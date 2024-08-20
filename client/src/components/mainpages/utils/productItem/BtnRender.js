import React, {useContext} from 'react'
import {Link} from 'react-router-dom'
import {GlobalState} from '../../../../GlobalState'

function BtnRender({product, deleteProduct}) {
    const state = useContext(GlobalState)
    const [isAdmin] = state.userAPI.isAdmin
    const addCart = state.userAPI.addCart


    return (
        <div className="row_btn">
            {
                isAdmin ?
                <>
                    <Link id="btn_buy" className='bg-sky-500 hover:bg-sky-700' to="#!"
                    onClick={() =>deleteProduct(product._id, product.images.public_id)}>
                        Xóa
                    </Link>
                    <Link id="btn_view" className='bg-teal-600 hover:bg-teal-800' to={`/edit_product/${product._id}`}>
                        Sửa
                    </Link>
                </>
                : <>
                    <Link id="btn_buy" className='bg-sky-500 hover:bg-sky-700' to="#!" onClick={() => addCart(product)}>
                        Mua
                    </Link>
                    <Link id="btn_view" className='bg-teal-600 hover:bg-teal-800' to={`/detail/${product._id}`}>
                        Xem
                    </Link>
                </>
            }

        </div>
    )
}

export default BtnRender
