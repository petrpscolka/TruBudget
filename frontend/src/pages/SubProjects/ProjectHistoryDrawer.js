import React, { useRef, useState, useEffect } from "react";
import { connect } from "react-redux";

import { toJS } from "../../helper";
import HistoryDrawer from "../Common/History/HistoryDrawer";
import { hideHistory } from "../Notifications/actions";
import {
  fetchNextProjectHistoryPage,
  storeHistorySearchTerm,
  storeHistorySearchBarDisplayed,
  storeHistoryFilteredProjects,
  storeHistoryHighlightingRegex,
  storeHistorySearchTermArray,
  restoreDefaultProjectHistoryState
} from "./actions";
import queryString from "query-string";
import WebWorker from "../../WebWorker.js";
import worker1 from "../Common/filterProjects.worker.js";
import { convertToSearchBarString } from "../../helper";
import _isEqual from "lodash/isEqual";

function ProjectHistoryDrawer({
  projectId,
  doShow,
  events,
  nEventsTotal,
  currentHistoryPage,
  lastHistoryPage,
  isLoading,
  getUserDisplayname,
  hideHistory,
  fetchNextProjectHistoryPage,
  filteredProjectsHistory,
  //searchTerm,
  subProjects,
  state,
  searchBarDisplayedHistory,
  searchTermHistory,
  searchDisabledHistory,
  highlightingRegex,
  storeHistorySearchBarDisplayed,
  storeHistorySearchTerm,
  storeHistorySearchTermArray,
  storeHistoryFilteredProjects,
  storeHistoryHighlightingRegex,
  restoreDefaultProjectHistoryState
}) {
  let worker = new WebWorker(worker1);
  worker.addEventListener("message", event => {
    // const newFilteredProjectsHistory = event.data ? event.data.filteredProjectsHistory : events;
    // console.log(newFilteredProjectsHistory);
    // const highlightingRegex = event.data.highlightingRegex;
    const searchTerms = event.data.searchTerms;
    // storeHistoryFilteredProjects(newFilteredProjectsHistory);
    // storeHistoryHighlightingRegex(highlightingRegex);
    storeHistorySearchTermArray(searchTerms);
  });

  let searchTermChanged = false;
  //On Update
  useEffect(() => {
    if (doShow) {
      // Start searching
      if (searchTermHistory) {
        //Trigger that the searchTerm for history has changed => fetching API
        searchTermChanged = true;
        restoreDefaultProjectHistoryState();
        console.log(" START SEARCHING and restored something");
      }
      // Reset searchbar
      if (!searchTermHistory) {
        console.log("RESET SEARCHING");

        storeHistorySearchTermArray([]);
      }
    }
  }, [doShow, searchTermHistory]);

  console.log(filteredProjectsHistory);
  return (
    <HistoryDrawer
      doShow={doShow}
      onClose={hideHistory}
      events={filteredProjectsHistory}
      nEventsTotal={nEventsTotal}
      searchTermChanged={searchTermChanged}
      fetchNext={() => fetchNextProjectHistoryPage(projectId, searchTermHistory)}
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

function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

const mapStateToProps = state => {
  return {
    doShow: state.getIn(["detailview", "showHistory"]),
    events: state.getIn(["detailview", "historyItems"]),
    filteredProjectsHistory: state.getIn(["detailview", "filteredProjectsHistory"]),
    nEventsTotal: state.getIn(["detailview", "totalHistoryItemCount"]),
    isLoading: state.getIn(["detailview", "isHistoryLoading"]),
    currentHistoryPage: state.getIn(["detailview", "currentHistoryPage"]),
    lastHistoryPage: state.getIn(["detailview", "lastHistoryPage"]),
    getUserDisplayname: uid => state.getIn(["login", "userDisplayNameMap", uid]) || "Somebody",

    searchBarDisplayedHistory: state.getIn(["detailview", "searchBarDisplayedHistory"]),
    searchTermHistory: state.getIn(["detailview", "searchTermHistory"]),
    //searchTerm: state.getIn(["detailview", "searchTerm"]),
    searchDisabledHistory: state.getIn(["detailview", "searchDisabledHistory"]),
    highlightingRegex: state.getIn(["detailview", "highlightingRegexHistory"]),
    //location: state.getIn(["router", "location"]),
    subProjects: state.getIn(["detailview", "subProjects"])
  };
};

const mapDispatchToProps = dispatch => {
  return {
    hideHistory: () => dispatch(hideHistory()),
    fetchNextProjectHistoryPage: projectId => dispatch(fetchNextProjectHistoryPage(projectId)),
    storeHistorySearchTerm: searchTermHistory => dispatch(storeHistorySearchTerm(searchTermHistory)),
    storeHistorySearchBarDisplayed: subSearchBarDisplayed =>
      dispatch(storeHistorySearchBarDisplayed(subSearchBarDisplayed)),
    storeHistoryFilteredProjects: filteredProjectsHistory =>
      dispatch(storeHistoryFilteredProjects(filteredProjectsHistory)),
    storeHistoryHighlightingRegex: highlightingRegex => dispatch(storeHistoryHighlightingRegex(highlightingRegex)),
    storeHistorySearchTermArray: searchTerms => dispatch(storeHistorySearchTermArray(searchTerms)),
    restoreDefaultProjectHistoryState: () => dispatch(restoreDefaultProjectHistoryState())
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(toJS(ProjectHistoryDrawer));
