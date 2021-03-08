import React, {
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react';
import { useHistory } from 'react-router-dom';

type ContextValue = {
  activeBookmark: string;
  bookmarkList: string[];
  handleSetActiveBookmark: (id: string) => void;
  handleAddBookmark: () => void;
  handleDeleteBookmark: (e: Event, id: string) => void;
};

const BookmarkContext = React.createContext<ContextValue | undefined>(undefined);

const BookmarkProvider = (props: PropsWithChildren<any>) => {
  const history = useHistory();

  const [activeBookmark, setActiveBookmark] = useState<string>('1');
  const [bookmarkList, setBookmarkList] = useState<string[]>([activeBookmark]);

  const handleSetActiveBookmark = useCallback((id: string): void => {
    setActiveBookmark(id);
  }, []);

  const handleAddBookmark = useCallback((): void => {
    const nextBookmarkId = (+bookmarkList[bookmarkList.length - 1] + 1).toString();
    setBookmarkList([...bookmarkList, nextBookmarkId]);
    handleSetActiveBookmark(nextBookmarkId);
    history.push(`/bookmark/${nextBookmarkId}`);
  }, [bookmarkList]);

  const handleDeleteBookmark = useCallback(
    (e: Event, id: string): void => {
      e.stopPropagation();

      if (activeBookmark === id) {
        let newActiveIndex = id;
        const oldActiveIndex: number = bookmarkList.findIndex(item => item === id);
        if (oldActiveIndex < 1 && bookmarkList[oldActiveIndex + 1]) {
          newActiveIndex = bookmarkList[oldActiveIndex + 1];
        } else {
          newActiveIndex = bookmarkList[oldActiveIndex - 1];
        }
        handleSetActiveBookmark(newActiveIndex);
        history.push(`/bookmark/${newActiveIndex}`);
      }
      setBookmarkList([...bookmarkList.filter(bookmark => bookmark !== id)]);
    },
    [bookmarkList]
  );

  const value = useMemo(
    () => ({
      activeBookmark,
      bookmarkList,
      handleSetActiveBookmark,
      handleAddBookmark,
      handleDeleteBookmark
    }),
    [activeBookmark, bookmarkList, handleSetActiveBookmark, handleAddBookmark, handleDeleteBookmark]
  );

  return <BookmarkContext.Provider value={value} {...props} />;
};

const useBookmark = (): ContextValue => {
  const context = useContext(BookmarkContext);

  if (context === undefined) {
    throw new Error('useFile must be used within an FileProvider');
  }

  return context;
};

export { BookmarkProvider, useBookmark };
