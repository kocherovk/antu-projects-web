import React from "react";
import ProjectsFilter from './ProjectsFilter';
import EnrichedTable from './EnrichedTable';
import Grid from '@material-ui/core/Grid';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import ProjectModal from './ProjectModal';
const querystring = require('querystring');
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  button: {
    margin: theme.spacing.unit,
  }
});

class ProjectsList extends React.Component {
  state = {
    projects: [],
    projectsLoaded: false,
    projectsFilter: {},
    projectsFieldsOptions: {
      types: [],
      stages: [],
      statuses: [],
      tobedones: [],
      users: { clients: [], engineers: [] },
    },
    selectedProject: null,
    modalIsVisible: false,
    updating: false,
    creating: false,
    tableViewMode: 'resume'
  };

  loadProjects(filter) {
    this.setState({
      ...this.state,
      projects: [],
      projectsLoaded: false,
      modalIsVisible: false,
      selectedProject: false,
      projectsFilter: filter
    });

    fetch('/api/projects?' + querystring.stringify(filter))
      .then(res => res.json())
      .then(
        (result) => {
          this.setState({
            ...this.state,
            projectsLoaded: true,
            projects: result,
            projectsFilter: filter
          });
        },
        (error) => {
          console.error(error);
          this.setState({
            ...this.state,
            isLoaded: true,
            error
          });
        }
      )
  }

  loadProjectFieldsOptions() {
    fetch('/api/project-fields')
      .then(res => res.json())
      .then(
        (result) => {
          this.setState({ ...this.state, projectsFieldsOptions: result });
        },
        (error) => {
          console.error(error);
        }
      )
  }

  componentDidMount() {
    this.loadProjects();
    this.loadProjectFieldsOptions();
  }

  handleCreateProject() {
    this.setState({ creating: true, modalIsVisible: true });
  }

  handleUpdateProject() {
    if (this.state.selectedProject)
      this.setState({ updating: true, modalIsVisible: true });
  }

  handleDeleteProject() {
    if (this.state.selectedProject) {
      const answer = confirm('Are you shure?');
      if (answer)
        this.deleteProject(this.state.selectedProject);
    }
  }

  deleteProject(id) {
    fetch('/api/project/' + id, {
      method: 'DELETE'
    }).then(() => {
      this.loadProjects();
    });
  }

