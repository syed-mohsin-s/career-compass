"use client";

import { useState, useRef } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bot, Send, User, Mic, FileText, Loader2, Upload } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { provideAiMockInterviews } from "@/ai/flows/provide-ai-mock-interviews";

interface InterviewMessage {
  sender: "user" | "bot";
  text: string;
}

const fileToDataURI = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => {
            if (event.target?.result) {
                resolve(event.target.result as string);
            } else {
                reject(new Error("Failed to read file."));
            }
        };
        reader.onerror = (error) => {
            reject(error);
        };
        reader.readAsDataURL(file);
    });
};

export default function MockInterviewPage() {
  const { toast } = useToast();
  const [messages, setMessages] = useState<InterviewMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isBotThinking, setIsBotThinking] = useState(false);
  const [sessionStarted, setSessionStarted] = useState(false);

  const [interviewType, setInterviewType] = useState("technical");
  const [targetRole, setTargetRole] = useState("ai-ml-engineer");
  const [resumeDataUri, setResumeDataUri] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
        if (file.size > 4 * 1024 * 1024) { // 4MB limit
            toast({ variant: "destructive", title: "File too large", description: "Please upload a file smaller than 4MB." });
            return;
        }
        try {
            const dataUri = await fileToDataURI(file);
            setResumeDataUri(dataUri);
            toast({ title: "Resume Uploaded", description: file.name });
        } catch (error) {
            toast({ variant: "destructive", title: "Upload Failed", description: "Could not read the resume file." });
        }
    }
  };

  const startSession = () => {
    if (!resumeDataUri) {
        toast({ variant: "destructive", title: "Resume Required", description: "Please upload your resume to start." });
        return;
    }
    setSessionStarted(true);
    setMessages([
        {
          sender: "bot",
          text: `Hello! I'm your AI interviewer. I see you're preparing for a ${targetRole} role. Let's begin. To start, could you tell me about yourself and your background?`,
        },
      ]);
  }

  const handleSendMessage = async () => {
    if (inputValue.trim() === "" || isBotThinking) return;
    
    const userMessage: InterviewMessage = { sender: "user", text: inputValue };
    const currentMessages = [...messages, userMessage];
    setMessages(currentMessages);
    setInputValue("");
    setIsBotThinking(true);

    try {
        const lastBotMessage = messages.filter(m => m.sender === 'bot').pop();
        const response = await provideAiMockInterviews({
            resume: resumeDataUri,
            jobDescription: `Role: ${targetRole}. Type: ${interviewType} interview.`,
            userResponse: inputValue,
            interviewerQuestion: lastBotMessage?.text,
        });

        setMessages([...currentMessages, { sender: "bot", text: response.interviewerResponse }]);

    } catch (error) {
        console.error(error);
        toast({ variant: "destructive", title: "Error", description: "The AI interviewer is having some trouble. Please try again." });
        setMessages(messages); // Revert messages
    } finally {
        setIsBotThinking(false);
    }
  };

  if (!sessionStarted) {
    return (
        <div className="flex items-center justify-center h-full">
            <Card className="w-full max-w-lg">
                <CardHeader>
                    <CardTitle className="font-headline">Mock Interview Setup</CardTitle>
                    <CardDescription>Configure your interview session before you start.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label>Interview Type</Label>
                        <Select value={interviewType} onValueChange={setInterviewType}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="technical">Technical</SelectItem>
                                <SelectItem value="behavioral">Behavioral</SelectItem>
                                <SelectItem value="case">Case Study</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label>Target Role</Label>
                        <Select value={targetRole} onValueChange={setTargetRole}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="ai-ml-engineer">AI/ML Engineer</SelectItem>
                                <SelectItem value="data-scientist">Data Scientist</SelectItem>
                                <SelectItem value="cloud-architect">Cloud Architect</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label>Upload Your Resume</Label>
                        <Input type="file" accept=".pdf,.doc,.docx,.txt" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
                        <Button variant="outline" className="w-full" onClick={() => fileInputRef.current?.click()}>
                           <Upload className="mr-2 h-4 w-4" /> {resumeDataUri ? "Resume Uploaded" : "Select Resume"}
                        </Button>
                    </div>
                    <Button className="w-full" onClick={startSession} disabled={!resumeDataUri}>Start Interview</Button>
                </CardContent>
            </Card>
        </div>
    )
  }

  return (
    <div className="grid lg:grid-cols-3 gap-6 h-[calc(100vh-10rem)]">
      <div className="lg:col-span-2 bg-card border rounded-lg flex flex-col">
        <CardHeader>
          <CardTitle className="font-headline flex items-center justify-between">
            <span>AI Mock Interview</span>
            <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => setSessionStarted(false)}>End Session</Button>
                <div className="flex items-center gap-1 text-sm text-red-500 animate-pulse">
                    <div className="h-2 w-2 rounded-full bg-red-500"></div>
                    REC
                </div>
            </div>
          </CardTitle>
        </CardHeader>
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-6">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex items-start gap-3 ${
                  msg.sender === "user" ? "justify-end" : ""
                }`}
              >
                {msg.sender === "bot" && (
                  <Avatar>
                    <AvatarFallback>
                      <Bot />
                    </AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={`max-w-xl rounded-lg p-3 text-sm ${
                    msg.sender === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }`}
                >
                  <p>{msg.text}</p>
                </div>
                {msg.sender === "user" && (
                  <Avatar>
                    <AvatarImage src="https://picsum.photos/seed/1/40/40" />
                    <AvatarFallback>
                      <User />
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
            {isBotThinking && (
                 <div className="flex items-start gap-3">
                     <Avatar><AvatarFallback><Bot /></AvatarFallback></Avatar>
                     <div className="max-w-xl rounded-lg p-3 text-sm bg-muted flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Thinking...</span>
                     </div>
                 </div>
            )}
          </div>
        </ScrollArea>
        <div className="p-4 border-t">
          <div className="relative">
            <Input
              placeholder="Type your answer or use the microphone..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSendMessage();
              }}
              className="pr-20"
              disabled={isBotThinking}
            />
            <div className="absolute top-1/2 right-2 -translate-y-1/2 flex gap-1">
              <Button
                variant={isRecording ? "destructive" : "outline"}
                size="icon"
                className="h-8 w-8"
                onClick={() => setIsRecording(!isRecording)}
              >
                <Mic className="h-4 w-4" />
              </Button>
              <Button size="icon" className="h-8 w-8" onClick={handleSendMessage} disabled={!inputValue || isBotThinking}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

       <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Session Info</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
             <div className="flex justify-between">
                <span className="text-muted-foreground">Interview Type:</span>
                <span className="font-medium capitalize">{interviewType}</span>
             </div>
             <div className="flex justify-between">
                <span className="text-muted-foreground">Target Role:</span>
                <span className="font-medium capitalize">{targetRole.replace(/-/g, ' ')}</span>
             </div>
          </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle className="font-headline flex items-center gap-2"><FileText className="h-5 w-5" /> Session Transcript</CardTitle>
                <CardDescription>Review the full transcript after your session.</CardDescription>
            </CardHeader>
            <CardContent>
                <Button variant="outline" className="w-full" disabled>Download Transcript</Button>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
