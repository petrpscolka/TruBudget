import React, {Component} from 'react';
import {Step, Stepper, StepLabel} from 'material-ui/Stepper';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import ProjectCreationName from '../../Overview/ProjectCreationName';
import ProjectCreationPurpose from '../../Overview/ProjectCreationPurpose';
import ProjectCreationAmount from '../../Overview/ProjectCreationAmount';
import ProjectCreationAdditionalData from '../../Overview/ProjectCreationAdditionalData';
import WorkflowStateAndAssignee from './WorkflowStateAndAssignee'
class WorkflowCreationStepper extends Component {
  state = {
    stepIndex: 0
  };

  handleNext = () => {
    const {stepIndex} = this.state;
    this.setState({
     stepIndex: stepIndex + 1,
    });
    if (stepIndex === 5) {
          this.props.createWorkflowItem(this.props.location.pathname.split('/')[3], this.props.workflowName, this.props.workflowAmount, this.props.workflowCurrency, this.props.workflowPurpose, this.props.workflowAdditionalData, this.props.workflowState, this.props.workflowAssignee)
          this.props.hideWorkflowDialog();
          this.props.hideWorkflowDialog();
          this.props.storeWorkflowName('')
          this.props.storeWorkflowAmount('')
          this.props.storeWorkflowCurrency('EUR')
          this.props.storeWorkflowPurpose('')
          this.props.storeWorkflowAdditionalData('')
          this.props.storeWorkflowAssignee('')
          this.props.disableWorkflowState()
          this.props.storeWorkflowState('Open')
    }
  };

  handlePrev = () => {
    const {stepIndex} = this.state;
    if (stepIndex === 0) {
      this.props.hideWorkflowDialog();
      this.props.storeWorkflowName('')
      this.props.storeWorkflowAmount('')
      this.props.storeWorkflowCurrency('EUR')
      this.props.storeWorkflowPurpose('')
      this.props.storeWorkflowAdditionalData('')
      this.props.storeWorkflowAssignee('')
      this.props.disableWorkflowState()
      this.props.storeWorkflowState('Open')
    }
    if (stepIndex > 0) {
      this.setState({
        stepIndex: stepIndex - 1
      });
    }
  };

  getStepContent(stepIndex) {
  switch (stepIndex) {

    case 0:
      return <ProjectCreationName storeProjectName={this.props.storeWorkflowName} projectName={this.props.workflowName} type={'workflow'}/>
    case 1:
      return <ProjectCreationAmount storeProjectAmount={this.props.storeWorkflowAmount} storeProjectCurrency={this.props.storeWorkflowCurrency} projectAmount={this.props.workflowAmount} projectCurrency={this.props.workflowCurrency} type={'workflow'}/>
    case 2:
      return <ProjectCreationPurpose storeProjectPurpose={this.props.storeWorkflowPurpose}  projectPurpose={this.props.workflowPurpose} type={'workflow'}/>
    case 3:
      return <span>Done</span>
    case 4:
      return <ProjectCreationAdditionalData storeWorkflowAdditionalData={this.props.storeWorkflowAdditionalData} workflowAdditionalData={this.props.workflowAdditionalData} />
    case 5:
      return <WorkflowStateAndAssignee storeWorkflowState={this.props.storeWorkflowState} storeWorkflowAssignee={this.props.storeWorkflowAssignee} workflowAssignee={this.props.workflowAssignee} workflowState={this.props.workflowState} disabledWorkflowState={this.props.disabledWorkflowState}/>

    }
  }

  render() {
    const {stepIndex} = this.state;
    const contentStyle = {
      margin: '0 16px'
    };
    return (
      <div>
        <Stepper activeStep={stepIndex}>
          <Step>
            <StepLabel>Name</StepLabel>
          </Step>
          <Step>
            <StepLabel>Amount</StepLabel>
          </Step>
          <Step>
            <StepLabel>Purpose</StepLabel>
          </Step>
          <Step>
            <StepLabel>Documents</StepLabel>
          </Step>
          <Step>
            <StepLabel>Additional Data</StepLabel>
          </Step>
          <Step>
            <StepLabel>Status & Assignee</StepLabel>
          </Step>
        </Stepper>
        <div style={contentStyle}>
          <div>
            <div>{this.getStepContent(stepIndex)}</div>
            <div style={{
              marginTop: 12
            }}>
              <FlatButton label="Back" onTouchTap={this.handlePrev} style={{
                marginRight: 360
              }}/>
              <RaisedButton label={stepIndex === 5
                ? 'Finish'
                : 'Next'} primary={true} style={{}} onTouchTap={this.handleNext}/>
            </div>
          </div>
        </div>
      </div>
    )
  }
};

export default WorkflowCreationStepper;
