import { Link, createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { DetailActionPanel, DetailGrid, DetailHero, DetailTimeline } from "@/components/admin/DetailView";
import { PageHeader, PageBody } from "@/components/shell/AppShell";
import { SectionCard, StatusBadge } from "@/components/shell/widgets";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CalendarClock, Mail, Megaphone, MessageSquareText, Send } from "lucide-react";
import { type AnnouncementStatus, initialAnnouncements } from "@/lib/admin-data";

export const Route = createFileRoute("/admin/announcements/$announcementId")({ component: AnnouncementDetail });

function AnnouncementDetail() {
  const { announcementId } = Route.useParams();
  const announcement = initialAnnouncements.find((item) => item.id === announcementId);
  const [announcementOverride, setAnnouncementOverride] = useState(announcement);
  const [notice, setNotice] = useState("");
  const currentAnnouncement = announcementOverride ?? announcement;

  if (!currentAnnouncement) {
    return (
      <>
        <PageHeader eyebrow="Announcement" title="Announcement not found" />
        <PageBody>
          <Link to="/admin/announcements" className="inline-flex items-center gap-2 text-sm text-primary hover:underline">
            <ArrowLeft className="h-4 w-4" />
            Back to announcements
          </Link>
        </PageBody>
      </>
    );
  }

  function updateStatus(status: AnnouncementStatus) {
    setAnnouncementOverride((current) => (current ? { ...current, status } : current));
    setNotice(status === "Sent" ? "Announcement sent to the selected target." : "Announcement scheduled for delivery.");
  }

  return (
    <>
      <PageHeader
        eyebrow="Announcement detail"
        title={currentAnnouncement.title}
        description="Message content, target audience, delivery channel, and platform communication actions."
      />
      <PageBody>
        {notice && <div className="rounded-lg border border-border bg-primary-soft px-4 py-3 text-sm text-primary">{notice}</div>}

        <DetailHero
          eyebrow={currentAnnouncement.tag}
          title={currentAnnouncement.title}
          description={currentAnnouncement.detail}
          icon={<Megaphone className="h-6 w-6" />}
          badges={<StatusBadge tone={currentAnnouncement.status === "Sent" ? "success" : currentAnnouncement.status === "Scheduled" ? "info" : "neutral"}>{currentAnnouncement.status}</StatusBadge>}
        />

        <div className="grid gap-4 lg:grid-cols-[1fr_360px]">
          <SectionCard title="Message preview">
            <div className="rounded-2xl border border-border bg-gradient-to-br from-primary-soft/70 via-card to-card p-5">
              <div className="mb-3 flex items-center gap-2">
                <MessageSquareText className="h-4 w-4 text-primary" />
                <span className="text-xs font-semibold uppercase tracking-wider text-primary">{currentAnnouncement.tag}</span>
              </div>
              <p className="text-sm leading-6 text-muted-foreground">{currentAnnouncement.detail}</p>
            </div>
          </SectionCard>

          <SectionCard title="Delivery settings">
            <DetailGrid
              items={[
                ["Target", currentAnnouncement.target],
                ["Channel", currentAnnouncement.channel],
                ["Status", currentAnnouncement.status],
                ["Message type", currentAnnouncement.tag],
              ]}
            />
          </SectionCard>
        </div>

        <SectionCard title="Communication guardrails">
          <DetailTimeline
            items={[
              { title: "Target review", detail: "Confirm audience before sending broadly.", tone: "warning" },
              { title: "Channel audit", detail: "In-app and email sends should log sender and timestamp.", tone: "primary" },
              { title: "Tenant safety", detail: "Critical notices should not expose another tenant's data.", tone: "success" },
            ]}
          />
        </SectionCard>

        <DetailActionPanel title="Announcement actions" description="Delivery actions live here for review before sending.">
          {currentAnnouncement.status !== "Sent" && (
            <Button onClick={() => updateStatus("Sent")} className="gap-1.5">
              <Send className="h-4 w-4" />
              Send now
            </Button>
          )}
          {currentAnnouncement.status === "Draft" && (
            <Button variant="outline" onClick={() => updateStatus("Scheduled")} className="gap-1.5">
              <CalendarClock className="h-4 w-4" />
              Schedule
            </Button>
          )}
          <Button variant="outline" className="gap-1.5">
            <Mail className="h-4 w-4" />
            Preview email
          </Button>
        </DetailActionPanel>
      </PageBody>
    </>
  );
}
