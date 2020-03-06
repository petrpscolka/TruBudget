import AppBar from "@material-ui/core/AppBar";
import FormControl from "@material-ui/core/FormControl";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import Dialog from "@material-ui/core/Dialog";
import IconButton from "@material-ui/core/IconButton";
import Slide from "@material-ui/core/Slide";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import CloseIcon from "@material-ui/icons/Close";
import React from "react";
import { connect } from "react-redux";

import { getCurrencies } from "../../helper";
import { closeAnalyticsDialog, getExchangeRates, storeDisplayCurrency } from "./actions";
import strings from "../../localizeStrings";
import ProjectAnalytics from "./ProjectAnalytics";

const styles = {
  container: {
    marginTop: "68px"
  },
  toolbar: {
    display: "flex"
  },
  dropdown: {
    marginLeft: "auto",
    marginTop: "0"
  },
  loadingCharts: {
    marginTop: "16px",
    display: "flex",
    justifyContent: "center"
  }
};

function getMenuItems(currencies) {
  return currencies.map((currency, index) => {
    return (
      <MenuItem key={index} data-test={`currency-menuitem-${currency.value}`} value={currency.value}>
        {currency.primaryText}
      </MenuItem>
    );
  });
}

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

const ProjectAnalyticsDialog = ({
  projectId,
  open,
  displayCurrency,
  closeAnalyticsDialog,
  storeDisplayCurrency,
  getExchangeRates,
  projectProjectedBudgets
}) => (
  <Dialog
    fullScreen
    open={open}
    onClose={closeAnalyticsDialog}
    aria-labelledby="responsive-dialog-title"
    TransitionComponent={Transition}
  >
    <AppBar>
      <Toolbar style={styles.toolbar}>
        <IconButton
          color="inherit"
          onClick={closeAnalyticsDialog}
          data-test="close-analytics-button"
          aria-label="Close"
        >
          <CloseIcon />
        </IconButton>
        <Typography variant="h6" color="inherit">
          {strings.analytics.project_analytics}
        </Typography>
        <form autoComplete="off" style={styles.dropdown}>
          <FormControl>
            <Select
              value={displayCurrency || "EUR"}
              onChange={e => {
                storeDisplayCurrency(e.target.value);
                getExchangeRates(e.target.value);
              }}
              inputProps={{
                name: "currencies",
                id: "currencies"
              }}
              data-test="select-currencies"
              IconComponent={props => <ArrowDropDownIcon {...props} style={{ color: "white" }} />}
              style={{ color: "white" }}
            >
              {getMenuItems(getCurrencies())}
            </Select>
          </FormControl>
        </form>
      </Toolbar>
    </AppBar>
    <div style={styles.container}>
      <ProjectAnalytics
        projectId={projectId}
        totalBudget={projectProjectedBudgets}
        getExchangeRates={getExchangeRates}
      />
    </div>
  </Dialog>
);

const mapStateToProps = state => {
  return {
    open: state.getIn(["analytics", "dialogOpen"]),
    displayCurrency: state.getIn(["analytics", "currency"])
  };
};

const mapDispatchToProps = {
  closeAnalyticsDialog,
  storeDisplayCurrency,
  getExchangeRates
};

export default connect(mapStateToProps, mapDispatchToProps)(ProjectAnalyticsDialog);
