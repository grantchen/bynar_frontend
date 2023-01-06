import React, { useState, useRef, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import UserPool from '../../UserPool';
import { AccountContext } from '../../components/Accounts';
import MFA from '../../components/MFA';

import {
  Theme,
  Content,
  Form,
  Stack,
  TextInput,
  Button,
  Heading,
  Checkbox,
  InlineLoading,
  FormLabel,
  Link,
  InlineNotification,
} from '@carbon/react';
import { ArrowRight, ArrowLeft } from '@carbon/react/icons';

const Profile = () => {
  return (
    <Content>
      <MFA />
    </Content>
  );
};

export default Profile;
