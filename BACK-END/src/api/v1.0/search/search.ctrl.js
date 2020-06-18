const GroupInfo = require('db/models/GroupInfo');

// keywords or keyword 검색
exports.searchGroupByKeywords = async (ctx) => {
  const { user } = ctx.request;
  const { keywords, keyword } = ctx.query;
  if(!user) { // user session이 없다면
    ctx.status = 403;
    ctx.body = 'Any session not founded!';
    // eslint-disable-next-line no-useless-return
    return;
  } else if(!keywords && !keyword) { // 어떤 키워드도 검색을 하지 않는다면
    ctx.status = 403;
    ctx.body = 'Any query not founded!';
    // eslint-disable-next-line no-useless-return
    return;
  }
  try {
    const groupList = keywords 
      ? await GroupInfo.searchGroupByPattern({ keywords }) 
      : await GroupInfo.searchGroupByKeyword({ keyword });
    // response message(=data)
    ctx.body = {
      groupList: groupList.length === 0 ? '검색결과 없음' : groupList 
    };
  } catch (error) {
    ctx.throw(error);
  }
};