"""create users and roles

Revision ID: 2b0b9ddc0df4
Revises: 7d27a1da2015
Create Date: 2018-10-16 11:05:56.229275

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '2b0b9ddc0df4'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        'roles',
        sa.Column('id', sa.Integer(), primary_key=True),
        sa.Column('name', sa.String(80), unique=True)
    )

    op.create_table(
        'users',
        sa.Column('id', sa.Integer, primary_key=True),
        sa.Column('name', sa.String(255), unique=True),
        sa.Column('email', sa.String(255), unique=True),
        sa.Column('password', sa.String(255)),
        sa.Column('phone', sa.String(255)),
        sa.Column('active', sa.Boolean()),
    )

    op.create_table(
        'user_roles',
        sa.Column('user_id', sa.Integer(), sa.ForeignKey('users.id')),
        sa.Column('role_id', sa.Integer(), sa.ForeignKey('roles.id'))
    )


def downgrade():
    op.drop_table('user_roles')
    op.drop_table('users')
    op.drop_table('roles')
