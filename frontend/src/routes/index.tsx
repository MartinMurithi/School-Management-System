import { createFileRoute, Link } from "@tanstack/react-router";
import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ShieldCheck, Building2, ArrowRight, Check, Smartphone, GraduationCap, Banknote, BarChart3, Users } from "lucide-react";

export const Route = createFileRoute("/")({
  component: Landing,
  head: () => ({
    meta: [
      { title: "Shulesoft - School Management SaaS for Kenya" },
      {
        name: "description",
        content:
          "Modern multi-tenant school ERP for CBC, 8-4-4 and hybrid schools. MPESA-native finance, exams, SIS and timetabling.",
      },
    ],
  }),
});

function Landing() {
  const rootRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const root = rootRef.current;
    if (!root) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;

    const ctx = gsap.context(() => {
      const intro = gsap.timeline({ defaults: { ease: "power2.out", duration: 0.7 } });
      intro
        .from("[data-animate='hero-badge']", { y: 14, autoAlpha: 0 })
        .from("[data-animate='hero-title']", { y: 16, autoAlpha: 0 }, "-=0.45")
        .from("[data-animate='hero-copy']", { y: 14, autoAlpha: 0 }, "-=0.42")
        .from("[data-animate='hero-actions']", { y: 12, autoAlpha: 0 }, "-=0.42")
        .from("[data-animate='hero-trust']", { y: 10, autoAlpha: 0, stagger: 0.05 }, "-=0.35")
        .from("[data-animate='hero-card']", { y: 24, autoAlpha: 0, scale: 0.985, duration: 0.9 }, "-=0.45")
        .from("[data-animate='hero-float']", { x: -10, y: 10, autoAlpha: 0, duration: 0.7 }, "-=0.55")
        .from("[data-animate='hero-metric']", { y: 10, autoAlpha: 0, stagger: 0.06, duration: 0.55 }, "-=0.5")
        .from(
          "[data-animate='hero-bar']",
          { scaleY: 0.35, transformOrigin: "bottom", stagger: 0.03, duration: 0.5 },
          "-=0.45",
        );

      gsap.utils.toArray<HTMLElement>("[data-animate='section-card']").forEach((el, index) => {
        gsap.from(el, {
          y: 22,
          autoAlpha: 0,
          duration: 0.7,
          ease: "power2.out",
          delay: (index % 3) * 0.04,
          scrollTrigger: {
            trigger: el,
            start: "top 86%",
            once: true,
          },
        });
      });

      gsap.from("[data-animate='portal-card']", {
        y: 24,
        autoAlpha: 0,
        duration: 0.8,
        ease: "power2.out",
        stagger: 0.08,
        scrollTrigger: {
          trigger: "[data-animate='portals']",
          start: "top 80%",
          once: true,
        },
      });
    }, root);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <div ref={rootRef} className="min-h-dvh bg-background">
      <header className="sticky top-0 z-30 border-b border-border bg-background/85 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="grid h-9 w-9 place-items-center rounded-lg bg-primary font-display font-semibold text-primary-foreground">S</div>
            <div className="font-display font-semibold tracking-tight">Shulesoft</div>
            <span className="ml-1 hidden rounded border border-border px-1.5 py-0.5 text-[10px] uppercase tracking-wider text-muted-foreground sm:inline-flex">v1 preview</span>
          </Link>
          <nav className="hidden items-center gap-7 text-sm text-muted-foreground md:flex">
            <a href="#modules" className="hover:text-foreground">Modules</a>
            <a href="#mpesa" className="hover:text-foreground">M-PESA</a>
            <a href="#curriculum" className="hover:text-foreground">CBC & 8-4-4</a>
            <a href="#pricing" className="hover:text-foreground">Pricing</a>
          </nav>
          <div className="flex items-center gap-2">
            <Link to="/admin" className="hidden h-9 items-center gap-1.5 rounded-md border border-border px-3 text-sm hover:bg-muted sm:inline-flex">
              <ShieldCheck className="h-4 w-4" /> Super Admin
            </Link>
            <Link to="/school" className="inline-flex h-9 items-center gap-1.5 rounded-md bg-primary px-3 text-sm text-primary-foreground hover:opacity-90">
              <Building2 className="h-4 w-4" /> Open School ERP
            </Link>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 bg-grid opacity-60 [mask-image:radial-gradient(ellipse_at_top,black_30%,transparent_70%)]" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-6 pb-24 pt-20 lg:grid-cols-2">
          <div className="space-y-7">
            <div data-animate="hero-badge" className="inline-flex items-center gap-2 rounded-full bg-primary-soft px-3 py-1.5 text-xs font-medium text-primary">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              Built for Kenyan schools - CBC, 8-4-4, hybrid
            </div>
            <h1 data-animate="hero-title" className="text-balance font-display text-4xl font-semibold tracking-tight md:text-6xl">
              The school operating system Kenya has been waiting for.
            </h1>
            <p data-animate="hero-copy" className="max-w-xl text-lg text-muted-foreground">
              One platform for admissions, fees, M-PESA reconciliation, exams, CBC competencies and timetabling - designed for principals, bursars and teachers, not IT departments.
            </p>
            <div data-animate="hero-actions" className="flex flex-wrap items-center gap-3">
              <Link to="/school" className="inline-flex h-11 items-center gap-2 rounded-md bg-primary px-5 font-medium text-primary-foreground shadow-elevated hover:opacity-90">
                Open School ERP <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/admin" className="inline-flex h-11 items-center gap-2 rounded-md border border-border bg-card px-5 font-medium hover:bg-muted">
                <ShieldCheck className="h-4 w-4" /> Super Admin console
              </Link>
            </div>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-2 text-sm text-muted-foreground">
              {["NEMIS-ready", "M-PESA Daraja", "Multi-campus", "Offline-friendly"].map((t) => (
                <div data-animate="hero-trust" key={t} className="inline-flex items-center gap-1.5"><Check className="h-4 w-4 text-success" />{t}</div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div data-animate="hero-card" className="rounded-2xl border border-border bg-card p-5 shadow-elevated">
              <div className="flex items-center justify-between border-b border-border pb-4">
                <div>
                  <div className="text-[11px] uppercase tracking-wider text-muted-foreground">Term 2 - 2026</div>
                  <div className="font-display font-semibold">Mwangaza Academy</div>
                </div>
                <div className="rounded bg-success/10 px-2 py-1 text-xs font-medium text-success">All systems normal</div>
              </div>
              <div className="grid grid-cols-2 gap-3 pt-4">
                {[
                  { l: "Students", v: "1,284", d: "+24" },
                  { l: "Fees today", v: "KES 412K", d: "M-PESA" },
                  { l: "Attendance", v: "96.2%", d: "" },
                  { l: "Defaulters", v: "78", d: "" },
                ].map((m) => (
                  <div data-animate="hero-metric" key={m.l} className="rounded-lg border border-border bg-surface p-3">
                    <div className="text-[11px] uppercase tracking-wider text-muted-foreground">{m.l}</div>
                    <div className="mt-1 font-display text-xl font-semibold">{m.v}</div>
                    {m.d && <div className="mt-0.5 text-[11px] text-muted-foreground">{m.d}</div>}
                  </div>
                ))}
              </div>
              <div className="mt-4 rounded-lg border border-border bg-surface p-4">
                <div className="mb-2 flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Fee collection - this week</span>
                  <span className="font-medium text-success">+18.4%</span>
                </div>
                <div className="flex h-20 items-end gap-1.5">
                  {[40, 55, 38, 72, 60, 88, 95].map((v, i) => (
                    <div data-animate="hero-bar" key={i} className="flex-1 rounded-sm bg-primary" style={{ height: `${v}%`, opacity: 0.3 + v / 200 }} />
                  ))}
                </div>
              </div>
            </div>
            <div data-animate="hero-float" className="absolute -bottom-6 -left-6 hidden w-56 rounded-xl border border-border bg-card p-3 shadow-elevated md:block">
              <div className="flex items-center gap-2">
                <div className="grid h-8 w-8 place-items-center rounded-md bg-success/15 text-success"><Smartphone className="h-4 w-4" /></div>
                <div className="leading-tight">
                  <div className="text-xs text-muted-foreground">M-PESA matched</div>
                  <div className="text-sm font-semibold">KES 12,500 - Grade 4</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="modules" className="mx-auto max-w-7xl px-6 py-20">
        <div className="mb-12 max-w-2xl">
          <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-primary">One platform</div>
          <h2 className="font-display text-3xl font-semibold tracking-tight md:text-4xl">Everything a Kenyan school runs on, in one place.</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[
            { icon: Users, t: "Student Information System", d: "Admissions, NEMIS, guardians, transfers, alumni." },
            { icon: Banknote, t: "Finance & Billing", d: "Fee structures, invoices, statements, defaulters." },
            { icon: Smartphone, t: "M-PESA Reconciliation", d: "STK Push, Paybill matching, unmatched queue." },
            { icon: GraduationCap, t: "Exams & CBC", d: "Marks entry, competencies, rubrics, report cards." },
            { icon: BarChart3, t: "Analytics", d: "Performance, attendance, finance dashboards." },
            { icon: Building2, t: "Multi-campus", d: "Run multiple branches under one tenant." },
          ].map((m) => (
            <div data-animate="section-card" key={m.t} className="rounded-xl border border-border bg-card p-6 transition-shadow hover:shadow-elevated">
              <div className="mb-4 grid h-10 w-10 place-items-center rounded-lg bg-primary-soft text-primary">
                <m.icon className="h-5 w-5" />
              </div>
              <div className="font-display font-semibold">{m.t}</div>
              <p className="mt-1 text-sm text-muted-foreground">{m.d}</p>
            </div>
          ))}
        </div>
      </section>

      <section data-animate="portals" className="border-t border-border bg-surface">
        <div className="mx-auto grid max-w-7xl gap-5 px-6 py-20 md:grid-cols-2">
          <Link data-animate="portal-card" to="/admin" className="group rounded-2xl border border-border bg-card p-8 transition-shadow hover:shadow-elevated">
            <div className="flex items-center justify-between">
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-primary text-primary-foreground"><ShieldCheck className="h-6 w-6" /></div>
              <ArrowRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1" />
            </div>
            <h3 className="mt-6 font-display text-2xl font-semibold">Super Admin SaaS</h3>
            <p className="mt-1.5 text-muted-foreground">Tenant onboarding, subscriptions, MRR, platform analytics, support center.</p>
          </Link>
          <Link data-animate="portal-card" to="/school" className="group rounded-2xl border border-border bg-card p-8 transition-shadow hover:shadow-elevated">
            <div className="flex items-center justify-between">
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-info text-info-foreground"><Building2 className="h-6 w-6" /></div>
              <ArrowRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1" />
            </div>
            <h3 className="mt-6 font-display text-2xl font-semibold">School ERP</h3>
            <p className="mt-1.5 text-muted-foreground">Dashboards for principals, bursars, registrars and teachers. SIS, Finance, M-PESA, Exams, Timetable.</p>
          </Link>
        </div>
      </section>

      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-6 py-8 text-sm text-muted-foreground sm:flex-row">
          <div>© 2026 Shulesoft. Made for Kenyan schools.</div>
          <div className="flex items-center gap-5"><a href="#" className="hover:text-foreground">Privacy</a><a href="#" className="hover:text-foreground">Terms</a><a href="#" className="hover:text-foreground">Status</a></div>
        </div>
      </footer>
    </div>
  );
}
