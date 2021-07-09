import React from 'react';
import { Switch } from 'react-router-dom';

import Route from './Route';

import SignIn from '../pages/SignIn';
import SignUp from '../pages/SignUp';

import ForgotPassword from '../pages/ForgotPassword';
import ResetPassword from '../pages/ResetPassword';

import Profile from '../pages/Profile';

import AdminPanel from '../pages/AdminPanel';
import AdminGiftCards from '../pages/AdminGiftCards';
import AdminValidateGiftCard from '../pages/AdminValidateGiftCard';

const Routes: React.FC = () => (
  <Switch>
    <Route path="/" exact component={SignIn} />
    <Route path="/signup" component={SignUp} />
    <Route path="/forgot-password" component={ForgotPassword} />
    <Route path="/reset-password" component={ResetPassword} />

    <Route path="/profile" component={Profile} isPrivate />
    <Route exact path="/admin-panel" component={AdminPanel} isPrivate />
    <Route
      path="/admin-panel/gift-cards"
      component={AdminGiftCards}
      isPrivate
    />
    <Route
      path="/admin-panel/validate-gift-card"
      component={AdminValidateGiftCard}
      isPrivate
    />
  </Switch>
);

export default Routes;
