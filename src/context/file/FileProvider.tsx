import React, {
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react';
import { useLazyQuery, ApolloError } from '@apollo/client';

import { GET_FILE } from 'graphql/queries';
import { client } from 'utils/apolloClient';

import { QueryGetFileArgs, QueryGetFileResponse, File } from 'graphql/types';

type ContextValue = {
  loading: boolean;
  error: ApolloError;
  data: File;
  file: File;
  activeFile: string | null;
  openedFiles: File[];
  handleOpenFile: (id: string) => void;
  handleCloseFile: (id: string) => void;
};

const FileContext = React.createContext<ContextValue | undefined>(undefined);

const FileProvider = (props: PropsWithChildren<any>) => {
  const [file, setFile] = useState<File | null>();
  const [activeFile, setActiveFile] = useState<string | null>();
  const [openedFiles, setOpenedFiles] = useState<File[]>([]);

  const [getFile, { loading, data, error, variables }] = useLazyQuery<
    QueryGetFileResponse,
    QueryGetFileArgs
  >(GET_FILE, {
    onError: () => {
      const errorData = {
        id: variables?.id || '',
        name: null,
        text: null
      };
      handleAddFileBoolmark(variables?.id, { getFile: errorData });
      setFile(errorData);
    }
  });

  const handleAddFileBoolmark = useCallback(
    (fileId: string, data: QueryGetFileResponse) => {
      if (!openedFiles.some(openFile => openFile.id === fileId)) {
        setOpenedFiles([...openedFiles, data.getFile]);
      }
    },
    [openedFiles]
  );

  useEffect(() => {
    if (data?.getFile) {
      setFile(data.getFile);

      const fileId = data.getFile.id;
      handleAddFileBoolmark(fileId, data);
    }
  }, [data]);

  useEffect(() => {
    if (!activeFile) {
      return;
    }
    const fileFromCache = client.readQuery({ query: GET_FILE, variables: { id: activeFile } });

    if (fileFromCache) {
      setFile(fileFromCache.getFile);
      handleAddFileBoolmark(activeFile, fileFromCache);
    } else {
      getFile({ variables: { id: activeFile } });
    }
  }, [activeFile, getFile]);

  const handleOpenFile = useCallback((fileId: string) => {
    setActiveFile(fileId);
  }, []);

  const handleCloseFile = useCallback(
    (fileId: string) => {
      if (fileId === activeFile) {
        const oldActiveIndex: number = openedFiles.findIndex(item => item.id === activeFile);
        if (oldActiveIndex < 1 && openedFiles[oldActiveIndex + 1]) {
          setActiveFile(openedFiles[oldActiveIndex + 1].id);
          setFile(openedFiles[oldActiveIndex + 1]);
        } else {
          const prevFile = openedFiles[oldActiveIndex - 1];
          setActiveFile(prevFile?.id);
          setFile(prevFile);
        }
      }
      setOpenedFiles(openedFiles.filter(openFile => openFile.id !== fileId));
    },
    [openedFiles, activeFile]
  );

  const value = useMemo(
    () => ({
      loading,
      error,
      data,
      file,
      activeFile,
      openedFiles,
      handleOpenFile,
      handleCloseFile
    }),
    [loading, error, data, file, activeFile, openedFiles, handleOpenFile, handleCloseFile]
  );

  return <FileContext.Provider value={value} {...props} />;
};

const useFile = (): ContextValue => {
  const context = useContext(FileContext);

  if (context === undefined) {
    throw new Error('useFile must be used within an FileProvider');
  }

  return context;
};

export { FileProvider, useFile };
