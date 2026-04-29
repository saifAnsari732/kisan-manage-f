import React, { useEffect, useState } from "react";
import api from "../../utils/api";
import { Link } from "react-router-dom";
/* ─── Inline styles as JS objects ─────────────────────────────────────────── */
const S = {
  page: {
    minHeight: "100vh",
    background: "#f5f6fa",
    fontFamily: "'Segoe UI', system-ui, sans-serif",
    padding: "0",
  },
  topBar: {
    background: "linear-gradient(135deg, #0f2942 0%, #1a4a7a 60%, #1e5799 100%)",
    padding: "28px 36px 24px",
    color: "#fff",
  },
  topBarInner: {
    maxWidth: "1100px",
    margin: "0 auto",
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: "16px",
  },
  topBarLeft: {},
  topBarEyebrow: {
    fontSize: "11px",
    fontWeight: "600",
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    color: "#7eb8f7",
    marginBottom: "6px",
  },
  topBarTitle: {
    fontSize: "24px",
    fontWeight: "700",
    margin: "0 0 4px",
    color: "#fff",
  },
  topBarSub: {
    fontSize: "13px",
    color: "#a8c8f0",
    margin: 0,
  },
  statRow: {
    display: "flex",
    gap: "12px",
    flexWrap: "wrap",
  },
  statChip: {
    background: "rgba(255,255,255,0.12)",
    border: "1px solid rgba(255,255,255,0.2)",
    borderRadius: "8px",
    padding: "8px 16px",
    textAlign: "center",
    minWidth: "80px",
  },
  statNum: {
    fontSize: "18px",
    fontWeight: "700",
    color: "#fff",
    display: "block",
  },
  statLabel: {
    fontSize: "11px",
    color: "#a8c8f0",
    display: "block",
  },
  body: {
    maxWidth: "1100px",
    margin: "0 auto",
    padding: "28px 36px",
  },
  toolbar: {
    display: "flex",
    gap: "12px",
    marginBottom: "20px",
    flexWrap: "wrap",
    alignItems: "center",
  },
  searchWrap: {
    position: "relative",
    flex: "1",
    minWidth: "200px",
  },
  searchIcon: {
    position: "absolute",
    left: "12px",
    top: "50%",
    transform: "translateY(-50%)",
    color: "#999",
    fontSize: "14px",
    pointerEvents: "none",
  },
  searchInput: {
    width: "100%",
    paddingLeft: "36px",
    paddingRight: "12px",
    paddingTop: "9px",
    paddingBottom: "9px",
    border: "1px solid #dde1ea",
    borderRadius: "8px",
    fontSize: "13px",
    background: "#fff",
    color: "#1a1a1a",
    outline: "none",
    boxSizing: "border-box",
    fontFamily: "inherit",
  },
  filterSelect: {
    padding: "9px 14px",
    border: "1px solid #dde1ea",
    borderRadius: "8px",
    fontSize: "13px",
    background: "#fff",
    color: "#444",
    outline: "none",
    cursor: "pointer",
    fontFamily: "inherit",
  },
  countBadge: {
    fontSize: "12px",
    color: "#666",
    whiteSpace: "nowrap",
    padding: "0 4px",
  },
  tableCard: {
    background: "#fff",
    borderRadius: "12px",
    border: "1px solid #e4e8f0",
    overflow: "hidden",
    boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  thead: {
    background: "#f8f9fc",
  },
  th: {
    padding: "12px 18px",
    textAlign: "left",
    fontSize: "11px",
    fontWeight: "600",
    color: "#888",
    textTransform: "uppercase",
    letterSpacing: "0.07em",
    borderBottom: "1px solid #edf0f7",
  },
  thCenter: {
    textAlign: "center",
  },
  tr: (i) => ({
    background: i % 2 === 0 ? "#fff" : "#fafbfe",
    transition: "background 0.15s",
  }),
  td: {
    padding: "14px 18px",
    fontSize: "13.5px",
    color: "#2d2d2d",
    borderBottom: "1px solid #f0f2f8",
    verticalAlign: "middle",
  },
  tdCenter: {
    textAlign: "center",
  },
  avatarWrap: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  avatar: (color) => ({
    width: "36px",
    height: "36px",
    borderRadius: "50%",
    background: color,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "12px",
    fontWeight: "700",
    color: "#fff",
    flexShrink: 0,
  }),
  empName: {
    fontWeight: "600",
    fontSize: "13.5px",
    color: "#1a1a2e",
  },
  idPill: {
    fontSize: "11px",
    color: "#1a5799",
    background: "#e8f0fb",
    padding: "2px 7px",
    borderRadius: "20px",
    fontWeight: "600",
    display: "inline-block",
    marginTop: "2px",
  },
  deptBadge: (color, bg) => ({
    display: "inline-block",
    padding: "3px 10px",
    borderRadius: "20px",
    fontSize: "11.5px",
    fontWeight: "600",
    color,
    background: bg,
  }),
  dlBtn: {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    padding: "7px 14px",
    background: "#1a5799",
    color: "#fff",
    border: "none",
    borderRadius: "7px",
    fontSize: "12.5px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "background 0.15s, transform 0.1s",
    fontFamily: "inherit",
  },
  dlBtnLoading: {
    background: "#4a90d9",
    cursor: "not-allowed",
  },
  emptyRow: {
    textAlign: "center",
    padding: "48px",
    color: "#aaa",
    fontSize: "14px",
  },
  loadingWrap: {
    textAlign: "center",
    padding: "60px",
    color: "#888",
    fontSize: "14px",
  },
  errorBanner: {
    background: "#fff5f5",
    border: "1px solid #fcc",
    borderRadius: "8px",
    padding: "12px 16px",
    color: "#a32d2d",
    fontSize: "13px",
    marginBottom: "16px",
  },
};

/* ─── Department color map ─────────────────────────────────────────────────── */
const DEPT_COLORS = {
  Sales:            { text: "#7c3aed", bg: "#f3f0ff" },
  Marketing:        { text: "#b45309", bg: "#fffbeb" },
  Developer:        { text: "#0369a1", bg: "#e0f2fe" },
  "Graphic Designer": { text: "#be185d", bg: "#fdf2f8" },
  Editor:           { text: "#065f46", bg: "#ecfdf5" },
  Telecaller:       { text: "#9a3412", bg: "#fff7ed" },
};

const AVATAR_COLORS = [
  "#1a5799","#7c3aed","#0369a1","#be185d","#065f46","#9a3412","#b45309",
];

function getInitials(name = "") {
  return name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);
}

