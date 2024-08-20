import React, { useState, useContext } from 'react'
import axios from 'axios'
import { GlobalState } from '../../../GlobalState'
import Loading from '../utils/loading/Loading'
import { useHistory, useParams } from 'react-router-dom'
import { useForm } from "react-hook-form";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';


const initialState = {
    product_id: '',
    title: '',
    price: 0,
    description: 'Nhập vào chi tiết sản phẩm',
    content: 'Nhập vào mô tả sản phẩm',
    category: '',
    _id: ''
}

function CreateProduct() {

    const state = useContext(GlobalState)
    const [product, setProduct] = useState(initialState)
    const [categories] = state.categoriesAPI.categories
    const [images, setImages] = useState(false)
    const [loading, setLoading] = useState(false)
    const [valueTextEditor, setValueTextEditor] = useState({
        description: initialState.description,
        content: initialState.content
    });
    const [isAdmin] = state.userAPI.isAdmin
    const [token] = state.token

    const history = useHistory()
    const param = useParams()

    const [products] = state.productsAPI.products
    const [onEdit, setOnEdit] = useState(false)
    const [callback, setCallback] = state.productsAPI.callback;
    const { register, setValue, handleSubmit, formState: { errors } } = useForm();

    React.useLayoutEffect(() => {
        if (param.id) {
            setOnEdit(true)
            products.forEach(product => {
                if (product._id === param.id) {
                    setProduct(product)
                    setImages(product.images)
                    setValueTextEditor({
                        description: product.description,
                        content: product.content
                    });
                    setValue("title", product.title);
                    setValue("price", product.price);
                    setValue("category", product.category);
                    setValue("product_id", product.product_id);
                }
            })
        } else {
            setOnEdit(false)
            setProduct(initialState)
            setImages(false)
            setValue("title", product.title);
            setValue("price", product.price);
            setValue("category", product.category);
            setValue("product_id", product.product_id);
        }
    }, [param.id, products])

    const handleUpload = async e => {
        e.preventDefault()
        try {
            if (!isAdmin) return alert("Bạn không phải là quản trị viên")
            const file = e.target.files[0]

            if (!file) return alert("Tệp không tồn tại.")

            if (file.size > 1024 * 1024) // 1mb
                return alert("Kích thước quá lớn!")

            if (file.type !== 'image/jpeg' && file.type !== 'image/png') // 1mb
                return alert("File format is incorrect.")

            let formData = new FormData()
            formData.append('file', file)

            setLoading(true)
            const res = await axios.post('/api/upload', formData, {
                headers: { 'content-type': 'multipart/form-data', Authorization: token }
            })
            setLoading(false)
            setImages(res.data)

        } catch (err) {
            alert(err.response.data.msg)
        }
    }

    const handleDestroy = async () => {
        try {
            if (!isAdmin) return alert("Bạn không phải là quản trị viên")
            setLoading(true)
            await axios.post('/api/destroy', { public_id: images.public_id }, {
                headers: { Authorization: token }
            })
            setLoading(false)
            setImages(false)
        } catch (err) {
            alert(err.response.data.msg)
        }
    }


    const onSubmitForm = async data => {

        const payload = { ...data, images, ...valueTextEditor };

        try {
            if (!isAdmin) return alert("Bạn không phải là quản trị viên")
            if (!images) return alert("No Image Upload")

            if (onEdit) {
                await axios.put(`/api/products/${product._id}`, payload, {
                    headers: { Authorization: token }
                })
            } else {
                await axios.post('/api/products', payload, {
                    headers: { Authorization: token }
                })
            }
            setCallback(!callback)
            history.push("/")
        } catch (err) {
            console.log('err', err)
            alert(err.response.data.msg)
        }
    }

    const styleUpload = {
        display: images ? "block" : "none"
    }
    return (
        <div className="create_product">
            <div className="upload">
                <input type="file" name="file" id="file_up" onChange={handleUpload} />
                {
                    loading ? <div id="file_img"><Loading /></div>

                        : <div id="file_img" style={styleUpload}>
                            <img src={images ? images.url : ''} alt="" />
                            <span onClick={handleDestroy}>X</span>
                        </div>
                }

            </div>

            <form onSubmit={handleSubmit(onSubmitForm)}>
                <div className="row">
                    <label htmlFor="product_id">Mã Sản Phẩm</label>
                    <input type="text" id="product_id"
                        {...register("product_id")}
                    />
                </div>

                <div className="row">
                    <label htmlFor="title">Tên Sản Phẩm</label>
                    <input type="text"  {...register("title")} id="title"
                    />
                </div>

                <div className="row">
                    <label htmlFor="categories">Danh Mục: </label>
                    <select  {...register("category")}  >
                        <option value="">Chọn danh mục</option>
                        {
                            categories.map(category => (
                                <option value={category._id} key={category._id}>
                                    {category.name}
                                </option>
                            ))
                        }
                    </select>
                </div>

                <div className="row">
                    <label htmlFor="price">Giá</label>
                    <input type="text"  {...register("price")} id="price"
                    />
                </div>

                <div className="row">
                    <label htmlFor="description">Chi Tiết Sản Phẩm</label>
                    <ReactQuill
                        onChange={(e) => {
                            setValueTextEditor((prev) => {
                                return { ...prev, description: e }
                            })
                        }}
                        value={valueTextEditor.description || ""} placeholder="Nhập vào chi tiết..." />
                </div>

                <div className="row">
                    <label htmlFor="content">Mô Tả</label>
                    <ReactQuill
                        onChange={(e) => {
                            setValueTextEditor((prev) => {
                                return { ...prev, content: e }
                            })
                        }}

                        value={valueTextEditor.content || ""} placeholder="Nhập vào mô tả..." />
                </div>

                <button className='bg-sky-500' type="submit">{onEdit ? "Cập Nhật" : "Tạo Mới"}</button>
            </form>
        </div>
    )
}

export default CreateProduct
