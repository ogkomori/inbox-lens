import { useState, useEffect } from "react";
import { usePageTitle } from "@/hooks/usePageTitle";
import { useAuth } from "@/context/AuthContext";
import GeometricBackground from "@/components/GeometricBackground";
import DashboardNavigation from "@/components/DashboardNavigation";
import Footer from "@/components/Footer";
import LoadingSpinner from "@/components/LoadingSpinner";

const columns = ["S/N", "Role", "Company", "Status", "Last Updated"];

// Define row type for future use
type ApplicationRow = {
  sn: number;
  role: string;
  company: string;
  status: string;
  updated: string;
};

const aiTiles = [
  { title: "AI Insights", description: "Get personalized tips for your job search." },
  { title: "Resume Suggestions", description: "Optimize your resume with AI feedback." },
  { title: "Market Trends", description: "See which roles are trending now." },
];

const Applications = ({ onContactClick }: { onContactClick: () => void }) => {
  const [rows, setRows] = useState<ApplicationRow[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
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
    // Only show spinner, no nav or footer
    return <LoadingSpinner message="Loading applications..." />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-background relative">
      <GeometricBackground />
      <DashboardNavigation user={{ name: "", email: "", avatar: "" }} />
      <main className="container mx-auto px-2 md:px-4 pt-24 flex flex-col lg:flex-row gap-10 md:gap-20 relative z-10 flex-1">
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
          </div>
        </section>
        {/* AI Tiles Section */}
        <aside className="flex-1 max-w-md flex flex-col gap-6">
          <h2 className="text-2xl font-bold mb-4 text-primary">AI Tools</h2>
          <div className="grid gap-6">
            {aiTiles.map(tile => (
              <div key={tile.title} className="bg-card rounded-xl shadow p-6">
                <h3 className="text-lg font-semibold mb-2 text-foreground">{tile.title}</h3>
                <p className="text-muted-foreground">{tile.description}</p>
              </div>
            ))}
          </div>
        </aside>
      </main>
      <Footer onContactClick={onContactClick} />
    </div>
  );
};

export default Applications;
