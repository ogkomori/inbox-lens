import { useState, useEffect } from "react";
import { usePageTitle } from "@/hooks/usePageTitle";
import { useAuth } from "@/context/AuthContext";
import GeometricBackground from "@/components/GeometricBackground";
import DashboardNavigation from "@/components/DashboardNavigation";

const columns = ["S/N", "Role", "Company", "Status", "Last Updated"];

// const initialRows = [
//   { sn: 1, role: "Software Engineer", company: "Acme Corp", status: "Interviewing", updated: "2025-07-20" },
//   { sn: 2, role: "Product Manager", company: "Globex", status: "Applied", updated: "2025-07-18" },
// ];

const aiTiles = [
  { title: "AI Insights", description: "Get personalized tips for your job search." },
  { title: "Resume Suggestions", description: "Optimize your resume with AI feedback." },
  { title: "Market Trends", description: "See which roles are trending now." },
];

const Applications = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const { loggedIn } = useAuth();
  usePageTitle();

  useEffect(() => {
    // Simulate fetch for demo; replace with real API call
    setTimeout(() => {
      setRows([]); // Replace with fetched data
      setLoading(false);
    }, 1000);
  }, []);

  if (loggedIn === null || loading) {
    // No navbars or dashboard nav on loading
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-primary border-solid mb-4" aria-label="Loading applications"></div>
        <div className="text-lg text-muted-foreground poppins-regular">Loading applications...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative">
      <GeometricBackground />
      <DashboardNavigation user={{ name: "", email: "", avatar: "" }} />
      <main className="container mx-auto px-2 md:px-4 pt-24 flex flex-col lg:flex-row gap-10 md:gap-20 relative z-10">
        {/* Table Section */}
        <section className="flex-1 max-w-4xl">
          <div className="mb-8 flex items-center">
            <a href="/dashboard">
              <button className="bg-primary text-white px-6 py-2 rounded shadow hover:bg-primary/80 transition font-semibold" aria-label="Back to Dashboard">← Back to Dashboard</button>
            </a>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-8 text-foreground poppins-bold">Applications</h1>
          <div className="bg-card rounded-xl shadow p-4 md:p-6">
            <table className="w-full text-left border-collapse mb-4 text-sm md:text-base">
              <thead>
                <tr>
                  {columns.map(col => (
                    <th key={col} className="py-2 px-2 md:px-4 border-b font-semibold text-muted-foreground">{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.length === 0 ? (
                  <tr>
                    <td colSpan={columns.length} className="py-8 px-4 text-center text-muted-foreground">
                      No applications found.
                    </td>
                  </tr>
                ) : (
                  rows.map((row, idx) => (
                    <tr key={idx} className="hover:bg-muted/30">
                      <td className="py-2 px-2 md:px-4 border-b">{row.sn}</td>
                      <td className="py-2 px-2 md:px-4 border-b">{row.role}</td>
                      <td className="py-2 px-2 md:px-4 border-b">{row.company}</td>
                      <td className="py-2 px-2 md:px-4 border-b">{row.status}</td>
                      <td className="py-2 px-2 md:px-4 border-b">{row.updated}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
            {rows.length > 0 && (
              <div className="flex gap-4 justify-end">
                <button className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/80 transition" aria-label="Add Row">Add Row</button>
                <button className="bg-destructive text-white px-4 py-2 rounded hover:bg-destructive/80 transition" aria-label="Delete Row">Delete Row</button>
                <button className="bg-secondary text-foreground px-4 py-2 rounded hover:bg-secondary/80 transition" aria-label="Save">Save</button>
              </div>
            )}
          </div>
        </section>
        {/* AI Insights Section */}
        <aside className="w-full lg:w-[28rem] flex flex-col gap-6 pt-8">
          {aiTiles.map(tile => (
            <div key={tile.title} className="bg-card rounded-xl shadow p-4 md:p-6">
              <h2 className="text-lg md:text-xl font-bold mb-2 text-primary poppins-bold">{tile.title}</h2>
              <p className="text-muted-foreground poppins-regular">{tile.description}</p>
            </div>
          ))}
        </aside>
      </main>
    </div>
  );
};

export default Applications;
