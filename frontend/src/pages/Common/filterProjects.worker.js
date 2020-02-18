export default () => {
  let highlightingRegex;
  onmessage = ({ data: { items, searchTerm, searchType } }) => {
    let filteredItems;
    switch (searchType) {
      case "project":
      case "subProject":
        filteredItems = filterProjects(items, searchTerm);
        break;
      case "history":
        filteredItems = filterHistoryEvents(items, searchTerm);
        break;
      default:
        filteredItems = filterProjects(items, searchTerm);
        break;
    }
    console.log(filteredItems);
    postMessage(filteredItems);
  };

  const filterProjects = (projects, searchTermString) => {
    const unfilteredSearchTerms = searchTermString.split(" ");
    const searchedDisplayNames = extractFromSearchTerms(unfilteredSearchTerms, "name");
    const searchedTags = extractFromSearchTerms(unfilteredSearchTerms, "tag");
    const searchedStatus = extractFromSearchTerms(unfilteredSearchTerms, "status");
    const searchTermsWithoutPrefix = unfilteredSearchTerms.filter(
      searchTerm => !searchTerm.includes(":") && searchTerm.length !== 0
    );
    // Create highligthingRegex from all filtered searchterms
    const filteredSearchTerms = searchTermsWithoutPrefix.concat(searchedDisplayNames, searchedTags, searchedStatus);
    highlightingRegex = filteredSearchTerms.length !== 0 ? generateHighligthingRegex(filteredSearchTerms) : "";
    console.log(searchedDisplayNames);
    const filteredProjects = projects.filter(project => {
      let hasDisplayName = true;
      let hasStatus = true;
      let hasTag = true;
      let hasSearchTerm = true;
      // Only call functions when searching for it explicitly
      if (searchedDisplayNames.length !== 0) hasDisplayName = includesDisplayName(project, searchedDisplayNames);
      if (searchedStatus.length !== 0) hasStatus = includesStatus(project, searchedStatus);
      if (searchedTags && searchedTags.length !== 0) hasTag = includesTag(project, searchedTags);
      if (searchTermsWithoutPrefix.length !== 0) hasSearchTerm = includesSearchTerm(project, searchTermsWithoutPrefix);
      return hasDisplayName && hasStatus && hasTag && hasSearchTerm;
    });

    return { filteredProjects, searchTerms: filteredSearchTerms, highlightingRegex };
  };

  const filterHistoryEvents = (historyEvents, searchTermString) => {
    const unfilteredSearchTerms = searchTermString.split(" ");
    const searchedDisplayNames = extractFromSearchTerms(unfilteredSearchTerms, "name");
    const searchedTime = extractFromSearchTerms(unfilteredSearchTerms, "time");
    const searchTermsWithoutPrefix = unfilteredSearchTerms.filter(
      searchTerm => !searchTerm.includes(":") && searchTerm.length !== 0
    );
    // Create highligthingRegex from all filtered searchterms
    const filteredSearchTerms = searchTermsWithoutPrefix.concat(searchedDisplayNames, searchedTime);
    highlightingRegex = filteredSearchTerms.length !== 0 ? generateHighligthingRegex(filteredSearchTerms) : "";
    // console.log("Anfang");
    console.log(searchTermString);
    console.log(unfilteredSearchTerms);
    console.log(searchedDisplayNames);
    // console.log("Ende");

    const filteredProjectsHistory = historyEvents.filter(event => {
      let hasDisplayName = true;
      let hasTime = true;
      let hasSearchTerm = true;
      // Only call functions when searching for it explicitly
      if (searchedDisplayNames.length !== 0) hasDisplayName = includesDescription(event, searchedDisplayNames);
      if (searchedTime.length !== 0) hasTime = includesTime(event, searchedTime);
      if (searchTermsWithoutPrefix.length !== 0)
        hasSearchTerm = includesSearchTermHistory(event, searchTermsWithoutPrefix);

      console.table(hasDisplayName, hasTime, hasSearchTerm);
      return hasDisplayName && hasTime && hasSearchTerm;
    });

    return { filteredProjectsHistory, searchTerms: filteredSearchTerms, highlightingRegex };
  };

  const extractFromSearchTerms = (searchTerms, prefix) => {
    return searchTerms.reduce((extractedTerms, searchTerm) => {
      const searchTermPrefix = searchTerm.replace(/:/, " ").split(" ")[0];
      if (searchTermPrefix === prefix) {
        const searchTermWithoutPrefix = searchTerm.replace(/:/, " ").split(" ")[1];
        if (searchTermWithoutPrefix) {
          extractedTerms.push(searchTermWithoutPrefix);
        }
      }
      console.log(extractedTerms);
      return extractedTerms;
    }, []);
  };

  function includesSearchTerm(project, searchTermsWithoutPrefix) {
    return searchTermsWithoutPrefix.every(searchTerm => {
      return (
        project.data.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.data.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (project.data.tags !== undefined
          ? project.data.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
          : false)
      );
    });
  }

  function includesSearchTermHistory(event, searchTermsWithoutPrefix) {
    return searchTermsWithoutPrefix.every(searchTerm => {
      return (
        event.snapshot.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.businessEvent.time.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
  }

  function includesTag(project, searchedTags) {
    if (!project.data.tags) {
      return false;
    }
    return project.data.tags.some(projectTag =>
      searchedTags.some(extractedTag => projectTag.toLowerCase().includes(extractedTag.toLowerCase()))
    );
  }

  function includesStatus(project, searchedStatus) {
    if (!project.data.status) {
      return false;
    }
    return searchedStatus.some(status => {
      return project.data.status.toLowerCase().includes(status.toLowerCase());
    });
  }

  function includesDisplayName(project, searchedDisplayNames) {
    if (!project.data.displayName) {
      return false;
    }
    return searchedDisplayNames.some(displayName =>
      project.data.displayName.toLowerCase().includes(displayName.toLowerCase())
    );
  }

  function includesTime(event, searchedTime) {
    if (!event.businessEvent.time) {
      return false;
    }
    return searchedTime.some(time => {
      return event.businessEvent.time.toLowerCase().includes(time.toLowerCase());
    });
  }

  function includesDescription(event, searchedDisplayNames) {
    console.table(event.snapshot.displayName, searchedDisplayNames);
    if (!event.snapshot.displayName) {
      return false;
    }
    //search in History Description
    return searchedDisplayNames.some(displayName =>
      event.snapshot.displayName.toLowerCase().includes(displayName.toLowerCase())
    );
  }

  function generateHighligthingRegex(searchTerms) {
    const regexString = searchTerms.reduce((string, searchTerm) => {
      return string.concat("|" + searchTerm);
    });
    return new RegExp("(" + regexString + ")", "i");
  }
};
