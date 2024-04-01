import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'

export default class PickingSlipsController {
  async index({ response, request }: HttpContext) {
    const {
      limit,
      page,
      picking_slip_status: pickingSlipStatus,
      has_pre_order_item: hasPreOrderItem,
    } = request.qs()

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

                WHEN psd.printed_at IS NOT NULL THEN 'printed'

                ELSE 'not printed'
              END as picking_slip_status
            `),
            db.raw(/* sql */ `
              (psi.is_pre_order = 1) AS has_pre_order_item
            `)
          )
          .leftJoin('picking_slip_dates as psd', 'ps.id', 'psd.picking_slip_id')
          .leftJoin('picking_slip_items as psi', 'ps.id', 'psi.picking_slip_id')
          .groupBy('ps.id', 'psi.is_pre_order', 'psd.held_at', 'psd.printed_at')
          .orderBy('ps.created_at', 'desc')
          .as('aggregate')
      })
      .select('aggregate.*')
      .whereRaw(
        pickingSlipStatus ? `aggregate.picking_slip_status = '${pickingSlipStatus}'` : 'TRUE'
      )
      .whereRaw(hasPreOrderItem ? `aggregate.has_pre_order_item = '${hasPreOrderItem}'` : 'TRUE')
      .paginate(page ?? 1, limit)

    return response.ok(pickingSlips)
  }
}