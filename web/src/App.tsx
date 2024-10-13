import React, { useState } from 'react'
import { Link, Routes, Route } from 'react-router-dom';
import './App.css';
import { Layout, Menu } from 'antd'
import { DefaultKey, MenuItem, Paths } from './config/routes'
import { AiFillSliders, AiOutlinePieChart, AiFillTool, AiOutlineFileDone } from "react-icons/ai";
import Chart from './pages/chart'
import Portfolio from './pages/portfolio'
import Trades from './pages/trades'
import { purpleDark } from '@ant-design/colors';

function App(): React.ReactElement {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const { pathname } = window.location

  return (
    <Layout>
      <Layout.Sider className='layout' theme={theme} collapsed={true} >
        <Menu theme={theme} mode='inline' defaultSelectedKeys={[DefaultKey[pathname as Paths]]} style={{marginTop: '0.2em'}}>
          <Menu.Item key={MenuItem.CHART} icon={<AiFillSliders />}>
            <Link to={Paths.HOME}>Chart</Link>
          </Menu.Item>
          <Menu.Item key={MenuItem.TRADES} icon={<AiOutlineFileDone />}>
            <Link to={Paths.TRADES}>Trades</Link>
          </Menu.Item>
          <Menu.Item key={MenuItem.PORTFOLIO} icon={<AiOutlinePieChart />}>
            <Link to={Paths.PORTFOLIO}>Portfolio</Link>
          </Menu.Item>
          <Menu.Item key={MenuItem.CONFIG} icon={<AiFillTool />}>
            <Link to={Paths.CONFIG}>Configuration</Link>
          </Menu.Item>
        </Menu>
      </Layout.Sider>
      <Layout className='layout'>
        <Routes>
          <Route path={Paths.HOME} element={<Chart/>} />
          <Route path={Paths.TRADES} element={<Trades/>} />
          <Route path={Paths.PORTFOLIO} element={<Portfolio />} />
          {/* <Route path={Paths.CONFIG} element={<Config />} /> */}
        </Routes>
      </Layout>
    </Layout>
  );
}

export default App;
