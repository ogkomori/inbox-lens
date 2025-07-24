import GeometricBackground from "@/components/GeometricBackground";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import DashboardNavigation from "@/components/DashboardNavigation";

const user = {
  name: "Jane Doe",
  avatar: "https://randomuser.me/api/portraits/women/44.jpg",
};

const stats = [
  { label: "Tasks Completed", value: 24 },
  { label: "Active Projects", value: 3 },
  { label: "Focus Time (hrs)", value: 12.5 },
];

const Dashboard = () => (
  <div className="min-h-screen relative bg-gradient-to-br from-background to-secondary/30">
    <GeometricBackground />
    <DashboardNavigation user={user} />
    <main className="container mx-auto px-4 pt-32 relative z-10">
      <h1 className="text-4xl font-bold mb-8 text-foreground">Welcome back, {user.name.split(" ")[0]}!</h1>
      <div className="grid md:grid-cols-3 gap-8 mb-12">
        {stats.map((stat) => (
          <Card key={stat.label} className="text-center">
            <CardContent className="p-8">
              <CardTitle className="mb-2 text-2xl">{stat.value}</CardTitle>
              <div className="text-muted-foreground">{stat.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>
      {/* Chart placeholder */}
      <div className="bg-background/80 rounded-xl shadow p-8 flex flex-col items-center">
        <div className="w-full h-64 flex items-center justify-center text-muted-foreground">
          [Productivity Chart Placeholder]
        </div>
      </div>
    </main>
  </div>
);

export default Dashboard;