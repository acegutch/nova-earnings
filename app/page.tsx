"use client";

import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  BarChart,
  Bar,
} from "recharts";
import {
  Bell,
  Briefcase,
  Building2,
  Calendar,
  ChevronDown,
  CircleDollarSign,
  ClipboardList,
  DollarSign,
  Filter,
  Gauge,
  Gift,
  Home,
  LayoutDashboard,
  Link as LinkIcon,
  Search,
  Settings,
  Shield,
  Sparkles,
  Trophy,
  Users,
} from "lucide-react";

const cx = (...c) => c.filter(Boolean).join(" ");

const roles = [
  { key: "setter", label: "Appointment Setter" },
  { key: "closer", label: "Closer" },
  { key: "manager", label: "Manager" },
  { key: "ops", label: "Ops" },
  { key: "admin", label: "Admin" },
  { key: "customer", label: "Customer" },
  { key: "partner", label: "Referral Partner" },
];

const brands = [
  { key: "solar", label: "Nova NRG Solar" },
  { key: "roofing", label: "Nova NRG Roofing" },
];

const stages = [
  "Lead",
  "Appt Set",
  "Sit Completed",
  "Closed",
  "Site Survey",
  "Permitting",
  "Install Scheduled",
  "Installed",
  "PTO",
  "Activated",
];

const seedDeals = [
  {
    id: "OPP-10428",
    customer: "John McCubbin",
    city: "Miami",
    state: "FL",
    brand: "solar",
    stage: "Permitting",
    status: "Active",
    kw: 12.3,
    contractValue: 44144.7,
    adders: 1250,
    commissionPending: 650,
    commissionLocked: 0,
    commissionPaid: 1200,
    expectedNextPay: "Jan 05",
    blocks: ["Permit docs missing"],
  },
  {
    id: "OPP-10702",
    customer: "Maria Santos",
    city: "Orlando",
    state: "FL",
    brand: "solar",
    stage: "Install Scheduled",
    status: "Active",
    kw: 9.9,
    contractValue: 31200,
    adders: 0,
    commissionPending: 0,
    commissionLocked: 950,
    commissionPaid: 0,
    expectedNextPay: "Dec 27",
    blocks: [],
  },
  {
    id: "OPP-11011",
    customer: "Chris Bailey",
    city: "Tampa",
    state: "FL",
    brand: "roofing",
    stage: "Closed",
    status: "On Hold",
    kw: null,
    contractValue: 18500,
    adders: 0,
    commissionPending: 300,
    commissionLocked: 0,
    commissionPaid: 0,
    expectedNextPay: "—",
    blocks: ["Financing pending"],
  },
];

const seedTimeline = [
  { at: "Dec 10", title: "Closed", detail: "Contract signed" },
  { at: "Dec 12", title: "Site Survey", detail: "Survey scheduled" },
  { at: "Dec 15", title: "Permitting", detail: "Permit packet started" },
  { at: "Dec 16", title: "Blocked", detail: "Permit docs missing" },
];

const seedPayouts = [
  { period: "Nov 18–Nov 24", total: 1420, status: "PAID" },
  { period: "Nov 25–Dec 01", total: 980, status: "PAID" },
  { period: "Dec 02–Dec 08", total: 650, status: "PENDING" },
];

const seedReferrals = [
  {
    id: "REF-0012",
    name: "Alex Rivera",
    status: "Qualified",
    earnings: 50,
    lastUpdate: "Dec 14",
  },
  {
    id: "REF-0015",
    name: "Jamie Lee",
    status: "Install",
    earnings: 250,
    lastUpdate: "Dec 16",
  },
  {
    id: "REF-0018",
    name: "Pat Gomez",
    status: "Submitted",
    earnings: 0,
    lastUpdate: "Dec 10",
  },
];

const monthlyTrend = [
  { m: "Aug", pending: 1200, locked: 2600, paid: 3100 },
  { m: "Sep", pending: 900, locked: 2400, paid: 3500 },
  { m: "Oct", pending: 1500, locked: 2100, paid: 3300 },
  { m: "Nov", pending: 1100, locked: 2800, paid: 3700 },
  { m: "Dec", pending: 1700, locked: 2300, paid: 2900 },
];

