import React from "react";
import moment from 'moment';
import Button from '@material/react-button/dist';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Modal from '@material-ui/core/Modal';
import DatePicker from 'material-ui-pickers/DatePicker';
import MenuItem from '@material-ui/core/MenuItem';


function getModalStyle() {
  return {
    top: `50%`,
    left: `50%`,
    transform: `translate(-50%, -50%)`,
  };
}

const styles = theme => ({
  paper: {
    overflow: 'auto',
    maxHeight: '90vh',
    position: 'absolute',
    width: '75vw',
    [theme.breakpoints.down('md')]: {
      width: '90vw',
    },
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing.unit * 4,
  },
});

class ProjectModal extends React.Component {
  state = { project: null };

  handleChange = name => event => {
    this.setProjectAttribute(name, event.target.value);
  };

  setProjectAttribute = (attr, value) => {
    this.setState({
      project: {
        ...this.state.project,
        [attr]: value
      }
    });
  }

  handleCreateProject = () => {
    let currentItem = this.currentProject();
    if (!currentItem.type_id || !currentItem.tobedone_id)
      return;

    this.props.createFunc && this.props.createFunc(this.currentProject());
    this.setState({ project: null });
  }

  handleUpdateProject = () => {
    let currentItem = this.currentProject();
    if (!currentItem.type_id || !currentItem.tobedone_id)
      return;

    this.props.updateFunc && this.props.updateFunc(this.currentProject());
    this.setState({ project: null });
  }

  handleClose = () => {
    this.setState({ project: null });
    this.props.onCloseFunc && this.props.onCloseFunc();
  };

  currentProject() {
    const defaultProject = {
      stage_id: 1,
      status_id: 1,
      type_id: 3,
      tobedone_id: 1,
      client_id: '',
      engineer_id: '',
      owner_id: '',
      priority: 0,
      quantity: '',
      serials: '',
      order_number: '',
      invoice_number: '',
      invoice_sent: null,
      invoice_paid: null,
      number: '',
      name: '',
      version: '',
      description: '',
      link: '',
      link2: '',
    }

    if (this.props.updating) {
      return { ...this.props.project, ...this.state.project }
    } else if (this.props.creating) {
      return { ...defaultProject, ...this.state.project }
    } else {
      return defaultProject;
    }
  }

