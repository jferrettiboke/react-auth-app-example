import React from 'react';

import Navbar from '../containers/NavbarContainer';

export default ({ children }) => (
  <div>
    <Navbar />
    {children}
  </div>
);
