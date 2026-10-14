import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getOrders } from '../data/orderStore'

const customerData = {
  '1': {
    customerId: 'CUS-1001',
    name: 'Rahul',
    phone: '+91 98765 43210',
  },
  '2': {
    customerId: 'CUS-1002',
    name: 'Priya',
    phone: '+91 98765 12345',
  },
  '3': {
    customerId: 'CUS-1003',
    name: 'Arun',
    phone: '+91 91234 56789',
  },
  '4': {
    customerId: 'CUS-1004',
    name: 'Sneha',
    phone: '+91 99887 66554',
  },
}

function CustomerDetails() {
  const navigate = useNavigate()
  const { id } = useParams()

  const [allOrders, setAllOrders] = useState([])
  const [customers, setCustomers] = useState(() => {
    try {
      return {
        ...customerData,
        ...JSON.parse(
          localStorage.getItem('customer_care_customers') || '{}'
        ),
      }
    } catch {
      return customerData
    }
  })

  const customer = customers[id]
  const [isEditing, setIsEditing] = useState(false)
  const [editedCustomer, setEditedCustomer] = useState({
  customerId: '',
  name: '',
  phone: '',
  email: '',
})
  useEffect(() => {
    const loadOrders = () => setAllOrders(getOrders())

    loadOrders()
    window.addEventListener('ordersUpdated', loadOrders)

    return () => {
      window.removeEventListener('ordersUpdated', loadOrders)
    }
  }, [])

  
useEffect(() => {
  if (customer) {
    setEditedCustomer({
      customerId: customer.customerId || '',
      name: customer.name || '',
      phone: customer.phone || '',
      email: customer.email || '',
    })
  }
}, [
  id,
  customer?.customerId,
  customer?.name,
  customer?.phone,
  customer?.email,
])


  if (!customer) {
    return (
      <div className="customer-details-page">
        <button
          className="back-button"
          onClick={() => navigate('/customers')}
        >
          ← Back to Customers
        </button>
        <h2>Customer not found</h2>
      </div>
    )
  }

  const customerOrders = allOrders
    .filter(
      (order) =>
        order.customer?.trim().toLowerCase() ===
        customer.name.trim().toLowerCase()
    )
    .map((order) => ({
      ...order,
      amount:
        typeof order.amount === 'number'
          ? order.amount
          : Number(
              String(order.amount ?? '0').replace(/[₹,\s]/g, '')
            ),
    }))

  const totalSpent = customerOrders.reduce(
    (total, order) => total + order.amount,
    0
  )

  const lastOrder = customerOrders[0]

const handleSave = () => {
  if (!editedCustomer.name.trim()) {
    alert('Please enter a customer name.')
    return
  }

  const savedCustomers = JSON.parse(
    localStorage.getItem('customer_care_customers') || '{}'
  )

  const updatedCustomer = {
    ...customer,
    customerId: customer.customerId,
    name: editedCustomer.name.trim(),
    phone: customer.phone,
    email: editedCustomer.email.trim(),
  }

  savedCustomers[id] = updatedCustomer

  localStorage.setItem(
    'customer_care_customers',
    JSON.stringify(savedCustomers)
  )

  setCustomers((previous) => ({
    ...previous,
    [id]: updatedCustomer,
  }))

  setEditedCustomer({
    customerId: updatedCustomer.customerId || '',
    name: updatedCustomer.name,
    phone: updatedCustomer.phone,
    email: updatedCustomer.email,
  })

  setIsEditing(false)
  alert('Customer details saved successfully!')
}

  return (
    <div className="customer-details-page">
      <button
        className="back-button"
        onClick={() => navigate('/customers')}
      >
        ← Back to Customers
      </button>

      <div className="customer-profile-card">
        <div className="profile-top">
          <div className="large-avatar">
            {customer.name.charAt(0).toUpperCase()}
          </div>

          <div>
            <h2>{customer.name}</h2>
            <p>{customer.phone}</p>
          </div>

          <span className="customer-status">Active</span>

          <button
            className="update-customer-btn"
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? 'Cancel Edit' : 'Edit Customer'}
          </button>
        </div>

        {isEditing && (
          <div className="customer-edit-form">
            <h3>Update Customer Details</h3>
            <label>
  Customer ID
  <input
    value={editedCustomer.customerId}
    disabled
    onChange={(e) =>
      setEditedCustomer({
        ...editedCustomer,
        customerId: e.target.value,
      })
    }
  />
</label>

            <label>
              Customer Name
              <input
                value={editedCustomer.name}
                onChange={(e) =>
                  setEditedCustomer({
                    ...editedCustomer,
                    name: e.target.value,
                  })
                }
              />
            </label>

            <label>
  Phone Number
  <input
    type="tel"
    value={editedCustomer.phone}
    readOnly
    title="Only an authorized administrator can change the phone number"
  />
  <small>
    Phone number cannot be changed by customer support.
  </small>
</label>
<label>
  Email (Optional)
  <input
    type="email"
    value={editedCustomer.email}
    onChange={(e) =>
      setEditedCustomer({
        ...editedCustomer,
        email: e.target.value,
      })
    }
    placeholder="customer@example.com"
  />
</label>

<div className="edit-actions">
  <button
    type="button"
    onClick={() => {
      setEditedCustomer({
        customerId: customer.customerId || '',
        name: customer.name || '',
        phone: customer.phone || '',
        email: customer.email || '',
      })
      setIsEditing(false)
    }}
  >
    Cancel
  </button>

  <button type="button" onClick={handleSave}>
    Save Changes
  </button>
</div>
</div>
)}


           
        <div className="customer-info">
          <div>
            <span>Total Orders</span>
            <strong>{customerOrders.length}</strong>
          </div>

          <div>
            <span>Total Spent</span>
            <strong>₹{totalSpent.toLocaleString('en-IN')}</strong>
          </div>

          <div>
            <span>Last Order</span>
            <strong>{lastOrder ? lastOrder.id : 'No orders'}</strong>
          </div>
        </div>
      </div>

      <div className="orders-section">
        <div className="section-header">
          <div>
            <h2>Order History</h2>
            <p>Previous orders placed by this customer.</p>
          </div>
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>ORDER ID</th>
                <th>PRODUCT</th>
                <th>DATE</th>
                <th>AMOUNT</th>
                <th>STATUS</th>
              </tr>
            </thead>

            <tbody>
              {customerOrders.length > 0 ? (
                customerOrders.map((order) => (
                  <tr key={order.id}>
                    <td className="order-id">{order.id}</td>
                    <td>{order.product}</td>
                    <td>{order.date}</td>
                    <td>₹{order.amount.toLocaleString('en-IN')}</td>
                    <td>
                      <span
                        className={`status ${String(order.status)
                          .toLowerCase()
                          .replace(/\s+/g, '-')}`}
                      >
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5">
                    No orders found for this customer.
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

export default CustomerDetails
