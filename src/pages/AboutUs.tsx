import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useRef } from "react";
import { Heart, Users, Shield, Award } from "lucide-react";

const AboutUs = () => {
  const teamMembers = [
    { 
      name: "Ayush Shevde", 
      role: "Team Leader", 
      description: "Project Architect",
      imageUrl: "https://media.istockphoto.com/id/1332100919/vector/man-icon-black-icon-person-symbol.jpg?s=612x612&w=0&k=20&c=AVVJkvxQQCuBhawHrUhDRTCeNQ3Jgt0K1tXjJsFy1eg="
    },
    { 
      name: "Ananya Munshi", 
      description: "Team Coordinator",
      imageUrl: "https://static.vecteezy.com/system/resources/previews/042/125/244/non_2x/people-person-contact-black-solid-flat-glyph-icon-single-icon-isolated-on-white-background-free-vector.jpg"
    },
    { 
      name: "Anvit Panhalkar", 
      description: "Back-end Lead",
      imageUrl: "https://media.istockphoto.com/id/1332100919/vector/man-icon-black-icon-person-symbol.jpg?s=612x612&w=0&k=20&c=AVVJkvxQQCuBhawHrUhDRTCeNQ3Jgt0K1tXjJsFy1eg="
    },
    { 
      name: "Manmeet Santre", 
      description: "Front-end Lead",
      imageUrl: "https://media.istockphoto.com/id/1332100919/vector/man-icon-black-icon-person-symbol.jpg?s=612x612&w=0&k=20&c=AVVJkvxQQCuBhawHrUhDRTCeNQ3Jgt0K1tXjJsFy1eg="
    },
    { 
      name: "Shreesh Jugade", 
      description: "ML Lead",
      imageUrl: "https://media.istockphoto.com/id/1332100919/vector/man-icon-black-icon-person-symbol.jpg?s=612x612&w=0&k=20&c=AVVJkvxQQCuBhawHrUhDRTCeNQ3Jgt0K1tXjJsFy1eg="
    },
    { 
      name: "Nihar Bapat", 
      description: "Back-end Lead",
      imageUrl: "https://media.istockphoto.com/id/1332100919/vector/man-icon-black-icon-person-symbol.jpg?s=612x612&w=0&k=20&c=AVVJkvxQQCuBhawHrUhDRTCeNQ3Jgt0K1tXjJsFy1eg="
    }
  ];

  const values = [
    {
      title: "Privacy First",
      description: "Your mental health journey is personal. We prioritize your privacy and data security above all else.",
      icon: Shield,
      color: "bg-gradient-primary"
    },
    {
      title: "Community Support",
      description: "Healing happens in connection. We foster a safe, supportive community for everyone.",
      icon: Users,
      color: "bg-gradient-wellness"
    },
    {
      title: "Evidence-Based",
      description: "Our approaches are grounded in clinical research and proven therapeutic methods.",
      icon: Award,
      color: "bg-gradient-calm"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-hero text-primary-foreground py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="mx-auto w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-6">
            <Heart className="w-8 h-8" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            About Maitri
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto opacity-90">
            Supporting astronaut mental health through advanced AI, mission-focused psychology, and compassionate care
          </p>
        </div>
      </section>

      {/* Our Mission Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-8">Our Mission</h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              At Maitri, we believe that astronaut mental health support should be accessible, 
              mission-focused, and available even when communication with Earth is impossible. Our platform combines cutting-edge AI technology 
              with space psychology expertise to create tools that truly make a difference in 
              astronauts' lives during long-duration space missions. We are committed to promoting mental health awareness in space exploration and 
              providing a safe space where astronauts can find the support and resources they need, even millions of miles from home.
            </p>
            <div className="grid md:grid-cols-3 gap-8">
              {values.map((value) => (
                <Card key={value.title} className="shadow-card hover:shadow-glow transition-shadow">
                  <CardHeader className="text-center">
                    <div className={`mx-auto w-12 h-12 ${value.color} rounded-full flex items-center justify-center mb-4`}>
                      <value.icon className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle className="text-xl">{value.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-center">
                      {value.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Why Mental Health Matters Section */}
      <section className="py-16 bg-gradient-wellness/10">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Why Mental Health Matters</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="text-xl text-primary">Breaking the Stigma</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Mental health is just as important as physical health. By creating open conversations 
                    and providing accessible resources, we help break down barriers and reduce stigma 
                    around mental health challenges.
                  </p>
                </CardContent>
              </Card>

              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="text-xl text-primary">Support & Resources</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Our platform offers comprehensive support through professional guidance, peer connections, 
                    evidence-based tools, and educational resources designed to empower your mental wellness journey.
                  </p>
                </CardContent>
              </Card>

              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="text-xl text-primary">Safe Space</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    We've created a judgment-free environment where you can express yourself freely, 
                    connect with others who understand, and access help without fear or shame.
                  </p>
                </CardContent>
              </Card>

              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="text-xl text-primary">Awareness & Education</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Through education and awareness initiatives, we help individuals recognize mental health 
                    signs, understand available treatments, and build resilience for long-term wellbeing.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section - Auto Carousel */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Meet Our Team</h2>
            <Carousel members={teamMembers} />
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8">Our Story</h2>
            <div className="prose prose-lg mx-auto text-muted-foreground">
              <p className="text-center mb-8">
                Maitri was born from a simple observation: while technology has 
                transformed many aspects of healthcare, astronaut mental health support remained 
                fragmented and often inaccessible during long-duration space missions.
              </p>
              
              <Card className="shadow-card">
                <CardContent className="pt-6">
                  <p className="mb-4">
                    Our journey began with a simple but powerful realization: astronauts need specialized mental health support during long-duration space missions. Isolation, confinement, distance from Earth, and mission stress can take a toll on psychological well-being—and too often, astronauts are left navigating these challenges alone when communication with Earth is delayed or impossible.
                  </p>
                  <p className="mb-4">
                    That insight inspired the creation of Maitri—a platform featuring TARS, an advanced AI companion designed to support astronauts beyond mission control. Our platform bridges the gap between professional space psychology and daily psychological self-care, giving astronauts tools to track their mental health, reflect on their experiences, and connect with a supportive community that understands the unique challenges of space exploration.
                  </p>
                  <p className="mb-4">
                    Built with empathy and informed by space psychology best practices, every feature is designed to be accessible, practical, and mission-focused. We believe astronaut mental wellness should be proactive, not reactive—especially when help from Earth is millions of miles away.
                  </p>
                  <p>
                    Today, we're proud to support astronauts on their mental health journeys—empowering them to build resilience, maintain psychological well-being, and thrive both during missions and upon return to Earth.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-gradient-beige">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Get in Touch</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Have questions about our platform or want to share your feedback? 
            We'd love to hear from you.
          </p>
          <Card className="max-w-md mx-auto shadow-card">
            <CardContent className="pt-6">
              <div className="space-y-2 text-sm">
                <p><strong>Email:</strong> hello@maitri.space</p>
                <p><strong>Support:</strong> support@maitri.space</p>
                <p><strong>Phone:</strong> 1800-599-0019</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;

// Simple auto-scrolling horizontal carousel
const Carousel = ({ members }: { members: Array<{ name: string; role?: string; description?: string; imageUrl?: string }> }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let raf: number | null = null;
    let frame: number | null = null;
    const speedPxPerFrame = 2; // increased flow speed slightly

    const step = () => {
      if (!el) return;
      el.scrollLeft += speedPxPerFrame;
      // reset to start when reaching end for infinite loop effect
      if (el.scrollLeft + el.clientWidth >= el.scrollWidth - 1) {
        el.scrollLeft = 0;
      }
      frame = window.setTimeout(() => {
        raf = requestAnimationFrame(step);
      }, 16);
    };

    raf = requestAnimationFrame(step);

    return () => {
      if (raf) cancelAnimationFrame(raf);
      if (frame) clearTimeout(frame);
    };
  }, []);

  // duplicate list to avoid large visual gap during reset
  const items = [...members, ...members];

  return (
    <div className="relative">
      <div ref={containerRef} className="overflow-hidden">
        <div className="flex gap-6 py-2">
          {items.map((m, idx) => (
            <Card key={`${m.name}-${idx}`} className="min-w-[240px] w-[240px] shadow-card hover:shadow-glow transition-shadow">
              <CardHeader className="text-center">
                {m.imageUrl && (
                  <img
                    src={m.imageUrl}
                    alt={`${m.name} avatar`}
                    className="mx-auto mb-3 w-16 h-16 rounded-full object-cover border border-primary/30"
                  />
                )}
                <CardTitle className="text-lg">{m.name}</CardTitle>
                {m.role && (
                  <CardDescription className="font-medium text-primary">{m.role}</CardDescription>
                )}
              </CardHeader>
              {m.description && (
                <CardContent>
                  <p className="text-sm text-muted-foreground text-center">{m.description}</p>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};