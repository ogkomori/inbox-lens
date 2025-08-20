
import { Card, CardContent } from "@/components/ui/card";
import GeometricBackground from "@/components/GeometricBackground";

const features = [
  {
    title: "Highlights Actionable Emails",
    description: "Automatically identifies emails that require your attention and action, helping you focus on what's important."
  },
  {
    title: "Smart Summaries",
    description: "Get quick, digestible summaries of important information without reading through entire email threads."
  },
  {
    title: "Intelligent Insights",
    description: "Provides smart insights and context to help you stay on top of your inbox and never miss critical communications."
  }
];

const AboutSection = () => {
  return (
  <section id="about" className="py-36 min-h-[90vh] relative flex-1 flex flex-col justify-center bg-gradient-to-br from-background to-secondary/30">
      <GeometricBackground />
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
            How InboxLens Works
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Three powerful features that transform how you manage your email
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="border-border/50 hover:shadow-lg transition-shadow">
              <CardContent className="p-8 text-center">
                <h3 className="text-2xl font-semibold mb-4 text-foreground">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;