import { useMemo, useState } from 'react'

const initialConversations = [
  {
    id: 'CONV-1001',
    customer: 'Rahul Sharma',
    phone: '+91 98765 43210',
    status: 'open',
    lastUpdated: '10:32 AM',
    messages: [
      {
        id: 1,
        sender: 'customer',
        text: 'Hi, where is my order?',
        time: '10:30 AM',
      },
      {
        id: 2,
        sender: 'agent',
        text: "Hi Rahul! I'll check your order status for you.",
        time: '10:31 AM',
      },
      {
        id: 3,
        sender: 'customer',
        text: 'Thank you. Please update me.',
        time: '10:32 AM',
      },
    ],
  },
  {
    id: 'CONV-1002',
    customer: 'Priya Reddy',
    phone: '+91 98765 12345',
    status: 'resolved',
    lastUpdated: 'Yesterday',
    messages: [
      {
        id: 1,
        sender: 'customer',
        text: 'I received my order. Thank you!',
        time: 'Yesterday',
      },
      {
        id: 2,
        sender: 'agent',
        text: 'Glad to hear that, Priya!',
        time: 'Yesterday',
      },
    ],
  },
  {
    id: 'CONV-1003',
    customer: 'Arun Kumar',
    phone: '+91 91234 56789',
    status: 'open',
    lastUpdated: '09:45 AM',
    messages: [
      {
        id: 1,
        sender: 'customer',
        text: 'I need help with my payment.',
        time: '09:45 AM',
      },
    ],
  },
]

function Conversations() {
  const [conversations, setConversations] = useState(initialConversations)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedId, setSelectedId] = useState('CONV-1001')
  const [reply, setReply] = useState('')

  const filteredConversations = useMemo(() => {
    const query = search.trim().toLowerCase()

    return conversations.filter((conversation) => {
      const matchesSearch =
        conversation.customer.toLowerCase().includes(query) ||
        conversation.phone.toLowerCase().includes(query) ||
        conversation.id.toLowerCase().includes(query) ||
        conversation.messages.some((message) =>
          message.text.toLowerCase().includes(query)
        )

      const matchesStatus =
        statusFilter === 'all' || conversation.status === statusFilter

      return matchesSearch && matchesStatus
    })
  }, [conversations, search, statusFilter])

  const selectedConversation = conversations.find(
    (conversation) => conversation.id === selectedId
  )

  function sendReply(event) {
    event.preventDefault()

    const text = reply.trim()
    if (!text || !selectedConversation) return

    const time = new Date().toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
    })

    setConversations((current) =>
      current.map((conversation) =>
        conversation.id === selectedId
          ? {
              ...conversation,
              lastUpdated: time,
              messages: [
                ...conversation.messages,
                {
                  id: Date.now(),
                  sender: 'agent',
                  text,
                  time,
                },
              ],
            }
          : conversation
      )
    )

    setReply('')
  }

  function toggleStatus() {
    if (!selectedConversation) return

    setConversations((current) =>
      current.map((conversation) =>
        conversation.id === selectedId
          ? {
              ...conversation,
              status:
                conversation.status === 'open' ? 'resolved' : 'open',
            }
          : conversation
      )
    )
  }

  return (
    <div className="conversations-page">
      <div className="page-heading">
        <div>
          <h2>Conversations</h2>
          <p>View and manage customer conversations.</p>
        </div>
        <span className="status active">Demo Data</span>
      </div>

      <div className="conversation-toolbar">
        <input
          type="text"
          placeholder="Search customers, messages or conversation ID..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />

        <select
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
        >
          <option value="all">All conversations</option>
          <option value="open">Open</option>
          <option value="resolved">Resolved</option>
        </select>
      </div>

      <div className="conversation-layout">
        <aside className="conversation-list">
          <div className="conversation-list-header">
            <h3>Inbox</h3>
            <span>{filteredConversations.length}</span>
          </div>

          {filteredConversations.length ? (
            filteredConversations.map((conversation) => {
              const lastMessage =
                conversation.messages[conversation.messages.length - 1]

              return (
                <button
                  type="button"
                  key={conversation.id}
                  className={`conversation-item ${
                    selectedId === conversation.id ? 'selected' : ''
                  }`}
                  onClick={() => setSelectedId(conversation.id)}
                >
                  <span className="conversation-avatar">
                    {conversation.customer.charAt(0)}
                  </span>

                  <span className="conversation-item-content">
                    <span className="conversation-item-top">
                      <strong>{conversation.customer}</strong>
                      <small>{lastMessage?.time}</small>
                    </span>

                    <span className="conversation-preview">
                      {lastMessage?.text}
                    </span>

                    <span className={`status ${conversation.status}`}>
                      {conversation.status === 'open' ? 'Open' : 'Resolved'}
                    </span>
                  </span>
                </button>
              )
            })
          ) : (
            <p className="conversation-empty">
              No conversations match your search.
            </p>
          )}
        </aside>

        <section className="conversation-details">
          {selectedConversation ? (
            <>
              <header className="chat-header">
                <div className="chat-customer">
                  <span className="conversation-avatar">
                    {selectedConversation.customer.charAt(0)}
                  </span>
                  <div>
                    <h3>{selectedConversation.customer}</h3>
                    <p>{selectedConversation.phone}</p>
                  </div>
                </div>

                <button
                  type="button"
                  className="conversation-status-button"
                  onClick={toggleStatus}
                >
                  {selectedConversation.status === 'open'
                    ? 'Mark Resolved'
                    : 'Reopen Conversation'}
                </button>
              </header>

              <div className="chat-messages">
                <p className="chat-date-label">
                  {selectedConversation.id}
                </p>

                {selectedConversation.messages.map((message) => (
                  <div
                    key={message.id}
                    className={`message-row ${
                      message.sender === 'agent' ? 'sent' : 'received'
                    }`}
                  >
                    <div className="message-bubble">
                      <p>{message.text}</p>
                      <small>{message.time}</small>
                    </div>
                  </div>
                ))}
              </div>

              <form className="chat-reply" onSubmit={sendReply}>
                <input
                  type="text"
                  placeholder="Type a reply..."
                  value={reply}
                  onChange={(event) => setReply(event.target.value)}
                />
                <button type="submit" disabled={!reply.trim()}>
                  Send
                </button>
              </form>

              <p className="demo-notice">
                Demo mode — replies are shown here only and are not sent on WhatsApp.
              </p>
            </>
          ) : (
            <div className="empty-conversation">
              <h3>Select a conversation</h3>
              <p>Choose a customer from the inbox to view their messages.</p>
            </div>
          )}
        </section>

        {selectedConversation && (
          <aside className="conversation-customer-panel">
            <div className="customer-profile-avatar">
              {selectedConversation.customer.charAt(0)}
            </div>
            <h3>{selectedConversation.customer}</h3>
            <p>{selectedConversation.phone}</p>

            <div className="customer-info-row">
              <span>Conversation ID</span>
              <strong>{selectedConversation.id}</strong>
            </div>

            <div className="customer-info-row">
              <span>Status</span>
              <strong>
                {selectedConversation.status === 'open'
                  ? 'Open'
                  : 'Resolved'}
              </strong>
            </div>

            <div className="customer-info-row">
              <span>Total messages</span>
              <strong>{selectedConversation.messages.length}</strong>
            </div>

            <div className="customer-info-row">
              <span>Last activity</span>
              <strong>{selectedConversation.lastUpdated}</strong>
            </div>
          </aside>
        )}
      </div>
    </div>
  )
}

export default Conversations