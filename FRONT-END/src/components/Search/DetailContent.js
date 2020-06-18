import React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import styled from 'styled-components';

const useStyles = makeStyles((theme) => ({
    root: {
        marginTop: '1rem',
        flexGrow: 1,
    }
}));

const Title = styled.span`
    padding: 3px;
    margin-left: 1rem;
    font-weight: bold;
`;
const Content = styled.p`
    padding: 3px;
    margin: 0 1rem;
    max-height: 300px;
    width: 90%;
    word-break:break-all;
`;

export default function DetailContent({ content }) {
  const classes = useStyles();
  const { type, name, tell, location, description } = content;
  return (
    <div className={classes.root}>
        <hr/>
        <Grid container spacing={3} >
            <Grid item xs={12} sm={12}>
                <Typography><Title>Type:</Title> {type}</Typography>
            </Grid>
            <Grid item xs={12} sm={12}>
                <Typography><Title>Name:</Title> {name}</Typography>
            </Grid>
            <Grid item xs={12} sm={12}>
                <Typography><Title>Tell:</Title> {tell}</Typography>
            </Grid>
            <Grid item xs={12} sm={12}>
                <Typography><Title>Location:</Title> {location}</Typography>
            </Grid>
            <Grid item xs={12} sm={12}>
                <Typography><Title>Description:</Title></Typography>
                <Content>{description}</Content>
            </Grid>
        </Grid>
    </div>
  )
}