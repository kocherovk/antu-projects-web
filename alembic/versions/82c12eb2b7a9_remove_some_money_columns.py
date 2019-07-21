"""remove some money columns

Revision ID: 82c12eb2b7a9
Revises: d4437b657069
Create Date: 2019-07-21 17:01:58.148278

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '82c12eb2b7a9'
down_revision = 'd4437b657069'
branch_labels = None
depends_on = None


def upgrade():
    with op.batch_alter_table("projects") as batch_op:
        batch_op.drop_column('eur')
        batch_op.drop_column('eur_inv')
        batch_op.drop_column('nzd')
        batch_op.drop_column('nzd_inv')

        batch_op.alter_column(
            'quote_price',
            existing_type=sa.Numeric(10, 2),
            type_=sa.VARCHAR(length=128)
        )

        batch_op.add_column(sa.Column('still_to_invoice', sa.String(255)))


def downgrade():
    with op.batch_alter_table("projects") as batch_op:
        batch_op.add_column(sa.Column('eur', sa.Numeric(10, 2)))
        batch_op.add_column(sa.Column('eur_inv', sa.Numeric(10, 2)))
        batch_op.add_column(sa.Column('nzd', sa.Numeric(10, 2)))
        batch_op.add_column(sa.Column('nzd_inv', sa.Numeric(10, 2)))

        batch_op.alter_column(
            'quote_price',
            existing_type=sa.VARCHAR(length=128),
            type_=sa.Numeric(10, 2)
        )

        batch_op.drop_column('still_to_invoice')
