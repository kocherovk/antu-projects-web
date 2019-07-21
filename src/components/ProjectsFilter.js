import moment from 'moment';
import React from "react";
import DatePicker from 'material-ui-pickers/DatePicker';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';

const styles = theme => ({
  filterItem: {
    padding: 'relative',
  }
});

class ProjectsFilter extends React.Component {
  constructor(props) {
    super(props);
  }

  static defaultProps = {
    filter: {
      stage_id: '',
      status_id: '',
      type_id: '',
      tobedone_id: '',
      client_id: '',
      engineer_id: '',
      owner_id: '',
      priority: '',
      number: '',
    },
    filterOptions: {
      'dinner_options': [],
      'payment_options': [],
      'usuario_options': [],
      'table_options': [],
    },
  };

  updateFilter(property, value) {
    if (this.props.filter[property] === value)
      return;

    let newFilter = Object.assign({}, this.props.filter);
    newFilter[property] = value;
    this.props.onChange && this.props.onChange(newFilter);
  }

  render() {
    let {
      stages,
      statuses,
      types,
      tobedones,
    } = this.props.filterOptions;

    let {
      clients,
      engineers
    } = this.props.filterOptions.users;

    return (
      <Grid container spacing={40} alignContent='center' alignItems='center' >

        <Grid item lg={2} md={4} sm={6} xs={6}>
          <TextField
            select
            fullWidth
            label="Status"
            value={this.props.filter.status_id || ''}
            onChange={(evt) => this.updateFilter('status_id', evt.target.value)}
            margin="normal"
          >
            <MenuItem key='' value=''>All</MenuItem>
            {statuses.map(option => (
              <MenuItem key={option.id} value={option.id}>
                {option.name}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        <Grid item lg={1} md={3} sm={6} xs={6}>
          <TextField
            fullWidth
            type='number'
            label="Priority"
            value={this.props.filter.priority || ''}
            onChange={(evt) => this.updateFilter('priority', evt.target.value)}
            margin="normal"
          />
        </Grid>

        <Grid item lg={1} md={3} sm={6} xs={6}>
          <TextField
            fullWidth
            label="Number"
            value={this.props.filter.number || ''}
            onChange={(evt) => this.updateFilter('number', evt.target.value)}
            margin="normal"
          >
          </TextField>
        </Grid>

        <Grid item lg={2} md={4} sm={6} xs={6}>
          <TextField
            select
            fullWidth
            label="Owner"
            value={this.props.filter.owner_id || ''}
            onChange={(evt) => this.updateFilter('owner_id', evt.target.value)}
            margin="normal"
          >
            <MenuItem key='' value=''>All</MenuItem>
            {engineers.map(option => (
              <MenuItem key={option.id} value={option.id}>
                {option.name}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        <Grid item lg={2} md={4} sm={6} xs={6}>
          <TextField
            select
            fullWidth
            label="Engineer"
            value={this.props.filter.engineer_id || ''}
            onChange={(evt) => this.updateFilter('engineer_id', evt.target.value)}
            margin="normal"
          >
            <MenuItem key='' value=''>All</MenuItem>
            {engineers.map(option => (
              <MenuItem key={option.id} value={option.id}>
                {option.name}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

          {this.props.canView('client_id') && <Grid item lg={2} md={4} sm={6} xs={6}>
          <TextField
            select
            fullWidth
            label="To be done"
            value={this.props.filter.tobedone_id || ''}
            onChange={(evt) => this.updateFilter('tobedone_id', evt.target.value)}
            margin="normal"
          >
            <MenuItem key='' value=''>All</MenuItem>
            {tobedones.map(option => (
              <MenuItem key={option.id} value={option.id}>
                {option.name}
              </MenuItem>
            ))}
          </TextField>
        </Grid>}

          {this.props.canView('client_id') && <Grid item lg={2} md={4} sm={6} xs={6}>
          <TextField
            select
            fullWidth
            label="Client"
            value={this.props.filter.client_id || ''}
            onChange={(evt) => this.updateFilter('client_id', evt.target.value)}
            margin="normal"
          >
            <MenuItem key='' value=''>All</MenuItem>
            {clients.map(option => (
              <MenuItem key={option.id} value={option.id}>
                {option.name}
              </MenuItem>
            ))}
          </TextField>
        </Grid>}

      </Grid>
    );
  }
}

export default ProjectsFilter