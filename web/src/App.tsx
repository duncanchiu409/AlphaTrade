import React, { useState, useEffect } from 'react'
import { Link, Routes, Route } from 'react-router-dom';
import './App.css';
import { Layout, Menu } from 'antd'
import { DefaultKey, MenuItem, Paths } from './config/routes'
import { AiFillSliders, AiOutlinePieChart, AiFillTool, AiOutlineFileDone } from "react-icons/ai";
import Chart from './pages/chart'
import Portfolio from './pages/portfolio'
import Trades from './pages/trades'
import PortfolioLog from './pages/portfolioLog'
import Config from './pages/config'
import { useTableStore } from './store/useTableStore'

function App(): React.ReactElement {
  const [ model, setModel ] = useState<string>('')
  const [ theme, setTheme ] = useState<'light' | 'dark'>('light')
  const { pathname } = window.location
  const { tables, resetTables } = useTableStore()

  useEffect(() => {
    resetTables()
  }, [])

  useEffect(() => {
    setModel(Array.from(tables.keys())[0])
  }, [tables])

  return (
    <Layout>
      <Layout.Sider className='layout' theme={theme} collapsed={true} >
        <Menu theme={theme} mode='inline' defaultSelectedKeys={[DefaultKey[pathname as Paths]]} style={{ marginTop: '0.2em' }}>
          <Menu.Item key={MenuItem.CHART} icon={<AiFillSliders />}>
            <Link to={Paths.HOME}>Chart</Link>
          </Menu.Item>
          <Menu.Item key={MenuItem.TRADES} icon={<AiOutlineFileDone />}>
            <Link to={Paths.TRADES}>Trades</Link>
          </Menu.Item>
          <Menu.Item key={MenuItem.PORTFOLIOLOG} icon={<AiOutlineFileDone />}>
            <Link to={Paths.PORTFOLIOLOG}>Portfolio Logs</Link>
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
            <Route path={Paths.HOME} element={<Chart model={model} setModel={setModel}/>} />
            <Route path={Paths.TRADES} element={<Trades model={model} setModel={setModel}/>} />
            <Route path={Paths.PORTFOLIOLOG} element={<PortfolioLog model={model} setModel={setModel}/>} />
            <Route path={Paths.PORTFOLIO} element={<Portfolio model={model} setModel={setModel}/>} />
            <Route path={Paths.CONFIG} element={<Config model={model} setModel={setModel}/>} />
          </Routes>
      </Layout>
    </Layout>
  );
}

export default App;
