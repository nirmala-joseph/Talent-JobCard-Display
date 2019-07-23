import React from 'react';
import ReactDOM from 'react-dom';
import Cookies from 'js-cookie';
import LoggedInBanner from '../../Layout/Banner/LoggedInBanner.jsx';
import { LoggedInNavigation } from '../../Layout/LoggedInNavigation.jsx';
import { JobSummaryCard } from './JobSummaryCard.jsx';
import { BodyWrapper, loaderData } from '../../Layout/BodyWrapper.jsx';
import { Pagination, Icon, Dropdown, Checkbox, Accordion, Form, Segment, AccordionTitle, Popup, Button, Card, Label } from 'semantic-ui-react';

export default class ManageJob extends React.Component {
    constructor(props) {
        super(props);
        let loader = loaderData
        loader.allowedUsers.push("Employer");
        loader.allowedUsers.push("Recruiter");
        //console.log(loader)
        this.state = {
            loadJobs: [],
            loaderData: loader,
            activePage: 1,
            sortBy: {
                date: "desc"
            },
            filter: {
                showActive: true,
                showClosed: false,
                showDraft: true,
                showExpired: true,
                showUnexpired: true
            },
            totalPages: 1,
            activeIndex: "",
            jobId: '0'
        }
        this.loadData = this.loadData.bind(this);
        this.init = this.init.bind(this);
        
        this.paginationChange = this.paginationChange.bind(this);
        //this.sortingChange = this.sortingChange.bind(this);
        //this.filterData = this.filterData.bind(this);
        this.loadNewData = this.loadNewData.bind(this);
        //this.userClick = this.userClick.bind(this);
        this.handleCloseJob = this.handleCloseJob.bind(this);
        //your functions go here
    };

    init() {
        let loaderData = TalentUtil.deepCopy(this.state.loaderData)
        loaderData.isLoading = false;
        

        //set loaderData.isLoading to false after getting data
        this.loadData(() =>
            this.setState({ loaderData })
        )
       
        //console.log("loaderdata"+this.state.loaderData)
    }

    componentDidMount() {
        this.init();
    };
    //int activePage, string sortbyDate, bool showActive, bool showClosed, bool showDraft,
    //bool showExpired, bool showUnexpired, string employerId = null, int limit = 6)
    loadData(callback) {
        var link = 'http://localhost:51689/listing/listing/getSortedEmployerJobs';
        var cookies = Cookies.get('talentAuthToken');
       // your ajax call and other logic goes here
        $.ajax({
            url: link,
            headers: {
                'Authorization': 'Bearer ' + cookies,
                'Content-Type': 'application/json'
            },
            type: "GET",
            contentType: "application/json",
            dataType: "json",
            data: {
                activePage: this.state.activePage,
                sortByDate: this.state.sortBy.date,
                showActive: this.state.filter.showActive,
                showClosed: this.state.filter.showClosed,
                showDraft: this.state.filter.showDraft,
                showExpired: this.state.filter.showExpired,
                showUnexpired: this.state.filter.showUnexpired
            },
            success: function (data) {
                this.setState({ loadJobs: data.myJobs, totalPages: Math.ceil(data.totalCount / 6) }, callback);

                console.log("loadjobs -", this.state.loadJobs);
            }.bind(this),
//////////////////////////////////
           error: function (res, a, b) {
                //this.init();

                console.log(res)
                console.log(a)
                console.log(b)

            }.bind(this) 
        })
    }

    paginationChange(e, { activePage }) {
        this.loadNewData({ activePage: activePage });
    }

    handleCloseJob(e, jobId) {
        
            
        var link = 'http://localhost:51689/listing/listing/CloseJob';
        var cookies = Cookies.get('talentAuthToken');
        // your ajax call and other logic goes here
        $.ajax({
            url: link,
            headers: {
                'Authorization': 'Bearer ' + cookies,
                'Content-Type': 'application/json'
            },
            type: "POST",
            contentType: "application/json",
            dataType: "json",
            data: JSON.stringify(jobId),
            success: function (res) {
                this.loadData();
            }.bind(this),
            //////////////////////////////////
            error: function (res) {
                //this.init();

                console.log(res);

            }.bind(this)
        })
        this.loadData();
    }
    
         

    loadNewData(data) {
        var loader = this.state.loaderData;
        loader.isLoading = true;
        data[loaderData] = loader;
        this.setState(data, () => {
            this.loadData(() => {
                loader.isLoading = false;
                this.setState({
                    loadData: loader
                })
            })
        });
    }

    render() {
        var res = undefined;
        if (this.state.loadJobs.length > 0) {
            res = this.state.loadJobs.map(job =>
               
                <Card>
                        <Card.Content>
                        <Card.Header>{job.title}</Card.Header>
                        <Label as='a' color='black' icon='user' content='0' ribbon='right'/>
                            <Card.Meta>{job.location.city}, {job.location.country}</Card.Meta>
                            <Card.Description>
                                {job.summary}
                            </Card.Description>
                        </Card.Content>
                        <Card.Content extra>
                            <div>
                                <Button size='mini' color='red' floated='left'>
                                    Expired
                                </Button>
                            <Button.Group floated='right' size='mini'>
                                <Popup
                                    trigger={
                                        <Button content='Close' icon='close' basic color='blue' onClick={() => { this.handleCloseJob(this, job.id) }} />
                                    }
                                    content='Job will be closed'
                                    on='hover'
                                    position='top right'
                                />
                               
                                <Button content='Edit' icon='edit' basic color='blue' />
                                <Button content='Copy' icon='copy' basic color='blue'/>
                                    
                                
                                </Button.Group>
                            </div>
                        </Card.Content>
                    </Card>
               
            );
              
        }
        const options = [
            {
            key: 'desc',
            text: 'Newest First',
            value: 'desc',
            content:'Newest First',
            },
            {
                key: 'asc',
                text: 'Oldest First',
                value: 'asc',
                content: 'Oldest First',
            }
        ];
        const { activeIndex } = this.state;
        return (
            <BodyWrapper reload={this.init} loaderData={this.state.loaderData}>

                <div className="ui container">
                    <div className="ui grid">
                        <div className="row">
                            <div className="sixteen wide column">
                                <h1>List of Jobs</h1>
                                <div>
                                    <Icon name='filter'/>Filter :Choose filter Sort by Date:
                                </div>
                                <span> </span>
                                <div className="ui three cards">
                                    {
                                        res != undefined ?
                                            res
                                            : <React.Fragment>
                                                <p style={{
                                                    paddingTop: 20,
                                                    paddingBottom: 50,
                                                    marginLeft: 15
                                                }}>No Jobs Found</p>
                                            </React.Fragment>
                                    }
                                </div>
                            </div>
                        </div>
                            
                        <div className="centered row">
                             
                            <Pagination
                                ellipsisItem={{ content: <Icon name='ellipsis horizontal' />, icon: true }}
                                firstItem={{ content: <Icon name='angle double left' />, icon: true }}
                                lastItem={{ content: <Icon name='angle double right' />, icon: true }}
                                prevItem={{ content: <Icon name='angle left' />, icon: true }}
                                nextItem={{ content: <Icon name='angle right' />, icon: true }}
                                totalPages={this.state.totalPages}
                                activePage={this.state.activePage}
                                onPageChange={this.paginationChange}
                            />
                          
                        </div>
                        <div className="row">
                        </div>
                    </div>
                </div>
                                                                                             
                             
            </BodyWrapper>
        )
    }
}