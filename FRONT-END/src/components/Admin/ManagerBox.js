import React from 'react';
import styled from 'styled-components';
import oc from 'open-color';
import { media } from 'lib/styleUtils';
import { Paper } from '@material-ui/core';

const ManagerBox = ({children, style, display, width}) => {
  const { wide, phone } = width||{ wide: '500px', phone: '20rem'};
  const ManagerPaper = styled(Paper)`
    width: ${wide};
    height: 600px;
    ${media.wide`
      width: ${wide};
      margin-right: 2rem;
    `}
    ${media.phone`
      width: ${phone};
      height: 500px;
      margin-top: 1rem;
      margin-right: 0rem;
      display: ${display?'none':'block'}
    `}
  `;

  return (
    <ManagerPaper elevation={3} style={style}>
      { children }
    </ManagerPaper>
  )
};

export default ManagerBox;