import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { FileProvider } from './file/FileProvider';
import { BookmarkProvider } from './bookmark/BookmarkProvider';

const AppProviders = ({ children }) => {
  return (
    <Router>
      <BookmarkProvider>
        <FileProvider>{children}</FileProvider>
      </BookmarkProvider>
    </Router>
  );
};

export default AppProviders;
