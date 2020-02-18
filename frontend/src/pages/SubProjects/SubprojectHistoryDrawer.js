import React from "react";
import { connect } from "react-redux";

import { toJS } from "../../helper";
import HistoryDrawer from "../Common/History/HistoryDrawer";
import { hideHistory } from "../Notifications/actions";
import { fetchNextSubprojectHistoryPage } from "../Workflows/actions";
import {
  storeHistorySearchTerm,
  storeHistorySearchBarDisplayed,
  storeHistoryFilteredProjects,
  storeHistoryHighlightingRegex,
  storeHistorySearchTermArray
} from "./actions";

function SubprojectHistoryDrawer({
  projectId,
  subprojectId,
  doShow,
  events,
  nEventsTotal,
  isLoading,
  getUserDisplayname,
  hideHistory,
  fetchNextSubprojectHistoryPage,
  currentHistoryPage,
  lastHistoryPage,
  searchBarDisplayedHistory,
  searchTermHistory,
  searchDisabledHistory,
  storeHistorySearchBarDisplayed,
  storeHistorySearchTerm
}) {
  return (
    <HistoryDrawer
      doShow={doShow}
      onClose={hideHistory}
      events={events}
      nEventsTotal={nEventsTotal}
      fetchNext={() => fetchNextSubprojectHistoryPage(projectId, subprojectId)}
      hasMore={currentHistoryPage < lastHistoryPage}
      isLoading={isLoading}
      getUserDisplayname={getUserDisplayname}
      searchBarDisplayedHistory={searchBarDisplayedHistory}
      searchTermHistory={searchTermHistory}
      searchDisabledHistory={searchDisabledHistory}
      storeHistorySearchBarDisplayed={storeHistorySearchBarDisplayed}
      storeHistorySearchTerm={storeHistorySearchTerm}
    />
  );
}

function mapStateToProps(state) {
  return {
    doShow: state.getIn(["workflow", "showHistory"]),
    events: state.getIn(["workflow", "historyItems"]),
    nEventsTotal: state.getIn(["workflow", "historyItemsCount"]),
    isLoading: state.getIn(["workflow", "isHistoryLoading"]),
    currentHistoryPage: state.getIn(["workflow", "currentHistoryPage"]),
    lastHistoryPage: state.getIn(["workflow", "lastHistoryPage"]),
    searchTermHistory: state.getIn(["detailview", "searchTermHistory"]),
    getUserDisplayname: uid => state.getIn(["login", "userDisplayNameMap", uid]) || "Somebody"
  };
}

function mapDispatchToProps(dispatch) {
  return {
    hideHistory: () => dispatch(hideHistory()),
    fetchNextSubprojectHistoryPage: (projectId, subprojectId, searchTermHistory) =>
      dispatch(fetchNextSubprojectHistoryPage(projectId, subprojectId, searchTermHistory)),
    storeHistorySearchTerm: searchTerm => dispatch(storeHistorySearchTerm(searchTerm)),
    storeHistorySearchBarDisplayed: subSearchBarDisplayed =>
      dispatch(storeHistorySearchBarDisplayed(subSearchBarDisplayed)),
    storeHistoryFilteredProjects: filteredProjectsHistory =>
      dispatch(storeHistoryFilteredProjects(filteredProjectsHistory)),
    storeHistoryHighlightingRegex: highlightingRegex => dispatch(storeHistoryHighlightingRegex(highlightingRegex)),
    storeHistorySearchTermArray: searchTerms => dispatch(storeHistorySearchTermArray(searchTerms))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(toJS(SubprojectHistoryDrawer));
