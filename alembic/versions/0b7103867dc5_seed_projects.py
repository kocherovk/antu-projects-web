"""seed_projects

Revision ID: 0b7103867dc5
Revises: a09d5e380acf
Create Date: 2019-03-09 16:23:47.091023

"""
from alembic import op
import sqlalchemy as sa

import sys
sys.path.append('.')

# revision identifiers, used by Alembic.
from models import ProjectStage, ProjectStatus, ProjectToBeDone, ProjectType

revision = '0b7103867dc5'
down_revision = 'a09d5e380acf'
branch_labels = None
depends_on = None


def upgrade():
    op.bulk_insert(ProjectStage.__table__, [
        {'order': 1, 'name': 'InitialDesign'},
        {'order': 2, 'name': 'DesignSch'},
        {'order': 3, 'name': 'DesignPCB'},
        {'order': 4, 'name': 'DesignSoftware'},
        {'order': 5, 'name': 'Ext Manufacturing'},
        {'order': 6, 'name': 'Int Manufacturing'},
        {'order': 7, 'name': 'Manual Manufact'},
        {'order': 8, 'name': 'Assembly'},
        {'order': 9, 'name': 'Testing Q.C.'},
        {'order': 10, 'name': 'Debugging'},
        {'order': 11, 'name': 'Shipping'},
        {'order': 12, 'name': 'Final Report'},
        {'order': 13, 'name': 'Finished'},
        {'order': 14, 'name': 'Alpha'},
        {'order': 15, 'name': 'Beta'},
        {'order': 16, 'name': 'Proposal'},
        {'order': 17, 'name': 'Quote'},
        {'order': 18, 'name': 'Invoice'}
    ])

    op.bulk_insert(ProjectStatus.__table__, [
        {'name': 'Open'},
        {'name': 'On Hold'},
        {'name': 'Finished'},
        {'name': 'Closed'}
    ])

    op.bulk_insert(ProjectToBeDone.__table__, [
        {'name': 'To be decided'},
        {'name': 'Internally'},
        {'name': 'Externally'}
    ])

    op.bulk_insert(ProjectType.__table__, [
        {'name': 'Electronic'},
        {'name': 'Software'},
        {'name': 'App'},
        {'name': 'Electronic-App'},
        {'name': 'Electronic-Software'},
        {'name': 'Manufacturing'},
        {'name': 'Administration'},
        {'name': 'Promotional'},
        {'name': 'Internal Docs'},
    ])


def downgrade():
    pass
