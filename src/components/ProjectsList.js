import React from "react";
import ProjectsFilter from './ProjectsFilter';
import EnrichedTable from './EnrichedTable';
import Grid from '@material-ui/core/Grid';
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
    creating: false
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

    console.log(filter);

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
      { id: 'stage_id', label: 'Stage' },
      { id: 'status_id', label: 'Status' },
      { id: 'type_id', label: 'Type' },
      { id: 'tobedone_id', label: 'To be done' },
      { id: 'client_id', label: 'Client' },
      { id: 'engineer_id', label: 'Engineer' },
      { id: 'owner_id', label: 'Owner' },
      { id: 'priority', label: 'Priority' },
      { id: 'quantity', label: 'Quantity' },
      { id: 'serials', label: 'Serials' },
      { id: 'order_number', label: 'Order number' },
      { id: 'invoice_number', label: 'Invoice number' },
      { id: 'invoice_sent', label: 'Invoice sent' },
      { id: 'invoice_paid', label: 'Invoice paid' },
      { id: 'number', label: 'Number' },
      { id: 'name', label: 'Name' },
      { id: 'version', label: 'Version' },
      { id: 'description', label: 'Description' },
      { id: 'link', label: 'Link' },
      { id: 'link2', label: 'Link' }
    ];

    let availableRows = [];

    if (this.props.currentUser) {
      availableRows = rows.filter((r) => 
        this.props.currentUser.rights.project_fields.indexOf(r.id) != -1);
    }

    projectsRows = this.state.projects.map(p => {
      const stage = options.stages.find(s => s.id == p.stage_id);
      const status = options.statuses.find(s => s.id == p.status_id);
      const type = options.types.find(s => s.id == p.type_id);
      const tobedone = options.tobedones.find(s => s.id == p.tobedone_id);
      const client = options.users.clients.find(s => s.id == p.client_id);
      const engineer = options.users.engineers.find(s => s.id == p.engineer_id);
      const owner = options.users.engineers.find(s => s.id == p.owner_id);

      return {
        ...p,
        stage_id: stage && stage.name,
        status_id: status && status.name,
        type_id: type && type.name,
        tobedone_id: tobedone && tobedone.name,
        client_id: client && client.name,
        engineer_id: engineer && engineer.name,
        owner_id: owner && owner.name,
        invoice_paid: new Date(p.invoice_paid * 1000).toDateString(),
        invoice_sent: new Date(p.invoice_sent * 1000).toDateString()
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