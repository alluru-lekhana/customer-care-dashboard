import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  getCustomerById,
  updateCustomer,
} from '../api/customerApi'

function EditCustomer() {
  const navigate = useNavigate()
  const { customerId } = useParams()

  const [customer, setCustomer] = useState(null)
  const [form, setForm] = useState({
    name: '',
    email: '',
    address: '',
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    let cancelled = false

    async function loadCustomer() {
      try {
        const data = await getCustomerById(customerId)
        if (cancelled) return

        setCustomer(data)
        setForm({
          name: data.name || '',
          email: data.email || '',
          address:
            data.address?.address_line ||
            data.address?.full_address ||
            data.profile?.address ||
            data.metadata?.address ||
            '',
        })
      } catch (err) {
        if (!cancelled) {
          setError(err.message || 'Unable to load customer.')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    loadCustomer()

    return () => {
      cancelled = true
    }
  }, [customerId])

  function updateField(event) {
    const { name, value } = event.target
    setForm((previous) => ({ ...previous, [name]: value }))
    setError('')
    setSuccess('')
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setSaving(true)
    setError('')
    setSuccess('')

    try {
      // Update name and email through the existing customer API.
      const updated = await updateCustomer(customerId, {
        name: form.name.trim(),
        email: form.email.trim() || null,
      })

      setCustomer((previous) => ({ ...previous, ...updated }))
      setSuccess('Customer details saved successfully.')

      // Address is displayed in the form, but is not sent until
      // the backend's supported address-update field is confirmed.
    } catch (err) {
      setError(err.message || 'Unable to save customer details.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="customer-details-page "><p>Loading customer...</p></div>
  }

  if (!customer) {
    return (
      <div className="customer-details-page  edit-customer-page">
        <h2>Unable to load customer</h2>
        {error && <p>{error}</p>}
        <button onClick={() => navigate('/customers')}>Back to Customers</button>
      </div>
    )
  }

  return (
    <div className="customer-details-page">
      <button
        type="button"
        className="back-button"
        onClick={() => navigate(`/customers/${customerId}`)}
      >
        ← Back to Customer
      </button>

      <section className="customer-profile-card">
        <div className="customer-profile-heading">
          <div className="customer-heading-text">
            <span className="profile-eyebrow">CUSTOMER MANAGEMENT</span>
            <h1>Edit Customer</h1>
            <p>Update customer contact details.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="edit-customer-panel">
          <label>
            Customer ID
            <input value={customer.id ?? customerId} readOnly />
          </label>

          <label>
            Phone Number (read-only)
            <input
              value={customer.whatsapp_number || 'Not provided'}
              readOnly
            />
          </label>

          <label>
            Customer Name
            <input
              name="name"
              value={form.name}
              onChange={updateField}
              required
              maxLength={100}
            />
          </label>

          <label>
            Email Address
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={updateField}
            />
          </label>

          <label>
            Delivery Address
            <textarea
              name="address"
              value={form.address}
              onChange={updateField}
              rows={3}
              placeholder="Enter delivery address"
            />
            <small>
              Address saving needs backend support. The address field is not
              saved by this form yet.
            </small>
          </label>

          {error && <p className="edit-error">{error}</p>}
          {success && <p role="status">{success}</p>}

          <div className="edit-customer-actions">
            <button
              type="button"
              onClick={() => navigate(`/customers/${customerId}`)}
              disabled={saving}
            >
              Cancel
            </button>

            <button type="submit" disabled={saving}>
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </section>
    </div>
  )
}

export default EditCustomer
