
import React from "react";
import VoiceAssistant from "@/components/VoiceAssistant";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <header className="container mx-auto py-8">
        <h1 className="text-4xl font-bold text-center text-primary">Voice-Enabled Todo List</h1>
        <p className="text-center text-muted-foreground mt-2">
          Manage your tasks with voice commands or touch controls
        </p>
      </header>

      <main className="container mx-auto px-4 pb-20">
        <section className="flex flex-col items-center gap-6">
          <VoiceAssistant />
        </section>
      </main>
    </div>
  );
};

export default Index;