  render() {
    const { classes, projectsFieldsOptions } = this.props;

    const canView = (field) => this.props.canView(field);

    let project = this.currentProject();

    return (
      <Modal
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        open={this.props.isVisible}
        onClose={this.handleClose}
      >
        <div style={getModalStyle()} className={classes.paper}>
          <Typography variant="h6" id="modal-title">
            {this.props.updating && 'Edit Project'}
            {this.props.creating && 'New Project'}
          </Typography>
          <Grid container spacing={16}>
            <Grid item lg={2} md={2} sm={6} xs={6}>
              <TextField
                select
                fullWidth
                label="Stage"
                value={project.stage_id}
                onChange={this.handleChange('stage_id')}
                margin="normal"
              >
                {projectsFieldsOptions.stages.map(option => (
                  <MenuItem key={option.id} value={option.id}>
                    {option.name}
                  </MenuItem >
                ))}
              </TextField>
            </Grid>
            <Grid item lg={2} md={2} sm={6} xs={6}>
              <TextField
                select
                fullWidth
                label="Status"
                value={project.status_id}
                onChange={this.handleChange('status_id')}
                margin="normal"
              >
                {projectsFieldsOptions.statuses.map(option => (
                  <MenuItem key={option.id} value={option.id}>
                    {option.name}
                  </MenuItem >
                ))}
              </TextField>
            </Grid>
            <Grid item lg={2} md={2} sm={6} xs={6}>
              <TextField
                select
                fullWidth
                label="Type"
                value={project.type_id}
                onChange={this.handleChange('type_id')}
                margin="normal"
              >
                {projectsFieldsOptions.types.map(option => (
                  <MenuItem key={option.id} value={option.id}>
                    {option.name}
                  </MenuItem >
                ))}
              </TextField>
            </Grid>
            <Grid item lg={2} md={2} sm={6} xs={6}>
              <TextField
                select
                fullWidth
                label="To Be Done"
                value={project.tobedone_id}
                onChange={this.handleChange('tobedone_id')}
                margin="normal"
              >
                {projectsFieldsOptions.tobedones.map(option => (
                  <MenuItem key={option.id} value={option.id}>
                    {option.name}
                  </MenuItem >
                ))}
              </TextField>
            </Grid>
            <Grid item lg={2} md={2} sm={6} xs={6}>
              <TextField
                select
                fullWidth
                label="Client"
                value={project.client_id || ''}
                onChange={this.handleChange('client_id')}
                margin="normal"
              >
                {projectsFieldsOptions.users.clients.map(option => (
                  <MenuItem key={option.id} value={option.id}>
                    {option.name}
                  </MenuItem >
                ))}
              </TextField>
            </Grid>
            <Grid item lg={2} md={2} sm={6} xs={6}>
              <TextField
                select
                fullWidth
                label="Engineer"
                value={project.engineer_id || ''}
                onChange={this.handleChange('engineer_id')}
                margin="normal"
              >
                {projectsFieldsOptions.users.engineers.map(option => (
                  <MenuItem key={option.id} value={option.id}>
                    {option.name}
                  </MenuItem >
                ))}
              </TextField>
            </Grid>
            <Grid item lg={2} md={2} sm={6} xs={6}>
              <TextField
                select
                fullWidth
                label="Owner"
                value={project.owner_id || ''}
                onChange={this.handleChange('owner_id')}
                margin="normal"
              >
                {projectsFieldsOptions.users.engineers.map(option => (
                  <MenuItem key={option.id} value={option.id}>
                    {option.name}
                  </MenuItem >
                ))}
              </TextField>
            </Grid>
            <Grid item lg={1} md={1} sm={6} xs={6}>
              <TextField
                fullWidth
                type='number'
                label="Priority"
                value={project.priority}
                onChange={this.handleChange('priority')}
                margin="normal"
              />
            </Grid>
            <Grid item lg={1} md={1} sm={6} xs={6}>
              <TextField
                fullWidth
                type='number'
                label="Quantity"
                value={project.quantity}
                onChange={this.handleChange('quantity')}
                margin="normal"
              />
            </Grid>
            <Grid item lg={2} md={2} sm={6} xs={6}>
              <TextField
                fullWidth
                label="Serials"
                value={project.serials}
                onChange={this.handleChange('serials')}
                margin="normal"
              />
            </Grid>
            {canView('order_number') && <Grid item lg={2} md={2} sm={6} xs={6}>
              <TextField
                fullWidth
                label="Order Number"
                value={project.order_number}
                onChange={this.handleChange('order_number')}
                margin="normal"
              >
              </TextField>
            </Grid> }
            {canView('date_of_order') && <Grid item lg={2} md={2} sm={6} xs={6}>
            <DatePicker
                autoOk
                clearable
                label='Date of order'
                margin="normal"
                value={project.date_of_order && moment.unix(project.date_of_order)}
                onChange={m => this.setProjectAttribute('date_of_order', m && m.unix())}
                style={{ width: '100%' }}
              />
            </Grid> }
            {canView('deliver_when') && <Grid item lg={2} md={2} sm={6} xs={6}>
            <DatePicker
                autoOk
                clearable
                label='Deliver'
                margin="normal"
                value={project.deliver_when && moment.unix(project.deliver_when)}
                onChange={m => this.setProjectAttribute('deliver_when', m && m.unix())}
                style={{ width: '100%' }}
              />
            </Grid> }
            {canView('date_finish') && <Grid item lg={2} md={2} sm={6} xs={6}>
            <DatePicker
                autoOk
                clearable
                label='Date Finish'
                margin="normal"
                value={project.date_finish && moment.unix(project.date_finish)}
                onChange={m => this.setProjectAttribute('date_finish', m && m.unix())}
                style={{ width: '100%' }}
              />
            </Grid> }
            {canView('quote_date') && <Grid item lg={2} md={2} sm={6} xs={6}>
            <DatePicker
                autoOk
                clearable
                label='Quote Date'
                margin="normal"
                value={project.quote_date && moment.unix(project.quote_date)}
                onChange={m => this.setProjectAttribute('quote_date', m && m.unix())}
                style={{ width: '100%' }}
              />
            </Grid> }
            {canView('quote_number') && <Grid item lg={2} md={2} sm={6} xs={6}>
              <TextField
                fullWidth
                label="Quote Number"
                value={project.quote_number}
                onChange={this.handleChange('quote_number')}
                margin="normal"
              >
              </TextField>
            </Grid>}
            {canView('quote_price') && <Grid item lg={2} md={2} sm={6} xs={6}>
              <TextField
                fullWidth
                label="Quote price"
                type="number"
                value={project.quote_price}
                onChange={this.handleChange('quote_price')}
                margin="normal"
              >
              </TextField>
            </Grid>}
            {canView('client_po') && <Grid item lg={2} md={2} sm={6} xs={6}>
              <TextField
                fullWidth
                label="Client PO"
                value={project.client_po}
                onChange={this.handleChange('client_po')}
                margin="normal"
              >
              </TextField>
            </Grid>}
            {canView('eur') && <Grid item lg={2} md={2} sm={6} xs={6}>
              <TextField
                fullWidth
                label="EUR"
                type="number"
                value={project.eur}
                onChange={this.handleChange('eur')}
                margin="normal"
              >
              </TextField>
            </Grid>}
            {canView('eur_inv') && <Grid item lg={2} md={2} sm={6} xs={6}>
              <TextField
                fullWidth
                label="EUR inv"
                type="number"
                value={project.eur_inv}
                onChange={this.handleChange('eur_inv')}
                margin="normal"
              >
              </TextField>
            </Grid>}
            {canView('nzd') && <Grid item lg={2} md={2} sm={6} xs={6}>
              <TextField
                fullWidth
                label="NZD"
                type="number"
                value={project.nzd}
                onChange={this.handleChange('nzd')}
                margin="normal"
              >
              </TextField>
            </Grid>}
            {canView('nzd_inv') && <Grid item lg={2} md={2} sm={6} xs={6}>
              <TextField
                fullWidth
                label="NZD inv"
                type="number"
                value={project.nzd_inv}
                onChange={this.handleChange('nzd_inv')}
                margin="normal"
              >
              </TextField>
            </Grid>}
            {canView('invoice_number') && <Grid item lg={2} md={2} sm={6} xs={6}>
              <TextField
                fullWidth
                label="Invoice Number"
                value={project.invoice_number}
                onChange={this.handleChange('invoice_number')}
                margin="normal"
              >
              </TextField>
            </Grid>}
            {canView('invoice_amount') && <Grid item lg={2} md={2} sm={6} xs={6}>
              <TextField
                fullWidth
                label="Invoice Amount"
                type="number"
                value={project.invoice_amount}
                onChange={this.handleChange('invoice_amount')}
                margin="normal"
              >
              </TextField>
            </Grid>}
            {canView('invoice_sent') && <Grid item lg={2} md={4} sm={6} xs={6}>
              <DatePicker
                autoOk
                clearable
                label='Invoice Sent'
                margin="normal"
                value={project.invoice_sent && moment.unix(project.invoice_sent)}
                onChange={m => this.setProjectAttribute('invoice_sent', m && m.unix())}
                style={{ width: '100%' }}
              />
            </Grid>}
            {canView('invoice_paid') && <Grid item lg={2} md={4} sm={6} xs={6}>
              <DatePicker
                autoOk
                clearable
                label='Invoice Paid'
                margin="normal"
                value={project.invoice_paid && moment.unix(project.invoice_paid)}
                onChange={m => this.setProjectAttribute('invoice_paid', m && m.unix())}
                style={{ width: '100%' }}
              />
            </Grid>}
            <Grid item lg={2} md={2} sm={6} xs={6}>
              <TextField
                fullWidth
                label="Number"
                value={project.number}
                onChange={this.handleChange('number')}
                margin="normal"
              >
              </TextField>
            </Grid>
            <Grid item lg={2} md={2} sm={6} xs={6}>
              <TextField
                fullWidth
                label="Name"
                value={project.name}
                onChange={this.handleChange('name')}
                margin="normal"
              >
              </TextField>
            </Grid>
            <Grid item lg={2} md={2} sm={6} xs={6}>
              <TextField
                fullWidth
                label="Version"
                value={project.version}
                onChange={this.handleChange('version')}
                margin="normal"
              >
              </TextField>
            </Grid>
            <Grid item lg={6} md={6} sm={12} xs={12}>
              <TextField
                fullWidth
                label="Link1"
                value={project.link}
                onChange={this.handleChange('link')}
                margin="normal"
              >
              </TextField>
            </Grid>
            <Grid item lg={6} md={6} sm={12} xs={12}>
              <TextField
                fullWidth
                label="Link2"
                value={project.link2}
                onChange={this.handleChange('link2')}
                margin="normal"
              >
              </TextField>
            </Grid>
            <Grid item lg={6} md={6} sm={12} xs={12}>
              <TextField
                fullWidth
                label="Description"
                multiline
                rowsMax={4}
                rows={4}
                value={project.description}
                onChange={this.handleChange('description')}
                margin="normal"
              />
            </Grid>
            {canView('finance_remarks') && <Grid item lg={6} md={6} sm={12} xs={12}>
            <TextField
                fullWidth
                label="Finance remarks"
                multiline
                rowsMax={4}
                rows={4}
                value={project.finance_remarks}
                onChange={this.handleChange('finance_remarks')}
                margin="normal"
              />
            </Grid>}
          </Grid>
          {this.props.creating &&
            <Button raised color="primary" onClick={() => this.handleCreateProject()}>
              Create
            </Button>
          }
          {this.props.updating &&
            <Button raised color="primary" onClick={() => this.handleUpdateProject()}>
              Update
            </Button>
          }
          <Button color="secondary" onClick={() => this.props.onCloseFunc && this.props.onCloseFunc()}>
            Cancel
          </Button>
        </div>
      </Modal>
    );
  }
}

ProjectModal.propTypes = {
  classes: PropTypes.object.isRequired,
  createFunc: PropTypes.func,
  updateFunc: PropTypes.func,
  onCloseFunc: PropTypes.func,
  isVisible: PropTypes.bool,
};

const ProjectModalWrapped = withStyles(styles)(ProjectModal);

export default ProjectModalWrapped;