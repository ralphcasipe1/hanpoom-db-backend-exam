import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'
import vine from '@vinejs/vine'

export default class PickingSlipsController {
  async index({ response, request }: HttpContext) {
    const querystrings = request.qs()

    const qsValidator = vine.compile(
      vine.object({
        page: vine.number().positive().min(1).withoutDecimals().optional(),
        limit: vine.number().positive().min(1).withoutDecimals().optional(),
        picking_slip_status: vine.enum(['printed', 'not printed', 'held']).optional(),
        has_pre_order_item: vine.boolean().optional(),
      })
    )

    const {
      limit,
      page,
      picking_slip_status: pickingSlipStatus,
      has_pre_order_item: hasPreOrderItem,
    } = await qsValidator.validate(querystrings)

    const pickingSlips = await db
      .from((subQuery) => {
        subQuery
          .from('picking_slips as ps')
          .select(
            'ps.id as picking_slip_id',
            'ps.order_id',
            db.raw(/* sql */ `
              CASE
                WHEN psd.held_at IS NOT NULL THEN 'held'

                -- Maybe we can do this:
                -- "WHEN printed_at IS NOT NULL THEN 'printed'"
                -- But I don't the context of this so I will just follow the condition
                -- based from the docs.
                WHEN psd.printed_at IS NOT NULL
                  AND psd.inspected_at IS NULL
                  AND psd.shipped_at IS NULL
                  AND psd.held_at IS NULL
                    THEN 'printed'

                WHEN psd.printed_at IS NULL
                  AND psd.inspected_at IS NULL
                    AND psd.shipped_at IS NULL
                    AND psd.held_at IS NULL
                      THEN 'not printed'

                ELSE '-'
              END as picking_slip_status
            `),
            db.raw(/* sql */ `
              (psi.is_pre_order = 1) AS has_pre_order_item
            `)
          )
          .leftJoin('picking_slip_dates as psd', 'ps.id', 'psd.picking_slip_id')
          .leftJoin('picking_slip_items as psi', 'ps.id', 'psi.picking_slip_id')
          .groupBy(
            'ps.id',
            'psi.is_pre_order',
            'psd.held_at',
            'psd.printed_at',
            'psd.inspected_at',
            'psd.shipped_at'
          )
          .orderBy('ps.created_at', 'desc')
          .as('aggregate')
      })
      .select('aggregate.*')
      .whereRaw(
        pickingSlipStatus ? `aggregate.picking_slip_status = '${pickingSlipStatus}'` : 'TRUE'
      )
      .whereRaw(hasPreOrderItem ? `aggregate.has_pre_order_item = '${hasPreOrderItem}'` : 'TRUE')
      .paginate(page ?? 1, limit ?? 20)

    return response.ok(pickingSlips)
  }
}
