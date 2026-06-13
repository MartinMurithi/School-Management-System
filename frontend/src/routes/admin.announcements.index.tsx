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
import { Eye, Mail, Megaphone, MessageSquareText, Plus, Smartphone } from "lucide-react";
import { type AnnouncementStatus, type PlatformAnnouncement, initialAnnouncements, makeId } from "@/lib/admin-data";

export const Route = createFileRoute("/admin/announcements/")({ component: Announcements });

const statuses: Array<"All" | AnnouncementStatus> = ["All", "Draft", "Scheduled", "Sent"];

function Announcements() {
  const [items, setItems] = useState(initialAnnouncements);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"All" | AnnouncementStatus>("All");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    title: "",
    detail: "",
    tag: "Release",
    target: "All schools",
    channel: "In-app",
    status: "Draft" as AnnouncementStatus,
  });

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return items.filter((item) => {
      const matchesSearch = !needle || [item.title, item.detail, item.tag, item.target, item.channel].join(" ").toLowerCase().includes(needle);
      const matchesStatus = status === "All" || item.status === status;
      return matchesSearch && matchesStatus;
    });
  }, [items, query, status]);

  function createAnnouncement(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const item: PlatformAnnouncement = { id: makeId(form.title), ...form };
    setItems((current) => [item, ...current.filter((existing) => existing.id !== item.id)]);
    setShowForm(false);
    setForm({ title: "", detail: "", tag: "Release", target: "All schools", channel: "In-app", status: "Draft" });
  }

  return (
    <>
      <PageHeader
        eyebrow="Platform communication"
        title="Announcements"
        description="Send maintenance notices, feature updates, downtime alerts, and policy changes."
        actions={
          <button onClick={() => setShowForm(true)} className="inline-flex h-9 items-center gap-1.5 rounded-md bg-primary px-3 text-sm text-primary-foreground">
            <Plus className="h-4 w-4" />
            New announcement
          </button>
        }
      />
      <PageBody>
        <div className="grid gap-4 lg:grid-cols-3">
          <SectionCard title="Targeting rules" description="Announcements can be sent broadly or narrowly.">
            <div className="space-y-2 text-sm">
              {["All schools", "Specific schools", "Specific user roles", "Billing status segments"].map((rule) => (
                <div key={rule} className="rounded-lg border border-border bg-surface p-3">{rule}</div>
              ))}
            </div>
          </SectionCard>
          <SectionCard title="Channels" description="Start with in-app and email; SMS can follow.">
            <div className="grid gap-3 text-sm">
              <div className="flex items-center gap-2 rounded-lg bg-primary-soft p-3 text-primary"><MessageSquareText className="h-4 w-4" />In-app notifications</div>
              <div className="flex items-center gap-2 rounded-lg bg-muted p-3 text-muted-foreground"><Mail className="h-4 w-4" />Email</div>
              <div className="flex items-center gap-2 rounded-lg bg-muted p-3 text-muted-foreground"><Smartphone className="h-4 w-4" />SMS later</div>
            </div>
          </SectionCard>
          <SectionCard title="Communication guardrails" description="Avoid noisy platform-wide messaging.">
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>Require target review before sending to all schools.</p>
              <p>Keep maintenance notices separate from feature updates.</p>
              <p>Audit who sent each announcement and when.</p>
            </div>
          </SectionCard>
        </div>

        <SectionCard title="Message log" padded={false}>
          <div className="flex flex-wrap items-center gap-3 border-b border-border p-4">
            <AdminSearchInput value={query} onChange={setQuery} placeholder="Search announcements..." />
            <div className="flex items-center gap-1 rounded-md bg-muted p-1">
              {statuses.map((item) => (
                <button key={item} onClick={() => setStatus(item)} className={`rounded px-2.5 py-1.5 text-xs ${status === item ? "bg-card font-medium shadow-card" : "text-muted-foreground hover:text-foreground"}`}>
                  {item}
                </button>
              ))}
            </div>
          </div>
          <ul className="divide-y divide-border">
            {filtered.map((item) => (
              <li key={item.id} className="flex items-start gap-4 px-5 py-4">
                <div className="mt-0.5 grid h-9 w-9 place-items-center rounded-md bg-primary-soft text-primary"><Megaphone className="h-4 w-4" /></div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-primary">{item.tag}</span>
                    <StatusBadge tone={item.status === "Sent" ? "success" : item.status === "Scheduled" ? "info" : "neutral"}>{item.status}</StatusBadge>
                  </div>
                  <Link to="/admin/announcements/$announcementId" params={{ announcementId: item.id }} className="mt-1 block font-medium hover:text-primary">{item.title}</Link>
                  <p className="mt-1 text-sm text-muted-foreground">{item.detail}</p>
                  <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                    <span>Target: {item.target}</span>
                    <span>Channel: {item.channel}</span>
                  </div>
                </div>
                <AdminActionIcon asChild label={`View ${item.title}`}>
                  <Link to="/admin/announcements/$announcementId" params={{ announcementId: item.id }}>
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  </Link>
                </AdminActionIcon>
              </li>
            ))}
          </ul>
        </SectionCard>
      </PageBody>

      <AdminModal
        open={showForm}
        onOpenChange={setShowForm}
        title="New announcement"
        description="Prepare a platform message with targeting and channels."
      >
        <form onSubmit={createAnnouncement}>
            <div className="grid gap-3">
              <AdminTextField label="Title" required value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} />
              <AdminTextareaField label="Detail" required value={form.detail} onChange={(event) => setForm({ ...form, detail: event.target.value })} />
              <div className="grid gap-3 md:grid-cols-2">
                <AdminTextField label="Tag" value={form.tag} onChange={(event) => setForm({ ...form, tag: event.target.value })} />
                <AdminSelectField label="Target" value={form.target} onChange={(event) => setForm({ ...form, target: event.target.value })}>
                  <option>All schools</option>
                  <option>CBC schools</option>
                  <option>Overdue schools</option>
                  <option>School owners</option>
                </AdminSelectField>
                <AdminSelectField label="Channel" value={form.channel} onChange={(event) => setForm({ ...form, channel: event.target.value })}>
                  <option>In-app</option>
                  <option>In-app + email</option>
                  <option>Email + SMS</option>
                </AdminSelectField>
                <AdminSelectField label="Status" value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value as AnnouncementStatus })}>
                  <option>Draft</option>
                  <option>Scheduled</option>
                  <option>Sent</option>
                </AdminSelectField>
              </div>
            </div>
          <AdminModalFooter onCancel={() => setShowForm(false)} submitLabel="Save announcement" />
        </form>
      </AdminModal>
    </>
  );
}
