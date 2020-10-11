import React, { Component } from 'react';
import axios from 'axios';
import { List, Skeleton, PageHeader, Button, Modal } from 'antd';
import config from '../../config';
import AddBatchForm from './AddBatchForm';

class BatchList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      error: false,
      data: [],
      visible: false,
    }
  }

  getBatchDetails() {
    axios.get(`${config.url}/batch/`)
      .then(res => this.setState({
        loading: false,
        data: res.data,
      }))
      .catch(err => this.setState({
        loading: false,
        error: true,
      }))
  }

  componentDidMount() {
    this.getBatchDetails()  
  }

  redirectToDetails = (item) => {
    const { history } = this.props;
    history.push({ pathname: `/batch/${item.id}`, state: { item } });
  }

  render() {
    const { data, error, loading, visible } = this.state;

    if (loading) return <>Loading... </>;
    if (error) return <>Some Error occurred..</>

    return (
      <>
        <PageHeader
          ghost={false}
          title="Batch List"
          extra={[
            <Button onClick={() => this.setState({ visible: true })} key="1" type="primary">
              Add Batch
          </Button>,
          ]}
        >
          <List
            className="demo-loadmore-list"
            itemLayout="horizontal"
            dataSource={data}
            renderItem={item => (
              <List.Item
                actions={[<a key="list-loadmore-more" onClick={() => this.redirectToDetails(item)}>Details</a>]}
              >
                <Skeleton avatar title={false} loading={item.loading} active>
                  <List.Item.Meta
                    title={<a href="https://ant.design">{item.name}</a>}
                    description={`start date: ${item.start_date} end date: ${item.end_date}`}
                  />
                  <div>{item.fulfilled ? 'Fulfilled' : 'Open'}</div>
                </Skeleton>
              </List.Item>
            )}
          />
        </PageHeader>
        <Modal
          title="Basic Modal"
          visible={visible}
          onOk={this.handleOk}
          footer={null}
          onCancel={() => this.setState({ visible: false })}
        >
          <AddBatchForm
            closeModal={() => {
              this.getBatchDetails();
              this.setState({ visible: false });
            }}
          />
        </Modal>
      </>
    );
  }
}

export default BatchList;