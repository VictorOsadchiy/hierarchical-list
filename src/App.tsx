import React from 'react';
import { ApolloProvider } from '@apollo/client';
import { Container, Grid } from '@material-ui/core';
import { Switch, Route, Redirect } from 'react-router-dom';

import { client } from 'utils/apolloClient';

import AppProviders from 'context/AppProviders';
import HierarchicalList from 'components/layout/HierarchicalStructure';
import FileBookmarks from 'components/layout/FileBookmarks';
import Header from 'components/layout/Header';

const App: React.FC = () => {
  return (
    <ApolloProvider client={client}>
      <AppProviders>
        <Container maxWidth="md">
          <Route path={`/bookmark/:id`}>
            <Header>
              <Grid container spacing={2} style={{ margin: '15px 0', width: '100%' }}>
                <Grid item xs={12} sm={5} md={4}>
                  <HierarchicalList />
                </Grid>
                <Grid item xs={12} sm={7} md={8}>
                  <Switch>
                    <Route path={`/bookmark/:id/file/:slug`} component={FileBookmarks} />
                  </Switch>
                </Grid>
              </Grid>
            </Header>
          </Route>
          <Redirect to="/bookmark/1" />
        </Container>
      </AppProviders>
    </ApolloProvider>
  );
};

export default App;
