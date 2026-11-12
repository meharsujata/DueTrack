
import { useEffect, useState } from 'react';
import { supabase } from './supabase';
import './App.css';

function App() {
  const [deadlines, setDeadlines] = useState([]);
  const [title, setTitle] = useState('');
  const [owner, setOwner] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [category, setCategory] = useState('Task');
  const [reminderMinutes, setReminderMinutes] = useState('60');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
const [notificationsEnabled, setNotificationsEnabled] = useState(
  Notification.permission === 'granted'
);

function enableNotifications() {
  Notification.requestPermission().then(permission => {
    if (permission === 'granted') {
      setNotificationsEnabled(true);
      setMessage('Notifications enabled successfully!');
    } else {
      setNotificationsEnabled(false);
      setMessage('Notification permission was not granted.');
    }
  });
}

  async function loadDeadlines() {
    setLoading(true);
    const { data, error } = await supabase
      .from('deadlines')
      .select('*')
      .order('due_date', { ascending: true });

    if (error) {
      setMessage(error.message);
    } else {
      setDeadlines(data || []);
    }
    setLoading(false);
  }

  useEffect(() => {
    loadDeadlines();
  }, []);
  useEffect(() => {
  if (!notificationsEnabled) return;

  function checkReminders() {
    const now = Date.now();

    deadlines.forEach(item => {
      if (item.status === 'Completed') return;

      const dueTime = new Date(item.due_date).getTime();
      const reminderMinutes = Number(item.reminder_minutes ?? 60);
      const reminderTime = dueTime - reminderMinutes * 60 * 1000;

      const notificationKey = `duetrack-reminder-${item.id}-${item.due_date}`;

      if (
        now >= reminderTime &&
        now < dueTime &&
        !localStorage.getItem(notificationKey)
      ) {
        new Notification('DueTrack Reminder', {
          body: `${item.title} is approaching its deadline!`
        });

        localStorage.setItem(notificationKey, 'sent');
      }
    });
  }

  checkReminders();

  const interval = setInterval(checkReminders, 30000);

  return () => clearInterval(interval);
}, [deadlines, notificationsEnabled]);

  async function addDeadline(e) {
    e.preventDefault();
    setMessage('');

    const { error } = await supabase.from('deadlines').insert([{
  title,
  owner,
  category,
  due_date: new Date(dueDate).toISOString(),
  reminder_minutes: Number(reminderMinutes),
  status: 'Pending'
}]);
    

    if (error) {
      setMessage(error.message);
    } else {
      setTitle('');
      setOwner('');
      setDueDate('');
      setCategory('Task');
      setReminderMinutes('60');
      setMessage('Deadline added successfully!');
      loadDeadlines();
    }
  }

  async function updateStatus(id, status) {
    const { error } = await supabase
      .from('deadlines')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id);

    if (error) {
      setMessage(error.message);
    } else {
      loadDeadlines();
    }
  }

  async function deleteDeadline(id) {
    if (!window.confirm('Delete this deadline?')) return;

    const { error } = await supabase
      .from('deadlines')
      .delete()
      .eq('id', id);

    if (error) {
      setMessage(error.message);
    } else {
      loadDeadlines();
    }
  }

  const pending = deadlines.filter(d => d.status === 'Pending').length;
  const progress = deadlines.filter(d => d.status === 'In Progress').length;
  const completed = deadlines.filter(d => d.status === 'Completed').length;
  const overdue = deadlines.filter(
    d => new Date(d.due_date) < new Date() && d.status !== 'Completed'
  ).length;

  return (
    <div className="app">
      <header className="topbar">
  <h2>DueTrack<span>.</span></h2>
  <p>Deadline & Commitment Tracker</p>

  <button onClick={enableNotifications}>
    {notificationsEnabled ? 'Notifications Enabled' : 'Enable Notifications'}
  </button>
</header>

      <main className="container">
        <section className="welcome">
          <div>
            <p className="eyebrow">WORKSPACE OVERVIEW</p>
            <h1>Stay ahead of every deadline.</h1>
            <p>Track commitments, monitor due dates and keep work moving.</p>
          </div>
          <div className="today">
            TODAY<br />
            {new Date().toLocaleDateString()}
          </div>
        </section>

        <section className="stats">
          <div className="stat-card">
            <span>Total deadlines</span>
            <strong>{deadlines.length}</strong>
          </div>
          <div className="stat-card">
            <span>Pending</span>
            <strong>{pending}</strong>
          </div>
          <div className="stat-card">
            <span>In progress</span>
            <strong>{progress}</strong>
          </div>
          <div className="stat-card">
            <span>Completed</span>
            <strong>{completed}</strong>
          </div>
          <div className="stat-card overdue">
            <span>Overdue</span>
            <strong>{overdue}</strong>
          </div>
        </section>

        <section className="content-grid">
          <div className="panel">
            <h2>Add a deadline</h2>
            <p className="muted">Create a new commitment to track.</p>

            <form onSubmit={addDeadline}>
              <label>Task or commitment</label>
              <input
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="e.g. Submit monthly report"
                required
              />

              <label>Responsible person</label>
              <input
                value={owner}
                onChange={e => setOwner(e.target.value)}
                placeholder="Enter owner name"
              />

              <label>Category</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
              >
                <option>Task</option>
                <option>SLA</option>
                <option>Reporting</option>
                <option>Compliance</option>
                <option>Project</option>
              </select>

              <label>Deadline date and time</label>
              <input
                type="datetime-local"
                value={dueDate}
                onChange={e => setDueDate(e.target.value)}
                required
              />
<label>Remind me before deadline</label>
<select
  value={reminderMinutes}
  onChange={e => setReminderMinutes(e.target.value)}
>
  <option value="15">15 minutes</option>
  <option value="30">30 minutes</option>
  <option value="60">1 hour</option>
  <option value="1440">1 day</option>
</select>
              <button type="submit">+ Add deadline</button>
            </form>
          </div>

          <div className="panel deadline-panel">
            <div className="list-heading">
              <div>
                <h2>Tracked deadlines</h2>
                <p className="muted">Your upcoming commitments</p>
              </div>
              <button className="refresh" onClick={loadDeadlines}>
                Refresh
              </button>
            </div>

            {message && <p className="message">{message}</p>}

            {loading ? (
              <p className="muted">Loading deadlines...</p>
            ) : deadlines.length === 0 ? (
              <div className="empty">
                <h3>No deadlines yet</h3>
                <p>Add your first commitment using the form.</p>
              </div>
            ) : (
              <div className="deadline-list">
                {deadlines.map(item => {
                  const isOverdue =
                    new Date(item.due_date) < new Date() &&
                    item.status !== 'Completed';

                  return (
                    <div className="deadline-item" key={item.id}>
                      <div className="item-top">
                        <div>
                          <h3>{item.title}</h3>
                          <p>{item.category} · {item.owner || 'No owner assigned'}</p>
                        </div>
                        <span className={`status ${isOverdue ? 'late' : item.status.toLowerCase().replace(' ', '-')}`}>
                          {isOverdue ? 'Overdue' : item.status}
                        </span>
                      </div>

                      <p className="due-date">
                        Due: {new Date(item.due_date).toLocaleString()}
                      </p>

                      <div className="item-actions">
                        <select
                          value={item.status}
                          onChange={e => updateStatus(item.id, e.target.value)}
                        >
                          <option>Pending</option>
                          <option>In Progress</option>
                          <option>Completed</option>
                        </select>
                        <button
                          className="delete"
                          onClick={() => deleteDeadline(item.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>
        <footer>DueTrack · Simple deadline management for teams</footer>
      </main>
    </div>
  );
}

export default App;
