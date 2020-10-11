import React from 'react';
import Routes from './Router';
import './App.css';
import { BrowserRouter } from 'react-router-dom';
import { Layout } from 'antd';

const { Header, Content, Footer } = Layout;

function App() {
  return (
    <Layout className="layout">
      <Header>
        <div className="logo" />
      </Header>
      <Content style={{ padding: '50px 50px 0px' }}>
        <div className="site-layout-content">
          <BrowserRouter>
            <Routes />
          </BrowserRouter>
        </div>
      </Content>
      <Footer style={{ textAlign: 'center' }}>Store Manager</Footer>
    </Layout>
  );
}

export default App;
