import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mic, MicOff, Volume2, VolumeX, ZoomIn, ZoomOut, Headphones } from "lucide-react";
import { cn } from "@/lib/utils";
import TodoList from "./TodoList";

interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

const COMMANDS = [
  { name: "add task", description: "Add a new todo (e.g., 'add task buy groceries')" },
  { name: "complete task", description: "Mark a task as done (e.g., 'complete task buy groceries')" },
  { name: "delete task", description: "Remove a task (e.g., 'delete task buy groceries')" },
  { name: "read tasks", description: "Read all tasks aloud" },
  { name: "clear completed", description: "Remove all completed tasks" },
  { name: "help", description: "List available commands" },
  { name: "read", description: "Read page content aloud" },
  { name: "stop", description: "Stop reading or listening" },
  { name: "zoom in", description: "Increase text size" },
  { name: "zoom out", description: "Decrease text size" },
  { name: "high contrast", description: "Toggle high contrast mode" },
  { name: "go to", description: "Navigate to a section (e.g., 'go to features')" },
  { name: "click", description: "Click a visible button or link (e.g., 'click submit')" },
];

const VoiceAssistant = () => {
  const [listening, setListening] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [feedback, setFeedback] = useState("");
  const [todos, setTodos] = useState<Todo[]>([]);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [highContrast, setHighContrast] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const speechSynthesisRef = useRef<SpeechSynthesisUtterance | null>(null);
  const listeningTimeoutRef = useRef<number | null>(null);
  const LISTENING_TIMEOUT = 60000; // 60 seconds of listening time

  useEffect(() => {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event) => {
        const current = event.resultIndex;
        const result = event.results[current];
        const transcript = result[0].transcript.trim().toLowerCase();
        
        setTranscript(transcript);

        // Reset the timeout when user speaks
        if (listening && listeningTimeoutRef.current) {
          resetListeningTimeout();
        }

        if (result.isFinal) {
          processCommand(transcript);
        }
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        if (event.error === 'not-allowed') {
          setFeedback("Microphone access denied. Please enable microphone permissions.");
        } else if (event.error === 'network') {
          // Try to restart recognition on network errors
          if (listening) {
            restartRecognition();
          }
        }
        setListening(false);
      };

      recognitionRef.current.onend = () => {
        // This ensures we keep listening even if the recognition service stops
        if (listening) {
          recognitionRef.current?.start();
        }
      };

    } else {
      setFeedback("Speech recognition is not supported in this browser. Try Chrome, Edge, or Safari.");
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      if (listeningTimeoutRef.current) {
        clearTimeout(listeningTimeoutRef.current);
      }
    };
  }, [listening]);

  const resetListeningTimeout = () => {
    if (listeningTimeoutRef.current) {
      clearTimeout(listeningTimeoutRef.current);
    }
    
    listeningTimeoutRef.current = window.setTimeout(() => {
      if (listening) {
        toggleListening();
        setFeedback("Voice recognition paused due to inactivity. Click the microphone to resume.");
      }
    }, LISTENING_TIMEOUT);
  };

  const restartRecognition = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
        setTimeout(() => {
          if (recognitionRef.current && listening) {
            recognitionRef.current.start();
            setFeedback("Restarting voice recognition...");
          }
        }, 300);
      } catch (e) {
        console.error("Error restarting recognition:", e);
      }
    }
  };

  const processCommand = (command: string) => {
    if (command.includes("help")) {
      const helpText = "Available commands: " + COMMANDS.map(cmd => cmd.name).join(", ");
      speak(helpText);
      setFeedback(helpText);
      return;
    }

    if (command.includes("add task")) {
      const taskText = command.replace("add task", "").trim();
      if (taskText) {
        const newTodo: Todo = {
          id: Date.now().toString(),
          text: taskText,
          completed: false,
        };
        setTodos(prev => [...prev, newTodo]);
        speak(`Added task: ${taskText}`);
        setFeedback(`Added task: ${taskText}`);
      }
      return;
    }

    if (command.includes("complete task")) {
      const taskText = command.replace("complete task", "").trim();
      const todo = todos.find(t => t.text.toLowerCase().includes(taskText.toLowerCase()));
      if (todo) {
        setTodos(prev => prev.map(t => t.id === todo.id ? { ...t, completed: true } : t));
        speak(`Completed task: ${todo.text}`);
        setFeedback(`Completed task: ${todo.text}`);
      } else {
        speak(`Could not find task containing: ${taskText}`);
        setFeedback(`Could not find task containing: ${taskText}`);
      }
      return;
    }

    if (command.includes("delete task")) {
      const taskText = command.replace("delete task", "").trim();
      const todo = todos.find(t => t.text.toLowerCase().includes(taskText.toLowerCase()));
      if (todo) {
        setTodos(prev => prev.filter(t => t.id !== todo.id));
        speak(`Deleted task: ${todo.text}`);
        setFeedback(`Deleted task: ${todo.text}`);
      } else {
        speak(`Could not find task containing: ${taskText}`);
        setFeedback(`Could not find task containing: ${taskText}`);
      }
      return;
    }

    if (command.includes("read tasks")) {
      if (todos.length === 0) {
        speak("No tasks in the list");
        setFeedback("No tasks in the list");
      } else {
        const tasksText = todos
          .map(todo => `${todo.completed ? "Completed:" : "Todo:"} ${todo.text}`)
          .join(". ");
        speak(`Here are your tasks: ${tasksText}`);
        setFeedback("Reading tasks");
      }
      return;
    }

    if (command.includes("clear completed")) {
      const completedCount = todos.filter(t => t.completed).length;
      setTodos(prev => prev.filter(t => !t.completed));
      speak(`Cleared ${completedCount} completed tasks`);
      setFeedback(`Cleared ${completedCount} completed tasks`);
      return;
    }
    
    if (command.includes("read")) {
      const mainContent = document.querySelector("main")?.textContent || document.body.textContent;
      if (mainContent) {
        speak("Reading page content: " + mainContent.substring(0, 200) + "... and more");
        setFeedback("Reading page content...");
      } else {
        speak("No content to read.");
        setFeedback("No content to read.");
      }
      return;
    }
    
    if (command.includes("stop")) {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
        setSpeaking(false);
      }
      if (recognitionRef.current && listening) {
        toggleListening();
      }
      setFeedback("Stopped all speech operations");
      return;
    }
    
    if (command.includes("zoom in")) {
      const newZoom = zoomLevel + 10;
      setZoomLevel(newZoom);
      document.body.style.fontSize = `${newZoom}%`;
      speak(`Zoomed in to ${newZoom} percent`);
      setFeedback(`Zoomed in to ${newZoom}%`);
      return;
    }
    
    if (command.includes("zoom out")) {
      const newZoom = Math.max(zoomLevel - 10, 70);
      setZoomLevel(newZoom);
      document.body.style.fontSize = `${newZoom}%`;
      speak(`Zoomed out to ${newZoom} percent`);
      setFeedback(`Zoomed out to ${newZoom}%`);
      return;
    }
    
    if (command.includes("high contrast")) {
      const newState = !highContrast;
      setHighContrast(newState);
      if (newState) {
        document.body.classList.add("high-contrast");
        document.body.style.backgroundColor = "#000";
        document.body.style.color = "#fff";
      } else {
        document.body.classList.remove("high-contrast");
        document.body.style.backgroundColor = "";
        document.body.style.color = "";
      }
      speak(`High contrast mode ${newState ? 'enabled' : 'disabled'}`);
      setFeedback(`High contrast mode ${newState ? 'enabled' : 'disabled'}`);
      return;
    }
    
    if (command.includes("go to")) {
      const target = command.replace("go to", "").trim();
      const headings = Array.from(document.querySelectorAll("h1, h2, h3, h4, h5, h6, [role=heading]"));
      const links = Array.from(document.querySelectorAll("a"));
      const sections = Array.from(document.querySelectorAll("section, [role=region]"));
      
      const allElements = [...headings, ...links, ...sections];
      
      const matchedElement = allElements.find(el => 
        el.textContent?.toLowerCase().includes(target)
      );
      
      if (matchedElement) {
        matchedElement.scrollIntoView({ behavior: "smooth" });
        speak(`Navigated to ${target}`);
        setFeedback(`Navigated to ${target}`);
        
        matchedElement.classList.add("highlight-focus");
        setTimeout(() => matchedElement.classList.remove("highlight-focus"), 2000);
      } else {
        speak(`Could not find a section named ${target}`);
        setFeedback(`Could not find a section named ${target}`);
      }
      return;
    }
    
    if (command.includes("click")) {
      const target = command.replace("click", "").trim();
      const buttons = Array.from(document.querySelectorAll("button, [role=button]"));
      const links = Array.from(document.querySelectorAll("a"));
      
      const clickableElements = [...buttons, ...links];
      
      const matchedElement = clickableElements.find(el => 
        el.textContent?.toLowerCase().includes(target)
      ) as HTMLElement;
      
      if (matchedElement) {
        speak(`Clicking ${target}`);
        setFeedback(`Clicking ${target}`);
        matchedElement.click();
      } else {
        speak(`Could not find a clickable element named ${target}`);
        setFeedback(`Could not find a clickable element named ${target}`);
      }
      return;
    }
    
    if (command.length > 3) {
      setFeedback(`Command not recognized: "${command}". Say "help" for available commands.`);
      speak(`I didn't understand "${command}". Say "help" for available commands.`);
    }
  };

  const toggleListening = () => {
    if (!recognitionRef.current) {
      setFeedback("Speech recognition is not supported in this browser.");
      return;
    }

    if (listening) {
      recognitionRef.current.stop();
      setFeedback("Voice recognition paused. Click the microphone to resume.");
      if (listeningTimeoutRef.current) {
        clearTimeout(listeningTimeoutRef.current);
        listeningTimeoutRef.current = null;
      }
    } else {
      setTranscript("");
      recognitionRef.current.start();
      setFeedback("Listening for commands...");
      resetListeningTimeout();
    }
    
    setListening(!listening);
  };

  const speak = (text: string) => {
    if (!window.speechSynthesis) {
      console.error("Speech synthesis not supported");
      return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;
    
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(voice => 
      voice.name.includes("Daniel") || voice.name.includes("Google") || voice.name.includes("Microsoft")
    );
    
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }
    
    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => setSpeaking(false);
    
    speechSynthesisRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  const cancelSpeech = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      setFeedback("Speech stopped");
    }
  };

  const addTodo = (text: string) => {
    const newTodo: Todo = {
      id: Date.now().toString(),
      text: text,
      completed: false,
    };
    setTodos(prev => [...prev, newTodo]);
  };

  return (
    <div className="space-y-6">
      <Card className="w-full max-w-lg shadow-lg">
        <CardHeader className="space-y-1 bg-primary text-primary-foreground rounded-t-lg">
          <div className="flex justify-between items-center">
            <CardTitle className="text-xl flex items-center gap-2">
              <Headphones className="h-5 w-5" />
              Voice Flow Access
            </CardTitle>
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                size="icon" 
                onClick={() => {
                  const newZoom = zoomLevel + 10;
                  setZoomLevel(newZoom);
                  document.body.style.fontSize = `${newZoom}%`;
                  setFeedback(`Zoomed in to ${newZoom}%`);
                }}
                className="h-8 w-8 bg-white/20 hover:bg-white/30 text-white"
              >
                <ZoomIn className="h-4 w-4" />
                <span className="sr-only">Zoom In</span>
              </Button>
              <Button 
                variant="outline" 
                size="icon"
                onClick={() => {
                  const newZoom = Math.max(zoomLevel - 10, 70);
                  setZoomLevel(newZoom);
                  document.body.style.fontSize = `${newZoom}%`;
                  setFeedback(`Zoomed out to ${newZoom}%`);
                }}
                className="h-8 w-8 bg-white/20 hover:bg-white/30 text-white"
              >
                <ZoomOut className="h-4 w-4" />
                <span className="sr-only">Zoom Out</span>
              </Button>
              <Button 
                variant="outline" 
                size="icon"
                onClick={() => {
                  const newState = !highContrast;
                  setHighContrast(newState);
                  if (newState) {
                    document.body.classList.add("high-contrast");
                    document.body.style.backgroundColor = "#000";
                    document.body.style.color = "#fff";
                  } else {
                    document.body.classList.remove("high-contrast");
                    document.body.style.backgroundColor = "";
                    document.body.style.color = "";
                  }
                  setFeedback(`High contrast mode ${newState ? 'enabled' : 'disabled'}`);
                }}
                className="h-8 w-8 bg-white/20 hover:bg-white/30 text-white"
              >
                <span className="text-xs font-bold">A</span>
                <span className="sr-only">Toggle High Contrast</span>
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <div className="flex justify-center mb-4">
            <Button
              variant={listening ? "destructive" : "default"}
              className={cn(
                "rounded-full h-16 w-16 flex items-center justify-center relative",
                listening && "mic-pulse"
              )}
              onClick={toggleListening}
              aria-label={listening ? "Stop listening" : "Start listening"}
            >
              {listening ? (
                <MicOff className="h-6 w-6" />
              ) : (
                <Mic className="h-6 w-6" />
              )}
            </Button>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant={listening ? "default" : "outline"} className="capitalize">
                {listening ? "Listening" : "Idle"}
              </Badge>
              {speaking && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Volume2 className="h-3 w-3" /> Speaking
                </Badge>
              )}
            </div>
            
            {transcript && (
              <div className="p-3 bg-muted rounded-md text-sm">
                <p className="font-medium text-muted-foreground">I heard:</p>
                <p className="mt-1">{transcript}</p>
              </div>
            )}
            
            {feedback && (
              <div className="p-3 bg-secondary/10 rounded-md">
                <p className="text-secondary-foreground">{feedback}</p>
              </div>
            )}
            
            <div className="flex justify-between">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  speak("Available commands: " + COMMANDS.map(cmd => cmd.name).join(", "));
                  setFeedback("Available commands: " + COMMANDS.map(cmd => cmd.name).join(", "));
                }}
                className="text-xs"
              >
                Show Commands
              </Button>
              
              {speaking && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={cancelSpeech}
                  className="text-xs"
                >
                  <VolumeX className="h-3 w-3 mr-1" /> Stop Speaking
                </Button>
              )}
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t text-sm">
            <p className="font-medium text-muted-foreground mb-2">Example commands:</p>
            <div className="grid grid-cols-2 gap-2">
              {COMMANDS.slice(0, 6).map((command) => (
                <div key={command.name} className="text-xs">
                  <span className="voice-command-highlight">{command.name}</span>
                  <span className="ml-1 text-muted-foreground">- {command.description}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
      
      <TodoList
        todos={todos}
        onToggleTodo={(id) => {
          setTodos(prev => prev.map(t => 
            t.id === id ? { ...t, completed: !t.completed } : t
          ));
        }}
        onDeleteTodo={(id) => {
          setTodos(prev => prev.filter(t => t.id !== id));
        }}
        onAddTodo={addTodo}
      />
    </div>
  );
};

export default VoiceAssistant;
