import React, { useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import List from "@material-ui/core/List";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import Checkbox from "@material-ui/core/Checkbox";
import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";
import Skeleton from '@material-ui/lab/Skeleton';
import { FormControl, InputLabel, NativeSelect } from "@material-ui/core";

const useStyles = makeStyles(theme => ({
  root: {
    margin: "auto"
  },
  cardHeader: {
    padding: theme.spacing(1, 2)
  },
  list: {
    width: "100%",
    height: 420,
    backgroundColor: theme.palette.background.paper,
    overflow: "auto",
    [theme.breakpoints.down('md')]: {
      height: 300,
    }
  },
  button: {
    width: "10%",
    height: "2rem",
    margin: theme.spacing(0.5, 0)
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120
  },
  selectEmpty: {
    marginTop: theme.spacing(2)
  }
}));

function not(a, b) {
  return a.filter(value => b.indexOf(value) === -1);
}

function intersection(a, b) {
  return a.filter(value => b.indexOf(value) !== -1);
}

function union(a, b) {
  return [...a, ...not(b, a)];
}

// role 리스트
const RoleSelector = ({ roles, setRoles, dir }) => {
  const classes = useStyles();
  const [state, setState] = React.useState({
    age: ""
  });
  const { data } = roles;
  // const roleKeys = Object.keys(data);
  const roleKeys =
    dir === "left"
      ? Object.keys(data).filter(key => key !== roles.right.role)
      : Object.keys(data).filter(key => key !== roles.left.role);

  // 초기상태의 Role
  const defaultRole = roles[dir].role;

  const handleChange = event => {
    const { name, value } = event.target;
    console.log(dir, ":", value)
    const selectedList = data[value];
    setState({
      ...state,
      [name]: value
    });
    setRoles({
      ...roles,
      [dir]: {
        role: value,
        data: selectedList
      }
    });
  };
  return (
    <FormControl className={classes.formControl}>
      <InputLabel htmlFor="age-native-simple">Role</InputLabel>
      <NativeSelect
        native
        value={state.age}
        onChange={handleChange}
        defaultValue={defaultRole}
        inputProps={{
          name: "age",
          id: "age-native-simple"
        }}
      >
        {roleKeys.map(role => (
          <option value={role}>{role}</option>
        ))}
      </NativeSelect>
    </FormControl>
  );
};

export default function UsersTransferList({ managers, result, AdminActions, history }) {
  const classes = useStyles();
  const [checked, setChecked] = React.useState([]);
  // componentDidMount 
  useEffect(() => {
    AdminActions.getManagers();
    return ()=> {
      AdminActions.getManagers();
    }
  }, [AdminActions])
  useEffect(() => {
    setRoles({
      ...roles,
      data: managers,
      left: {...roles.left, data: managers["Users"]},
      right: {...roles.right, data: managers["Drivers"]}
    })
  }, [managers])
  // +++++++++++++++수정구역
  const [roles, setRoles] = React.useState({
    data: managers,
    left: {
      role: "Users",
      data: managers["Users"]
    },
    right: {
      role: "Drivers",
      data: managers["Drivers"]
    }
  });
  const left = roles.left.data;
  const right = roles.right.data;
  // +++++++++++++++

  const leftChecked = intersection(checked, left);
  const rightChecked = intersection(checked, right);

  const handleToggle = value => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  const numberOfChecked = items => intersection(checked, items).length;

  const handleToggleAll = items => () => {
    if (numberOfChecked(items) === items.length) {
      setChecked(not(checked, items));
    } else {
      setChecked(union(checked, items));
    }
  };

  const handleCheckedRight = () => {
    setRoles({
      ...roles,
      data: {
        ...roles.data,
        [roles.right.role]: right.concat(leftChecked),
        [roles.left.role]: not(left, leftChecked)
      },
      right: {
        ...roles.right,
        data: right.concat(leftChecked)
      },
      left: {
        ...roles.left,
        data: not(left, leftChecked)
      }
    });
    setChecked(not(checked, leftChecked));
  };
  const handleCheckedLeft = () => {
    setRoles({
      ...roles,
      data: {
        ...roles.data,
        [roles.right.role]: not(right, rightChecked),
        [roles.left.role]: left.concat(rightChecked)
      },
      left: {
        ...roles.left,
        data: left.concat(rightChecked)
      },
      right: {
        ...roles.right,
        data: not(right, rightChecked)
      }
    });
    setChecked(not(checked, rightChecked));
  };

  const exportId = data => {
    let result = {};
      for( const key in data ){
        result[key] = data[key];
        for( let idx=0; idx<result[key].length; idx++ ){
          result[key][idx] = result[key][idx]._id;
        }
      }
    return result; 
  }

  const handleUpdate = async () => {
    try {
      const result = exportId(roles.data);
      await AdminActions.updateManagers(result)
        .then(
          AdminActions.getManagers()
        );
    } catch (error) {
      alert("Server Error:::알수없는 error 발생");
    }
  }
  const customList = (title, items) => (
    <Card>
      <CardHeader
        className={classes.cardHeader}
        avatar={
          <Checkbox
            onClick={handleToggleAll(items)}
            checked={
              numberOfChecked(items) === items.length && items.length !== 0
            }
            indeterminate={
              numberOfChecked(items) !== items.length &&
              numberOfChecked(items) !== 0
            }
            disabled={items.length === 0}
            inputProps={{ "aria-label": "all items selected" }}
          />
        }
        title={title}
        subheader={`${numberOfChecked(items)}/${items.length} selected`}
      />
      <Divider />
      <List className={classes.list} dense component="div" role="list">
        {items.map(value => {
          const labelId = `transfer-list-all-item-${value.email}-label`;

          return (
            <ListItem
              key={value.email}
              role="listitem"
              button
              onClick={handleToggle(value)}
            >
              <ListItemIcon>
                <Checkbox
                  checked={checked.indexOf(value) !== -1}
                  tabIndex={-1}
                  disableRipple
                  inputProps={{ "aria-labelledby": labelId }}
                />
              </ListItemIcon>
              <ListItemText id={labelId} primary={`😀 ${value.email}`} />
            </ListItem>
          );
        })}
        <ListItem />
      </List>
    </Card>
  );
  return (
    <Grid
      container
      spacing={2}
      justify="center"
      alignItems="center"
      className={classes.root}
    >
      <Grid item xs={10} sm={4}>
        {customList(
            <RoleSelector roles={roles} setRoles={setRoles} dir="left" />,
            left
        )}
      </Grid>
      <Grid item xs={10} sm={1}>
        <Grid container direction="column" alignItems="center">
          <Button
            variant="outlined"
            size="small"
            className={classes.button}
            onClick={handleCheckedRight}
            disabled={leftChecked.length === 0}
            aria-label="move selected right"
          >
            {window.innerWidth > 360 ? "▶" : "▼"}
          </Button>
          <Button
            variant="outlined"
            size="small"
            className={classes.button}
            onClick={handleCheckedLeft}
            disabled={rightChecked.length === 0}
            aria-label="move selected left"
          >
            {window.innerWidth > 360 ? "◀" : "▲"}
          </Button>
          <Button
            variant="outlined"
            size="small"
            className={classes.button}
            onClick={handleUpdate}
            disabled={managers === roles.data}
            aria-label="move selected left"
          >
            Update
          </Button>
        </Grid>
      </Grid>
      <Grid item xs={10} sm={4}>
        {customList(
          <RoleSelector roles={roles} setRoles={setRoles} dir="right" />,
          right
        )}
      </Grid>
    </Grid>
  );
}
