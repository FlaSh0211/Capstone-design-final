/* eslint-disable react-hooks/rules-of-hooks */
import React, { useEffect, useState } from "react";
import Header, { LoginButton, ProfileButton } from "components/Base/Header";
import { SearchInput } from "components/Search";
import { connect } from "react-redux";
import * as userActions from "redux/modules/user";
import * as searchActions from "redux/modules/search";
import storage from "lib/storage";
import { bindActionCreators } from "redux";

function HeaderContainer({
  visible,
  user,
  UserActions,
  SearchActions,
  history,
  keywords,
}) {
  if (!visible) return null;
  /* 
    [ Logout handler ]
    로그아웃을 할 때에는, 로그아웃 요청을 하고, 로컬스토리지도 비워주어야 합니다.
  */
  const [adminPath, setAdminPath] = useState("/auth/admin/register");
  useEffect(() => {
    const adminInfo = storage.get("adminInfo");
    if (adminInfo) {
      const path = !adminInfo._id
        ? "/auth/admin/register"
        : "/admin/management";
      setAdminPath(path);
    } else {
      setAdminPath("/auth/admin/register");
    }
  }, []);

  const handleLogout = async () => {
    try {
      // Logout API 요청하는 Action
      await UserActions.logout();
    } catch (error) {
      console.log(error);
    }
    // delete loggedInfo&adminInfo data in local storage
    storage.remove("loggedInfo");
    storage.remove("adminInfo");
    storage.remove("car");
    storage.remove("myList");
    storage.remove("myData");
    storage.remove("driverInfo");
    // reflash current page to Home
    window.location.href = "/";
  };

  const onSubmit = (event) => {
    event.preventDefault(); // submit event 초기화
    const keywordsList = keywords.split(" ").filter((str) => str !== "");
    let keys = "";
    for (const i in keywordsList) {
      keys += i == 0 ? keywordsList[i] : `+${keywordsList[i]}`;
    }
    history.push("/search/list?keywords=" + keys); // enter시 searchContainer로 연결
    // SearchActions.searchGroup({keywords})
    // history.push("/search");  // enter시 searchContainer로 연결
  };
  const searchOnChange = (event) => {
    const { name, value } = event.target;
    SearchActions.changeInput({ name, value });
  };
  return (
    <Header>
      {user.get("logged") ? (
        <>
          <SearchInput
            onSubmit={onSubmit}
            onChange={searchOnChange}
            value={keywords}
          />
          <ProfileButton
            displayName={user.getIn(["loggedInfo", "displayName"])}
            handleLogout={handleLogout}
            adminPath={adminPath}
          />
        </>
      ) : (
        <LoginButton />
      )}
    </Header>
  );
}

export default connect(
  (state) => ({
    visible: state.base.getIn(["header", "default"]),
    user: state.user,
    keywords: state.search.get("keywords"),
  }),
  (dispatch) => ({
    UserActions: bindActionCreators(userActions, dispatch),
    SearchActions: bindActionCreators(searchActions, dispatch),
  })
)(HeaderContainer);
