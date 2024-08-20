import React, { useContext } from 'react'
import { Switch, Route } from 'react-router-dom'
import Products from './products/Products'
import DetailProduct from './detailProduct/DetailProduct'
import Login from './auth/Login'
import Register from './auth/Register'
import OrderHistory from './history/OrderHistory'
import OrderDetails from './history/OrderDetails'
import Cart from './cart/Cart'
import NotFound from './utils/not_found/NotFound'
import Categories from './categories/Categories'
import CreateProduct from './createProduct/CreateProduct'
import { GlobalState } from '../../GlobalState'
import Users from './users/Users'
import EditUsers from './editUsers/EditUsers'
import ChangePassword from './editUsers/ChangePassword'
import UpdateStatus from './history/UpdateStatus'


function Pages() {
    const state = useContext(GlobalState)
    const [isLogged] = state.userAPI.isLogged
    const [isAdmin] = state.userAPI.isAdmin


    return (
        <Switch>
            <Route path="/" exact component={isAdmin ? Products : Login} />
            <Route path="/detail/:id" exact component={DetailProduct} />

            <Route path="/login" exact component={isLogged ? NotFound : Login} />
            <Route path="/register" exact component={isLogged ? NotFound : Register} />
            <Route path="/user/:id/reset-password" exact component={isLogged ? ChangePassword : NotFound} />

            <Route path="/category" exact component={isAdmin ? Categories : NotFound} />
            <Route path="/create_product" exact component={isAdmin ? CreateProduct : NotFound} />
            <Route path="/edit_product/:id" exact component={isAdmin ? CreateProduct : NotFound} />

            <Route path="/history" exact component={isAdmin ? OrderHistory : NotFound} />
            <Route path="/history/:id" exact component={isLogged ? OrderDetails : NotFound} />
            <Route path="/history/:id/status/:status" exact component={isLogged ? UpdateStatus : NotFound} />

            <Route path="/cart" exact component={Cart} />

            <Route path="/user" exact component={isAdmin ? Users : NotFound} />

            <Route path="/user/:id" exact component={isAdmin ? EditUsers : NotFound} />


            <Route path="*" exact component={NotFound} />
        </Switch>
    )
}

export default Pages
