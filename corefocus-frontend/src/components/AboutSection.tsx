import { Card, CardContent } from "@/components/ui/card";
import GeometricBackground from "@/components/GeometricBackground";

const AboutSection = () => {
  const features = [
    {
      title: "Intuitive Design",
      description: "Clean and modern interface that makes complex tasks simple and enjoyable."
    },
    {
      title: "Powerful Features",
      description: "Advanced tools and capabilities to handle your most demanding workflows."
    },
    {
      title: "Seamless Integration",
      description: "Connect with your favorite tools and services for a unified experience."
    }
  ];

  return (
    <section id="about" className="py-20 bg-secondary/20 relative">
      <GeometricBackground />
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
            About CoreFocus
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            We're dedicated to creating tools that empower individuals and teams to achieve more. 
            CoreFocus is built with modern technology and designed for the way you work.
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
      
      {/* Section divider */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent"></div>
    </section>
  );
};

export default AboutSection;