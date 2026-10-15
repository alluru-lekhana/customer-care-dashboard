
const BASE_URL = 'https://whatsapp-bot.whatsbot.workers.dev'

// Local testing only. Never commit your token to GitHub.
const TOKEN = 'innova-admin-2026-secret'

async function apiFetch(path, options = {}) {
  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    method: options.method || 'GET',
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  })

  if (!response.ok) {
    const message = await response.text()
    throw new Error(message || `API request failed: ${response.status}`)
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

  if (Array.isArray(data)) return data
  if (Array.isArray(data.orders)) return data.orders

  return []
}

export async function updateCustomer(customerId, updates) {
  const data = await apiFetch(
    `/api/admin/customers/${customerId}`,
    {
      method: 'PATCH',
      body: JSON.stringify(updates),
    }
  )

  return data.customer ?? data
}
export async function getAllOrders() {
  const data = await apiFetch('/api/admin/orders')

  if (Array.isArray(data.orders)) {
    return data.orders
  }

  return []
}
