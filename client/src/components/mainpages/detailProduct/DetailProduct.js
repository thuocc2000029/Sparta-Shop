import React, { useContext, useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { GlobalState } from '../../../GlobalState'
import { Tabs } from 'antd'
import ProductItem from '../utils/productItem/ProductItem'


function DetailProduct() {
    const params = useParams()
    const state = useContext(GlobalState)
    const [products] = state.productsAPI.products
    const addCart = state.userAPI.addCart
    const [detailProduct, setDetailProduct] = useState([])

    useEffect(() => {
        if (params.id) {

            products.forEach(product => {
                if (product._id === params.id) setDetailProduct(product)
            })
        }
    }, [params.id, products])

    if (detailProduct.length === 0) return null;

    return (
        <>
            <div className="detail">
                <img src={detailProduct.images.url} alt="" />
                <div className="box-detail">
                    <div className="">
                        <h2 className='text-sky-400 font-bold'>{detailProduct.title}</h2>
                        <h6>Mã Sản Phẩm: {detailProduct.product_id}</h6>
                        <br />
                    </div>
                    <span className='text-rose-600'>$ {detailProduct.price}</span>
                    <p>Chi Tiết Sản Phẩm:</p>
                    <div dangerouslySetInnerHTML={{ __html: detailProduct.description }} />
                    <p>Đã Bán: {detailProduct.sold}</p>
                    <Link to="/cart" className="cart bg-sky-500 hover:bg-sky-600"
                        onClick={() => addCart(detailProduct)}>
                        Mua Ngay
                    </Link>
                </div>
            </div>
            <Tabs
                className='text-lg'
                defaultActiveKey="1"
                items={[
                    {
                        label: `Mô Tả`,
                        key: '1',
                        children: <div dangerouslySetInnerHTML={{ __html: detailProduct.content }} />,
                    },
                    {
                        label: `Đánh Giá`,
                        key: '2',
                        children: `Tính năng đang được phát triển`,
                    },
                ]}
            />
            <hr />
            <div>
                <h2>Sản Phẩm Tương Tự</h2>
                <div className="products">
                    {
                        products.map(product => {
                            return product.category === detailProduct.category
                                ? <ProductItem key={product._id} product={product} /> : null
                        })
                    }
                </div>
            </div>
        </>
    )
}

export default DetailProduct
