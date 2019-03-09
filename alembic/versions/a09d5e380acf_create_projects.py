"""create projects

Revision ID: a09d5e380acf
Revises: 2b0b9ddc0df4
Create Date: 2019-03-09 16:17:34.254068

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'a09d5e380acf'
down_revision = '2b0b9ddc0df4'
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        'project_stages',
        sa.Column('id', sa.Integer(), primary_key=True),
        sa.Column('order', sa.Integer(), nullable=False),
        sa.Column('name', sa.String(255), nullable=False),
    )

    op.create_table(
        'project_statuses',
        sa.Column('id', sa.Integer(), primary_key=True),
        sa.Column('name', sa.String(255), nullable=False),
    )

    op.create_table(
        'project_tobedone',
        sa.Column('id', sa.Integer(), primary_key=True),
        sa.Column('name', sa.String(255), nullable=False),
    )

    op.create_table(
        'project_types',
        sa.Column('id', sa.Integer(), primary_key=True),
        sa.Column('name', sa.String(255), nullable=False),
    )

    op.create_table(
        'projects',
        sa.Column('id', sa.Integer(), primary_key=True),
        sa.Column('stage_id', sa.Integer(), nullable=True),
        sa.Column('status_id', sa.Integer(), nullable=True),
        sa.Column('type_id', sa.Integer(), nullable=True),
        sa.Column('tobedone_id', sa.Integer(), nullable=True),
        sa.Column('client_id', sa.Integer(), nullable=True),
        sa.Column('engineer_id', sa.Integer(), nullable=True),
        sa.Column('owner_id', sa.Integer(), nullable=True),
        sa.Column('priority', sa.Integer(), nullable=True),
        sa.Column('quantity', sa.Integer(), nullable=True),
        sa.Column('serials', sa.String(255), nullable=True),
        sa.Column('order_number', sa.String(255), nullable=True),
        sa.Column('invoice_number', sa.String(255), nullable=True),
        sa.Column('invoice_sent', sa.DateTime(), nullable=True),
        sa.Column('invoice_paid', sa.DateTime(), nullable=True),
        sa.Column('number', sa.String(255), nullable=True),
        sa.Column('name', sa.String(255), nullable=True),
        sa.Column('version', sa.String(255), nullable=True),
        sa.Column('description', sa.String(1024), nullable=False),
        sa.Column('link', sa.String(255), nullable=True),
        sa.Column('link2', sa.String(255), nullable=True)
    )


def downgrade():
    op.drop_table('projects')
    op.drop_table('project_stages')
    op.drop_table('project_statuses')
    op.drop_table('project_tobedone')
    op.drop_table('project_types')
