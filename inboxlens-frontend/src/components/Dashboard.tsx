import DashboardNavigation from "@/components/DashboardNavigation";
import GeometricBackground from "@/components/GeometricBackground";
import { CheckSquare, Target, Clock, Mail } from "lucide-react";
import Footer from "@/components/Footer";


import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchDashboardDetails } from "../lib/profileApi";


const Dashboard = () => {
  const navigate = useNavigate();
  const [details, setDetails] = useState<{
    name: string;
    email: string;
    toDoList: number;
    trackables: number;
    digests: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardDetails()
      .then(setDetails)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-primary border-solid mb-6" aria-label="Loading user info"></div>
        <div className="text-lg text-muted-foreground font-semibold">Loading dashboard...</div>
      </div>
    );
  }
  if (error || !details) {
    return <div className="text-red-500 p-8">Failed to load dashboard details: {error}</div>;
  }
  return (
    <div className="flex flex-col min-h-screen relative">
      <DashboardNavigation user={{ name: details.name, avatar: "", email: details.email }} />
  <main className="flex-1 flex flex-col items-center justify-start px-4 py-4 w-full pt-28 pb-20 relative z-10">
        {/* Welcome + Stats Grid Row */}
        <div className="w-full max-w-6xl mb-14 flex flex-col items-start">
          <div className="mb-10 w-full lg:w-auto text-left">
            <h1 className="text-4xl font-bold mb-2 text-foreground">
              Welcome back{details.name ? `, ${details.name}` : ""}!
            </h1>
            <p className="text-muted-foreground text-lg">Here's a quick look at your dashboard today.</p>
          </div>
          <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-8">
            <StatCard
              icon={<CheckSquare className="w-7 h-7 text-primary" />}
              label="To-Do List"
              value={details.toDoList.toString()}
              subtext={<><span>incomplete tasks</span><br /><br /><span className="font-medium text-white">Click to view or edit your to-do list</span></>}
              onClick={() => navigate('/todo')}
            />
            <StatCard
              icon={<Target className="w-7 h-7 text-primary" />}
              label="Tracking"
              value={details.trackables.toString()}
              subtext={<><span>items to keep track of</span><br /><br /><span className="font-medium text-white">Click to view what you're tracking</span></>}
              onClick={() => navigate('/trackables')}
            />
            <StatCard
              icon={<Mail className="w-7 h-7 text-primary" />}
              label="Digests"
              value={details.digests?.toString() || "0"}
              subtext={<><span>days covered</span><br /><br /><span className="font-medium text-white">Click to customize your digests</span></>}
              onClick={() => navigate('/digests')}
            />
          </div>
        </div>
      </main>
  <Footer fixed />
    </div>
  );
}
function StatCard({ icon, label, value, subtext, onClick }: { icon: React.ReactNode; label: string; value: string; subtext: React.ReactNode; onClick?: () => void }) {
  return (
    <button
      className="bg-white dark:bg-black border border-border rounded-2xl px-12 py-10 flex flex-col gap-4 shadow-lg min-h-[180px] w-full transition hover:scale-[1.03] hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
      onClick={onClick}
      tabIndex={0}
      aria-label={`View details for ${label}`}
    >
      <div className="flex items-center gap-5 mb-4">{icon}<span className="text-2xl font-bold text-foreground">{label}</span></div>
      <div className="text-5xl font-extrabold text-primary">{value}</div>
      <div className="text-lg text-muted-foreground">{subtext}</div>
    </button>
  );
}

export default Dashboard;