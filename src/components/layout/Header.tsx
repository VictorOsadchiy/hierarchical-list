import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { AppBar, Tabs, Tab, IconButton } from '@material-ui/core';
import { useParams, useHistory } from 'react-router-dom';

import { useBookmark } from 'context/bookmark/BookmarkProvider';

import CloseIcon from '@material-ui/icons/Close';
import AddIcon from '@material-ui/icons/Add';

function a11yProps(index) {
  return {
    id: `scrollable-auto-tab-${index}`,
    'aria-controls': `scrollable-auto-tabpanel-${index}`
  };
}

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    width: '100%',
    backgroundColor: theme.palette.background.paper
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  },
  tabLabel: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  closeIcon: {
    position: 'absolute',
    right: 5
  }
}));

export default function Header({ children }) {
  const classes = useStyles();
  const history = useHistory();
  let { id } = useParams();
  const {
    bookmarkList,
    handleAddBookmark,
    handleDeleteBookmark,
    handleSetActiveBookmark
  } = useBookmark();

  const handleChange = (event, newValue) => {
    history.push(`/bookmark/${newValue}`);
  };

  return (
    <div className={classes.root}>
      <AppBar position="static" color="inherit" classes={{ root: classes.header }}>
        <Tabs
          value={id}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="primary"
          variant="scrollable"
          scrollButtons="auto"
          aria-label="scrollable auto tabs example"
        >
          {bookmarkList.map(bookmark => (
            <Tab
              key={bookmark}
              label={
                <div onClick={() => handleSetActiveBookmark(bookmark)} className={classes.tabLabel}>
                  {`Bookmark ${bookmark}`}
                  <CloseIcon
                    onClick={e => handleDeleteBookmark(e, bookmark)}
                    fontSize="inherit"
                    className={classes.closeIcon}
                  />
                </div>
              }
              value={bookmark}
              {...a11yProps(bookmark)}
            />
          ))}
        </Tabs>
        <IconButton color="primary" component="span">
          <AddIcon onClick={handleAddBookmark} fontSize="inherit" />
        </IconButton>
      </AppBar>
      {children}
    </div>
  );
}
