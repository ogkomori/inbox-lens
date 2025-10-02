import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";

const features = [
  {
    title: "Highlights Actionable Emails",
    description:
      "Automatically identifies emails that require your attention and action, helping you focus on what's important.",
    image: "/actionable.png",
  },
  {
    title: "Smart Summaries",
    description:
      "Get quick, digestible summaries of important information without reading through entire email threads.",
    image: "/concise_summary_ss.jpg",
  },
  {
    title: "Intelligent Insights",
    description:
      "Provides smart insights and context to help you stay on top of your inbox and never miss critical communications.",
    image: "/smart-insight.jpg",
  },
];

const AboutSection: React.FC = React.memo(() => {
  return (
  <section id="about" className="py-36 min-h-[90vh] relative flex-1 flex flex-col justify-center bg-gradient-to-br from-background to-secondary/30">
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-12">
          <div className="md:w-1/2 w-full mb-8 md:mb-0">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground text-left">
              How InboxLens Works
            </h2>
            <p className="text-xl text-muted-foreground max-w-lg text-left">
              Three powerful features that transform how you manage your email
            </p>
          </div>
          <div className="md:w-1/2 w-full">
            <Carousel opts={{ loop: true }}>
              <CarouselContent>
                {features.map((feature, index) => (
                  <CarouselItem key={index}>
                    <Card className="border-border/50 shadow-lg">
                      <CardContent className="p-8 flex flex-col items-center text-center">
                        <div className="w-full max-h-72 mb-6 rounded-xl overflow-hidden bg-white flex items-center justify-center border-2 border-secondary shadow-md">
                          <img
                            src={feature.image}
                            alt={feature.title + ' screenshot'}
                            className="w-full h-72 object-cover"
                          />
                        </div>
                        <h3 className="text-2xl font-semibold mb-4 text-foreground">
                          {feature.title}
                        </h3>
                        <p className="text-muted-foreground leading-relaxed">
                          {feature.description}
                        </p>
                      </CardContent>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>
        </div>
      </div>
    </section>
  );
});

export default AboutSection;

