import React, { useCallback, useEffect } from 'react';
import { Paper, Divider, Tabs, Tab, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import CloseIcon from '@material-ui/icons/Close';
import { useFile } from 'context/file/FileProvider';
import Stub from 'components/Stub';
import { useParams, useHistory } from 'react-router-dom';

const useStyles = makeStyles(theme => ({
  root: {
    flex: 1
  },
  header: {
    flexGrow: 1,
    width: '100%',
    backgroundColor: theme.palette.background.paper
  },
  tabLabel: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  closeIcon: {
    position: 'absolute',
    right: 5
  },
  contentWrapper: {
    padding: 24,
    minHeight: 190
  },
  tabWrapper: {
    [theme.breakpoints.up('xs')]: {
      minWidth: 120
    }
  }
}));

function a11yProps(index: string) {
  return {
    id: `scrollable-auto-tab-${index}`,
    'aria-controls': `scrollable-auto-tabpanel-${index}`
  };
}

const FileBookmarks = () => {
  const classes = useStyles();
  let { slug, id: bookmarkId } = useParams();
  const history = useHistory();

  const { openedFiles, activeFile, file, loading, handleCloseFile, handleOpenFile } = useFile();

  useEffect(() => {
    if (slug) {
      handleOpenFile(slug);
    }
  }, [slug]);

  const onCloseFile = useCallback(
    (e: Event, id: string): void => {
      e.stopPropagation();
      handleCloseFile(id);
    },
    [handleCloseFile]
  );

  const onOpenFile = useCallback((id: string): void => {
    history.push(`/bookmark/${bookmarkId}/file/${id}`);
    handleOpenFile(id);
  }, []);

  if (!loading && !openedFiles.length) {
    return null;
  }

  return (
    <Paper elevation={2} classes={{ root: classes.root }}>
      <Tabs
        value={activeFile}
        onChange={(e, id) => handleOpenFile(id)}
        indicatorColor="primary"
        textColor="primary"
        variant="scrollable"
        scrollButtons="auto"
      >
        {openedFiles.map(({ id, name }) => (
          <Tab
            key={id}
            label={
              <div onClick={() => onOpenFile(id)} className={classes.tabLabel}>
                {name || id}
                <CloseIcon
                  onClick={e => onCloseFile(e, id)}
                  fontSize="inherit"
                  className={classes.closeIcon}
                />
              </div>
            }
            {...a11yProps(id)}
            value={id}
            classes={{ root: classes.tabWrapper }}
          />
        ))}
      </Tabs>
      <Divider />

      <div className={classes.contentWrapper}>
        {activeFile && file && (
          <>
            {!file?.name && !file?.text ? (
              <Stub />
            ) : (
              <>
                <Typography variant="h4">{file.name}</Typography>
                <Typography variant="body2">{file.text}</Typography>
              </>
            )}
          </>
        )}
      </div>
    </Paper>
  );
};

export default FileBookmarks;
