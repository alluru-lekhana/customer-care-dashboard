
const BASE_URL = 'https://whatsapp-bot.whatsbot.workers.dev'

// Local testing only. Don't commit your token to GitHub.
const TOKEN = 'innova-admin-2026-secret'

async function apiFetch(path) {
  const response = await fetch(`${BASE_URL}${path}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`)
  }

  return response.json()
}

export async function getCustomers() {
  const data = await apiFetch('/api/admin/customers')
  return data.customers
}

export async function getCustomerById(customerId) {
  const data = await apiFetch(`/api/admin/customers/${customerId}`)
  return data.customer ?? data
}

export async function getCustomerOrders(customerId) {
  const data = await apiFetch(
    `/api/admin/customers/${customerId}/orders`
  )
  return data.orders ?? []
}
