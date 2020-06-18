import React from 'react';
import styled from 'styled-components';
import oc from 'open-color';
import { media } from 'lib/styleUtils';

const Title = styled.div`
    width: 500px;
    font-size: 1.5rem;
    font-weight: 500;
    color: ${oc.gray[8]};
    ${media.phone`
        width: 20rem;
        font-size: 1rem;
    `}
    margin-bottom: 1rem;
`;

const AuthContent = ({title, children}) => (
    <div>
        <Title>{title}</Title>
        {children}
    </div>
);

export default AuthContent;