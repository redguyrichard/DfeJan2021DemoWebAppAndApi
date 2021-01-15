import React, { Component } from 'react';
import { Form } from 'react-bootstrap';

class DatePicker extends Component {
    changeDate(event) {
        this.props.changeDate(`2021-${event.target.value}-01T00:00:00`);
    }

    render() {
        return (
            <Form inline>
                <Form.Label className="my-1 mr-2">Simulation date</Form.Label>
                <Form.Control as="select" onChange={event => this.changeDate(event)}>
                    <option value="01">Jan 2021</option>
                    <option value="02">Feb 2021</option>
                    <option value="03">Mar 2021</option>
                    <option value="04">Apr 2021</option>
                    <option value="05">May 2021</option>
                    <option value="06">Jun 2021</option>
                    <option value="07">Jul 2021</option>
                    <option value="08">Aug 2021</option>
                    <option value="09">Sep 2021</option>
                    <option value="10">Oct 2021</option>
                    <option value="11">Nov 2021</option>
                    <option value="12">Dec 2021</option>
                </Form.Control>
            </Form>
        )
    }
}

export default DatePicker;