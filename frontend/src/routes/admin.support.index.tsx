import { Link, createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  AdminActionIcon,
  AdminModalFooter,
  AdminSearchInput,
  AdminSelectField,
  AdminTextareaField,
  AdminTextField,
} from "@/components/admin/AdminControls";
import { AdminModal } from "@/components/admin/AdminModal";
import { PageHeader, PageBody } from "@/components/shell/AppShell";
import { SectionCard, StatusBadge } from "@/components/shell/widgets";
import { Eye, LifeBuoy, Plus, Send } from "lucide-react";
import {
  type SupportTicket,
  type TicketPriority,
  initialSchools,
  initialTickets,
  priorityTone,
  ticketPriorities,
} from "@/lib/admin-data";

export const Route = createFileRoute("/admin/support/")({ component: Support });

function Support() {
  const [tickets, setTickets] = useState(initialTickets);
  const [query, setQuery] = useState("");
  const [priority, setPriority] = useState<"All" | TicketPriority>("All");
  const [selectedId, setSelectedId] = useState(initialTickets[0]?.id ?? "");
  const [reply, setReply] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    title: "",
    schoolId: initialSchools[0].id,
    priority: "Normal" as TicketPriority,
    body: "",
  });

  const filteredTickets = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return tickets.filter((ticket) => {
      const matchesSearch = !needle || [ticket.id, ticket.title, ticket.school, ticket.assignee].join(" ").toLowerCase().includes(needle);
      const matchesPriority = priority === "All" || ticket.priority === priority;
      return matchesSearch && matchesPriority;
    });
  }, [priority, query, tickets]);

  const selectedTicket = tickets.find((ticket) => ticket.id === selectedId) ?? filteredTickets[0] ?? tickets[0];

  function sendReply() {
    if (!reply.trim() || !selectedTicket) return;
    setTickets((current) =>
      current.map((ticket) =>
        ticket.id === selectedTicket.id
          ? {
              ...ticket,
              updated: "now",
              messages: [...ticket.messages, { author: "Jane Mwangi", body: reply.trim(), time: "now", internal: true }],
            }
          : ticket,
      ),
    );
    setReply("");
  }

  function createTicket(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const school = initialSchools.find((item) => item.id === form.schoolId) ?? initialSchools[0];
    const ticket: SupportTicket = {
      id: String(4900 + tickets.length),
      title: form.title,
      schoolId: school.id,
      school: school.name,
      priority: form.priority,
      assignee: "JM",
      updated: "now",
      status: "Open",
      messages: [{ author: "Support intake", body: form.body, time: "now" }],
    };
    setTickets((current) => [ticket, ...current]);
    setSelectedId(ticket.id);
    setShowForm(false);
    setForm({ title: "", schoolId: initialSchools[0].id, priority: "Normal", body: "" });
  }

  return (
    <>
      <PageHeader
        eyebrow="Support"
        title="Support center"
        description="Conversations with schools, prioritized by urgency and linked to tenant access."
        actions={
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex h-9 items-center gap-1.5 rounded-md bg-primary px-3 text-sm text-primary-foreground"
          >
            <Plus className="h-4 w-4" />
            New ticket
          </button>
        }
      />
      <PageBody>
        <div className="grid gap-4 lg:grid-cols-[1fr_400px]">
          <SectionCard title="Open tickets" padded={false}>
            <div className="flex flex-wrap items-center gap-3 border-b border-border p-4">
              <AdminSearchInput value={query} onChange={setQuery} placeholder="Search tickets, schools..." />
              <div className="flex items-center gap-1 rounded-md bg-muted p-1">
                {ticketPriorities.map((item) => (
                  <button
                    key={item}
                    onClick={() => setPriority(item)}
                    className={`rounded px-2.5 py-1.5 text-xs ${priority === item ? "bg-card font-medium shadow-card" : "text-muted-foreground hover:text-foreground"}`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
            <ul className="divide-y divide-border">
              {filteredTickets.map((ticket) => (
                <li
                  key={ticket.id}
                  className={`flex items-center gap-3 px-5 py-3.5 hover:bg-muted/40 ${selectedTicket?.id === ticket.id ? "bg-primary-soft/40" : ""}`}
                >
                  <button onClick={() => setSelectedId(ticket.id)} className="flex flex-1 items-center gap-3 text-left">
                    <span className="w-14 font-mono text-xs text-muted-foreground">#{ticket.id}</span>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-medium">{ticket.title}</div>
                      <div className="text-xs text-muted-foreground">{ticket.school}</div>
                    </div>
                    <StatusBadge tone={priorityTone(ticket.priority)}>{ticket.priority}</StatusBadge>
                    <div className="hidden h-7 w-7 items-center justify-center rounded-full bg-primary-soft text-xs font-semibold text-primary sm:flex">
                      {ticket.assignee}
                    </div>
                    <div className="hidden w-16 text-right text-xs text-muted-foreground md:block">{ticket.updated}</div>
                  </button>
                  <AdminActionIcon asChild label={`View ticket ${ticket.id}`}>
                    <Link to="/admin/support/$ticketId" params={{ ticketId: ticket.id }}>
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    </Link>
                  </AdminActionIcon>
                </li>
              ))}
            </ul>
          </SectionCard>

          <SectionCard title="Conversation" description={selectedTicket ? `#${selectedTicket.id} - ${selectedTicket.school}` : "Select a ticket"}>
            {selectedTicket ? (
              <div className="space-y-4">
                {selectedTicket.messages.map((message, index) => (
                  <div key={`${message.time}-${index}`} className={`rounded-lg p-3 text-sm ${message.internal ? "bg-primary-soft" : "bg-muted"}`}>
                    <div className={`mb-1 text-[11px] ${message.internal ? "text-primary" : "text-muted-foreground"}`}>
                      {message.author} - {message.time}
                    </div>
                    {message.body}
                  </div>
                ))}
                <div className="flex items-center gap-2 pt-2">
                  <input
                    value={reply}
                    onChange={(event) => setReply(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") sendReply();
                    }}
                    placeholder="Type a reply..."
                    className="h-10 flex-1 rounded-md border border-border bg-surface px-3 text-sm outline-none focus:ring-2 focus:ring-primary/30"
                  />
                  <button onClick={sendReply} className="inline-flex h-10 items-center gap-1.5 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground">
                    <Send className="h-4 w-4" />
                    Send
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-sm text-muted-foreground">No ticket selected.</div>
            )}
          </SectionCard>
        </div>

        <SectionCard title="Support access rule" description="Opening a tenant workspace must create an audit log entry.">
          <div className="grid gap-3 md:grid-cols-3">
            {["Ticket reason required", "Time-boxed tenant access", "Visible in audit log"].map((item) => (
              <div key={item} className="flex items-center gap-2 rounded-lg border border-border bg-surface p-3 text-sm">
                <LifeBuoy className="h-4 w-4 text-primary" />
                {item}
              </div>
            ))}
          </div>
        </SectionCard>
      </PageBody>

      <AdminModal
        open={showForm}
        onOpenChange={setShowForm}
        title="Create support ticket"
        description="Start a tracked support case for a school tenant."
      >
        <form onSubmit={createTicket}>
            <div className="grid gap-3">
              <AdminTextField label="Title" required value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} />
              <AdminSelectField label="School" value={form.schoolId} onChange={(event) => setForm({ ...form, schoolId: event.target.value })}>
                  {initialSchools.map((school) => <option key={school.id} value={school.id}>{school.name}</option>)}
              </AdminSelectField>
              <AdminSelectField label="Priority" value={form.priority} onChange={(event) => setForm({ ...form, priority: event.target.value as TicketPriority })}>
                  <option>Urgent</option>
                  <option>High</option>
                  <option>Normal</option>
                  <option>Low</option>
              </AdminSelectField>
              <AdminTextareaField label="Message" required value={form.body} onChange={(event) => setForm({ ...form, body: event.target.value })} />
            </div>
          <AdminModalFooter onCancel={() => setShowForm(false)} submitLabel="Create ticket" />
        </form>
      </AdminModal>
    </>
  );
}
