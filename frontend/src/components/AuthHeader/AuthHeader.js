import React from 'react';
import { Link } from 'react-router-dom';

import {
  Header,
  HeaderContainer,
  HeaderName,
  HeaderMenuButton,
  SkipToContent,
} from '@carbon/react';

const AuthHeader = (props) => (
  <HeaderContainer
    render={({ isSideNavExpanded, onClickSideNavExpand }) => (
      <Header aria-label="Carbon Header">
        <SkipToContent />
        <HeaderName href="/" prefix="IBM">
          {props.isSignIn ? 'Sign In' : 'Sign up'} 
        </HeaderName>
    
      </Header>
    )}
  />
);

export default AuthHeader;