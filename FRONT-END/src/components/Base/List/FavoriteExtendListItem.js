import React from "react";
import { makeStyles, styled } from "@material-ui/core/styles";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Checkbox from "@material-ui/core/Checkbox";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepButton from "@material-ui/core/StepButton";
import { media } from "lib/styleUtils";
import { CourseTitle } from "components/List/Car";
import { Sliders } from "components/Base/List";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
  stepper: {
    minWidth: "150px",
    overflowX: "auto",
  },
  stepButton: {
    width: "1rem",
    minWidth: "0.2rem",
  },
}));

// children 이 들어가는 곳
const Contents = styled(StepButton)`
  width: 2rem;
  ${media.phone`
        padding: 1rem;
        width: '0.3rem';
    `}
`;

function HorizontalNonLinearStepper({
  subContent,
  active,
  nextStation,
  distPer,
  driverLoc,
  data
}) {
  const classes = useStyles();

  return (
    <Sliders
      subContent={subContent}
      distPer={distPer}
      nextStation={nextStation}
      driverLoc={driverLoc}
      data = {data}
    />
  );
}

export default function FavoriteExtendListItem({
  title,
  subContent,
  active,
  distPer,
  nextStation,
  driverLoc,
  data
}) {
  const classes = useStyles();

  return (
    <ExpansionPanel className={classes.root}>
      <ExpansionPanelSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1a-content"
        id="panel1a-header"
      >
        {/* currentLoc, active 는 소켓으로 받아오는 값 */}
        <CourseTitle name={title} active={active} currentLoc={"집"} />
      </ExpansionPanelSummary>
      <ExpansionPanelDetails style={{ paddingBottom: "30px" }}>
        <HorizontalNonLinearStepper
          subContent={subContent}
          distPer={distPer}
          nextStation={nextStation}
          driverLoc={driverLoc}
          data = {data}
        />
      </ExpansionPanelDetails>
    </ExpansionPanel>
  );
}
