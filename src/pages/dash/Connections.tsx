import { MessageSquare } from 'lucide-react'
import type { View } from '../Dashboard'
import { Card, Title } from '../../ui'
import { readConnections } from '../../Connect'

function Connections() {
  const items = readConnections()
  return (
    <Card>
      <Title>People you have reached out to</Title>
      {items.length === 0 ? (
        <p className="muted" style={{ marginTop: 10, lineHeight: 1.6 }}>
          Nothing yet. Use <b style={{ color: 'var(--text)' }}>Connect</b> next to any organisation in your dashboard to send an introduction, an email, or open their page. Everything you do is listed here.
        </p>
      ) : (
        <table className="table" style={{ marginTop: 8 }}>
          <thead><tr><th>Who</th><th>How</th><th>When</th><th>Your message</th></tr></thead>
          <tbody>
            {items.map((c) => (
              <tr key={c.id}>
                <td><b>{c.to}</b>{c.detail && <div className="muted" style={{ fontSize: 12 }}>{c.detail}</div>}</td>
                <td>{c.channel}</td>
                <td className="muted">{new Date(c.at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</td>
                <td className="muted" style={{ maxWidth: 360 }}>{c.message.length > 90 ? `${c.message.slice(0, 90)}…` : c.message}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <p className="src">These are sample organisations, so nothing is delivered in this prototype. In the live product the other side sees your verified profile and decides whether to reply.</p>
    </Card>
  )
}

export const connectionsView: View = {
  id: 'connections',
  label: 'Connections',
  icon: MessageSquare,
  title: 'Your connections',
  subtitle: 'Everyone you have reached out to, in one place.',
  render: () => <Connections />,
}
