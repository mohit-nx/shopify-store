import React, { Component } from 'react';
import axios from 'axios';
import { List, Skeleton, Descriptions, PageHeader, Button } from 'antd';
import config from '../../config';

class BatchDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      error: false,
      data: [],
    }
  }

  componentDidMount() {
    const { match } = this.props;
    if (match.params && match.params.id) {
      console.log(":::", this.props);
      axios.get(`${config.url}/order/batch/${match.params.id}/`)
        .then(res => this.setState({
          loading: false,
          data: res.data.orders,
        }))
        .catch(err => this.setState({
          loading: false,
          error: true,
        }))
    }
  }

  fulfillOrder = (id) => {
    const { data } = this.state;
    const updatedData = [...data];
    axios.post(`${config.url}/order/fulfill/${id}/`)
      .then(res => {
        const recordIndex = updatedData.findIndex(record => record.id === id);
        updatedData[recordIndex].fulfilled = true;
        this.setState({ data: updatedData });
      })
      .catch(err => console.log("::: some error occured", err))
  }

  fulfillBatch = (id) => {
    const { history } = this.props;
    axios.patch(`${config.url}/batch/${id}/`, {
      fulfilled: true, 
    })
      .then(() => {
        history.push('/batch');
      })
      .catch(err => console.log("::: some error occured", err))
  }

  render() {
    const { data, error, loading } = this.state;
    const { location: { state } } = this.props;

    if (loading) return <>Loading... </>;
    if (error) return <>Some Error occurred..</>

    return (
      <>
        <PageHeader
          ghost={false}
          onBack={() => window.history.back()}
          title={state.item.name}
          extra={[
            <Button disabled={data.some(item => !item.fulfilled)} onClick={() => this.fulfillBatch(state.item.id)} key="1" type="primary">
              Fulfill Batch
            </Button>,
          ]}
        >
          <Descriptions title="Batch Info">
            <Descriptions.Item label="Batch No.">{state.item.id}</Descriptions.Item>
            <Descriptions.Item label="Start Date">{state.item.start_date}</Descriptions.Item>
            <Descriptions.Item label="End Date">{state.item.end_date}</Descriptions.Item>
            <Descriptions.Item label="Status">{state.item.fulfilled ? 'Fulfilled' : 'Open'}</Descriptions.Item>
            <Descriptions.Item label="Note">{state.item.note}</Descriptions.Item>
          </Descriptions>
        </PageHeader>
        <List
          className="demo-loadmore-list"
          itemLayout="horizontal"
          dataSource={data}
          renderItem={item => (
            <List.Item
              actions={[<Button disabled={item.fulfilled} onClick={() => this.fulfillOrder(item.id)}>Fulfill</Button>]}
            >
              <Skeleton avatar title={false} loading={item.loading} active>
                <List.Item.Meta
                  title={<a href="https://ant.design">{item.id}</a>}
                  description={`Total items: ${item.items.length}`}
                />
                <div>{item.fulfilled ? 'Fulfilled' : 'Open'}</div>
                <div>{item.note ? `Notes: ${item.note}` : ''} </div>
              </Skeleton>
            </List.Item>
          )}
        />
      </>
    );
  }
}

export default BatchDetails;