import { useEffect, useState } from "react";
import "./App.css";

const API = "http://localhost:5000";

interface Contact {
  _id: string;
  name: string;
  email: string;
  phone: string;
  work: string;
  nick: string;
}

export default function App() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState("view"); // view | add | profile
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    work: "",
    nick: "",
  });
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const fetchContacts = async () => {
    setLoading(true);
    const res = await fetch(API + "/contacts");
    setContacts(await res.json());
    setLoading(false);
  };

  const addContact = async () => {
    await fetch(API + "/contacts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    setForm({ name: "", email: "", phone: "", work: "", nick: "" });
    fetchContacts();
    setView("view");
  };

  const deleteContact = async (id: string) => {
    await fetch(API + "/contacts/" + id, { method: "DELETE" });
    fetchContacts();
  };

  const startEdit = (contact: Contact) => {
    setForm({
      name: contact.name,
      email: contact.email,
      phone: contact.phone,
      work: contact.work,
      nick: contact.nick,
    });
    setSelectedContact(contact);
    setIsEditing(true);
    setView("add");
  };

  const updateContact = async () => {
    if (!selectedContact) return;

    await fetch(`${API}/contacts/${selectedContact._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    setForm({ name: "", email: "", phone: "", work: "", nick: "" });
    setSelectedContact(null);
    setIsEditing(false);
    fetchContacts();
    setView("view");
  };

  const viewContact = (contact: Contact) => {
    setSelectedContact(contact);
    setView("profile");
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  return (
    <div className="app-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <nav>
          <button onClick={() => setView("view")}>📒 View Contacts</button>
          <button onClick={() => setView("add")}>➕ Add Contact</button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="main">
        {/* View Contacts */}
        {view === "view" && (
          <div className="card">
            <h1 className="title">View Contacts</h1>
            {loading ? (
              <p>Loading...</p>
            ) : (
              <table className="contact-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Phone</th>
                    <th>Work</th>
                    <th>Nick</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {contacts.map((c) => (
                    <tr key={c._id}>
                      <td>
                        <div className="contact-info">
                          <div className="avatar">
                            {c.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <strong>{c.name}</strong>
                            <div className="email">{c.email}</div>
                          </div>
                        </div>
                      </td>
                      <td>{c.phone}</td>
                      <td>{c.work}</td>
                      <td>{c.nick}</td>
                      <td className="actions">
                        <button className="view-btn" onClick={() => viewContact(c)}>👁</button>
                        <button className="edit-btn" onClick={() => startEdit(c)}>✏</button>
                        <button className="delete-btn" onClick={() => deleteContact(c._id)}>🗑</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* Add/Edit Contact */}
        {view === "add" && (
          <div className="card">
            <h1 className="title">{isEditing ? "Edit Contact" : "Add Contact"}</h1>
            <div className="form">
              <input
                placeholder="Full Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
              <input
                placeholder="Email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
              <input
                placeholder="Phone"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
              <input
                placeholder="Work"
                value={form.work}
                onChange={(e) => setForm({ ...form, work: e.target.value })}
              />
              <input
                placeholder="Nick Name"
                value={form.nick}
                onChange={(e) => setForm({ ...form, nick: e.target.value })}
              />
              <button
                className="add-btn"
                onClick={isEditing ? updateContact : addContact}
              >
                {isEditing ? "Update Contact" : "Add Contact"}
              </button>
            </div>
          </div>
        )}

        {/* Profile View */}
        {view === "profile" && selectedContact && (
          <div className="card">
            <h1 className="title">{selectedContact.name}'s Profile</h1>
            <p><strong>Email:</strong> {selectedContact.email}</p>
            <p><strong>Phone:</strong> {selectedContact.phone}</p>
            <p><strong>Work:</strong> {selectedContact.work}</p>
            <p><strong>Nick:</strong> {selectedContact.nick}</p>
            <button className="add-btn" onClick={() => setView("view")}>Back</button>
          </div>
        )}
      </main>
    </div>
  );
}
