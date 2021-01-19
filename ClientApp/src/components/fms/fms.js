import React, { Component } from 'react';
import { Button, Col, Container, Form, Nav, Row, Tab, Tabs } from 'react-bootstrap';
import DatePicker from '../data-picker/data-picker';

class Fms extends Component {
    constructor() {
        super();
        this.state = {
            loaded: false,
        };
    }

    componentDidMount() {
        //fetch('https://dfejan2021demoapi.azurewebsites.net/api/snapshot')
        fetch('/api/snapshot/90000001')
        .then(response => response.json())
        .then(data => {
            // sort data
            data.sort((a, b) => a.date.localeCompare(b.date));

            // get academies
            const academyUpins = data[0].academies.map(academy => academy.academyUpin);

            //set state
            this.setState({
                academyUpins,
                academyUpinSelected: academyUpins[0],
                date: data[0].date,
                formData: data,
                loaded: true,
            });
        });
    }

    changeAcademy(academyUpin) {
        this.setState({ academyUpinSelected: parseInt(academyUpin) });
    }

    changeDate(date) {
        this.setState({ date });
    }

    getFieldValue(location, field) {
        if (!this.state.formData.find(item => item.date === this.state.date)) {
            return 0;
        } else if (location === 'academyCoaData') {
            const academyData = this.state.formData.find(item => item.date === this.state.date).academies.find(academy => academy.academyUpin === this.state.academyUpinSelected);
            if (academyData && academyData.academyCoaData[field]) return academyData.academyCoaData[field];
            return 0;
        }

        const trustLevelValue = this.state.formData.find(item => item.date === this.state.date)[location][field];
        return trustLevelValue ? trustLevelValue : 0;
    }

    updateField(location, field, value) {
        const formData = this.state.formData;
        let snapshot = formData.find(snapshot => snapshot.date === this.state.date);

        if (!snapshot) {
            // A data snapshot does not exist for this month... create one
            snapshot = {
                date: this.state.date,
                trustCoaData: null,
                academies: []
            };
            formData.push(snapshot);
        }

        if (location === 'academyCoaData') {
            let academy = snapshot.academies.find(academy => academy.academyUpin === this.state.academyUpinSelected);

            if (!academy) {
                academy = {
                    academyUpin: this.state.academyUpinSelected,
                    academyCoaData: {}
                };
                snapshot.academies.push(academy);
            }
            academy[location][field] = Number(value);
        } else {
            snapshot[location][field] = Number(value);
        }

        this.setState({ formData });
    }

    save()
    {
        // console.log(this.state);
        const currMonthformData = this.state.formData.find(item => item.date === this.state.date);
        console.log(currMonthformData);

        if (currMonthformData) {
            fetch('/api/snapshot/90000001', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(currMonthformData)
            });
        }

        //let acDataArray = [];
        //acDataArray.push(currMonthformData.academies[0]);
        //acDataArray.push(currMonthformData.academies[0]);
        //acDataArray.push(currMonthformData.academies[0]);

        //let mySnapShot = {
        //    date: "2020-01-01T00:00:00",
        //    trustCoaData: null,
        //    academies: acDataArray
        //}

