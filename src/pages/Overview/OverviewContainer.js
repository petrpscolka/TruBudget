import React, { Component } from 'react';
import { connect } from 'react-redux';


import {
  fetchProjects,
  createProject,
  storeProjectName,
  storeProjectAmount,
  storeProjectComment,
  storeProjectCurrency,
  setCurrentStep,
  addApproverRole,
  addAssignmentRole,
  addBankRole,
  removeApproverRole,
  removeAssignmentRole,
  removeBankRole,
  storeProjectThumbnail,
  showProjectDialog,
  onProjectDialogCancel
} from './actions';

import Overview from './Overview';
import { showSnackBar, storeSnackBarMessage } from '../Notifications/actions';
import { fetchRoles } from '../Login/actions';

import globalStyles from '../../styles';

class OverviewContainer extends Component {
  componentWillMount() {
    this.props.fetchProjects();
    this.props.fetchRoles();
  }

  render() {
    return (
      <div style={globalStyles.innerContainer}>
        <Overview {...this.props} />
      </div>
    )
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    fetchProjects: () => dispatch(fetchProjects()),
    createProject: (name, amount, comment, currency, _, approver, assignee, bank, thumbnail) => dispatch(createProject(name, amount, comment, currency, approver, assignee, bank, thumbnail)),
    showProjectDialog: () => dispatch(showProjectDialog()),
    onProjectDialogCancel: () => dispatch(onProjectDialogCancel()),
    storeProjectName: (name) => dispatch(storeProjectName(name)),
    storeProjectAmount: (amount) => dispatch(storeProjectAmount(amount)),
    storeProjectComment: (comment) => dispatch(storeProjectComment(comment)),
    storeProjectCurrency: (currency) => dispatch(storeProjectCurrency(currency)),
    addApproverRole: (role) => dispatch(addApproverRole(role)),
    addAssignmentRole: (role) => dispatch(addAssignmentRole(role)),
    addBankRole: (role) => dispatch(addBankRole(role)),
    removeApproverRole: (role) => dispatch(removeApproverRole(role)),
    removeAssignmentRole: (role) => dispatch(removeAssignmentRole(role)),
    removeBankRole: (role) => dispatch(removeBankRole(role)),
    showSnackBar: () => dispatch(showSnackBar(true)),
    storeSnackBarMessage: (message) => dispatch(storeSnackBarMessage(message)),
    setCurrentStep: (step) => dispatch(setCurrentStep(step)),
    fetchRoles: () => dispatch(fetchRoles()),
    storeProjectThumbnail: (thumbnail) => dispatch(storeProjectThumbnail(thumbnail))
  };
}

const mapStateToProps = (state) => {
  return {
    projects: state.getIn(['overview', 'projects']),
    creationDialogShown: state.getIn(['overview', 'projectDialogVisible']),
    currentStep: state.getIn(['overview', 'currentStep']),
    projectName: state.getIn(['overview', 'projectName']),
    projectAmount: state.getIn(['overview', 'projectAmount']),
    projectComment: state.getIn(['overview', 'projectComment']),
    projectThumbnail: state.getIn(['overview', 'projectThumbnail']),
    projectCurrency: state.getIn(['overview', 'projectCurrency']),
    projectApprover: state.getIn(['overview', 'projectApprover']).toJS(),
    projectAssignee: state.getIn(['overview', 'projectAssignee']).toJS(),
    projectBank: state.getIn(['overview', 'projectBank']).toJS(),
    loggedInUser: state.getIn(['login', 'loggedInUser']),
    roles: state.getIn(['login', 'roles']).toJS()
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(OverviewContainer);
