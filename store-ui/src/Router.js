import React, { lazy, Suspense } from 'react';
import { Switch, Route } from 'react-router-dom';
import { Redirect } from 'react-router';
const BatchList = lazy(() => import('./pages/batchList'));
const BatchDetails = lazy(() => import('./pages/batchDetails'));

const renderLoader = () => <p>Loading</p>;

export default () => (
  <Switch>
    <Route
      exact
      path="/batch"
      render={props => <Suspense fallback={renderLoader()}><BatchList {...props} /></Suspense>}
    />
    <Route
      exact
      path="/batch/:id"
      render={props => <Suspense fallback={renderLoader()}><BatchDetails {...props} /></Suspense>}
    />
    <Redirect to="/batch"/>
  </Switch>
)