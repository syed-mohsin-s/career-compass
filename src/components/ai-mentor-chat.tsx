"use client";

import { useState } from "react";
import { Bot, Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

import { useUserProfileStore, UserProfile } from "@/store/user-profile";
import useStore from "@/hooks/use-store";
import { provideAIGuidance } from "@/ai/flows/provide-ai-guidance";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: number;
  text: string;
  sender: "user" | "bot";
}

export function AiMentorChat() {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: "Hello! How can I help you navigate your career path today?", sender: "bot" },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const profile = useStore(useUserProfileStore, (state) => state.profile);

  const profileToString = (p: UserProfile | undefined): string | undefined => {
    if (!p || !p.skills) return undefined;
    return `Skills: ${p.skills}. Education: ${p.education}. Interests: ${p.interests}. Experience: ${p.experience}`;
  }

  const handleSendMessage = async () => {
    if (inputValue.trim() && !isLoading) {
      const userMessage = { id: Date.now(), text: inputValue, sender: "user" as const };
      setMessages([...messages, userMessage]);
      setInputValue("");
      setIsLoading(true);
      
      try {
        const response = await provideAIGuidance({
          query: inputValue,
          skillProfile: profileToString(profile)
        });
        setMessages(prev => [...prev, { id: Date.now() + 1, text: response.guidance, sender: "bot" }]);
      } catch (error) {
        console.error(error);
        toast({
          variant: "destructive",
          title: "Mentor Error",
          description: "The AI mentor is unavailable at the moment."
        });
        setMessages(messages); // revert
      } finally {
        setIsLoading(false);
      }
    }
  };
  
  const quickActions = ["Suggest career paths", "Review my resume", "Help me prepare for an interview"];

  return (
    <>
      <Button
        className="fixed bottom-6 right-6 h-16 w-16 rounded-full shadow-lg z-50 bg-accent hover:bg-accent/90 text-accent-foreground"
        onClick={() => setIsOpen(true)}
        aria-label="Open AI Mentor"
      >
        <Bot className="h-8 w-8" />
      </Button>
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent className="w-full sm:max-w-md flex flex-col p-0">
          <SheetHeader className="p-4 border-b">
            <SheetTitle className="flex items-center gap-2 font-headline">
              <Bot className="text-primary" />
              AI Mentor
            </SheetTitle>
          </SheetHeader>
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex items-end gap-2 ${
                    message.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {message.sender === "bot" && (
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>
                        <Bot className="h-5 w-5" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <p
                    className={`max-w-[75%] rounded-lg px-3 py-2 text-sm ${
                      message.sender === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {message.text}
                  </p>
                </div>
              ))}
               {isLoading && (
                <div className="flex items-end gap-2 justify-start">
                  <Avatar className="h-8 w-8"><AvatarFallback><Bot className="h-5 w-5" /></AvatarFallback></Avatar>
                  <p className="max-w-[75%] rounded-lg px-3 py-2 text-sm bg-muted text-muted-foreground flex items-center">
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Thinking...
                  </p>
                </div>
              )}
            </div>
          </ScrollArea>
          <SheetFooter className="p-4 border-t bg-background">
            <div className="flex flex-col gap-2 w-full">
              <div className="flex gap-2 flex-wrap">
                 {quickActions.map((action) => (
                    <Badge key={action} variant="outline" className="cursor-pointer hover:bg-muted" onClick={() => setInputValue(action)}>
                        {action}
                    </Badge>
                 ))}
              </div>
              <div className="relative">
                <Input
                  placeholder="Ask your mentor..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                  className="pr-12"
                  disabled={isLoading}
                />
                <Button
                  size="icon"
                  className="absolute top-1/2 right-1.5 -translate-y-1/2 h-7 w-7"
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isLoading}
                >
                  <Send className="h-4 w-4" />
                   <span className="sr-only">Send</span>
                </Button>
              </div>
            </div>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  );
}