        //console.log(currMonthformData, mySnapShot);
        // debugger;
    }

    render() {
        if (!this.state.loaded) {
            return (
                <Container style={{backgroundColor: '#fff', minHeight: '100vh', paddingTop: '1rem'}}>
                    <p>Getting data...</p>
                </Container>
            )
        }

        const academyOptions = this.state.academyUpins.map(academyUpin => {
            return <option>{academyUpin}</option>
        });

        return (
            <Container style={{backgroundColor: '#fff', minHeight: '100vh', paddingTop: '1rem'}}>
                <Row>
                    <Col><DatePicker changeDate={this.changeDate.bind(this)}></DatePicker></Col>
                    <Col><Button style={{ float: 'right' }} variant="success" onClick={event => this.save()}>Save</Button></Col>
                </Row>
                <hr></hr>
                <h1>Financial Management System</h1>
                <hr></hr>
                <Tab.Container id="left-tabs-example" defaultActiveKey="home">
                    <Row>
                        <Col sm="auto">
                            <Nav variant="pills" className="flex-column">
                                <Nav.Item>
                                    <Nav.Link eventKey="home">Home</Nav.Link>
                                </Nav.Item>
                                <Nav.Item>
                                    <Nav.Link eventKey="trust" disabled>Trust Data</Nav.Link>
                                </Nav.Item>
                                <Nav.Item>
                                    <Nav.Link eventKey="academy">Academy Data</Nav.Link>
                                </Nav.Item>
                            </Nav>
                        </Col>
                        <Col>
                            <Tab.Content>
                                <Tab.Pane eventKey="home">
                                    <Row className="my-1">
                                        <Col sm="2"><b>Trust UPIN:</b></Col>
                                        <Col>90000001</Col>
                                    </Row>
                                    <Row className="my-1">
                                        <Col sm="2"><b>Trust name:</b></Col>
                                        <Col>Pepsitown Trust</Col>
                                    </Row>
                                </Tab.Pane>
                                <Tab.Pane eventKey="trust"></Tab.Pane>
                                <Tab.Pane eventKey="academy">
                                    <Row>
                                        <Col sm="3">
                                            <Form.Group>
                                                <Form.Label>Select academy</Form.Label>
                                                <Form.Control as="select" onChange={event => this.changeAcademy(event.target.value)}>
                                                    {academyOptions}
                                                </Form.Control>
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                    <Tabs defaultActiveKey="staffCosts" id="uncontrolled-tab-example">
                                        <Tab eventKey="staffCosts" title="Staff Costs">
                                            <h2 className="h4" style={{padding: '1rem 0'}}>Supply Staff</h2>
                                            <Form.Group>
                                                <Form.Label>Teachers - long term cover:Wages and salaries</Form.Label>
                                                <Form.Control type="number" placeholder="0" value={this.getFieldValue('academyCoaData', '650400')} onChange={event => this.updateField('academyCoaData', '650400', event.target.value)} />
                                            </Form.Group>
                                            <Form.Group>
                                                <Form.Label>Teachers - short term cover:Wages and salaries</Form.Label>
                                                <Form.Control type="number" placeholder="0" value={this.getFieldValue('academyCoaData', '650450')} onChange={event => this.updateField('academyCoaData', '650450', event.target.value)} />
                                            </Form.Group>
                                            <Form.Group>
                                                <Form.Label>Teaching assistants:Wages and salaries</Form.Label>
                                                <Form.Control type="number" placeholder="0" value={this.getFieldValue('academyCoaData', '650500')} onChange={event => this.updateField('academyCoaData', '650500', event.target.value)} />
                                            </Form.Group>
                                            <Form.Group>
                                                <Form.Label>Support staff:Wages and salaries</Form.Label>
                                                <Form.Control type="number" placeholder="0" value={this.getFieldValue('academyCoaData', '650550')} onChange={event => this.updateField('academyCoaData', '650550', event.target.value)} />
                                            </Form.Group>
                                        </Tab>
                                        <Tab eventKey="suppliesServicesCosts" title="Supplies &amp; Services Costs">
                                            <h2 className="h4" style={{padding: '1rem 0'}}>Bought in supply cover</h2>
                                            <Form.Group>
                                                <Form.Label>Agency teaching staff long term</Form.Label>
                                                <Form.Control type="number" placeholder="0" value={this.getFieldValue('academyCoaData', '845100')} onChange={event => this.updateField('academyCoaData', '845100', event.target.value)} />
                                            </Form.Group>
                                            <Form.Group>
                                                <Form.Label>Agency teaching staff short term</Form.Label>
                                                <Form.Control type="number" placeholder="0" value={this.getFieldValue('academyCoaData', '845150')} onChange={event => this.updateField('academyCoaData', '845150', event.target.value)} />
                                            </Form.Group>
                                            <Form.Group>
                                                <Form.Label>Agency teaching assistants</Form.Label>
                                                <Form.Control type="number" placeholder="0" value={this.getFieldValue('academyCoaData', '845200')} onChange={event => this.updateField('academyCoaData', '845200', event.target.value)} />
                                            </Form.Group>
                                            <Form.Group>
                                                <Form.Label>Agency support staff</Form.Label>
                                                <Form.Control type="number" placeholder="0" value={this.getFieldValue('academyCoaData', '845250')} onChange={event => this.updateField('academyCoaData', '845250', event.target.value)} />
                                            </Form.Group>
                                            <h2 className="h4" style={{padding: '1rem 0'}}>Technology Costs</h2>
                                            <Form.Group>
                                                <Form.Label>Educational IT Equipment</Form.Label>
                                                <Form.Control type="number" placeholder="0" value={this.getFieldValue('academyCoaData', '820100')} onChange={event => this.updateField('academyCoaData', '820100', event.target.value)} />
                                            </Form.Group>
                                            <Form.Group>
                                                <Form.Label>ICT Support contract</Form.Label>
                                                <Form.Control type="number" placeholder="0" value={this.getFieldValue('academyCoaData', '820300')} onChange={event => this.updateField('academyCoaData', '820300', event.target.value)} />
                                            </Form.Group>
                                            <Form.Group>
                                                <Form.Label>ICT Repairs</Form.Label>
                                                <Form.Control type="number" placeholder="0" value={this.getFieldValue('academyCoaData', '820350')} onChange={event => this.updateField('academyCoaData', '820350', event.target.value)} />
                                            </Form.Group>
                                        </Tab>
                                        <Tab eventKey="fixedAssets" title="Fixed Assets" disabled></Tab>
                                        <Tab eventKey="currentAssets" title="Current Assets" disabled></Tab>
                                        <Tab eventKey="liabilities" title="Liabilities" disabled></Tab>
                                        <Tab eventKey="income" title="Income" disabled></Tab>
                                        <Tab eventKey="premisesCosts" title="Premises Costs" disabled></Tab>
                                    </Tabs>
                                </Tab.Pane>
                            </Tab.Content>
                        </Col>
                    </Row>
                </Tab.Container>
                <hr></hr>
            </Container>
        )
    }
}

export default Fms;