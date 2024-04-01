import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'picking_slip_dates'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()

      table.bigInteger('picking_slip_id').unsigned().unique()
      table.string('printed_username', 20)
      table.string('inspected_username', 20)
      table.string('packed_username', 20)
      table.string('shipped_username', 20)
      table.string('held_username', 20)
      table.string('cancelled_username', 20)
      table.string('refunded_username', 20)
      table.string('confirmed_username', 20)
      table.timestamp('printed_at', { useTz: false }).defaultTo(null)
      table.timestamp('inspected_at', { useTz: false }).defaultTo(null)
      table.timestamp('packed_at', { useTz: false }).defaultTo(null)
      table.timestamp('shipped_at', { useTz: false }).defaultTo(null)
      table.timestamp('delivered_at', { useTz: false }).defaultTo(null)
      table.timestamp('returned_at', { useTz: false }).defaultTo(null)
      table.timestamp('cancelled_at', { useTz: false }).defaultTo(null)
      table.timestamp('refunded_at', { useTz: false }).defaultTo(null)
      table.timestamp('held_at', { useTz: false }).defaultTo(null)
      table.timestamp('confirmed_at', { useTz: false }).defaultTo(null)
      table.string('held_reason', 20)
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
