import { useEffect, useState } from "react";

export default function AddMember() {
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const [members, setMembers] = useState([]);
  const [searchInput, setSearchInput] = useState("");
const [searchTerm, setSearchTerm] = useState("");

const nameQuery = searchTerm.toLowerCase();
const phoneQuery = /^[+\d\s().-]+$/.test(searchTerm)
  ? searchTerm.replace(/\D/g, "")
  : "";

const filteredMembers = members.filter(member => {
  if (!searchTerm) return true;

  const matchesName = member.name.toLowerCase().includes(nameQuery);
  const phoneDigits = String(member.phone ?? "").replace(/\D/g, "");
  const matchesPhone = phoneQuery !== "" && phoneDigits.includes(phoneQuery);

  return matchesName || matchesPhone;
});

function handleSearch(event) {
  event.preventDefault();
  setSearchTerm(searchInput.trim());
}

function clearSearch() {
  setSearchInput("");
  setSearchTerm("");
}


  const [loadingMembers, setLoadingMembers] = useState(true);
  const [listError, setListError] = useState('');
  const [listVersion, setListVersion] = useState(0);
  

useEffect(() => {
  const controller = new AbortController();

  async function loadMembers() {
    setLoadingMembers(true);
    setListError('');

    try {
      const response = await fetch('/api/members', {
        headers: { Accept: 'application/json' },
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(`Could not load members (HTTP ${response.status}).`);
      }

      const data = await response.json();
      if (!controller.signal.aborted) {
        setMembers(data);
      }
    } catch (error) {
      if (!controller.signal.aborted) {
        setListError(error.message || 'Could not load members.');
      }
    } finally {
      if (!controller.signal.aborted) {
        setLoadingMembers(false);
      }
    }
  }

  loadMembers();
  return () => controller.abort();
}, [listVersion]);



  async function handleSubmit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const fields = new FormData(form);

    const member = {
      name: fields.get("name").trim(),
      phone: fields.get("phone").trim(),
      email: fields.get("email").trim() || null,
    };

    setSaving(true);
    setMessage("");

    try {
      const response = await fetch(editing ? `/api/members/${editing.id}` : "/api/members", {
        method: editing ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(member),
      });

      if (response.status === 422) {
        const result = await response.json();
        setMessage(Object.values(result.errors).flat().join(" "));
        return;
      }

      if (!response.ok) {
        setMessage(`Could not save the member (HTTP ${response.status}).`);
        return;
      }

      const saved = await response.json();
      setMessage(`${editing ? "Updated" : "Registered"} ${saved.name}. Member ID: ${saved.id}.`);
      form.reset();
      setEditing(null);
      setListVersion(version => version + 1);
    } catch {
      setMessage("Could not reach the API. Check that Laravel is running.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <main>
      <h1>{editing ? `Edit Member #${editing.id}` : "Add Member"}</h1>

      <form key={editing?.id ?? "new"} onSubmit={handleSubmit}>
        <fieldset disabled={saving}>
        <p>
          <label>
            Name
            <br />
            <input defaultValue={editing?.name ?? ""} name="name" autoComplete="name" maxLength={255} required />
          </label>
        </p>
        <p>
          <label>
            Phone
            <br />
            <input
              name="phone"
              defaultValue={editing?.phone ?? ""}
              type="tel"
              autoComplete="tel"
              maxLength={20}
              required
            />
          </label>
        </p>
        <p>
          <label>
            Email
            <br />
            <input
              name="email"
              defaultValue={editing?.email ?? ""}
              type="email"
              autoComplete="email"
              maxLength={255}
            />
          </label>
        </p>

        <button type="submit" disabled={saving}>
          {saving ? "Saving…" : editing ? "Save Changes" : "Save"}
        </button>
        {editing && <button type="button" onClick={() => { setEditing(null); setMessage(""); }}>Cancel</button>}
        </fieldset>
      </form>
      <p role="status">{message}</p>
{/* <section aria-labelledby="members-heading">
  <h2 id="members-heading">Registered Members</h2>

  <form role="search" onSubmit={handleSearch}>
  <label htmlFor="member-search">Search by name or phone number</label>
  <input
    id="member-search"
    type="search"
    placeholder="Enter a name or phone number"
    value={searchInput}
    onChange={event => setSearchInput(event.target.value)}
  />
  <button type="submit">Search</button>
  <button type="button" onClick={clearSearch}>Clear</button>
</form>

{!loadingMembers && !listError && members.length > 0 &&
  filteredMembers.length === 0 && (
    <p role="status">No members found for “{searchTerm}”.</p>
  )}

  {loadingMembers && <p role="status">Loading members…</p>}

  {listError && (
    <p role="alert">
      {listError}{' '}
      <button
        type="button"
        onClick={() => setListVersion(version => version + 1)}
      >
        Retry
      </button>
    </p>
  )}

  {!loadingMembers && !listError && members.length === 0 && (
    <p>No members registered yet.</p>
  )}

  {members.length > 0 && (
    <table>
      <thead>
        <tr>
          <th scope="col">ID</th>
          <th scope="col">Name</th>
          <th scope="col">Phone</th>
          <th scope="col">Email</th>
          <th scope="col">Actions</th>
        </tr>
      </thead>
      <tbody>
        {members.map(member => (
          <tr key={member.id}>
            <td>{member.id}</td>
            <td>{member.name}</td>
            <td>{member.phone}</td>
            <td>{member.email || '—'}</td>
            <td><button type="button" disabled={saving} onClick={() => {
              setEditing(member);
              setMessage("");
              window.scrollTo(0, 0);
            }}>Edit</button></td>
          </tr>
        ))}
      </tbody>
    </table>
  )}
</section> */}
<section aria-labelledby="members-heading">
  <h2 id="members-heading">Registered Members</h2>

  <form role="search" onSubmit={handleSearch}>
    <label htmlFor="member-search">Search by name or phone number</label>
    <div>
      <input
        id="member-search"
        type="search"
        placeholder="Enter a name or phone number"
        value={searchInput}
        onChange={event => setSearchInput(event.target.value)}
      />
      <button type="submit">Search</button>
      <button type="button" onClick={clearSearch}>Clear</button>
    </div>
  </form>

  <div style={{ marginTop: "12px", overflowX: "auto" }}>
    {loadingMembers && <p role="status">Loading members…</p>}

    {listError && (
      <p role="alert">
        {listError}{" "}
        <button
          type="button"
          onClick={() => setListVersion(version => version + 1)}
        >
          Retry
        </button>
      </p>
    )}

    {!loadingMembers && !listError && (
      filteredMembers.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th scope="col">ID</th>
              <th scope="col">Name</th>
              <th scope="col">Phone</th>
              <th scope="col">Email</th>
              <th scope="col">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredMembers.map(member => (
              <tr key={member.id}>
                <td>{member.id}</td>
                <td>{member.name}</td>
                <td>{member.phone}</td>
                <td>{member.email || "—"}</td>
                <td>
                  <button
                    type="button"
                    disabled={saving}
                    onClick={() => {
                      setEditing(member);
                      setMessage("");
                      window.scrollTo(0, 0);
                    }}
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p role="status">
          {searchTerm
            ? `No members found for “${searchTerm}”.`
            : "No members registered yet."}
        </p>
      )
    )}
  </div>
</section>
    </main>
  );
}
