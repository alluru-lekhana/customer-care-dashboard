import { useEffect, useState } from 'react'
import { getOrders } from '../data/orderStore'

function Dashboard() {
  const [orders, setOrders] = useState([])

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
  const totalOrders = orders.length

const pendingOrders = orders.filter(
  (order) => order.status === 'Pending'
).length

const deliveredOrders = orders.filter(
  (order) => order.status === 'Delivered'
).length

const totalCustomers = new Set(
  orders.map((order) => order.customer)
).size

  return (
    <>
      <div className="page-heading">
        <div>
          <h2>Overview</h2>
          <p>Monitor customers, orders and support activity.</p>
        </div>
      </div>

      <div className="stats">

        <div className="stat-card">
          <div className="stat-top">
            <span className="stat-title">Total Customers</span>
            <span className="stat-icon">👥</span>
          </div>
          <h3>{totalCustomers}</h3>
          <p className="positive">+12.5% this month</p>
        </div>

        <div className="stat-card">
          <div className="stat-top">
            <span className="stat-title">Total Orders</span>
            <span className="stat-icon">📦</span>
          </div>
          <h3>{totalOrders}</h3>
          <p className="positive">+8.2% this month</p>
        </div>

        <div className="stat-card">
          <div className="stat-top">
            <span className="stat-title">Pending Orders</span>
            <span className="stat-icon">⏳</span>
          </div>
          <h3>{pendingOrders}</h3>
          <p className="warning-text">Needs attention</p>
        </div>

        <div className="stat-card">
          <div className="stat-top">
            <span className="stat-title">Delivered</span>
            <span className="stat-icon">✓</span>
          </div>
          <h3>{deliveredOrders}</h3>
          <p className="positive">Current delivered orders</p>
        </div>

      </div>

      <div className="orders-section">

        <div className="section-header">
          <div>
            <h2>Recent Orders</h2>
            <p>Latest customer orders and their current status.</p>
          </div>

          <button className="view-all">
            View all orders →
          </button>
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>ORDER ID</th>
                <th>CUSTOMER</th>
                <th>PRODUCT</th>
                <th>AMOUNT</th>
                <th>STATUS</th>
              </tr>
            </thead>

            <tbody>
              {orders.slice(0, 4).map((order) => (
                <tr key={order.id}>
                  <td className="order-id">{order.id}</td>
                  <td>{order.customer}</td>
                  <td>{order.product}</td>
                  <td>{order.amount}</td>
                  <td>
                    <span
                      className={`status ${order.status
                        .toLowerCase()
                        .replace(' ', '-')}`}
                    >
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </>
  )
}

export default Dashboard