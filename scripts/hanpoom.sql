-- query database
select
	ps.id as picking_slip_id,
	ps.order_id,
	CASE
	    WHEN psd.held_at IS NOT NULL THEN 'held'

	    WHEN psd.printed_at IS NOT NULL THEN 'printed'

	    ELSE 'not printed'
 	END as picking_slip_status,
	(psi.is_pre_order = 1) as has_pre_order_item
from picking_slips ps
left join picking_slip_items psi
	on psi.picking_slip_id = ps.id
left join picking_slip_dates psd
	on psd.picking_slip_id  = ps.id
group by ps.id, psi.is_pre_order, psd.held_at, psd.printed_at


-- pre_order_picking_slips
select
    psd.id,
    ps.created_at,
    ps.order_fulfillment_order_id,
    count(case when psi.is_pre_order = 1 then psi.id END) as count_of_pre_order_items,
    psd.printed_username,
    psd.inspected_username,
    psd.packed_username,
  	psd.shipped_username,
  	psd.held_username,
  	psd.cancelled_username,
  	psd.refunded_username,
  	psd.confirmed_username,
  	psd.printed_at,
  	psd.shipped_at,
  	psd.delivered_at,
  	psd.returned_at,
  	psd.cancelled_at,
  	psd.refunded_at,
  	psd.held_at,
  	psd.confirmed_at,
  	psd.held_reason
  from picking_slips ps
  left join picking_slip_items psi
    on psi.picking_slip_id = ps.id
  left join picking_slip_dates psd
    on psd.picking_slip_id  = ps.id
  where psd.printed_at is not null
  and psd.inspected_at is null
  and psd.shipped_at is null
  and psd.held_at is null
  and psi.pre_order_shipping_at >= '2023-08-10 00:00:00'
  and psi.pre_order_shipping_at < '2023-08-11 00:00:00'
  group by (
  	psd.id,
  	ps.created_at,
  	ps.order_fulfillment_order_id,
  	psd.printed_username,
  	psd.inspected_username,
  	psd.packed_username,
  	psd.shipped_username,
  	psd.held_username,
  	psd.cancelled_username,
  	psd.refunded_username,
  	psd.confirmed_username,
  	psd.printed_at,
  	psd.shipped_at,
  	psd.delivered_at,
  	psd.returned_at,
  	psd.cancelled_at,
  	psd.refunded_at,
  	psd.held_at,
  	psd.confirmed_at,
  	psd.held_reason
  )
