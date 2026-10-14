import { useNavigate, useParams } from 'react-router-dom'
import { getOrders } from '../data/orderStore'

const statusSteps = [
  'Order Placed',
  'Processing',
  'Shipped',
  'In Transit',
  'Delivered',
]

function createTimeline(order) {
  const history = order.trackingHistory || []

  return statusSteps.map((step, index) => {
    const historyItem = history.find(
      (item) => item.status.toLowerCase() === step.toLowerCase()
    )

    if (historyItem) {
      return {
        title: step,
        time: historyItem.date,
        state: 'completed',
        number: '✓',
      }
    }

    return {
      title: step,
      time: 'Waiting',
      state: '',
      number: index + 1,
    }
  })
}

function OrderDetails() {
  const navigate = useNavigate()
  const { id } = useParams()

  // Temporary local data source. API integration comes later.
  const order = getOrders().find(
    (item) => item.id.replace('#ORD-', '') === id
  )

  if (!order) {
    return (
      <div className="order-details-page">
        <button
          className="back-button"
          onClick={() => navigate('/orders')}
        >
          ← Back to Orders
        </button>

        <h2>Order not found</h2>
        <p>This order isn't available in the current local order store.</p>
      </div>
    )
  }

  return (
    <div className="order-details-page">
      <button
        className="back-button"
        onClick={() => navigate('/orders')}
      >
        ← Back to Orders
      </button>

      <div className="order-details-header">
        <div>
          <p className="order-label">ORDER</p>
          <h2>{order.id}</h2>
          <p>
            Placed on {order.date} via{' '}
            {order.source === 'whatsapp_bot' ? 'WhatsApp' : 'Manual'}
          </p>
        </div>

        <span
          className={`status ${order.status
            ?.toLowerCase()
            .replaceAll('_', '-')
            .replace(/\s+/g, '-')}`}
        >
          {order.status?.replaceAll('_', ' ')}
        </span>
      </div>

      <div className="order-details-grid">
        <div className="details-card">
          <h3>Customer</h3>
          <div className="detail-row">
            <span>Name</span>
            <strong>{order.customer}</strong>
          </div>
          <div className="detail-row">
            <span>Phone</span>
            <strong>{order.phone}</strong>
          </div>
          <div className="detail-row">
            <span>Order ID</span>
            <strong>{order.id}</strong>
          </div>
        </div>

        <div className="details-card">
          <h3>Product</h3>
          <div className="product-detail">
            <div className="product-placeholder">📦</div>
            <div>
              <strong>{order.product}</strong>
              <p>Quantity: {order.quantity || 1}</p>
            </div>
            <strong>{order.amount}</strong>
          </div>
        </div>
      </div>

      <div className="details-card">
        <h3>Payment Details</h3>
        <div className="detail-row">
          <span>Payment Status</span>
          <span className="payment-success">
            {order.payment?.status || 'Not available'}
          </span>
        </div>
        <div className="detail-row">
          <span>Payment Method</span>
          <strong>{order.payment?.method || 'Not available'}</strong>
        </div>
        <div className="detail-row">
          <span>Total Amount</span>
          <strong>{order.amount}</strong>
        </div>
      </div>

      <div className="details-card">
        <h3>Shipping Address</h3>
        <div className="shipping-address">
          <p>{order.shippingAddress?.address || 'Not available'}</p>
          <p>
            {[
              order.shippingAddress?.city,
              order.shippingAddress?.state,
            ]
              .filter(Boolean)
              .join(', ')}
          </p>
          <p>{order.shippingAddress?.pincode}</p>
        </div>
      </div>

      <div className="details-card">
        <div className="tracking-heading">
          <div>
            <h3>Order Tracking</h3>
            <p>Current delivery progress</p>
          </div>
          <span className="tracking-id">
            Tracking ID: {order.trackingId || 'Not assigned'}
          </span>
        </div>

        <div className="tracking-timeline">
          {createTimeline(order).map((step) => (
            <div
              className={`tracking-step ${step.state}`}
              key={step.title}
            >
              <div className="tracking-dot">{step.number}</div>
              <div>
                <strong>{step.title}</strong>
                <p>{step.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default OrderDetails