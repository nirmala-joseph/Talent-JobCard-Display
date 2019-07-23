import React from 'react';
import Cookies from 'js-cookie';
import { Popup, Card, Button } from 'semantic-ui-react';
import moment from 'moment';

export class JobSummaryCard extends React.Component {
    constructor(props) {
        super(props);
        this.selectJob = this.selectJob.bind(this)
    }

    selectJob(id) {
        var cookies = Cookies.get('talentAuthToken');
        //url: 'http://localhost:51689/listing/listing/closeJob',
    }

    render() {
        var data = this.props.data;
        return (
            < Card.Group >
                    <Card>
                        <Card.Content>
                            <Card.Header>{data.title}</Card.Header>
                        <Card.Meta>{data.city}</Card.Meta>
                            <Card.Description>
                            {data.summary}
                            </Card.Description>
                        </Card.Content>
                        <Card.Content extra>
                            <div className='ui two buttons'>
                                <Button color='green'>
                                    Approve
                                </Button>
                                <Button color='red'>
                                    Expired
                                </Button>
                            </div>
                        </Card.Content>
                    </Card>
                </Card.Group >
            )
    }
}