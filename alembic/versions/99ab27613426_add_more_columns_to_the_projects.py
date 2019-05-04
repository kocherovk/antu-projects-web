"""add more columns to the projects

Revision ID: 99ab27613426
Revises: 0b7103867dc5
Create Date: 2019-05-04 17:35:29.196908

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '99ab27613426'
down_revision = '0b7103867dc5'
branch_labels = None
depends_on = None


def upgrade():
    with op.batch_alter_table("projects") as batch_op:
        batch_op.add_column(sa.Column('invoice_amount', sa.Numeric(10, 2)))
        batch_op.add_column(sa.Column('finance_remarks', sa.String(1024)))
        batch_op.add_column(sa.Column('date_of_order', sa.Integer()))
        batch_op.add_column(sa.Column('deliver_when', sa.Integer()))
        batch_op.add_column(sa.Column('date_finish', sa.Integer()))
        batch_op.add_column(sa.Column('quote_date', sa.Integer()))
        batch_op.add_column(sa.Column('quote_number', sa.String(255)))
        batch_op.add_column(sa.Column('quote_price', sa.Numeric(10, 2)))
        batch_op.add_column(sa.Column('eur', sa.Numeric(10, 2)))
        batch_op.add_column(sa.Column('eur_inv', sa.Numeric(10, 2)))
        batch_op.add_column(sa.Column('nzd', sa.Numeric(10, 2)))
        batch_op.add_column(sa.Column('nzd_inv', sa.Numeric(10, 2)))
        batch_op.add_column(sa.Column('client_po', sa.String(255)))


def downgrade():
    with op.batch_alter_table("projects") as batch_op:
        batch_op.drop_column('invoice_amount')
        batch_op.drop_column('finance_remarks')
        batch_op.drop_column('date_of_order')
        batch_op.drop_column('deliver_when')
        batch_op.drop_column('date_finish')
        batch_op.drop_column('quote_date')
        batch_op.drop_column('quote_number')
        batch_op.drop_column('quote_price')
        batch_op.drop_column('eur')
        batch_op.drop_column('eur_inv')
        batch_op.drop_column('nzd')
        batch_op.drop_column('nzd_inv')
        batch_op.drop_column('client_po')
