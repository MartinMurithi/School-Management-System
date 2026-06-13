import { Link, createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { DetailActionPanel, DetailGrid, DetailHero, DetailTimeline } from "@/components/admin/DetailView";
import { PageHeader, PageBody } from "@/components/shell/AppShell";
import { SectionCard, StatusBadge } from "@/components/shell/widgets";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle2, Clock, LifeBuoy, LockKeyhole, Send, ShieldCheck } from "lucide-react";
import { initialTickets, priorityTone } from "@/lib/admin-data";

export const Route = createFileRoute("/admin/support/$ticketId")({ component: TicketDetail });

function TicketDetail() {
  const { ticketId } = Route.useParams();
  const ticket = initialTickets.find((item) => item.id === ticketId);
  const [status, setStatus] = useState(ticket?.status ?? "Open");
  const [notice, setNotice] = useState("");

  if (!ticket) {
    return (
      <>
        <PageHeader eyebrow="Support" title="Ticket not found" description="The support ticket could not be found." />
        <PageBody>
          <Link to="/admin/support" className="inline-flex items-center gap-2 text-sm text-primary hover:underline">
            <ArrowLeft className="h-4 w-4" />
            Back to support
          </Link>
        </PageBody>
      </>
    );
  }

  return (
    <>
      <PageHeader
        eyebrow="Support ticket"
        title={`#${ticket.id} - ${ticket.title}`}
        description="Conversation, tenant context, access audit, and support actions."
      />
      <PageBody>
        {notice && <div className="rounded-lg border border-border bg-primary-soft px-4 py-3 text-sm text-primary">{notice}</div>}

        <DetailHero
          eyebrow="Support case"
          title={ticket.title}
          description={`${ticket.school} - Ticket #${ticket.id}`}
          icon={<LifeBuoy className="h-6 w-6" />}
          badges={
            <>
              <StatusBadge tone={priorityTone(ticket.priority)}>{ticket.priority}</StatusBadge>
              <StatusBadge tone={status === "Resolved" ? "success" : status === "Waiting" ? "warning" : "info"}>{status}</StatusBadge>
            </>
          }
        />

        <div className="grid gap-4 lg:grid-cols-[1fr_360px]">
          <SectionCard title="Conversation">
            <div className="space-y-4">
              {ticket.messages.map((message, index) => (
                <div key={`${message.time}-${index}`} className={`rounded-lg p-3 text-sm ${message.internal ? "bg-primary-soft" : "bg-muted"}`}>
                  <div className={`mb-1 text-[11px] ${message.internal ? "text-primary" : "text-muted-foreground"}`}>
                    {message.author} - {message.time}
                  </div>
                  {message.body}
                </div>
              ))}
            </div>
          </SectionCard>

          <div className="space-y-4">
            <SectionCard title="Ticket summary">
              <DetailGrid
                items={[
                  ["School", ticket.school],
                  ["Priority", ticket.priority],
                  ["Assignee", ticket.assignee],
                  ["Updated", ticket.updated],
                ]}
                columns="two"
              />
            </SectionCard>
            <SectionCard title="Access audit">
              <DetailTimeline
                items={[
                  { title: "Reason required", detail: `Support ticket #${ticket.id}`, tone: "primary" },
                  { title: "Tenant access", detail: "Time-boxed access should be logged.", tone: "warning" },
                  { title: "Visible trail", detail: "Tenant owner should see sensitive support access.", tone: "success" },
                ]}
              />
            </SectionCard>
          </div>
        </div>

        <DetailActionPanel title="Support actions" description="Support actions happen from the ticket view with tenant context visible.">
          <Button onClick={() => setNotice("Internal reply composer opened.")} className="gap-1.5">
            <Send className="h-4 w-4" />
            Reply
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              setStatus("Waiting");
              setNotice("Ticket marked as waiting on school response.");
            }}
            className="gap-1.5"
          >
            <Clock className="h-4 w-4" />
            Mark waiting
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              setStatus("Resolved");
              setNotice("Ticket resolved.");
            }}
            className="gap-1.5"
          >
            <CheckCircle2 className="h-4 w-4" />
            Resolve
          </Button>
          <Button variant="outline" onClick={() => setNotice("Tenant access request recorded for audit.")} className="gap-1.5">
            <LockKeyhole className="h-4 w-4" />
            Request tenant access
          </Button>
          <Button variant="outline" className="gap-1.5">
            <ShieldCheck className="h-4 w-4" />
            View audit trail
          </Button>
        </DetailActionPanel>
      </PageBody>
    </>
  );
}
