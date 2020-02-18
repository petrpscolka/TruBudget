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
  storeHistorySearchTermArray
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
  storeHistoryHighlightingRegex
}) {
  // On Mount
  useEffect(() => {
    console.log("showing history on mount!");
    //Get Searchword from URL if available
    //console.log(props);
    console.log(isLoading);
    console.log(hideHistory);
    console.log(filteredProjectsHistory);
    console.log(fetchNextProjectHistoryPage);
    console.log(nEventsTotal);
    console.log(state);
    console.log(typeof state.router.location.search);
    console.log(state.router.location.search);
    if (state.router.location.search) {
      const queryParameterHistory = queryString.parse(state.router.location.search);
      const searchTermString = convertToSearchBarString(queryString.stringify(queryParameterHistory));
      storeHistorySearchTerm(searchTermString);
      storeHistorySearchBarDisplayed(true);
    }
    //    worker = new WebWorker(worker);
    // Listen for postmessage from worker
  }, []);

  let worker = new WebWorker(worker1);
  worker.addEventListener("message", event => {
    const newFilteredProjectsHistory = event.data ? event.data.filteredProjectsHistory : events;
    console.log(newFilteredProjectsHistory);
    const highlightingRegex = event.data.highlightingRegex;
    const searchTerms = event.data.searchTerms;
    storeHistoryFilteredProjects(newFilteredProjectsHistory);
    storeHistoryHighlightingRegex(highlightingRegex);
    storeHistorySearchTermArray(searchTerms);
  });

  //const [prevSearchterm, setPrevSearchterm] = useState("");
  const prevSearchterm = usePrevious(searchTermHistory);

  console.table(searchTermHistory, prevSearchterm);

  //On Update
  useEffect(() => {
    if (doShow) {
      // Start searching
      if (searchTermHistory) {
        worker.postMessage({ items: events, searchTerm: searchTermHistory, searchType: "history" });
        console.log(" START SEARCHING");
      }
      // Reset searchbar
      if (!searchTermHistory) {
        console.log("RESET SEARCHING");
        storeHistoryFilteredProjects(events);
        storeHistoryHighlightingRegex("");
        storeHistorySearchTermArray([]);
      }
    }
  }, [doShow, prevSearchterm]);

  console.log(filteredProjectsHistory);
  return (
    <HistoryDrawer
      doShow={doShow}
      onClose={hideHistory}
      events={filteredProjectsHistory}
      nEventsTotal={nEventsTotal}
      fetchNext={() => fetchNextProjectHistoryPage(projectId)}
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
    subProjects: state.getIn(["detailview", "subProjects"]),
    state: state
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
    storeHistorySearchTermArray: searchTerms => dispatch(storeHistorySearchTermArray(searchTerms))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(toJS(ProjectHistoryDrawer));
