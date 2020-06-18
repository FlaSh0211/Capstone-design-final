import axios from 'axios';

// Backend에서 API를 만들어야 함.

export const groupByKeywords = ({keywords}) => axios.get(`/api/v1.0/search/group/?keywords=${keywords}`);

export const groupByKeyword = ({keyword}) => axios.get(`/api/v1.0/mylist/drivers`);
