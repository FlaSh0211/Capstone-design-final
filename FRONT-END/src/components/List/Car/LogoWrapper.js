import React from 'react';
import styled from 'styled-components';
import oc from 'open-color';
import { Link } from 'react-router-dom';

// 로고
const Wrapper = styled.div`
    background: ${oc.teal[7]};
    height: 5rem;
    display: flex;
    align-items: center;
    justify-content: center;
`;

const Logo = styled(Link)`
    color: white;
    font-family: 'Rajdhani';
    font-size: 2.4rem;
    letter-spacing: 5px;
    text-decoration: none;
    display: flex;
    justify-content: center;
    width: 85%;
`;

export default function LogoWrapper({children, title, titleUrl}) {
  return (
    <Wrapper>
      <Logo to={titleUrl ? titleUrl :"/"}>{title ? title : 'List'}</Logo>
      {children}
    </Wrapper>
  );
} 