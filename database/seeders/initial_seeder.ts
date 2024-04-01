import fs from 'node:fs'

import { parse } from 'csv-parse'

import app from '@adonisjs/core/services/app'
import { BaseSeeder } from '@adonisjs/lucid/seeders'
import db from '@adonisjs/lucid/services/db'

export default class extends BaseSeeder {
  async run() {
    const pickingSlipsCSV = app.publicPath('imports/picking_slips.csv')
    const pickingSlips = fs.createReadStream(pickingSlipsCSV).pipe(
      parse({
        delimiter: ',',
        columns: true,
      })
    )

    const pickingSlipDatesCSV = app.publicPath('imports/picking_slip_dates.csv')
    const pickingSlipDates = fs.createReadStream(pickingSlipDatesCSV).pipe(
      parse({
        delimiter: ',',
        columns: true,
      })
    )
    const pickingSlipDatesArray = await pickingSlipDates.toArray()

    const pickingSlipItemsCSV = app.publicPath('imports/picking_slip_items.csv')
    const pickingSlipItems = fs.createReadStream(pickingSlipItemsCSV).pipe(
      parse({
        delimiter: ',',
        columns: true,
      })
    )
    const pickingSlipItemsArray = await pickingSlipItems.toArray()
    const trx = await db.transaction()

    try {
      await trx
        .insertQuery()
        .table('picking_slips')
        .debug(true)
        .returning('id')
        .multiInsert(await pickingSlips.toArray())

      await trx
        .insertQuery()
        .table('picking_slip_dates')
        .debug(true)
        .returning('id')
        .multiInsert(
          pickingSlipDatesArray.map((obj) => {
            Object.keys(obj).forEach((key) => {
              if (key === 'picking_slip_id') obj[key] = +obj[key]
              if (obj[key] === '') obj[key] = null
            })
            return obj
          })
        )

      await trx
        .insertQuery()
        .table('picking_slip_items')
        .debug(true)
        .returning('id')
        .multiInsert(
          pickingSlipItemsArray.slice(0, 4000).map((obj) => {
            Object.keys(obj).forEach((key) => {
              if (key === 'picking_slip_id') obj[key] = +obj[key]
              if (obj[key] === '') obj[key] = null
            })

            return obj
          })
        )
      await trx
        .table('picking_slip_items')
        .debug(true)
        .returning('id')
        .multiInsert(
          pickingSlipItemsArray.slice(4000).map((obj) => {
            Object.keys(obj).forEach((key) => {
              if (key === 'picking_slip_id') obj[key] = +obj[key]
              if (obj[key] === '') obj[key] = null
            })

            return obj
          })
        )
      await trx.commit()
    } catch (error) {
      await trx.rollback()
      console.error('Something went wrong', error)
    }
  }
}
