import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, PageBody } from "@/components/shell/AppShell";
import { SectionCard } from "@/components/shell/widgets";

export const Route = createFileRoute("/school/settings")({ component: SchoolSettings });

function SchoolSettings() {
  return (
    <>
      <PageHeader eyebrow="System" title="School settings" description="Configure your school's identity, payments and integrations." />
      <PageBody>
        <div className="grid lg:grid-cols-2 gap-4">
          <SectionCard title="School profile">
            <div className="space-y-3 text-sm">
              <div className="flex justify-between border-b border-border pb-2"><span className="text-muted-foreground">Name</span><span className="font-medium">Mwangaza Academy</span></div>
              <div className="flex justify-between border-b border-border pb-2"><span className="text-muted-foreground">Curriculum</span><span className="font-medium">CBC + 8-4-4 (Hybrid)</span></div>
              <div className="flex justify-between border-b border-border pb-2"><span className="text-muted-foreground">Sub-county</span><span className="font-medium">Westlands</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Plan</span><span className="font-medium">Growth · KES 26,000/mo</span></div>
            </div>
          </SectionCard>
          <SectionCard title="M-PESA integration">
            <div className="space-y-3 text-sm">
              <div className="flex justify-between border-b border-border pb-2"><span className="text-muted-foreground">Paybill</span><span className="font-mono">247247</span></div>
              <div className="flex justify-between border-b border-border pb-2"><span className="text-muted-foreground">Account format</span><span className="font-mono">{"{admission}"}</span></div>
              <div className="flex justify-between border-b border-border pb-2"><span className="text-muted-foreground">STK Push</span><span className="font-medium text-success">Enabled</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Daraja status</span><span className="font-medium text-success">Connected</span></div>
            </div>
          </SectionCard>
        </div>
      </PageBody>
    </>
  );
}
