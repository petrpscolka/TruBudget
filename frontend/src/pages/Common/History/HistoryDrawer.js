import Drawer from "@material-ui/core/Drawer";
import React from "react";

import ScrollingHistory from "./ScrollingHistory";

export default function HistoryDrawer({
  doShow,
  onClose,
  events,
  nEventsTotal,
  fetchNext,
  searchTermChanged,
  hasMore,
  isLoading,
  getUserDisplayname,
  searchBarDisplayedHistory,
  searchTermHistory,
  searchDisabledHistory,
  storeHistorySearchBarDisplayed,
  storeHistorySearchTerm
}) {
  return (
    <Drawer open={doShow} onClose={onClose} anchor="right">
      <ScrollingHistory
        events={events}
        nEventsTotal={nEventsTotal}
        hasMore={hasMore}
        isLoading={isLoading}
        getUserDisplayname={getUserDisplayname}
        fetchNext={fetchNext}
        searchTermChanged={searchTermChanged}
        searchBarDisplayedHistory={searchBarDisplayedHistory}
        searchTermHistory={searchTermHistory}
        searchDisabledHistory={searchDisabledHistory}
        storeHistorySearchBarDisplayed={storeHistorySearchBarDisplayed}
        storeHistorySearchTerm={storeHistorySearchTerm}
      />
    </Drawer>
  );
}
