import React from 'react';
import styled from 'styled-components';
import oc from 'open-color';
import { shadow, media } from 'lib/styleUtils';

const ListItem = ({title, subTitle}) => {
    return (
    <>
    <b style={{fontSize:"1rem", marginRight: "0.5rem"}}>{title?title:'타이틀을 입력해주세요'}</b>
    <span style={{fontSize:"0.7rem"}}>-{subTitle?subTitle:''}</span>
    </>
    );
};

export default ListItem;