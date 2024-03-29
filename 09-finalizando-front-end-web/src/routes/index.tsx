import { Routes as Switch, Route } from 'react-router-dom';

import { PrivateRoutes } from './PrivateRoutes';
import { PublicRoutes } from './PublicRoutes';

import { SignIn } from '../pages/SignIn';
import { SignUp } from '../pages/SignUp';
import { ForgotPassword } from '../pages/ForgotPassword';
import { ResetPassword } from '../pages/ResetPassword';

import { Dashboard } from '../pages/Dashboard';
import { Profile } from '../pages/Profile';

export function Routes() {
  return (
    <Switch>
      <Route element={<PublicRoutes />}>
        <Route path="/" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Route>

      <Route element={<PrivateRoutes />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
      </Route>

      <Route path="*" element={<h1>404 NOT FOUND</h1>} />
    </Switch>
  );
}
