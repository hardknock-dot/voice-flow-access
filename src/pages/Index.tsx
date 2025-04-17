
import React from "react";
import VoiceAssistant from "@/components/VoiceAssistant";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowDownCircle, Star, Users, Zap } from "lucide-react";
import { motion } from "framer-motion";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <header className="container mx-auto py-8">
        <h1 className="text-4xl font-bold text-center text-primary">Voice Flow Access</h1>
        <p className="text-center text-muted-foreground mt-2">
          Enhancing web accessibility with voice commands
        </p>
      </header>

      <main className="container mx-auto px-4 pb-20">
        <section id="voice-assistant" className="flex justify-center mb-12">
          <VoiceAssistant />
        </section>

        <section id="features" className="my-16">
          <h2 className="text-3xl font-bold text-center mb-10">Key Features</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardContent className="pt-6">
                <div className="mb-4 text-accent">
                  <Zap size={32} />
                </div>
                <h3 className="text-xl font-bold mb-2">Voice Commands</h3>
                <p className="text-muted-foreground">
                  Navigate and interact with content using natural voice commands like "read page" or "click button"
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="mb-4 text-accent">
                  <Users size={32} />
                </div>
                <h3 className="text-xl font-bold mb-2">Universal Design</h3>
                <p className="text-muted-foreground">
                  Created for users with disabilities, but beneficial for everyone with intuitive controls
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="mb-4 text-accent">
                  <Star size={32} />
                </div>
                <h3 className="text-xl font-bold mb-2">Accessibility Options</h3>
                <p className="text-muted-foreground">
                  Easily toggle high contrast mode, adjust text size, and get audio feedback
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        <section id="how-to-use" className="my-16">
          <h2 className="text-3xl font-bold text-center mb-10">How To Use</h2>
          
          <div className="max-w-3xl mx-auto bg-card rounded-lg p-6 shadow-md">
            <ol className="space-y-6">
              <li className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">1</div>
                <div>
                  <h3 className="font-bold text-lg">Enable the microphone</h3>
                  <p className="text-muted-foreground">Click the microphone button to start voice recognition</p>
                </div>
              </li>
              
              <li className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">2</div>
                <div>
                  <h3 className="font-bold text-lg">Try a command</h3>
                  <p className="text-muted-foreground">Say "help" to see available commands or try "read page"</p>
                </div>
              </li>
              
              <li className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">3</div>
                <div>
                  <h3 className="font-bold text-lg">Customize your experience</h3>
                  <p className="text-muted-foreground">Try commands like "zoom in" or "high contrast" to adjust the interface</p>
                </div>
              </li>
            </ol>
          </div>
        </section>

        <section id="get-started" className="my-16 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to try it yourself?</h2>
          <p className="text-xl text-muted-foreground mb-8">The voice assistant is ready to use at the top of this page</p>
          <Button 
            size="lg" 
            className="animate-pulse"
            onClick={() => {
              document.getElementById('voice-assistant')?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            <ArrowDownCircle className="mr-2 h-5 w-5" /> Try Voice Assistant
          </Button>
        </section>
      </main>

      <footer className="bg-muted py-6">
        <div className="container mx-auto text-center text-muted-foreground">
          <p>Voice Flow Access - Enhancing web accessibility for everyone</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
