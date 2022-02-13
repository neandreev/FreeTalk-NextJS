import React, { FC } from 'react';

import { AppPrivateLayout } from '../layouts/private-layout';

export const PrivateRoute: FC = ({ children }) => {
  return <AppPrivateLayout>{children}</AppPrivateLayout>;
};
