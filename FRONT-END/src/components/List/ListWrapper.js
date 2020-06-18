import React from 'react';
import styled from 'styled-components';
import { shadow } from 'lib/styleUtils';
import { media } from 'lib/styleUtils';

// 화면의 중앙에 위치시킨다
const Positioner = styled.div`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
`;

// 너비, 그림자 설정
const ShadowedBox = styled.div`
    width: 500px;
    ${media.wide`
        width: 100%;
    `}
    ${media.tablet`
        width: 30rem;
    `}
    ${media.phone`
        width: 20rem;
    `}
    ${shadow(2)}
`;

const AuthWrapper = ({children}) => (
    <Positioner>
        <ShadowedBox>
            {children}
        </ShadowedBox>
    </Positioner>
);

export default AuthWrapper;