const leaderboard = [
  { name: "Maria S.", points: 6, earnings: 750 },
  { name: "John M.", points: 5, earnings: 650 },
  { name: "Chris B.", points: 4, earnings: 500 },
  { name: "Jamie L.", points: 3, earnings: 350 },
];

function Pill({ children, tone = "neutral" }) {
  const tones = {
    neutral: "bg-zinc-100 text-zinc-700",
    good: "bg-emerald-100 text-emerald-700",
    warn: "bg-amber-100 text-amber-700",
    bad: "bg-rose-100 text-rose-700",
    info: "bg-sky-100 text-sky-700",
  };
  return (
    <span
      className={cx(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium",
        tones[tone] || tones.neutral
      )}
    >
      {children}
    </span>
  );
}

function Card({ title, icon: Icon, right, children }) {
  return (
    <div className="rounded-2xl bg-white shadow-sm ring-1 ring-zinc-200">
      <div className="flex items-center justify-between border-b border-zinc-100 px-4 py-3">
        <div className="flex items-center gap-2">
          {Icon ? (
            <div className="grid h-8 w-8 place-items-center rounded-xl bg-zinc-100">
              <Icon className="h-4 w-4 text-zinc-700" />
            </div>
          ) : null}
          <div className="text-sm font-semibold text-zinc-900">{title}</div>
        </div>
        {right}
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}

function Stat({ label, value, sub, tone = "neutral", icon: Icon }) {
  const tones = {
    neutral: "bg-zinc-50",
    good: "bg-emerald-50",
    warn: "bg-amber-50",
    bad: "bg-rose-50",
    info: "bg-sky-50",
  };
  return (
    <div className={cx("rounded-2xl p-4 ring-1 ring-zinc-200", tones[tone])}>
      <div className="flex items-center justify-between">
        <div className="text-xs font-medium text-zinc-600">{label}</div>
        {Icon ? (
          <div className="grid h-9 w-9 place-items-center rounded-2xl bg-white ring-1 ring-zinc-200">
            <Icon className="h-4 w-4 text-zinc-700" />
          </div>
        ) : null}
      </div>
      <div className="mt-2 text-2xl font-semibold text-zinc-900">{value}</div>
      {sub ? <div className="mt-1 text-xs text-zinc-600">{sub}</div> : null}
    </div>
  );
}

function Sidebar({ view, setView, role }) {
  const items = useMemo(() => {
    if (role === "customer" || role === "partner") {
      return [
        { key: "home", label: "Home", icon: Home },
        { key: "referrals", label: "My Referrals", icon: Gift },
        { key: "leaderboard", label: "Leaderboard", icon: Trophy },
        { key: "payouts", label: "Payouts", icon: CircleDollarSign },
        { key: "settings", label: "Settings", icon: Settings },
      ];
    }
    return [
      { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
      { key: "pipeline", label: "Pipeline", icon: Gauge },
      { key: "payouts", label: "Payout Schedule", icon: DollarSign },
      { key: "advances", label: "Advances", icon: Briefcase },
      { key: "approvals", label: "Approvals", icon: Shield },
      { key: "settings", label: "Settings", icon: Settings },
    ];
  }, [role]);

  return (
    <div className="h-full w-full rounded-3xl bg-white shadow-sm ring-1 ring-zinc-200">
      <div className="flex items-center gap-2 border-b border-zinc-100 px-4 py-4">
        <div className="grid h-10 w-10 place-items-center rounded-2xl bg-zinc-900">
          <Sparkles className="h-5 w-5 text-white" />
        </div>
        <div>
          <div className="text-sm font-semibold text-zinc-900">Nova Earnings</div>
          <div className="text-xs text-zinc-600">Commission and Referrals</div>
        </div>
      </div>

      <div className="p-2">
        {items.map((it) => (
          <button
            key={it.key}
            onClick={() => setView(it.key)}
            className={cx(
              "flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-left text-sm transition",
              view === it.key
                ? "bg-zinc-900 text-white"
                : "text-zinc-700 hover:bg-zinc-100"
            )}
          >
            <it.icon className={cx("h-4 w-4", view === it.key ? "text-white" : "text-zinc-700")} />
            <span className="font-medium">{it.label}</span>
          </button>
        ))}
      </div>

      <div className="px-4 pb-4">
        <div className="mt-2 rounded-2xl bg-zinc-50 p-3 ring-1 ring-zinc-200">
          <div className="text-xs font-medium text-zinc-700">Need help?</div>
          <div className="mt-1 text-xs text-zinc-600">
            Add a support link here for internal users and customers.
          </div>
        </div>
      </div>
    </div>
  );
}

function Topbar({ role, setRole, brand, setBrand }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div>
        <div className="text-xl font-semibold text-zinc-900">Welcome back</div>
        <div className="text-sm text-zinc-600">See pipeline progress, commissions, and referrals in one place.</div>
      </div>

      <div className="flex items-center gap-2">
        <div className="hidden md:flex items-center gap-2 rounded-2xl bg-white px-3 py-2 shadow-sm ring-1 ring-zinc-200">
          <Search className="h-4 w-4 text-zinc-500" />
          <input
            className="w-56 bg-transparent text-sm outline-none placeholder:text-zinc-400"
            placeholder="Search customer, opp ID, referral"
          />
        </div>

        <button className="grid h-10 w-10 place-items-center rounded-2xl bg-white shadow-sm ring-1 ring-zinc-200 hover:bg-zinc-50">
          <Bell className="h-4 w-4 text-zinc-700" />
        </button>

        <div className="relative">
          <select
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            className="h-10 rounded-2xl bg-white px-3 text-sm shadow-sm ring-1 ring-zinc-200 outline-none"
          >
            {brands.map((b) => (
              <option key={b.key} value={b.key}>
                {b.label}
              </option>
            ))}
          </select>
        </div>

        <div className="relative">
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="h-10 rounded-2xl bg-white px-3 text-sm shadow-sm ring-1 ring-zinc-200 outline-none"
          >
            {roles.map((r) => (
              <option key={r.key} value={r.key}>
                {r.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}

function DealsTable({ deals, onSelect, selectedId }) {
  return (
    <div className="overflow-hidden rounded-2xl ring-1 ring-zinc-200">
      <div className="flex items-center justify-between bg-white px-4 py-3">
        <div className="text-sm font-semibold text-zinc-900">Deals</div>
        <div className="flex items-center gap-2">
          <button className="inline-flex items-center gap-2 rounded-xl bg-zinc-100 px-3 py-2 text-xs font-medium text-zinc-700 hover:bg-zinc-200">
            <Filter className="h-3.5 w-3.5" />
            Filters
          </button>
          <button className="inline-flex items-center gap-2 rounded-xl bg-zinc-900 px-3 py-2 text-xs font-medium text-white hover:bg-zinc-800">
            <ClipboardList className="h-3.5 w-3.5" />
            Export
          </button>
        </div>
      </div>
      <div className="divide-y divide-zinc-100 bg-white">
        {deals.map((d) => (
          <button
            key={d.id}
            onClick={() => onSelect(d.id)}
            className={cx(
              "grid w-full grid-cols-12 items-center gap-3 px-4 py-3 text-left text-sm hover:bg-zinc-50",
              selectedId === d.id ? "bg-zinc-50" : ""
            )}
          >
            <div className="col-span-3">
              <div className="font-semibold text-zinc-900">{d.customer}</div>
              <div className="text-xs text-zinc-600">{d.id}</div>
            </div>
            <div className="col-span-2 text-zinc-700">
              {d.city}, {d.state}
            </div>
            <div className="col-span-2">
              <Pill tone={d.status === "Active" ? "good" : d.status === "On Hold" ? "warn" : "bad"}>
                {d.status}
              </Pill>
            </div>
            <div className="col-span-2">
              <div className="text-zinc-900 font-medium">{d.stage}</div>
              {d.blocks?.length ? (
                <div className="text-xs text-rose-600">Blocked</div>
              ) : (
                <div className="text-xs text-zinc-500">On track</div>
              )}
            </div>
            <div className="col-span-3 flex items-center justify-end gap-2">
              <Pill tone={d.commissionLocked > 0 ? "info" : "neutral"}>Locked ${d.commissionLocked}</Pill>
              <Pill tone={d.commissionPending > 0 ? "warn" : "neutral"}>Pending ${d.commissionPending}</Pill>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function StageStepper({ current }) {
  const idx = stages.indexOf(current);
  return (
    <div className="rounded-2xl bg-white p-4 ring-1 ring-zinc-200">
      <div className="text-sm font-semibold text-zinc-900">Stage progress</div>
      <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
        {stages.map((s, i) => {
          const done = i < idx;
          const now = i === idx;
          return (
            <div
              key={s}
              className={cx(
                "rounded-2xl px-3 py-2 ring-1",
                done
                  ? "bg-emerald-50 ring-emerald-200"
                  : now
                  ? "bg-sky-50 ring-sky-200"
                  : "bg-zinc-50 ring-zinc-200"
              )}
            >
              <div className="text-xs font-semibold text-zinc-900">{s}</div>
              <div className={cx("mt-1 text-[11px]", done ? "text-emerald-700" : now ? "text-sky-700" : "text-zinc-600")}>
                {done ? "Complete" : now ? "Current" : "Upcoming"}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Timeline({ items }) {
  return (
    <div className="rounded-2xl bg-white p-4 ring-1 ring-zinc-200">
      <div className="text-sm font-semibold text-zinc-900">Timeline</div>
      <div className="mt-4 space-y-3">
        {items.map((it, idx) => (
          <div key={idx} className="flex items-start gap-3">
            <div className="mt-1 h-2.5 w-2.5 rounded-full bg-zinc-900" />
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div className="text-sm font-semibold text-zinc-900">{it.title}</div>
                <div className="text-xs text-zinc-500">{it.at}</div>
              </div>
              <div className="text-xs text-zinc-600">{it.detail}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ReferralLinkCard() {
  return (
    <div className="rounded-2xl bg-white p-4 ring-1 ring-zinc-200">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm font-semibold text-zinc-900">Your referral link</div>
          <div className="text-xs text-zinc-600">Share and track your earnings.</div>
        </div>
        <Pill tone="info">Active</Pill>
      </div>
      <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center">
        <div className="flex-1 rounded-2xl bg-zinc-50 px-3 py-2 text-xs text-zinc-700 ring-1 ring-zinc-200">
          https://yourdomain.com/r/ABC123
        </div>
        <button className="inline-flex items-center justify-center gap-2 rounded-2xl bg-zinc-900 px-4 py-2 text-xs font-semibold text-white hover:bg-zinc-800">
          <LinkIcon className="h-3.5 w-3.5" />
          Copy
        </button>
      </div>
      <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-3">
        <Stat label="Submitted" value="3" sub="This month" icon={Users} />
        <Stat label="Installs" value="1" sub="This month" tone="good" icon={Building2} />
        <Stat label="Earnings" value="$300" sub="Pending + paid" tone="info" icon={CircleDollarSign} />
      </div>
    </div>
  );
}

function LeaderboardCard() {
  return (
    <Card
      title="Leaderboard"
      icon={Trophy}
      right={<Pill tone="neutral">Monthly</Pill>}
    >
      <div className="space-y-3">
        {leaderboard.map((row, i) => (
          <div key={row.name} className="flex items-center justify-between rounded-2xl bg-zinc-50 px-3 py-2 ring-1 ring-zinc-200">
            <div className="flex items-center gap-3">
              <div className="grid h-9 w-9 place-items-center rounded-2xl bg-white ring-1 ring-zinc-200 text-sm font-semibold text-zinc-900">
                {i + 1}
              </div>
              <div>
                <div className="text-sm font-semibold text-zinc-900">{row.name}</div>
                <div className="text-xs text-zinc-600">{row.points} conversions</div>
              </div>
            </div>
            <div className="text-sm font-semibold text-zinc-900">${row.earnings}</div>
          </div>
        ))}
      </div>
    </Card>
  );
}

function App() {
  const [role, setRole] = useState("closer");
  const [brand, setBrand] = useState("solar");
  const [view, setView] = useState("dashboard");
  const [selected, setSelected] = useState(seedDeals[0].id);

  const deals = useMemo(() => seedDeals.filter((d) => d.brand === brand), [brand]);
  const active = useMemo(() => deals.find((d) => d.id === selected) || deals[0], [deals, selected]);

  const totals = useMemo(() => {
    const sum = (k) => deals.reduce((a, d) => a + (d[k] || 0), 0);
    return {
      pending: sum("commissionPending"),
      locked: sum("commissionLocked"),
      paid: sum("commissionPaid"),
      cv: deals.reduce((a, d) => a + (d.contractValue || 0), 0),
    };
  }, [deals]);

  const isExternal = role === "customer" || role === "partner";

  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="mx-auto max-w-7xl px-4 py-6">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
          <div className="lg:col-span-3">
            <Sidebar view={view} setView={setView} role={role} />
          </div>

          <div className="lg:col-span-9">
            <Topbar role={role} setRole={setRole} brand={brand} setBrand={setBrand} />

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className="mt-4 space-y-4"
            >
              {/* Dashboard */}
              {view === "dashboard" && !isExternal && (
                <>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    <Stat label="Pending" value={`$${totals.pending}`} sub="Not locked yet" tone="warn" icon={Calendar} />
                    <Stat label="Locked" value={`$${totals.locked}`} sub="Eligible soon" tone="info" icon={Shield} />
                    <Stat label="Paid" value={`$${totals.paid}`} sub="Lifetime" tone="good" icon={DollarSign} />
                    <Stat label="Contract Value" value={`$${Math.round(totals.cv)}`} sub="This brand" icon={Building2} />
                  </div>

                  <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                    <Card title="Earnings trend" icon={CircleDollarSign} right={<Pill tone="neutral">Last 5 months</Pill>}>
                      <div className="h-56">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={monthlyTrend} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="m" />
                            <YAxis />
                            <Tooltip />
                            <Line type="monotone" dataKey="pending" strokeWidth={2} dot={false} />
                            <Line type="monotone" dataKey="locked" strokeWidth={2} dot={false} />
                            <Line type="monotone" dataKey="paid" strokeWidth={2} dot={false} />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </Card>

                    <Card title="Deal stage mix" icon={Gauge} right={<Pill tone="neutral">This week</Pill>}>
                      <div className="h-56">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={stages
                              .slice(0, 7)
                              .map((s) => ({
                                stage: s,
                                count: deals.filter((d) => d.stage === s).length,
                              }))}
                            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="stage" hide />
                            <YAxis allowDecimals={false} />
                            <Tooltip />
                            <Bar dataKey="count" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {stages.slice(0, 7).map((s) => (
                          <Pill key={s} tone="neutral">
                            {s}: {deals.filter((d) => d.stage === s).length}
                          </Pill>
                        ))}
                      </div>
                    </Card>
                  </div>

                  <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                    <DealsTable deals={deals} onSelect={setSelected} selectedId={active?.id} />
                    <div className="space-y-4">
                      <StageStepper current={active?.stage || "Lead"} />
                      <Timeline items={seedTimeline} />
                    </div>
                  </div>
                </>
              )}

              {/* Pipeline */}
              {view === "pipeline" && !isExternal && (
                <>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    <Stat label="Active deals" value={`${deals.filter((d) => d.status === "Active").length}`} sub="In progress" icon={ClipboardList} />
                    <Stat label="Blocked" value={`${deals.filter((d) => (d.blocks || []).length).length}`} sub="Needs action" tone="bad" icon={Shield} />
                    <Stat label="Next expected pay" value={active?.expectedNextPay || "—"} sub={active ? active.customer : "—"} tone="info" icon={Calendar} />
                    <Stat label="Avg KW" value={deals.filter((d) => d.kw).length ? (deals.reduce((a, d) => a + (d.kw || 0), 0) / deals.filter((d) => d.kw).length).toFixed(1) : "—"} sub="Solar only" icon={Gauge} />
                  </div>
                  <DealsTable deals={deals} onSelect={setSelected} selectedId={active?.id} />
                  <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                    <Card title="Deal details" icon={Building2}>
                      {active ? (
                        <div className="space-y-3">
                          <div className="flex flex-wrap items-center gap-2">
                            <Pill tone="neutral">{active.id}</Pill>
                            <Pill tone={active.status === "Active" ? "good" : active.status === "On Hold" ? "warn" : "bad"}>{active.status}</Pill>
                            <Pill tone="info">{active.stage}</Pill>
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <div className="rounded-2xl bg-zinc-50 p-3 ring-1 ring-zinc-200">
                              <div className="text-xs text-zinc-600">Contract value</div>
                              <div className="text-lg font-semibold text-zinc-900">${active.contractValue}</div>
                            </div>
                            <div className="rounded-2xl bg-zinc-50 p-3 ring-1 ring-zinc-200">
                              <div className="text-xs text-zinc-600">Adders</div>
                              <div className="text-lg font-semibold text-zinc-900">${active.adders}</div>
                            </div>
                            <div className="rounded-2xl bg-zinc-50 p-3 ring-1 ring-zinc-200">
                              <div className="text-xs text-zinc-600">Pending</div>
                              <div className="text-lg font-semibold text-zinc-900">${active.commissionPending}</div>
                            </div>
                            <div className="rounded-2xl bg-zinc-50 p-3 ring-1 ring-zinc-200">
                              <div className="text-xs text-zinc-600">Locked</div>
                              <div className="text-lg font-semibold text-zinc-900">${active.commissionLocked}</div>
                            </div>
                          </div>

                          {(active.blocks || []).length ? (
                            <div className="rounded-2xl bg-rose-50 p-3 ring-1 ring-rose-200">
                              <div className="text-xs font-semibold text-rose-800">Blocked items</div>
                              <ul className="mt-1 list-disc pl-5 text-xs text-rose-700">
                                {active.blocks.map((b, i) => (
                                  <li key={i}>{b}</li>
                                ))}
                              </ul>
                            </div>
                          ) : (
                            <div className="rounded-2xl bg-emerald-50 p-3 ring-1 ring-emerald-200">
                              <div className="text-xs font-semibold text-emerald-800">No blockers</div>
                              <div className="mt-1 text-xs text-emerald-700">This deal is moving forward.</div>
                            </div>
                          )}
                        </div>
                      ) : null}
                    </Card>

                    <div className="space-y-4">
                      <StageStepper current={active?.stage || "Lead"} />
                      <Timeline items={seedTimeline} />
                    </div>
                  </div>
                </>
              )}

              {/* Payout schedule */}
              {view === "payouts" && !isExternal && (
                <>
                  <Card title="Payout schedule" icon={DollarSign} right={<Pill tone="neutral">Weekly</Pill>}>
                    <div className="space-y-3">
                      {seedPayouts.map((p) => (
                        <div key={p.period} className="flex items-center justify-between rounded-2xl bg-zinc-50 px-3 py-3 ring-1 ring-zinc-200">
                          <div>
                            <div className="text-sm font-semibold text-zinc-900">{p.period}</div>
                            <div className="text-xs text-zinc-600">Direct deposit</div>
                          </div>
                          <div className="flex items-center gap-3">
                            <Pill tone={p.status === "PAID" ? "good" : "warn"}>{p.status}</Pill>
                            <div className="text-sm font-semibold text-zinc-900">${p.total}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>

                  <Card title="What got paid" icon={ClipboardList}>
                    <div className="rounded-2xl bg-zinc-50 p-3 ring-1 ring-zinc-200">
                      <div className="text-xs text-zinc-600">Replace this with payout line items tied to deals and ledger entries.</div>
                      <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-3">
                        <Pill tone="info">Commission P2</Pill>
                        <Pill tone="neutral">Adders</Pill>
                        <Pill tone="bad">Advance deduction</Pill>
                      </div>
                    </div>
                  </Card>
                </>
              )}

              {/* Advances */}
              {view === "advances" && !isExternal && (
                <>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                    <Stat label="Advance balance" value="$1,250" sub="Outstanding" tone="warn" icon={Briefcase} />
                    <Stat label="Next deduction" value="$150" sub="On next payout" tone="info" icon={DollarSign} />
                    <Stat label="YTD advances" value="$4,000" sub="Issued" icon={CircleDollarSign} />
                  </div>
                  <Card title="Advance history" icon={Briefcase}>
                    <div className="space-y-3">
                      {[
                        { at: "Dec 05", desc: "Advance issued", amt: 500 },
                        { at: "Dec 08", desc: "Deduction", amt: -150 },
                        { at: "Dec 12", desc: "Advance issued", amt: 750 },
                      ].map((r, i) => (
                        <div key={i} className="flex items-center justify-between rounded-2xl bg-zinc-50 px-3 py-3 ring-1 ring-zinc-200">
                          <div>
                            <div className="text-sm font-semibold text-zinc-900">{r.desc}</div>
                            <div className="text-xs text-zinc-600">{r.at}</div>
                          </div>
                          <div className={cx("text-sm font-semibold", r.amt < 0 ? "text-rose-700" : "text-zinc-900")}>{r.amt < 0 ? `-$${Math.abs(r.amt)}` : `$${r.amt}`}</div>
                        </div>
                      ))}
                    </div>
                  </Card>
                </>
              )}

              {/* Approvals */}
              {view === "approvals" && !isExternal && (
                <>
                  <Card title="Approvals" icon={Shield} right={<Pill tone="warn">Admin only</Pill>}>
                    <div className="rounded-2xl bg-zinc-50 p-3 ring-1 ring-zinc-200">
                      <div className="text-sm font-semibold text-zinc-900">Queue</div>
                      <div className="mt-1 text-xs text-zinc-600">
                        This is where Ops or Admin approves adjustments, chargebacks, and manual overrides.
                      </div>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <Pill tone="warn">Adjustment pending</Pill>
                        <Pill tone="bad">Chargeback review</Pill>
                        <Pill tone="info">Plan version change</Pill>
                      </div>
                    </div>
                  </Card>
                </>
              )}

              {/* External portal */}
              {isExternal && (view === "home" || view === "referrals" || view === "leaderboard" || view === "payouts") && (
                <>
                  {view === "home" && (
                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                      <div className="lg:col-span-2 space-y-4">
                        <ReferralLinkCard />
                        <Card title="My referrals" icon={Gift} right={<Pill tone="neutral">Recent</Pill>}>
                          <div className="space-y-3">
                            {seedReferrals.map((r) => (
                              <div key={r.id} className="flex items-center justify-between rounded-2xl bg-zinc-50 px-3 py-3 ring-1 ring-zinc-200">
                                <div>
                                  <div className="text-sm font-semibold text-zinc-900">{r.name}</div>
                                  <div className="text-xs text-zinc-600">{r.id} • Updated {r.lastUpdate}</div>
                                </div>
                                <div className="flex items-center gap-3">
                                  <Pill tone={r.status === "Install" ? "good" : r.status === "Qualified" ? "info" : "neutral"}>{r.status}</Pill>
                                  <div className="text-sm font-semibold text-zinc-900">${r.earnings}</div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </Card>
                      </div>
                      <div className="space-y-4">
                        <LeaderboardCard />
                        <Card title="How payouts work" icon={CircleDollarSign}>
                          <div className="text-sm text-zinc-700">
                            Replace this with your real rules, such as paid at install or PTO.
                          </div>
                          <div className="mt-3 grid grid-cols-1 gap-2">
                            <Pill tone="neutral">Submitted → Qualified</Pill>
                            <Pill tone="neutral">Qualified → Install</Pill>
                            <Pill tone="good">Install → Paid</Pill>
                          </div>
                        </Card>
                      </div>
                    </div>
                  )}

                  {view === "referrals" && (
                    <>
                      <ReferralLinkCard />
                      <Card title="Referral status tracker" icon={Gift}>
                        <div className="space-y-3">
                          {seedReferrals.map((r) => (
                            <div key={r.id} className="rounded-2xl bg-zinc-50 p-3 ring-1 ring-zinc-200">
                              <div className="flex items-center justify-between">
                                <div>
                                  <div className="text-sm font-semibold text-zinc-900">{r.name}</div>
                                  <div className="text-xs text-zinc-600">{r.id} • Updated {r.lastUpdate}</div>
                                </div>
                                <Pill tone={r.status === "Install" ? "good" : r.status === "Qualified" ? "info" : "neutral"}>{r.status}</Pill>
                              </div>
                              <div className="mt-2 flex flex-wrap items-center gap-2">
                                {["Submitted", "Qualified", "Appt", "Install", "Paid"].map((s) => {
                                  const order = ["Submitted", "Qualified", "Appt", "Install", "Paid"];
                                  const done = order.indexOf(s) <= order.indexOf(r.status);
                                  return (
                                    <Pill key={s} tone={done ? "good" : "neutral"}>
                                      {s}
                                    </Pill>
                                  );
                                })}
                                <div className="ml-auto text-sm font-semibold text-zinc-900">${r.earnings}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </Card>
                    </>
                  )}

                  {view === "leaderboard" && (
                    <>
                      <LeaderboardCard />
                    </>
                  )}

                  {view === "payouts" && (
                    <>
                      <Card title="Payouts" icon={CircleDollarSign} right={<Pill tone="neutral">History</Pill>}>
                        <div className="space-y-3">
                          {[
                            { at: "Dec 01", amount: 250, status: "PAID" },
                            { at: "Dec 15", amount: 50, status: "PENDING" },
                          ].map((p, i) => (
                            <div key={i} className="flex items-center justify-between rounded-2xl bg-zinc-50 px-3 py-3 ring-1 ring-zinc-200">
                              <div>
                                <div className="text-sm font-semibold text-zinc-900">{p.at}</div>
                                <div className="text-xs text-zinc-600">Referral payout</div>
                              </div>
                              <div className="flex items-center gap-3">
                                <Pill tone={p.status === "PAID" ? "good" : "warn"}>{p.status}</Pill>
                                <div className="text-sm font-semibold text-zinc-900">${p.amount}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </Card>
                    </>
                  )}
                </>
              )}

              {/* Settings */}
              {view === "settings" && (
                <Card title="Settings" icon={Settings}>
                  <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                    <div className="rounded-2xl bg-zinc-50 p-4 ring-1 ring-zinc-200">
                      <div className="text-sm font-semibold text-zinc-900">Account</div>
                      <div className="mt-2 text-sm text-zinc-700">Profile, password, notification preferences.</div>
                    </div>
                    <div className="rounded-2xl bg-zinc-50 p-4 ring-1 ring-zinc-200">
                      <div className="text-sm font-semibold text-zinc-900">Permissions</div>
                      <div className="mt-2 text-sm text-zinc-700">Brand access and role-based visibility controls.</div>
                    </div>
                    <div className="rounded-2xl bg-zinc-50 p-4 ring-1 ring-zinc-200">
                      <div className="text-sm font-semibold text-zinc-900">Integrations</div>
                      <div className="mt-2 text-sm text-zinc-700">GHL sync, Sheets import, SMS provider.</div>
                    </div>
                    <div className="rounded-2xl bg-zinc-50 p-4 ring-1 ring-zinc-200">
                      <div className="text-sm font-semibold text-zinc-900">Brands</div>
                      <div className="mt-2 text-sm text-zinc-700">Solar, Roofing, future lines of business.</div>
                    </div>
                  </div>
                </Card>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
