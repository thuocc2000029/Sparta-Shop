import React, {useContext} from 'react'
import {GlobalState} from '../../../GlobalState'

function Filters() {
    const state = useContext(GlobalState)
    const [categories] = state.categoriesAPI.categories

    const [category, setCategory] = state.productsAPI.category
    const [sort, setSort] = state.productsAPI.sort
    const [search, setSearch] = state.productsAPI.search


    const handleCategory = e => {
        setCategory(e.target.value)
        setSearch('')
    }

    return (
        <div className="filter_menu">
            <div className="row">
                <span>Lọc: </span>
                <select name="category" value={category} onChange={handleCategory} >
                    <option value=''>Tất Cả Sản Phẩm</option>
                    {
                        categories.map(category => (
                            <option value={"category=" + category._id} key={category._id}>
                                {category.name}
                            </option>
                        ))
                    }
                </select>
            </div>

            <input type="text" value={search} placeholder="Nhập nội dung cần tìm!"
            onChange={e => setSearch(e.target.value.toLowerCase())} />

            <div className="row sort">
                <span>Sắp Xếp Theo: </span>
                <select value={sort} onChange={e => setSort(e.target.value)} >
                    <option value=''>Mới Nhất</option>
                    <option value='sort=oldest'>Cũ Nhất</option>
                    <option value='sort=-sold'>Bán Chạy</option>
                    <option value='sort=-price'>Giá: Cao Đến Thấp</option>
                    <option value='sort=price'>Giá: Thấp Đến Cao</option>
                </select>
            </div>
        </div>
    )
}

export default Filters
