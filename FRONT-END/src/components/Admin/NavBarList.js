import React from 'react';

import { List, ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import LocalTaxiIcon from '@material-ui/icons/LocalTaxi';
import NavigationIcon from '@material-ui/icons/Navigation';
import SupervisorAccountIcon from '@material-ui/icons/SupervisorAccount';

const NavBarList = ({history}) => {
  const handleOnClick = (route) => {
    history.push(route)
  };

  return (
    <List>
        <ListItem button key="Manager" onClick={ () => handleOnClick("/admin/management") }>
          <ListItemIcon><SupervisorAccountIcon /></ListItemIcon>
          <ListItemText primary={"Manager"} />
        </ListItem>
        <ListItem button key="Cars" onClick={ () => handleOnClick("/admin/cars") }>
          <ListItemIcon><LocalTaxiIcon /></ListItemIcon>
          <ListItemText primary={"Cars"} />
        </ListItem>
        <ListItem button key="Courses" onClick={ () => handleOnClick("/admin/courses") }>
          <ListItemIcon><NavigationIcon /></ListItemIcon>
          <ListItemText primary={"Courses"} />
        </ListItem>
    </List>
  );
};

export default NavBarList;