function getDeptStyle(dept) {
  const c = DEPT_COLORS[dept];
  return c
    ? S.deptBadge(c.text, c.bg)
    : S.deptBadge("#444", "#f0f0f0");
}

/* ─── Component ────────────────────────────────────────────────────────────── */
const HRReportPage = () => {
  const [employees, setEmployees]   = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState("");
  const [search, setSearch]         = useState("");
  const [deptFilter, setDeptFilter] = useState("all");
  const [downloading, setDownloading] = useState({});

  /* fetch */
  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get("/employees");
        setEmployees(data);
      } catch {
        setError("Failed to load employees. Please try again.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  /* filter */
  const filtered = employees.filter((emp) => {
    const matchSearch =
      emp.name.toLowerCase().includes(search.toLowerCase()) ||
      emp.employeeId.toLowerCase().includes(search.toLowerCase());
    const matchDept =
      deptFilter === "all" || emp.department === deptFilter;
    return matchSearch && matchDept;
  });

  /* unique departments */
  const departments = [...new Set(employees.map((e) => e.department))].sort();

  /* stats */
  const deptCounts = employees.reduce((acc, e) => {
    acc[e.department] = (acc[e.department] || 0) + 1;
    return acc;
  }, {});

  /* download */
  const downloadReport = async (id, name) => {
    setDownloading((p) => ({ ...p, [id]: true }));
    try {
      const response = await api.get(`/reports/employee/${id}`, {
        responseType: "blob",
      });
      const url  = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href  = url;
      link.setAttribute("download", `${name.replace(/\s+/g, "_")}_report.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch {
      alert("Download failed. Please try again.");
    } finally {
      setDownloading((p) => ({ ...p, [id]: false }));
    }
  };

  /* ── Render ── */
  return (
    <div style={S.page}>

      {/* Top bar */}
      <div style={S.topBar}>
        <div style={S.topBarInner}>
          <div style={S.topBarLeft}>
            <p style={S.topBarEyebrow}>HR Management</p>
            <h1 style={S.topBarTitle}>Employee Reports</h1>
            <p style={S.topBarSub}>
              {employees.length} total employees across {departments.length} departments
            </p>
          </div>
          <div style={S.statRow}>
            {Object.entries(deptCounts).slice(0, 4).map(([dept, count]) => (
              <div key={dept} style={S.statChip}>
                <span style={S.statNum}>{count}</span>
                <span style={S.statLabel}>{dept}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Body */}
      <div style={S.body}>
        <Link to={'/hr/dashboard'}>  
<h1 className="mb-4 underline font-serif text-lg cursor-pointer  font-semibold">  Back To Dashboard </h1>
       </Link>
        {/* Error */}
        {error && <div style={S.errorBanner}>{error}</div>}

        {/* Toolbar */}
        <div style={S.toolbar}>
          <div style={S.searchWrap}>
            <span style={S.searchIcon}>🔍</span>
            <input
              style={S.searchInput}
              placeholder="Search by name or ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select
            style={S.filterSelect}
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
          >
            <option value="all">All Departments</option>
            {departments.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
          <span style={S.countBadge}>
            {filtered.length} of {employees.length} employees
          </span>
        </div>

        {/* Table */}
        {loading ? (
          <div style={S.loadingWrap}>Loading employees...</div>
        ) : (
          <div style={S.tableCard}>
            <table style={S.table}>
              <thead style={S.thead}>
                <tr>
                  <th style={S.th}>Employee</th>
                  <th style={S.th}>Department</th>
                  <th style={S.th}>Role</th>
                  <th style={S.th}>Headquarters</th>
                  <th style={{ ...S.th, ...S.thCenter }}>Report</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={S.emptyRow}>
                      No employees found matching your search.
                    </td>
                  </tr>
                ) : (
                  filtered.map((emp, i) => {
                    const avatarColor = AVATAR_COLORS[i % AVATAR_COLORS.length];
                    const isLoading   = downloading[emp._id];
                    return (
                      <tr
                        key={emp._id}
                        style={S.tr(i)}
                        onMouseEnter={(e) => (e.currentTarget.style.background = "#f0f5ff")}
                        onMouseLeave={(e) => (e.currentTarget.style.background = S.tr(i).background)}
                      >
                        {/* Employee */}
                        <td style={S.td}>
                          <div style={S.avatarWrap}>
                            <div style={S.avatar(avatarColor)}>
                              {getInitials(emp.name)}
                            </div>
                            <div>
                              <div style={S.empName}>{emp.name}</div>
                              <span style={S.idPill}>{emp.employeeId}</span>
                            </div>
                          </div>
                        </td>

                        {/* Department */}
                        <td style={S.td}>
                          <span style={getDeptStyle(emp.department)}>
                            {emp.department}
                          </span>
                        </td>

                        {/* Role */}
                        <td style={{ ...S.td, color: "#555", fontSize: "13px" }}>
                          {emp.role || "—"}
                        </td>

                        {/* HQ */}
                        <td style={{ ...S.td, color: "#555", fontSize: "13px" }}>
                          {emp.headQuarter || "—"}
                        </td>

                        {/* Download */}
                        <td style={{ ...S.td, ...S.tdCenter }}>
                          <button
                            style={isLoading ? { ...S.dlBtn, ...S.dlBtnLoading } : S.dlBtn}
                            disabled={isLoading}
                            onClick={() => downloadReport(emp._id, emp.name)}
                            onMouseEnter={(e) => { if (!isLoading) e.currentTarget.style.background = "#0f3d6e"; }}
                            onMouseLeave={(e) => { if (!isLoading) e.currentTarget.style.background = "#1a5799"; }}
                          >
                            {isLoading ? (
                              <>⏳ Generating...</>
                            ) : (
                              <>
                                <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
                                  <path d="M8 2v8M5 7l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                  <path d="M3 13h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                                </svg>
                                Download PDF
                              </>
                            )}
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default HRReportPage;