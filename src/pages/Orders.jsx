import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getOrders } from '../data/orderStore'

function Orders() {
  const navigate = useNavigate()

  const [orders, setOrders] = useState([])
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  useEffect(() => {
    const loadOrders = () => {
      setOrders(getOrders())
    }

    loadOrders()

    window.addEventListener('ordersUpdated', loadOrders)

    return () => {
      window.removeEventListener('ordersUpdated', loadOrders)
    }
  }, [])

  const filteredOrders = orders.filter((order) => {
    const searchText = search.toLowerCase().trim()

    const matchesSearch =
      order.id.toLowerCase().includes(searchText) ||
      order.customer.toLowerCase().includes(searchText) ||
      order.product.toLowerCase().includes(searchText)

    const matchesStatus =
      statusFilter === 'all' ||
      order.status.toLowerCase() === statusFilter

    return matchesSearch && matchesStatus
  })

  return (
    <div className="orders-page">

      <div className="page-heading">
        <div>
          <h2>Orders</h2>
          <p>View and manage customer orders.</p>
        </div>
      </div>

      <div className="order-toolbar">

        <input
          type="text"
          placeholder="Search by order ID, customer or product..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All Status</option>
          <option value="pending_payment">Pending Payment</option>
          <option value="paid">Paid</option>
          <option value="confirmed">Confirmed</option>
          <option value="packed">Packed</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
          <option value="refunded">Refunded</option>
        </select>

      </div>

      <div className="orders-section">

        <div className="section-header">
          <div>
            <h2>All Orders</h2>
            <p>{filteredOrders.length} orders</p>
          </div>
        </div>

        <div className="table-container">
          <table>

            <thead>
              <tr>
                <th>ORDER ID</th>
                <th>CUSTOMER</th>
                <th>PRODUCT</th>
                <th>ITEMS</th>
                <th>SOURCE</th>
                <th>DATE</th>
                <th>AMOUNT</th>
                <th>STATUS</th>
                <th>ACTION</th>
              </tr>
            </thead>

            <tbody>

              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <tr key={order.id}>

                    <td className="order-id">
                      {order.id}
                    </td>

                    <td>{order.customer}</td>

                    <td>{order.product}</td>

                    <td>{order.quantity || 1}</td>

                    <td>
                      {order.source === 'manual'
                        ? 'Manual'
                        : 'WhatsApp'}
                    </td>

                    <td>{order.date}</td>

                    <td>{order.amount}</td>

                    <td>
                      <span
                        className={`status ${order.status
                          .toLowerCase()
                          .replaceAll('_', '-')
                          .replaceAll(' ', '-')}`}
                      >
                        {order.status
                          .replaceAll('_', ' ')
                          .replace(/\b\w/g, (char) =>
                            char.toUpperCase()
                          )}
                      </span>
                    </td>

                    <td>
                      <button
                        className="view-button"
                        onClick={() =>
                          navigate(
                            `/orders/${order.id.replace('#ORD-', '')}`
                          )
                        }
                      >
                        View
                      </button>
                    </td>

                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="9"
                    style={{
                      textAlign: 'center',
                      padding: '30px',
                      color: '#6b7280',
                    }}
                  >
                    No orders found
                  </td>
                </tr>
              )}

            </tbody>

          </table>
        </div>

      </div>

    </div>
  )
}

export default Orders