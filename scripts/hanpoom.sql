-- create picking_slips
CREATE TABLE public.picking_slips (
	id serial4 NOT NULL,
	order_id int8 NULL,
	order_fulfillment_order_id int8 NULL,
	is_contained_single_product int2 NULL,
	created_at timestamp NULL,
	CONSTRAINT picking_slips_pkey PRIMARY KEY (id)
);
CREATE INDEX picking_slips_order_fulfillment_order_id_index ON public.picking_slips USING btree (order_fulfillment_order_id);
CREATE INDEX picking_slips_order_id_index ON public.picking_slips USING btree (order_id);

-- create picking_slip_items
CREATE TABLE public.picking_slip_items (
	id serial4 NOT NULL,
	picking_slip_id int8 NULL,
	item_id int8 NULL,
	stock_id int8 NULL,
	order_fulfillment_product_id int8 NULL,
	quantity int4 NULL,
	refunded_quantity int4 NULL,
	location_id int8 NULL,
	location_code varchar(30) DEFAULT NULL::character varying NULL,
	is_pre_order int2 NULL,
	is_sales_only int2 NULL,
	pre_order_shipping_at timestamp NULL,
	pre_order_deadline_at timestamp NULL,
	created_at timestamp NULL,
	updated_at timestamp NULL,
	CONSTRAINT picking_slip_items_pkey PRIMARY KEY (id)
);
CREATE INDEX picking_slip_items_item_id_index ON public.picking_slip_items USING btree (item_id);
CREATE INDEX picking_slip_items_picking_slip_id_index ON public.picking_slip_items USING btree (picking_slip_id);
CREATE INDEX picking_slip_items_stock_id_index ON public.picking_slip_items USING btree (stock_id);

-- create picking_slip_dates
CREATE TABLE public.picking_slip_dates (
	id serial4 NOT NULL,
	picking_slip_id int8 NULL,
	printed_username varchar(20) NULL,
	inspected_username varchar(20) NULL,
	packed_username varchar(20) NULL,
	shipped_username varchar(20) NULL,
	held_username varchar(20) NULL,
	cancelled_username varchar(20) NULL,
	refunded_username varchar(20) NULL,
	confirmed_username varchar(20) NULL,
	printed_at timestamp NULL,
	inspected_at timestamp NULL,
	packed_at timestamp NULL,
	shipped_at timestamp NULL,
	delivered_at timestamp NULL,
	returned_at timestamp NULL,
	cancelled_at timestamp NULL,
	refunded_at timestamp NULL,
	held_at timestamp NULL,
	held_reason varchar(20) NULL,
	confirmed_at timestamp NULL,
	CONSTRAINT picking_slip_dates_picking_slip_id_unique UNIQUE (picking_slip_id),
	CONSTRAINT picking_slip_dates_pkey PRIMARY KEY (id)
);

-- INSERT

-- insert to picking_slips
copy "picking_slips"
	from '/csv/picking_slips.csv'
	with (format csv, header true, delimiter ',')

-- insert to picking_slip_dates
copy "picking_slip_dates"
	from '/csv/picking_slip_dates.csv'
	with (format csv, header true, delimiter ',')

-- insert to picking_slip_items
copy "picking_slip_items"
	from '/csv/picking_slip_items.csv'
	with (format csv, header true, delimiter ',')

-- query api endpoints
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
