import { useMemo, useState } from 'react'

const mockProducts = [
  {
    id: 'PRD-1001',
    name: 'Smart Watch',
    sku: 'SW-001',
    category: 'Electronics',
    price: 1499,
    stock: 24,
    status: 'active',
    description: 'Smart watch with fitness tracking and notifications.',
  },
  {
    id: 'PRD-1002',
    name: 'Wireless Earbuds',
    sku: 'WE-002',
    category: 'Electronics',
    price: 899,
    stock: 8,
    status: 'active',
    description: 'Wireless earbuds with a compact charging case.',
  },
  {
    id: 'PRD-1003',
    name: 'Travel Backpack',
    sku: 'TB-003',
    category: 'Accessories',
    price: 1200,
    stock: 0,
    status: 'inactive',
    description: 'Everyday backpack with multiple storage compartments.',
  },
  {
    id: 'PRD-1004',
    name: 'Bluetooth Speaker',
    sku: 'BS-004',
    category: 'Electronics',
    price: 1799,
    stock: 15,
    status: 'active',
    description: 'Portable Bluetooth speaker for everyday use.',
  },
  {
    id: 'PRD-1005',
    name: 'Running Shoes',
    sku: 'RS-005',
    category: 'Footwear',
    price: 2499,
    stock: 3,
    status: 'active',
    description: 'Lightweight shoes designed for running and walking.',
  },
  {
    id: 'PRD-1006',
    name: 'Water Bottle',
    sku: 'WB-006',
    category: 'Accessories',
    price: 399,
    stock: 0,
    status: 'inactive',
    description: 'Reusable bottle for everyday hydration.',
  },
]

function Products() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [selectedProduct, setSelectedProduct] = useState(null)

  const categories = [...new Set(mockProducts.map((p) => p.category))]

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase()

    return mockProducts.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(query) ||
        product.sku.toLowerCase().includes(query) ||
        product.id.toLowerCase().includes(query)

      const matchesStatus =
        statusFilter === 'all' || product.status === statusFilter

      const matchesCategory =
        categoryFilter === 'all' || product.category === categoryFilter

      return matchesSearch && matchesStatus && matchesCategory
    })
  }, [search, statusFilter, categoryFilter])

  const formatPrice = (price) =>
    price.toLocaleString('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2,
    })

  return (
    <div className="products-page">
      <div className="page-heading">
        <div>
          <h2>Products</h2>
          <p>View and manage your product catalogue.</p>
        </div>

        <span className="status active">Demo Data</span>
      </div>

      <div className="product-stats">
        <div className="product-stat-card">
          <span>Total Products</span>
          <strong>{mockProducts.length}</strong>
          <small>Across all categories</small>
        </div>

        <div className="product-stat-card">
          <span>Active Products</span>
          <strong>
            {mockProducts.filter((p) => p.status === 'active').length}
          </strong>
          <small>Currently active</small>
        </div>

        <div className="product-stat-card">
          <span>Low Stock</span>
          <strong>
            {mockProducts.filter((p) => p.stock > 0 && p.stock <= 5).length}
          </strong>
          <small>5 units or fewer</small>
        </div>

        <div className="product-stat-card">
          <span>Out of Stock</span>
          <strong>{mockProducts.filter((p) => p.stock === 0).length}</strong>
          <small>Needs replenishment</small>
        </div>
      </div>

      <div className="order-toolbar product-toolbar">
        <input
          type="text"
          placeholder="Search by product name, SKU or ID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          <option value="all">All Categories</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All Products</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      <div className="orders-section">
        <div className="section-header">
          <div>
            <h2>All Products</h2>
            <p>{filteredProducts.length} products found</p>
          </div>
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>PRODUCT</th>
                <th>SKU</th>
                <th>CATEGORY</th>
                <th>PRICE</th>
                <th>STOCK</th>
                <th>STATUS</th>
                <th>ACTION</th>
              </tr>
            </thead>

            <tbody>
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <tr key={product.id}>
                    <td>
                      <div className="product-name-cell">
                        <div className="product-icon">📦</div>
                        <div>
                          <strong>{product.name}</strong>
                          <small>{product.id}</small>
                        </div>
                      </div>
                    </td>

                    <td>{product.sku}</td>
                    <td>{product.category}</td>
                    <td>{formatPrice(product.price)}</td>

                    <td>
                      <span
                        className={`stock-indicator ${
                          product.stock === 0
                            ? 'out'
                            : product.stock <= 5
                              ? 'low'
                              : 'available'
                        }`}
                      >
                        {product.stock === 0
                          ? 'Out of stock'
                          : product.stock <= 5
                            ? `Low · ${product.stock}`
                            : `${product.stock} units`}
                      </span>
                    </td>

                    <td>
                      <span className={`status ${product.status}`}>
                        {product.status === 'active' ? 'Active' : 'Inactive'}
                      </span>
                    </td>

                    <td>
                      <button
                        className="view-button"
                        onClick={() => setSelectedProduct(product)}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="7"
                    style={{
                      textAlign: 'center',
                      padding: '40px',
                      color: '#6b7280',
                    }}
                  >
                    No products match your search or filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedProduct && (
        <div
          className="product-modal-overlay"
          onClick={() => setSelectedProduct(null)}
        >
          <div
            className="product-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="product-modal-title"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="product-modal-header">
              <div>
                <p className="order-label">PRODUCT DETAILS</p>
                <h2 id="product-modal-title">{selectedProduct.name}</h2>
                <p>{selectedProduct.id}</p>
              </div>

              <button
                className="product-modal-close"
                onClick={() => setSelectedProduct(null)}
                aria-label="Close product details"
              >
                ×
              </button>
            </div>

            <div className="product-modal-icon">📦</div>

            <div className="detail-row">
              <span>SKU</span>
              <strong>{selectedProduct.sku}</strong>
            </div>

            <div className="detail-row">
              <span>Category</span>
              <strong>{selectedProduct.category}</strong>
            </div>

            <div className="detail-row">
              <span>Price</span>
              <strong>{formatPrice(selectedProduct.price)}</strong>
            </div>

            <div className="detail-row">
              <span>Available Stock</span>
              <strong>{selectedProduct.stock} units</strong>
            </div>

            <div className="detail-row">
              <span>Status</span>
              <strong>
                {selectedProduct.status === 'active' ? 'Active' : 'Inactive'}
              </strong>
            </div>

            <div className="product-description">
              <strong>Description</strong>
              <p>{selectedProduct.description}</p>
            </div>

            <button
              className="product-modal-done"
              onClick={() => setSelectedProduct(null)}
            >
              Close Details
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Products
