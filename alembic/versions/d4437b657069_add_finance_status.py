"""add finance status

Revision ID: d4437b657069
Revises: 99ab27613426
Create Date: 2019-05-27 19:49:08.989179

"""
from alembic import op
import sqlalchemy as sa

import sys
sys.path.append('.')

# revision identifiers, used by Alembic.
from models import FinanceStatus

revision = 'd4437b657069'
down_revision = '99ab27613426'
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        'finance_statuses',
        sa.Column('id', sa.Integer(), primary_key=True),
        sa.Column('colour', sa.String(16), nullable=False),
        sa.Column('name', sa.String(32), nullable=False),
    )

    op.bulk_insert(FinanceStatus.__table__, [
        {'name': 'Paid', 'colour': '#4caf50'},
        {'name': 'Special', 'colour': '#2196f3'},
        {'name': 'Next Invoice', 'colour': '#9c27b0'},
        {'name': 'Invoiced', 'colour': '#cddc39'},
        {'name': 'In Progress', 'colour': '#f44336'}
    ])

    with op.batch_alter_table("projects") as batch_op:
        batch_op.add_column(sa.Column('finance_status_id', sa.Integer()))


def downgrade():
    with op.batch_alter_table("projects") as batch_op:
        batch_op.drop_column('finance_status_id')

    op.drop_table('finance_statuses')