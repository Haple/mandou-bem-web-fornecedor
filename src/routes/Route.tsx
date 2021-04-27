import React from 'react';
import {
  Route as ReactDOMRoute,
  RouteProps as ReactDOMRouterProps,
  Redirect,
} from 'react-router-dom';

import { useAuth } from '../hooks/auth';

interface RouteProps extends ReactDOMRouterProps {
  isPrivate?: boolean;
  component: React.ComponentType;
}

const Route: React.FC<RouteProps> = ({
  isPrivate = false,
  component: Component,
  ...rest
}) => {
  const { provider } = useAuth();

  return (
    <ReactDOMRoute
      {...rest}
      render={({ location }) => {
        const redirect = (
          <Redirect
            to={{
              pathname: isPrivate ? '/' : '/admin-panel',
              state: { from: location },
            }}
          />
        );

        if (isPrivate === !!provider) {
          return <Component />;
        }

        return redirect;
      }}
    />
  );
};

export default Route;
