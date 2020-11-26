import {MigrationInterface, QueryRunner, TableColumn, TableForeignKey} from "typeorm";

export default class AddForeignKeyCatetoryIdOnTransactionsTable1606354304781 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.dropColumn('transactions', 'category');
      await queryRunner.addColumn('transactions', new TableColumn({
        name: 'category_id',
        type:  'uuid',
        isNullable: false
      }));

      await queryRunner.createForeignKey('transactions', new TableForeignKey({
        name: 'TransatcionCategory',
        columnNames: ['category_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'categories',
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE'
      }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.dropForeignKey('transactions', 'TransactionCategory');
      await queryRunner.dropColumn('transactions', 'category_id');
      await queryRunner.addColumn('transactions', new TableColumn({
        name: 'category',
        type: 'varchar',
      }))
    }

}
