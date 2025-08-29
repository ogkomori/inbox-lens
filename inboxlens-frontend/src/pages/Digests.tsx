import React, { useEffect, useState } from "react";
import { Button } from "../components/ui/button";
import DashboardNavigation from "../components/DashboardNavigation";
import { useNavigate } from "react-router-dom";
import { Card } from "../components/ui/card";

// TODO: Replace with real API call
const fetchDigests = async () => {
  // Simulate loading
  return new Promise<{ date: string; todos: number; trackables: number }[]>(resolve =>
    setTimeout(() => resolve([
      { date: "2025-08-28", todos: 4, trackables: 2 },
      { date: "2025-08-27", todos: 3, trackables: 1 },
      { date: "2025-08-26", todos: 5, trackables: 3 },
    ]), 1200)
  );
};


const Digests: React.FC = () => {
  const navigate = useNavigate();
  const [digests, setDigests] = useState<{ date: string; todos: number; trackables: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDigests()
      .then(setDigests)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <DashboardNavigation user={{ name: '', email: '', avatar: '' }} />
      <div className="container mx-auto pt-24">
        <Button variant="default" className="mb-6 bg-primary text-primary-foreground hover:bg-primary/90" onClick={() => navigate('/dashboard')}>&larr; Back to dashboard</Button>
        <h2 className="text-2xl font-bold mb-4">Digests</h2>
        <div className="overflow-x-auto">
          {loading ? (
            <Card className="flex items-center justify-center p-8 my-8 min-w-[300px]">
              <span className="animate-spin rounded-full h-8 w-8 border-t-4 border-primary border-solid mr-4"></span>
              <span>Loading your digests...</span>
            </Card>
          ) : error ? (
            <div className="text-red-500">{error}</div>
          ) : (
            <DigestMessageCard digestsCount={digests.length} />
          )}
        </div>
      </div>
    </div>
  );
}

// Message card for digests
function DigestMessageCard(props) {
  const digestsCount = props.digestsCount;
  const [showFancy, setShowFancy] = React.useState(false);
  const message = "You have no digests yet.";
  const fancyMessage = "✨ Keep an eye out! Your digests will appear here soon. ✨";
  if (digestsCount === 0) {
    return <Card className="p-8 my-8 text-center text-muted-foreground font-semibold">{message}</Card>;
  }
  return (
    <Card className="p-8 my-8 text-center text-muted-foreground font-semibold cursor-pointer select-none" onClick={() => setShowFancy(true)}>
      {showFancy ? (
        <span className="text-2xl font-bold text-primary animate-pulse">{fancyMessage}</span>
      ) : (
        <span>Click here to see your digests!</span>
      )}
    </Card>
  );
}

export default Digests;
