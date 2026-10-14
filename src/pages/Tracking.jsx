import { useEffect, useState } from 'react'
import {
  getOrders,
  updateOrderStatus,
} from '../data/orderStore'
const statusToApi = {
  Processing: 'PACKED',
  Shipped: 'SHIPPED',
  'In Transit': 'OUT_FOR_DELIVERY',
  Delivered: 'DELIVERED',
}

async function updateOrderStatusApi(orderId, status, token) {
  const apiStatus = statusToApi[status]

  if (!apiStatus) {
    throw new Error(`Status "${status}" cannot be updated through the API.`)
  }

  const response = await fetch(
    `https://whatsapp-bot.whatsbot.workers.dev/api/admin/orders/${orderId}/status`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        status: apiStatus,
      }),
    }
  )

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(errorText || 'Failed to update order status')
  }

  return response.json()
}
const statusOptions = [
  'Pending',
  'Processing',
  'Shipped',
  'In Transit',
  'Delivered',
]

const trackingInfo = {
  '1001': {
    trackingId: 'TRK-784512',
    phone: '+91 98765 43210',
  },
  '1002': {
    trackingId: 'TRK-784513',
    phone: '+91 98765 12345',
  },
  '1003': {
    trackingId: 'TRK-784514',
    phone: '+91 91234 56789',
  },
  '1004': {
    trackingId: 'TRK-784515',
    phone: '+91 99887 66554',
  },
  '1005': {
    trackingId: 'TRK-784516',
    phone: '+91 90000 11111',
  },
}

function createTimeline(order) {
  const statuses = [
    'Order Placed',
    'Processing',
    'Shipped',
    'In Transit',
    'Delivered',
  ]

  const history = order.trackingHistory || []

  return statuses.map((status) => {
    const historyItem = history.find(
      (item) => item.status === status
    )

    return {
      status,
      date: historyItem?.date || '--',
      completed: Boolean(historyItem),
      active: order.status === status,
    }
  })
}

function Tracking() {
  const [orders, setOrders] = useState([])
  const [search, setSearch] = useState('')
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [status, setStatus] = useState('')

  useEffect(() => {
    const savedOrders = getOrders()

    setOrders(savedOrders)

    if (savedOrders.length > 0) {
      setSelectedOrder(savedOrders[0])
      setStatus(savedOrders[0].status)
    }
  }, [])

  const filteredOrders = orders.filter((order) => {
    const searchText = search.toLowerCase().trim()

    const trackingId =
      trackingInfo[order.id.replace('#ORD-', '')]?.trackingId || ''

    return (
      order.id.toLowerCase().includes(searchText) ||
      trackingId.toLowerCase().includes(searchText) ||
      order.customer.toLowerCase().includes(searchText)
    )
  })

  const handleSelectOrder = (order) => {
    setSelectedOrder(order)
    setStatus(order.status)
  }


const handleStatusUpdate = () => {
  if (!selectedOrder) return

  const updatedOrders = updateOrderStatus(
    selectedOrder.id,
    status
  )

  const updatedOrder = updatedOrders.find(
    (order) => order.id === selectedOrder.id
  )

  if (updatedOrder) {
    setOrders(updatedOrders)
    setSelectedOrder(updatedOrder)
    setStatus(updatedOrder.status)
  }
}

  return (
    <div className="tracking-page">

      <div className="page-heading">
        <div>
          <h2>Tracking</h2>
          <p>Track orders and update their delivery status.</p>
        </div>
      </div>

      <div className="tracking-toolbar">
        <input
          type="text"
          placeholder="Search by order ID, tracking ID or customer..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="tracking-layout">

        {/* Order List */}
        <div className="tracking-orders">

          <div className="section-header">
            <div>
              <h2>Orders</h2>
              <p>{filteredOrders.length} orders</p>
            </div>
          </div>

          <div className="tracking-order-list">

            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => (
                <button
                  key={order.id}
                  className={`tracking-order-item ${
                    selectedOrder?.id === order.id
                      ? 'selected'
                      : ''
                  }`}
                  onClick={() => handleSelectOrder(order)}
                >
                  <div>
                    <strong>{order.id}</strong>
                    <p>{order.customer}</p>
                    <span>{order.product}</span>
                  </div>

                  <span className="tracking-status">
                    {order.status}
                  </span>
                </button>
              ))
            ) : (
              <div className="tracking-empty">
                No orders found
              </div>
            )}

          </div>
        </div>

        {/* Tracking Details */}
        {selectedOrder && (
          <div className="tracking-details">

            <div className="tracking-details-header">
              <div>
                <span className="order-label">
                  ORDER
                </span>

                <h2>{selectedOrder.id}</h2>

                <p>
                  {selectedOrder.customer} ·{' '}
                  {selectedOrder.product}
                </p>
              </div>

              <span className="tracking-id">
                {
                  trackingInfo[
                    selectedOrder.id.replace('#ORD-', '')
                  ]?.trackingId
                }
              </span>
            </div>

            {/* Update Status */}
            <div className="status-update-card">

              <div>
                <h3>Update Order Status</h3>
                <p>
                  Change the current status of this order.
                </p>
              </div>

              <div className="status-update-controls">

                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  {statusOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>

                <button
                  className="update-status-button"
                  onClick={handleStatusUpdate}
                >
                  Update Status
                </button>

              </div>
            </div>

            {/* Timeline */}
            <div className="tracking-timeline-card">

              <div className="tracking-heading">
                <div>
                  <h3>Tracking History</h3>
                  <p>Current order progress</p>
                </div>
              </div>

              <div className="tracking-timeline">

                {createTimeline(
                  selectedOrder
                ).map((step, index) => (
                  <div
                    className={`tracking-step ${
                      step.completed ? 'completed' : ''
                    } ${
                      step.active ? 'active' : ''
                    }`}
                    key={step.status}
                  >

                    <div className="tracking-dot">
                      {step.completed ? '✓' : index + 1}
                    </div>

                    <div>
                      <strong>{step.status}</strong>
                      <p>{step.date}</p>
                    </div>

                  </div>
                ))}

              </div>

            </div>

          </div>
        )}

      </div>

    </div>
  )
}

export default Tracking