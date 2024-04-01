import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'picking_slips'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()

      table.bigint('order_id').index()
      table.bigint('order_fulfillment_order_id').index()
      table.tinyint('is_contained_single_product')

      table.timestamp('created_at', { useTz: false })
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
