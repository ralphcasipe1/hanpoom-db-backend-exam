import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'picking_slip_items'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()

      table.bigInteger('picking_slip_id').unsigned().index()
      table.bigInteger('item_id').defaultTo(null).index()
      table.bigInteger('stock_id').defaultTo(null).index()
      table.bigInteger('order_fulfillment_product_id').defaultTo(null)
      table.integer('quantity').defaultTo(null)
      table.integer('refunded_quantity').defaultTo(null)
      table.bigInteger('location_id').defaultTo(null)
      table.string('location_code', 30).defaultTo(null)
      table.tinyint('is_pre_order').defaultTo(null)
      table.tinyint('is_sales_only').defaultTo(null)
      table.timestamp('pre_order_shipping_at', { useTz: false }).defaultTo(null)
      table.timestamp('pre_order_deadline_at', { useTz: false }).defaultTo(null)

      table.timestamp('created_at', { useTz: false }).defaultTo(null)
      table.timestamp('updated_at', { useTz: false }).defaultTo(null)
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
