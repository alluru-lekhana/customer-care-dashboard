import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const mockCarts = [
  {
    id: 'CART-1001',
    customer: 'Rahul Sharma',
    phone: '+91 98765 43210',
    customerId: 'CUS-1001',
    items: [
      { id: 'P-101', product: 'Smart Watch', price: 1499, quantity: 1 },
      { id: 'P-102', product: 'Wireless Earbuds', price: 899, quantity: 2 },
    ],
    status: 'active',
    createdAt: '12 Oct 2026, 10:30 AM',
    lastUpdated: '13 Oct 2026, 09:15 AM',
  },
  {
    id: 'CART-1002',
    customer: 'Priya Reddy',
    phone: '+91 98765 12345',
    customerId: 'CUS-1002',
    items: [
      { id: 'P-103', product: 'Headphones', price: 1299, quantity: 1 },
    ],
    status: 'abandoned',
    createdAt: '11 Oct 2026, 02:20 PM',
    lastUpdated: '11 Oct 2026, 04:45 PM',
  },
  {
    id: 'CART-1003',
    customer: 'Arun Kumar',
    phone: '+91 91234 56789',
    customerId: 'CUS-1003',
    items: [
      { id: 'P-104', product: 'Backpack', price: 1200, quantity: 1 },
      { id: 'P-105', product: 'Water Bottle', price: 399, quantity: 1 },
    ],
    status: 'converted',
    createdAt: '10 Oct 2026, 11:00 AM',
    lastUpdated: '10 Oct 2026, 11:45 AM',
  },
]

function Carts() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const filteredCarts = useMemo(() => {
    const query = search.trim().toLowerCase()

    return mockCarts.filter((cart) => {
      const matchesSearch =
        cart.id.toLowerCase().includes(query) ||
        cart.customer.toLowerCase().includes(query)

      const matchesStatus =
        statusFilter === 'all' || cart.status === statusFilter

      return matchesSearch && matchesStatus
    })
  }, [search, statusFilter])

  const getCartTotal = (cart) =>
    cart.items.reduce((total, item) => total + item.price * item.quantity, 0)

  return (
    <div className="carts-page">
      <div className="page-heading cart-page-heading">
        <div>
          <h2>Carts</h2>
          <p>View and manage customer carts.</p>
        </div>

        <span className="status active">Demo Data</span>
      </div>

      <div className="order-toolbar">
        <input
          type="text"
          placeholder="Search by customer or cart ID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="abandoned">Abandoned</option>
          <option value="converted">Converted</option>
        </select>
      </div>

      <div className="orders-section">
        <div className="section-header">
          <div>
            <h2>All Carts</h2>
            <p>{filteredCarts.length} carts</p>
          </div>
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>CART ID</th>
                <th>CUSTOMER</th>
                <th>ITEMS</th>
                <th>CART VALUE</th>
                <th>STATUS</th>
                <th>LAST UPDATED</th>
                <th>ACTION</th>
              </tr>
            </thead>

            <tbody>
              {filteredCarts.length > 0 ? (
                filteredCarts.map((cart) => (
                  <tr key={cart.id}>
                    <td className="order-id">{cart.id}</td>
                    <td>{cart.customer}</td>
                    <td>
                      {cart.items.reduce((sum, item) => sum + item.quantity, 0)}
                    </td>
                    <td>
                      {getCartTotal(cart).toLocaleString('en-IN', {
                        style: 'currency',
                        currency: 'INR',
                        maximumFractionDigits: 0,
                      })}
                    </td>
                    <td>
                      <span className={`status ${cart.status}`}>
                        {cart.status.charAt(0).toUpperCase() + cart.status.slice(1)}
                      </span>
                    </td>
                    <td>{cart.lastUpdated}</td>
                    <td>
                      <button
                        className="view-button"
                        onClick={() => navigate(`/carts/${cart.id}`)}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '40px' }}>
                    No carts match your search or filter.
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

export default Carts