  createProject(project) {
    this.setState({ creating: false });

    if (!project.client_id)
      project.client_id = null;

    if (!project.engineer_id)
      project.engineer_id = null;

    if (!project.owner_id)
      project.owner_id = null;

    if (!project.quantity)
      project.quantity = null;

    fetch('/api/project', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json; charset=utf-8"
      },
      body: JSON.stringify(project)
    }).then(() => this.loadProjects());
  }

  updateProject(project) {
    this.setState({ updating: false });

    let id = project.id;
    fetch('/api/project/' + id, {
      method: 'PATCH',
      headers: {
        "Content-Type": "application/json; charset=utf-8"
      },
      body: JSON.stringify(project)
    }).then(() => {
      this.loadProjects()
    });
  }

  canEdit() {
    return this.props.currentUser && this.props.currentUser.rights.can_edit;
  }

  canDelete() {
    return this.props.currentUser && this.props.currentUser.rights.can_delete;
  }

  canCreate() {
    return this.props.currentUser && this.props.currentUser.rights.can_create;
  }

  canView(field) {
    return this.props.currentUser && this.props.currentUser.rights.project_fields.indexOf(field) != -1;
  }

  render() {
    const { classes } = this.props;
    const selectedProject = this.state.projects.find((p) => p.id == this.state.selectedProject);
    let projectsRows = this.state.projects;
    const options = this.state.projectsFieldsOptions;

    const rows = [
      { id: 'id', label: 'Id' },
      { id: 'priority', label: 'Priority' },
      { id: 'status_id', label: 'Status' },
      { id: 'number', label: 'Number' },
      { id: 'name', label: 'Name' },
      { id: 'version', label: 'Version' },
      { id: 'owner_id', label: 'Owner' },
      { id: 'link', label: 'Link' },
      { id: 'link2', label: 'Link' },
      { id: 'tobedone_id', label: 'To be done' },
      { id: 'stage_id', label: 'Stage' },
      { id: 'type_id', label: 'Type' },
      { id: 'client_id', label: 'Client' },
      { id: 'engineer_id', label: 'Engineer' },
      { id: 'quantity', label: 'Quantity' },
      { id: 'serials', label: 'Serials' },
      { id: 'description', label: 'Description' },
      { id: 'order_number', label: 'Order number' },
      { id: 'eur', label: 'EUR' },
      { id: 'eur_inv', label: 'EUR inv' },
      { id: 'nzd', label: 'NZD' },
      { id: 'nzd_inv', label: 'NZD inv' },
      { id: 'client_po', label: 'Client PO' },
      { id: 'quote_date', label: 'Quote date' },
      { id: 'quote_number', label: 'Quote number' },
      { id: 'quote_price', label: 'Quote price' },
      { id: 'invoice_number', label: 'Invoice number' },
      { id: 'invoice_amount', label: 'Invoice amount' },
      { id: 'invoice_sent', label: 'Invoice sent' },
      { id: 'invoice_paid', label: 'Invoice paid' },
      { id: 'date_of_order', label: 'Date of order' },
      { id: 'deliver_when', label: 'Deliver' },
      { id: 'date_finish', label: 'Date finish' },
      { id: 'finance_remarks', label: 'Finance remarks' },
    ];

    const rowsPerViewMode = {
      'all': rows.map(r => r.id),
      'finance': [
        'number', 'name', 'client_id',
        'order_number', 'eur', 'eur_inv', 'nzd', 'nzd_inv', 'client_po', 
        'quote_date', 'quote_number', 'quote_price',
        'invoice_number', 'invoice_amount', 'invoice_sent', 'invoice_paid',
        'date_of_order', 'deliver_when', 'date_finish', 'finance_remarks'
      ],
      'resume': [
        'stage_id', 'status_id', 'type_id', 'tobedone_id', 'client_id',
         'engineer_id', 'owner_id', 'priority', 'quantity', 'serials',
          'number', 'name', 'version', 'description'
      ]
    };

    let availableRows = [];
    let displayTableViewModeSelect = false;

    if (this.props.currentUser) {
      displayTableViewModeSelect = this.props.currentUser.roles.indexOf('admin') != -1;
      availableRows = rows.filter((r) => {
        return  this.props.currentUser.rights.project_fields.indexOf(r.id) != -1 &&
                rowsPerViewMode[this.state.tableViewMode].indexOf(r.id) != -1;
      }
    )}

    projectsRows = this.state.projects.map(p => {
      const stage = options.stages.find(s => s.id == p.stage_id);
      const status = options.statuses.find(s => s.id == p.status_id);
      const type = options.types.find(s => s.id == p.type_id);
      const tobedone = options.tobedones.find(s => s.id == p.tobedone_id);
      const client = options.users.clients.find(s => s.id == p.client_id);
      const engineer = options.users.engineers.find(s => s.id == p.engineer_id);
      const owner = options.users.engineers.find(s => s.id == p.owner_id);
      const link = p.link && <a href={p.link}>open link</a>;
      const link2 = p.link2 && <a href={p.link2}>open link</a>;

      return {
        ...p,
        link, link2,
        stage_id: stage && stage.name,
        status_id: status && status.name,
        type_id: type && type.name,
        tobedone_id: tobedone && tobedone.name,
        client_id: client && client.name,
        engineer_id: engineer && engineer.name,
        owner_id: owner && owner.name,
        invoice_paid: p.invoice_paid && new Date(p.invoice_paid * 1000).toDateString(),
        invoice_sent: p.invoice_sent && new Date(p.invoice_sent * 1000).toDateString(),
        date_of_order: p.date_of_order && new Date(p.date_of_order * 1000).toDateString(),
        deliver_when: p.deliver_when && new Date(p.deliver_when * 1000).toDateString(),
        date_finish: p.date_finish && new Date(p.date_finish * 1000).toDateString(),
        quote_date: p.quote_date && new Date(p.quote_date * 1000).toDateString(),
      };
    });

    return (
      <div>
        <ProjectModal
          isVisible={this.state.modalIsVisible}
          project={selectedProject}
          updating={this.state.updating}
          creating={this.state.creating}
          projectsFieldsOptions={this.state.projectsFieldsOptions}
          onCloseFunc={() => this.setState({ modalIsVisible: false, creating: false, updating: false })}
          createFunc={(project) => this.createProject(project)}
          updateFunc={(project) => this.updateProject(project)}
          canView={(field) => this.canView(field)}
        />
        <ProjectsFilter
          filter={this.state.projectsFilter}
          filterOptions={this.state.projectsFieldsOptions}
          onChange={(filter) => this.loadProjects(filter)}
          canView={(field) => this.canView(field)}
        />
        {displayTableViewModeSelect && <Grid item lg={2} md={4} sm={6} xs={6}>
          <TextField
            select
            fullWidth
            label="View"
            value={this.state.tableViewMode}
            onChange={(evt) => this.setState({tableViewMode: evt.target.value})}
            margin="normal"
          >
            <MenuItem value='all'>All</MenuItem>
            <MenuItem value='finance'>Finance</MenuItem>
            <MenuItem value='resume'>Resume</MenuItem>
          </TextField>
        </Grid>}
        <Grid container spacing={24}>
          <Grid item lg={12} md={12}>
            <EnrichedTable
              orderBy='id'
              order='desc'
              rowsPerPage={10}
              title='Projects'
              rows={availableRows}
              data={projectsRows}
              selectedItemChanged={(id) => this.setState({ selectedProject: id })}
            >
            </EnrichedTable>
          </Grid>
          <Grid item lg={12}>
            {this.canCreate() && <Button
              className={classes.button}
              onClick={() => this.handleCreateProject()}
              variant='contained'
              size="small"
            >
              Create Project
           </Button>}
            {this.canEdit() && <Button
              className={classes.button}
              disabled={!this.state.selectedProject}
              onClick={() => this.handleUpdateProject()}
              variant='contained'
              size="small"
            >
              Edit Project
           </Button>}
            {this.canDelete() && <Button
              className={classes.button}
              variant='contained'
              disabled={!this.state.selectedProject}
              onClick={() => this.handleDeleteProject()}
              size="small">
              Delete Project
            </Button>}
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default withStyles(styles)(ProjectsList)