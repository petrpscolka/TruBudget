import Button from "@material-ui/core/Button";
import MenuItem from "@material-ui/core/MenuItem";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TextField from "@material-ui/core/TextField";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import React from "react";

import DoneIcon from "@material-ui/icons/Check";
import { fromAmountString, getCurrencies, toAmountString } from "../../helper";
import strings from "../../localizeStrings";
import DropDown from "./NewDropdown";

export default class Budget extends React.Component {
  state = {
    budgetAmount: "",
    budgetAmountEdit: "",
    organization: "",
    currency: "",
    edit: false,
    editIndex: -1
  };
  getMenuItems(currencies) {
    return currencies.map((currency, index) => {
      return (
        <MenuItem key={index} value={currency.value}>
          {currency.primaryText}
        </MenuItem>
      );
    });
  }

  deleteBudgetFromList(projectedBudgets, deletedProjectedBudgets, budgetToDelete) {
    this.props.storeDeletedProjectedBudget(this.addBudget(deletedProjectedBudgets, budgetToDelete));
  }

  editProjectedBudget(budgets, budget, budgetAmountEdit) {
    const updateIndex = budgets.findIndex(
      x => x.organization === budget.organization && x.currencyCode === budget.currencyCode
    );

    budgets[updateIndex].value = budgetAmountEdit;
    this.props.storeProjectedBudget(budgets);
    this.setState({
      edit: false,
      editIndex: -1
    });
  }

  addBudget(budgets, budgetToAdd) {
    budgets.push(budgetToAdd);
    return budgets;
  }

  render() {
    const { projectedBudgets = [], deletedProjectedBudgets = [], parentCurrency, storeProjectedBudget } = this.props;
    const currencies = getCurrencies(parentCurrency);
    return (
      <div>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Organization</TableCell>
              <TableCell align="right">Projected Budget</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {projectedBudgets.map((budget, i) => (
              <TableRow key={`pb-row-${budget.organization}-${budget.value}-${i}`}>
                <TableCell>{budget.organization}</TableCell>
                <TableCell align="right">
                  {this.state.edit && this.state.editIndex === i ? (
                    <TextField
                      label={strings.common.projectedBudget}
                      value={this.state.budgetAmountEdit}
                      onChange={e => this.setState({ budgetAmountEdit: e.target.value })}
                      type="text"
                      aria-label="projectedBudgetAmountEdit"
                      id="amountedit"
                    />
                  ) : (
                    toAmountString(budget.value, budget.currencyCode)
                  )}
                </TableCell>
                <TableCell align="right">
                  {this.state.edit && this.state.editIndex === i ? (
                    <Button
                      aria-label="Done"
                      onClick={() => this.editProjectedBudget(projectedBudgets, budget, this.state.budgetAmountEdit)}
                    >
                      <DoneIcon />
                    </Button>
                  ) : (
                    <Button
                      aria-label="Edit"
                      onClick={() => this.setState({ editIndex: i, edit: true, budgetAmountEdit: budget.value })}
                      disabled={this.state.edit}
                    >
                      <EditIcon />
                    </Button>
                  )}
                  <Button
                    aria-label="Delete"
                    onClick={() => this.deleteBudgetFromList(projectedBudgets, deletedProjectedBudgets, budget)}
                  >
                    <DeleteIcon />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            <TableRow key={`pb-row-add`}>
              <TableCell>
                <TextField
                  label={strings.users.organization}
                  value={this.state.organization}
                  onChange={e => this.setState({ organization: e.target.value })}
                  type="text"
                  aria-label="organization"
                  id="organizationinput"
                  disabled={this.state.edit}
                />
              </TableCell>
              <TableCell align="right">
                <div style={{ display: "flex" }}>
                  <DropDown
                    style={{ minWidth: 200, marginRight: "16px" }}
                    value={this.state.currency}
                    floatingLabel={strings.project.project_currency}
                    onChange={e => this.setState({ currency: e })}
                    id="currencies"
                    disabled={this.state.edit}
                  >
                    {this.getMenuItems(currencies)}
                  </DropDown>
                  <TextField
                    label={strings.common.projectedBudget}
                    value={this.state.budgetAmount}
                    onChange={v => {
                      if (/^[0-9,.-]*$/.test(v.target.value)) this.setState({ budgetAmount: v.target.value });
                    }}
                    onBlur={e => this.setState({ budgetAmount: toAmountString(e.target.value) })}
                    onFocus={() => this.setState({ budgetAmount: fromAmountString(this.state.budgetAmount) })}
                    type="text"
                    multiline={false}
                    aria-label="projectedbudget"
                    id="projectedbudgetinput"
                    style={{
                      width: "60%"
                    }}
                  />
                </div>
              </TableCell>
              <TableCell align="right">
                {
                  <Button
                    variant="contained"
                    color="secondary"
                    disabled={!this.state.budgetAmount || !this.state.currency || !this.state.organization}
                    onClick={() => {
                      this.setState({ edit: false });
                      const projectedBudgetsCopy = projectedBudgets;
                      projectedBudgetsCopy.push({
                        value: fromAmountString(this.state.budgetAmount).toString(10),
                        currencyCode: this.state.currency,
                        organization: this.state.organization
                      });
                      storeProjectedBudget(projectedBudgetsCopy);
                      this.setState({
                        budgetAmount: "",
                        organization: "",
                        currency: ""
                      });
                    }}
                  >
                    {this.state.edit ? `${strings.common.edit}` : `${strings.common.add}`}
                  </Button>
                }
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    );
  }
}
