import { useEffect, useState } from "react";

export default function AddMember() {
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

    const [members, setMembers] = useState([]);
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
      const response = await fetch("/api/members", {
        method: "POST",
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
      setMessage(`Saved ${saved.name}. Member ID: ${saved.id}.`);
      form.reset();
      setListVersion(version => version + 1);
    } catch {
      setMessage("Could not reach the API. Check that Laravel is running.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <main>
      <h1>Add Member</h1>

      <form onSubmit={handleSubmit}>
        <p>
          <label>
            Name
            <br />
            <input name="name" autoComplete="name" maxLength={255} required />
          </label>
        </p>
        <p>
          <label>
            Phone
            <br />
            <input
              name="phone"
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
              type="email"
              autoComplete="email"
              maxLength={255}
            />
          </label>
        </p>

        <button type="submit" disabled={saving}>
          {saving ? "Saving…" : "Save"}
        </button>
      </form>
      <p role="status">{message}</p>
<section aria-labelledby="members-heading">
  <h2 id="members-heading">Registered Members</h2>

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
        </tr>
      </thead>
      <tbody>
        {members.map(member => (
          <tr key={member.id}>
            <td>{member.id}</td>
            <td>{member.name}</td>
            <td>{member.phone}</td>
            <td>{member.email || '—'}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )}
</section>
    </main>
  );
}
