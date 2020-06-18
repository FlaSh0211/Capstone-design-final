import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import { LogoWrapper } from 'components/List/Car';
import { ListWrapper } from 'components/List';
import styled from 'styled-components';
import ListItem from "@material-ui/core/ListItem";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import Button from '@material-ui/core/Button';
import StarIcon from '@material-ui/icons/Star';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import { yellow } from '@material-ui/core/colors';
import SearchInput from 'components/Search/SearchInput';
import * as searchActions from 'redux/modules/search';
import * as listActions from 'redux/modules/list';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import queryString from "query-string";

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    height: '21rem',
    // maxWidth: 400,
    backgroundColor: theme.palette.background.paper,
    position: 'relative',
    overflow: 'auto',
    maxHeight: '21rem',
  },
  listSection: {
    backgroundColor: 'inherit',
  },
  ul: {
    backgroundColor: 'inherit',
    padding: 0,
  },
  Button: {
    margin: theme.spacing(0.5),
  },

}));
// children 이 들어가는 곳
const Contents = styled.div`
    background: white;
    padding: 1rem 0 1rem 0;
    height: auto;
`;

const isExist = ({ dataList, attr, target }) => {
  const exist = attr
    ? dataList.filter(obj => String(obj[attr]) === target)
    : dataList.filter(el => String(el) === target);

  return exist.length == 0 ? false : true;
};

function SearchContainer({history, result, location, myList, SearchActions, ListActions, keywords}) {
  const classes = useStyles();

  useEffect(() => {
    ListActions.getMyList(); // MyList 갱신
  }, [ListActions])

  useEffect(() => {
    const query = queryString.parse(location.search);
    SearchActions.searchGroup({keywords: query.keywords})
    return () => {
      SearchActions.changeInput({name: 'keywords', value: ''});
      SearchActions.setResult([])
    }
  }, [SearchActions])
  
  const onSubmit = event => {
    event.preventDefault(); // submit event 초기화
    const keywordsList = keywords.split(' ').filter(str => str !== '');
    let keys = ''
    for(const i in keywordsList){
      keys += i == 0
        ? keywordsList[i]
        : `+${keywordsList[i]}`;
    }
    history.push("/search/list/?keywords="+keys);  // enter시 searchContainer로 연결 
    SearchActions.searchGroup({keywords})
  }
  const searchOnChange = event => {
    const {name, value} = event.target;
    SearchActions.changeInput({name, value})
  }
  const handleDetail = id => {
    history.push(`/search/result/${id}`);
  }
  const handleFavorite = ({ groupId }) => {
    const check = prompt('즐겨찾기를 추가/해제 하시겠습니까?', 'yes');
    if (check === 'yes') {
      const result = ListActions.groupPushRemove({groupId}); // group 추가
      history.go(history.location);
    }
  }
  return (
    <>
      <LogoWrapper title="Home" >
      </LogoWrapper>
      <Contents>
      <SearchInput onSubmit={onSubmit} onChange={searchOnChange} value={keywords} />
        <List dense className={classes.root}>
        {
          typeof(result) === 'object'
          ? result.map(value => {
              const result = isExist({dataList: myList.groupList, attr: 'group', target: value._id});
              const labelId = `transfer-list-all-item-${value._id}-label`;
              return (
                <ListItem key={value._id}>
                  <FormControlLabel
                    control={
                      <Checkbox 
                        icon={
                          result 
                          ? <StarIcon style={{ color: yellow[500] }} />
                          : <StarBorderIcon />
                        } 
                        checkedIcon={
                          result
                          ? <StarIcon style={{ color: yellow[500] }} />
                          : <StarBorderIcon style={{ color: "#696969" }}/>
                        } 
                        name={value._id} 
                        onClick={ () => handleFavorite({groupId: value._id})}
                      />
                    }
                  />
                  <ListItemText id={labelId} primary={`${value.name}`} />
                  <ListItemSecondaryAction>
                    <Button className={classes.Button} variant="outlined" onClick={()=>handleDetail(value._id)}>상세보기</Button>
                    {/* onClick={ (검색 인풋값) =>  {history.push('/Search/listinfo')} */}
                    {/* 위에 온클릭 이벤트를 추가해야함 */}
                  </ListItemSecondaryAction>
                </ListItem>
              );
            })
          : <ListItem key={0}>{result}</ListItem>
        }
        </List>
      </Contents>
    </>
  );
}

export default connect(
  (state) => ({
    keywords: state.search.get('keywords'),
    result: state.search.get('result'),
    myList: state.list.get('myList').toJS().mylist
  }),
  (dispatch) => ({
    SearchActions: bindActionCreators(searchActions, dispatch),
    ListActions: bindActionCreators(listActions, dispatch)  
  })
)(SearchContainer);