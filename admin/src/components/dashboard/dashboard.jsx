import {
    FileOutlined,
    PieChartOutlined,
    UserOutlined,
    DesktopOutlined,
    TeamOutlined,
    PlusCircleOutlined,
    AccountBookOutlined,
    CarryOutOutlined,
} from '@ant-design/icons';
import { Breadcrumb, Layout, Menu, theme } from 'antd';
import { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { GlobalState } from '../../GlobalState'
import MainPages from '../mainpages/Pages';
const { Header, Content, Footer, Sider } = Layout;

function getItem(label, key, icon, children) {
    return {
        key,
        icon,
        children,
        label,
    };
}
const items = [
    getItem('Sản phẩm', '1', <Link to='/'><AccountBookOutlined /></Link>, [
        getItem('Tất cả sản phẩm', '2', <Link to='/'><PieChartOutlined /></Link>),
        getItem('Thêm sản phẩm', '3', <Link to='/create_product'><PlusCircleOutlined /></Link>),
    ]),
    getItem('Danh mục', '4', <Link to='/category'><DesktopOutlined /></Link>),
    getItem('Đơn hàng', '5', <Link to='/history'><CarryOutOutlined /></Link>),

    getItem('Tài khoản', 'sub1', <Link to='/user'><UserOutlined /></Link>, [
        getItem('Người dùng', '6', <Link to='/user'></Link>),
        getItem('Quản trị', '7',),
    ]),
    getItem('Files', '8', <FileOutlined />),
];
const Dashboard = () => {
    const [collapsed, setCollapsed] = useState(false);
    const state = useContext(GlobalState)
    const [isAdmin] = state.userAPI.isAdmin
    const {
        token: { colorBgContainer },
    } = theme.useToken();

    const logoutUser = async () => {
        await axios.get('/user/logout')

        localStorage.removeItem('firstLogin')

        window.location.href = "/";
    }
    return (
        <Layout
            style={{
                minHeight: '100vh',
            }}
        >
            <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
                <div
                    style={{
                        height: 32,
                        margin: 16,
                        // background: 'rgba(255, 255, 255, 0.2)',
                    }}
                >
                    <img src="https://res.cloudinary.com/npvinh/image/upload/v1669830305/mern-ecommerce/logo.png" alt="Logo" />
                </div>
                <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline" items={items} />
            </Sider>
            <Layout className="site-layout">
                <Header
                    style={{
                        padding: "0 16px",
                        background: colorBgContainer,
                        display: 'flex',
                        justifyContent: 'flex-end',
                    }}
                >
                    <Link to="/" onClick={logoutUser}>{isAdmin ? 'Đăng Xuất' : ''}</Link>
                </Header>
                <Content
                    style={{
                        margin: '0 16px',
                    }}
                >
                    <Breadcrumb
                        style={{
                            margin: '16px 0',
                        }}
                    >
                        {/* <Breadcrumb.Item>User</Breadcrumb.Item>
                        <Breadcrumb.Item>Bill</Breadcrumb.Item> */}
                    </Breadcrumb>
                    <div
                        style={{
                            padding: 24,
                            minHeight: 360,
                            background: colorBgContainer,
                        }}
                    >
                        <MainPages />
                    </div>
                </Content>
                <Footer
                    style={{
                        textAlign: 'center',
                    }}
                >
                    © 2023 by Nguyễn Phúc Vinh - C2000031
                </Footer>
            </Layout>
        </Layout>
    );
};
export default Dashboard;