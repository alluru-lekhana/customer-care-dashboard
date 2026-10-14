import { useNavigate, useParams } from 'react-router-dom'
import { mockCarts } from '../data/cartStore'
function CartDetails() {
  const navigate = useNavigate()
  const { id } = useParams()

  const cart = mockCarts.find((item) => item.id === id)

  const totalQuantity = cart
    ? cart.items.reduce((sum, item) => sum + item.quantity, 0)
    : 0

  const total = cart
    ? cart.items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      )
    : 0

  const formatPrice = (amount) =>
    amount.toLocaleString('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2,
    })

  if (!cart) {
    return (
      <div className="order-details-page">
        <button
          className="back-button"
          onClick={() => navigate('/carts')}
        >
          ← Back to Carts
        </button>
        <h2>Cart not found</h2>
      </div>
    )
  }

  return (
    <div className="order-details-page">
      <button
        className="back-button"
        onClick={() => navigate('/carts')}
      >
        ← Back to Carts
      </button>

      <div className="order-details-header">
        <div>
          <p className="order-label">CART DETAILS</p>
          <h2>{cart.id}</h2>
          <p>Customer shopping cart information</p>
        </div>
        <span className={`status ${cart.status}`}>
          {cart.status.charAt(0).toUpperCase() + cart.status.slice(1)}
        </span>
      </div>

      <div className="order-details-grid">
        <div className="details-card">
          <h3>Customer Details</h3>
          <div className="detail-row">
            <span>Customer Name</span>
            <strong>{cart.customer}</strong>
          </div>
          <div className="detail-row">
            <span>Phone Number</span>
            <strong>{cart.phone}</strong>
          </div>
          <div className="detail-row">
            <span>Customer ID</span>
            <strong>{cart.customerId}</strong>
          </div>
        </div>

        <div className="details-card">
          <h3>Cart Summary</h3>
          <div className="detail-row">
            <span>Total Products</span>
            <strong>{cart.items.length}</strong>
          </div>
          <div className="detail-row">
            <span>Total Quantity</span>
            <strong>{totalQuantity}</strong>
          </div>
          <div className="detail-row">
            <span>Cart Value</span>
            <strong>{formatPrice(total)}</strong>
          </div>
        </div>
      </div>

      <div className="details-card">
        <div className="tracking-heading">
          <div>
            <h3>Cart Items</h3>
            <p>Products currently in this cart</p>
          </div>
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>PRODUCT</th>
                <th>UNIT PRICE</th>
                <th>QUANTITY</th>
                <th>SUBTOTAL</th>
              </tr>
            </thead>
            <tbody>
              {cart.items.map((item) => (
                <tr key={item.id}>
                  <td>{item.product}</td>
                  <td>{formatPrice(item.price)}</td>
                  <td>{item.quantity}</td>
                  <td>{formatPrice(item.price * item.quantity)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="details-card">
        <h3>Cart Activity</h3>
        <div className="detail-row">
          <span>Created On</span>
          <strong>{cart.createdAt}</strong>
        </div>
        <div className="detail-row">
          <span>Last Updated</span>
          <strong>{cart.lastUpdated}</strong>
        </div>
        <div className="detail-row">
          <span>Cart Status</span>
          <strong>{cart.status}</strong>
        </div>
      </div>

      <div className="details-card">
        <div className="detail-row">
          <h3>Estimated Cart Total</h3>
          <h2>{formatPrice(total)}</h2>
        </div>
        <p style={{ color: '#6b7280', fontSize: '13px' }}>
          Demo data — real cart values will come from the API later.
        </p>
      </div>
    </div>
  )
}

export default CartDetails