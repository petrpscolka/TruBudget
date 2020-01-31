import React, { Component } from "react";
import { connect } from "react-redux";

import { toJS } from "../../helper";
import withInitialLoading from "../Loading/withInitialLoading";
import { storeSnackbarMessage } from "../Notifications/actions";
import {
  createProject,
  editProject,
  hideProjectDialog,
  setCurrentStep,
  storeProjectComment,
  storeProjectName,
  storeProjectThumbnail,
  storeProjectedBudget,
  storeDeletedProjectedBudget,
  addProjectTag,
  removeProjectTag,
  storeProjectProjectedBudgetAmount
} from "./actions";
import ProjectDialog from "./ProjectDialog";

class ProjectDialogContainer extends Component {
  render() {
    return <ProjectDialog {...this.props} />;
  }
}

const mapStateToProps = state => {
  return {
    projects: state.getIn(["overview", "projects"]),
    creationDialogShown: state.getIn(["overview", "creationDialogShown"]),
    editDialogShown: state.getIn(["overview", "editDialogShown"]),
    currentStep: state.getIn(["overview", "currentStep"]),
    projectToAdd: state.getIn(["overview", "projectToAdd"]),
    dialogTitle: state.getIn(["overview", "dialogTitle"]),
    allowedIntents: state.getIn(["login", "allowedIntents"]),
    projectProjectedBudgetAmount: state.getIn(["overview", "projectProjectedBudgetAmount"])
  };
};

const mapDispatchToProps = dispatch => {
  return {
    createProject: (name, comment, thumbnail, projectedBudgets, tags) =>
      dispatch(createProject(name, comment, thumbnail, projectedBudgets, tags)),
    editProject: (id, changes, deletedProjectedBudgets) => dispatch(editProject(id, changes, deletedProjectedBudgets)),
    hideProjectDialog: () => dispatch(hideProjectDialog()),
    storeProjectName: name => dispatch(storeProjectName(name)),
    storeProjectComment: comment => dispatch(storeProjectComment(comment)),
    setCurrentStep: step => dispatch(setCurrentStep(step)),
    storeProjectThumbnail: thumbnail => dispatch(storeProjectThumbnail(thumbnail)),
    storeProjectedBudget: projectedBudgets => dispatch(storeProjectedBudget(projectedBudgets)),
    storeDeletedProjectedBudget: projectedBudgets => dispatch(storeDeletedProjectedBudget(projectedBudgets)),
    storeSnackbarMessage: message => dispatch(storeSnackbarMessage(message)),
    addProjectTag: tag => dispatch(addProjectTag(tag)),
    removeProjectTag: tag => dispatch(removeProjectTag(tag)),
    storeProjectProjectedBudgetAmount: budgetAmount => dispatch(storeProjectProjectedBudgetAmount(budgetAmount))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(withInitialLoading(toJS(ProjectDialogContainer)));
