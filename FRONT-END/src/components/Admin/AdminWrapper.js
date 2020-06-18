import React from 'react';
import styled from 'styled-components';
import oc from 'open-color';
import { shadow } from 'lib/styleUtils';
import { Link } from 'react-router-dom';
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
    ${media.phone`
        width: 20rem;
    `}
    ${shadow(2)}
`;

// 로고
const LogoWrapper = styled.div`
    background: #3f50b5;
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
`;

// children 이 들어가는 곳
const Contents = styled.div`
    background: white;
    padding: 2rem;
    height: 400px;
    ${media.wide`
        width: 550px;
    `}
    ${media.desktop`
        width: 550px;
    `}
    ${media.tablet`
        width: 550px;
    `}
    ${media.phone`
        padding: 1rem;
        width: 20rem;
    `}
`;

const AdminWrapper = ({children, path, title}) => (
    <Positioner>
        <ShadowedBox>
            <LogoWrapper>
                <Logo to={path?path:"/admin/management"}>{title?title:"WHERE-CAR"}</Logo>
            </LogoWrapper>
            <Contents>
                {children}
            </Contents>
        </ShadowedBox>
    </Positioner>
);

export default AdminWrapper;