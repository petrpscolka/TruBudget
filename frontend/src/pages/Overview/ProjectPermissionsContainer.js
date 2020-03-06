import _isEmpty from "lodash/isEmpty";
import React, { Component } from "react";
import { connect } from "react-redux";
import { formatString, toJS } from "../../helper";
import strings from "../../localizeStrings";
import { projectIntentOrder } from "../../permissions";
import PermissionDialog from "../Common/Permissions/PermissionDialog";
import withInitialLoading from "../Loading/withInitialLoading";
import { fetchUser } from "../Login/actions";
import {
  addTemporaryPermission,
  fetchProjectPermissions,
  grantPermission,
  hideProjectPermissions,
  removeTemporaryPermission,
  revokePermission
} from "./actions";

class ProjectPermissionsContainer extends Component {
  componentDidMount() {
    this.props.fetchUser();
    this.props.fetchProjectPermissions(this.props.projectId);
  }

  shouldComponentUpdate() {
    return !this.props.isConfirmationDialogOpen;
  }

  grant = (permission, granteeId, granteeName) => {
    this.props.grant(this.props.projectId, this.props.projectDisplayName, permission, granteeId, granteeName);
  };

  revoke = (permission, revokeeId, revokeeName) => {
    this.props.revoke(this.props.projectId, this.props.projectDisplayName, permission, revokeeId, revokeeName);
  };

  hasOnlyViewPermissions(allowedIntents) {
    const necessaryIntents = ["project.intent.grantPermission", "project.intent.revokePermission"];
    return necessaryIntents.every(i => !allowedIntents.includes(i));
  }

  /*
   * Submit is disabled in the following cases
   *  - Temporary permissions are added: Submit disabled if grant permissions are missing
   *  - Temporary permissions are removed: Submit disabled if revoke permissions are missing
   */
  isSubmitDisabled(allowedIntents, projectPermissions, temporaryPermissions) {
    if (_isEmpty(temporaryPermissions)) return true;

    const hasGrantPermissions = allowedIntents.includes("project.intent.grantPermission");
    const hasRevokePermissions = allowedIntents.includes("project.intent.revokePermission");
    const temporaryPermissionsAdded = Object.keys(projectPermissions).some(intent => {
      return temporaryPermissions[intent].some(id => !projectPermissions[intent].includes(id));
    });
    const temporaryPermissionsRemoved = Object.keys(projectPermissions).some(intent =>
      projectPermissions[intent].some(id => !temporaryPermissions[intent].includes(id))
    );

    if ((!hasGrantPermissions && temporaryPermissionsAdded) || (!hasRevokePermissions && temporaryPermissionsRemoved)) {
      return true;
    } else {
      return false;
    }
  }

  getAllowedIntents = () => {
    const { permissions, myself } = this.props;
    return Object.keys(permissions).filter(intent => permissions[intent].includes(myself));
  };

  render() {
    const allowedIntents = this.getAllowedIntents();
    return (
      <PermissionDialog
        {...this.props}
        open={this.props.permissionDialogShown}
        id={this.props.projectId}
        title={formatString(strings.permissions.dialog_title, this.props.projectDisplayName)}
        intentOrder={projectIntentOrder}
        disabledUserSelection={this.hasOnlyViewPermissions(allowedIntents)}
        disabledSubmit={this.isSubmitDisabled(allowedIntents, this.props.permissions, this.props.temporaryPermissions)}
        grant={this.grant}
        revoke={this.revoke}
        userList={this.props.userList}
      />
    );
  }
}

const mapStateToProps = state => {
  return {
    permissions: state.getIn(["overview", "permissions", "project"]),
    temporaryPermissions: state.getIn(["overview", "temporaryPermissions"]),
    permissionDialogShown: state.getIn(["overview", "permissionDialogShown"]),
    myself: state.getIn(["login", "id"]),
    userList: state.getIn(["login", "user"]),
    projectId: state.getIn(["overview", "idForPermissions"]),
    projectDisplayName: state.getIn(["overview", "displayNameForPermissions"]),
    isConfirmationDialogOpen: state.getIn(["confirmation", "open"])
  };
};

const mapDispatchToProps = dispatch => {
  return {
    hidePermissionDialog: () => dispatch(hideProjectPermissions()),
    grant: (pId, pName, permission, granteeId, granteeName) =>
      dispatch(grantPermission(pId, pName, permission, granteeId, granteeName, true)),
    revoke: (pId, pName, permission, revokeeId, revokeeName) =>
      dispatch(revokePermission(pId, pName, permission, revokeeId, revokeeName, true)),
    fetchProjectPermissions: (projectId, showLoading) => dispatch(fetchProjectPermissions(projectId, showLoading)),
    fetchUser: showLoading => dispatch(fetchUser(showLoading)),
    addTemporaryPermission: (permission, userId) => dispatch(addTemporaryPermission(permission, userId)),
    removeTemporaryPermission: (permission, userId) => dispatch(removeTemporaryPermission(permission, userId))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(withInitialLoading(toJS(ProjectPermissionsContainer)));
