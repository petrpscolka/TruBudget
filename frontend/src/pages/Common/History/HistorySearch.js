import React from "react";
import { withStyles } from "@material-ui/core";
import Searchbar from "../../Navbar/Searchbar";
import strings from "../../../localizeStrings";

const styles = {
  searchField: {
    padding: "2px",
    margin: "5px",
    width: "270px",
    display: "flex",
    flexDirection: "row",
    opacity: "0.8",
    boxShadow: "none"
  }
};

const ProjectSearch = ({
  searchBarDisplayed,
  searchDisabled,
  searchTerm,
  storeSearchBarDisplayed,
  storeSearchTerm
}) => {
  return (
    <Searchbar
      datatest="history-search"
      searchBarDisplayed={searchBarDisplayed}
      searchTerm={searchTerm}
      searchDisabled={searchDisabled}
      storeSearchBarDisplayed={storeSearchBarDisplayed}
      storeSearchTerm={storeSearchTerm}
      // only search after pressing Enter (search from API)
      autoSearch={false}
      previewText={"Searching History"}
      //previewText={strings.common.project_history_searchtext}
    />
  );
};

export default withStyles(styles)(ProjectSearch);
