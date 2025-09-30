
import React, { useState, useEffect } from "react";
import { Button } from "../components/ui/button";
import DashboardNavigation from "../components/DashboardNavigation";
import { useNavigate } from "react-router-dom";
import { fetchTrackables } from "../lib/dashboardApi";
import { Card } from "../components/ui/card";

interface TrackablesEntity {
  id: number;
  title: string;
  type: "APPLICATION" | "ORDER" | "BOOKING" | "OTHER";
}


const Trackables: React.FC = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState<string | null>(null);
  const [trackables, setTrackables] = useState<TrackablesEntity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTrackables()
      .then(setTrackables)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);


  // Group by type
  const grouped = trackables.reduce((acc: Record<string, string[]>, t) => {
    if (!acc[t.type]) acc[t.type] = [];
    acc[t.type].push(t.title);
    return acc;
  }, {});

  // For display: map enum to readable label
  const typeLabels: Record<string, string> = {
    APPLICATION: "Applications",
    ORDER: "Orders",
    BOOKING: "Bookings",
    OTHER: "Other"
  };

  return (
    <div className="min-h-screen flex flex-col">
  <DashboardNavigation user={{ name: '', email: '' }} />
      <div className="container mx-auto pt-24">
        <Button variant="default" className="mb-6 bg-primary text-primary-foreground hover:bg-primary/90" onClick={() => navigate('/dashboard')}>&larr; Back to dashboard</Button>
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1">
            <h2 className="text-2xl font-bold mb-4">Trackables</h2>
            {loading ? (
              <Card className="flex items-center justify-center p-8 my-8">
                <span className="animate-spin rounded-full h-8 w-8 border-t-4 border-primary border-solid mr-4"></span>
                <span>Loading your trackables...</span>
              </Card>
            ) : error ? (
              <div className="text-red-500">{error}</div>
            ) : Object.keys(grouped).length === 0 ? (
              <Card className="p-8 my-8 text-center text-muted-foreground font-semibold">You have no trackables yet.</Card>
            ) : (
              <div className="flex flex-col gap-4">
                {Object.entries(grouped).map(([type, items]) => (
                  <div key={type} className="border rounded bg-card">
                    <button
                      className="w-full text-left px-4 py-3 font-semibold bg-card hover:bg-accent rounded-t flex justify-between items-center"
                      onClick={() => setOpen(open === type ? null : type)}
                    >
                      <span>{typeLabels[type] || type} <span className="ml-2 text-xs text-muted-foreground font-mono">[{items.length}]</span></span>
                      <span>{open === type ? "\u25b2" : "\u25bc"}</span>
                    </button>
                    {open === type && (
                      <ul className="p-4 bg-card rounded-b">
                        {items.map((item) => (
                          <li key={item} className="py-1 border-b last:border-b-0">{item}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="w-full lg:w-80 flex flex-col gap-4">
            <h3 className="text-xl font-semibold mb-2">AI Insights</h3>
            <div className="bg-card p-4 rounded shadow">
              <strong>Tip:</strong> Track your applications and orders for timely follow-ups.
            </div>
            <div className="bg-card p-4 rounded shadow">
              <strong>AI Suggestion:</strong> Would you like to enable smart reminders? (Coming soon)
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Trackables;
