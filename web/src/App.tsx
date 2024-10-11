import React from 'react'
import { Link, Routes, Route } from 'react-router-dom';
import './App.css';
import { Layout, Menu } from 'antd'
import { DefaultKey, MenuItem, Paths } from './config/routes'
import { BiBarChart } from 'react-icons/bi';
// import Chart from './pages/kline'
import { KlineChart } from './charts/kline'

function App(): React.ReactElement {
  const { pathname } = window.location

  return (
    <Layout>
      <Layout.Sider className='layout' theme='dark' collapsed={false}>
        <Menu theme='dark' mode='inline' defaultSelectedKeys={[DefaultKey[pathname as Paths]]}>
          <Menu.Item key={MenuItem.CHART} icon={<BiBarChart size={25}/>}>
            <Link to={Paths.HOME}>Chart</Link>
          </Menu.Item>
          <Menu.Item key={MenuItem.DATAFRAME} icon={<BiBarChart size={25}/>}>
            <Link to={Paths.DATAFRAME}>DataFrame</Link>
          </Menu.Item>
          <Menu.Item key={MenuItem.PORTFOLIO} icon={<BiBarChart size={25}/>}>
            <Link to={Paths.PORTFOLIO}>Portfolio</Link>
          </Menu.Item>
          <Menu.Item key={MenuItem.CONFIG} icon={<BiBarChart size={25}/>}>
            <Link to={Paths.CONFIG}>Configuration</Link>
          </Menu.Item>
        </Menu>
      </Layout.Sider>
      <Layout>
        <Routes>
          <Route path={Paths.HOME} element={<KlineChart/>} />
          {/* <Route path={Paths.DATAFRAME} element={} />
          <Route path={Paths.PORTFOLIO} element={<Portfolio />} />
          <Route path={Paths.CONFIG} element={<Config />} /> */}
        </Routes>
      </Layout>
    </Layout>
  );
}

export default App;
