import React from "react";
import MuiPickersUtilsProvider from 'material-ui-pickers/MuiPickersUtilsProvider';
import MomentUtils from 'material-ui-pickers/utils/moment-utils';
import AppBar from '@material-ui/core/AppBar';
import Person from '@material-ui/icons/Person';
import CssBaseline from '@material-ui/core/CssBaseline';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import ProjectsList from "./ProjectsList";

const styles = theme => ({
  appBar: {
    position: 'relative',
  },
  icon: {
    marginRight: theme.spacing.unit * 2,
  },
  toolbarTitle: {
    flex: 1
  },
  layout: {
    width: 'auto',
    marginTop: theme.spacing.unit * 2,
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    [theme.breakpoints.up(1400 + theme.spacing.unit * 3 * 2)]: {
      width: 1400,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
  main: {
    paddingLeft: theme.spacing.unit * 2,
    paddingRight: theme.spacing.unit * 2
  }
});

class App extends React.Component {
  state = {
    activeIndex: 0,
    currentUser: undefined,
  };

  componentDidMount() {
    fetch('/api/current-user')
      .then(res => res.json())
      .then(
        (result) => {
          this.setState({
            ...this.state,
            currentUser: result
          });
        },
        (error) => {
          console.error(error);
        }
      )
  }

  render() {
    const { activeIndex, currentUser } = this.state;
    const { classes } = this.props;

    let uerRole;
    let username;

    if (currentUser) {
      username = currentUser.name;
      uerRole = currentUser.role;
    }

    return (
      <MuiPickersUtilsProvider utils={MomentUtils}>
        <React.Fragment>
          <CssBaseline />
          <AppBar position="static" className={this.props.classes.appBar}>
            <Toolbar>
              <Person className={this.props.classes.icon} />
              <Typography variant="h6" color="inherit" noWrap className={classes.toolbarTitle}>
                {uerRole} {username}
              </Typography>
              <Button variant='contained' href='/log-out' size="small">
                Logout
              </Button>
            </Toolbar>
          </AppBar>
          <main className={this.props.classes.main}>
            <ProjectsList currentUser={this.state.currentUser}/>
          </main>
        </React.Fragment>
      </MuiPickersUtilsProvider>
    );
  }
}

export default withStyles(styles)(App);