import React from 'react';
import { useQuery } from '@apollo/client';
import { makeStyles } from '@material-ui/core/styles';

import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import FolderIcon from '@material-ui/icons/Folder';
import DescriptionIcon from '@material-ui/icons/Description';

import TreeView from '@material-ui/lab/TreeView';
import Typography from '@material-ui/core/Typography';
import HierarchicalList from './HierarchicalList';
import Stub from 'components/Stub';

import { GET_LIST } from 'graphql/queries';
import { buildStucture } from 'utils/helper';
import { useFile } from 'context/file/FileProvider';

import { useHistory, useParams } from 'react-router-dom';

import { QueryGetListArgs, Item_Type, QueryGetListResponse } from 'graphql/types';

const useStyles = makeStyles({
  root: {
    maxWidth: 400
  }
});

const HierarchicalStructure = () => {
  const classes = useStyles();
  const { handleOpenFile } = useFile();
  const history = useHistory();
  let { id: bookmarkId } = useParams();

  const [listId, setListId] = React.useState();
  const { client, loading, data, error, refetch } = useQuery<
    QueryGetListResponse,
    QueryGetListArgs
  >(GET_LIST);

  const [structure, setStructure] = React.useState([]);
  const [expanded, setExpanded] = React.useState([]);

  const handleToggle = (event, nodeIds) => {
    setExpanded(nodeIds);
  };

  React.useEffect(() => {
    if (data?.getList?.length) {
      const updatedStructure = structure.map(item => buildStucture(item, listId, data));
      setStructure(updatedStructure.length ? updatedStructure : data.getList);
    }
  }, [data]);

  const onItemClick = (id, type) => {
    if (type === Item_Type.File) {
      handleOpenFile(id);
      history.push(`/bookmark/${bookmarkId}/file/${id}`);
      return;
    }

    const data = client.readQuery({ query: GET_LIST, variables: { id: id } });
    if (!data) {
      refetch({ id: id });
    }

    setListId(id);
    if (expanded.some(item => item === id)) {
      setExpanded([...expanded.filter(item => item !== id)]);
    } else {
      setExpanded([...expanded, id]);
    }
  };

  const getListItem = list => {
    return list.map(({ id, name, type, list }) => (
      <HierarchicalList
        key={id}
        nodeId={id}
        labelText={name}
        labelIcon={type === Item_Type.File ? DescriptionIcon : FolderIcon}
        onLabelClick={() => onItemClick(id, type)}
        onIconClick={() => onItemClick(id, type)}
        defaultIcon={type === Item_Type.File ? <div style={{ width: 24 }} /> : <ChevronRightIcon />}
      >
        {list?.length && getListItem(list)}
      </HierarchicalList>
    ));
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <Stub />;
  }

  return (
    <TreeView
      className={classes.root}
      defaultCollapseIcon={<ExpandMoreIcon />}
      defaultExpandIcon={<ChevronRightIcon />}
      defaultEndIcon={<ChevronRightIcon />}
      multiSelect
      expanded={expanded}
      onNodeToggle={handleToggle}
    >
      <Typography>Chose File</Typography>
      {getListItem(structure)}
    </TreeView>
  );
};

export default HierarchicalStructure;
