import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import GeometricBackground from "@/components/GeometricBackground";

const hours = Array.from({ length: 12 }, (_, i) => i + 1);
const minutes = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, "0"));
const ampm = ["AM", "PM"];

const to24HourString = (hour: number, minute: string, period: string) => {
  let h = hour % 12;
  if (period === "PM") h += 12;
  return `${h.toString().padStart(2, "0")}:${minute}`;
};

const PreferredTime = () => {
  const [hour, setHour] = useState(8);
  const [minute, setMinute] = useState("00");
  const [period, setPeriod] = useState("AM");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const time24 = to24HourString(hour, minute, period);
    try {
      const response = await fetch("http://localhost:8080/api/profile/set-preferred-time", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ preferredTime: time24 }),
        credentials: "include", // <-- this sends cookies, including HttpOnly
      });
      if (!response.ok) {
        throw new Error("Failed to set preferred time");
      }
      // Optionally handle response data here
      alert(`Preferred time set to: ${time24}`);
      navigate("/dashboard");
    } catch (error) {
      alert("Error: " + (error instanceof Error ? error.message : "Unknown error"));
    }
  };

  return (
    <div className="min-h-screen bg-background relative">
      {/* Geometric background */}
      <GeometricBackground />
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center">
          <button
            className="font-bold text-2xl bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent focus:outline-none"
            onClick={() => navigate("/")}
            aria-label="Go to homepage"
          >
            CoreFocus
          </button>
        </div>
      </nav>
      <main className="container mx-auto px-4 pt-32 max-w-md relative z-10">
        <h1 className="text-3xl font-bold mb-8 text-foreground text-center">Choose Your Preferred Time</h1>
        <form onSubmit={handleSubmit} className="bg-card rounded-xl shadow p-8 flex flex-col gap-6">
          <div className="flex justify-center gap-4">
            <select
              className="border rounded px-3 py-2 text-lg focus:outline-none focus:ring focus:border-primary"
              value={hour}
              onChange={e => setHour(Number(e.target.value))}
            >
              {hours.map(h => (
                <option key={h} value={h}>{h}</option>
              ))}
            </select>
            <span className="text-lg font-bold self-center">:</span>
            <select
              className="border rounded px-3 py-2 text-lg focus:outline-none focus:ring focus:border-primary"
              value={minute}
              onChange={e => setMinute(e.target.value)}
            >
              {minutes.map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
            <select
              className="border rounded px-3 py-2 text-lg focus:outline-none focus:ring focus:border-primary"
              value={period}
              onChange={e => setPeriod(e.target.value)}
            >
              {ampm.map(p => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>
          <Button type="submit" className="w-full mt-4">Set Preferred Time</Button>
        </form>
      </main>
    </div>
  );
};

export default PreferredTime;
