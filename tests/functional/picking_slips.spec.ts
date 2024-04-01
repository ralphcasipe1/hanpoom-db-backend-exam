import { test } from '@japa/runner'

test.group('Picking slips', () => {
  const API_ENDPOINT = '/api/picking-slips'
  test('should return 422 when `page` is negative', async ({ client }) => {
    const response = await client.get(API_ENDPOINT).qs('page', -2)

    response.assertStatus(422)
  })

  test('should return 422 when `page` is 0', async ({ client }) => {
    const response = await client.get(API_ENDPOINT).qs('page', 0)

    response.assertStatus(422)
  })

  test('should return 422 when `page` is a decimal', async ({ client }) => {
    const response = await client.get(API_ENDPOINT).qs('page', 2.1)

    response.assertStatus(422)
  })

  test('should return 422 when `limit` is negative', async ({ client }) => {
    const response = await client.get(API_ENDPOINT).qs('limit', -2)

    response.assertStatus(422)
  })

  test('should return 422 when `limit` is 0', async ({ client }) => {
    const response = await client.get(API_ENDPOINT).qs('limit', 0)

    response.assertStatus(422)
  })

  test('should return 422 when `limit` is a decimal', async ({ client }) => {
    const response = await client.get(API_ENDPOINT).qs('limit', 2.1)

    response.assertStatus(422)
  })

  test('should return 422 when `picking_slip_status` is invalid', async ({ client }) => {
    const response = await client.get(API_ENDPOINT).qs('picking_slip_status', 'invalid status')

    response.assertStatus(422)
  })

  test('should return 200 status code when it is a success', async ({ client }) => {
    const response = await client.get(API_ENDPOINT).qs('page', 1).qs('limit', 1)

    response.assertStatus(200)
  })

  test('should return a paginated result', async ({ client }) => {
    const response = await client.get(API_ENDPOINT).qs('page', 1).qs('limit', 1)

    response.assertBodyContains({
      meta: {
        currentPage: 1,
        perPage: 1,
      },
      data: [
        {
          picking_slip_status: 'not printed',
        },
      ],
    })
  })

  test('should filter with `picking_slip_status` is {$self}')
    .with(['printed', 'not printed', 'held'] as const)
    .run(async ({ client, assert }, status) => {
      const response = await client
        .get(API_ENDPOINT)
        .qs('page', 1)
        .qs('limit', 20)
        .qs('picking_slip_status', status)

      const { data } = response.body()

      assert.includeMembers(
        [
          ...new Set(
            data.map((pickingSlip: Record<string, unknown>) => pickingSlip.picking_slip_status)
          ),
        ],
        [status]
      )
    })
})
