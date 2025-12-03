import { useState, FormEvent, useRef, useEffect, ChangeEvent } from "react";
import { Send, Loader2, Paperclip, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { GeminiService } from "@/services/gemini";

interface ChatInputProps {
    onSend: (message: string, fileUri?: string) => void;
    isLoading: boolean;
}

export function ChatInput({ onSend, isLoading }: ChatInputProps) {
    const [input, setInput] = useState("");
    const [isUploading, setIsUploading] = useState(false);
    const [attachedFile, setAttachedFile] = useState<{ name: string; uri: string } | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if ((!input.trim() && !attachedFile) || isLoading || isUploading) return;
        
        onSend(input, attachedFile?.uri);
        setInput("");
        setAttachedFile(null);
    };

    const handleFileSelect = async (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        try {
            const response = await GeminiService.uploadFile(file);
            setAttachedFile({ name: file.name, uri: response.uri });
        } catch (error) {
            console.error("File upload failed", error);
            // Ideally show a toast here
            alert("File upload failed");
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        }
    };

    const clearAttachment = () => {
        setAttachedFile(null);
    };

    useEffect(() => {
        if (!isLoading) {
            inputRef.current?.focus();
        }
    }, [isLoading]);

    return (
        <form
            onSubmit={handleSubmit}
            className="relative flex w-full max-w-4xl flex-col gap-2 rounded-2xl border border-border bg-background/80 p-2 shadow-lg backdrop-blur-xl transition-all focus-within:ring-2 focus-within:ring-ring/20"
        >
            {attachedFile && (
                <div className="flex items-center gap-2 px-4 py-2 text-sm text-muted-foreground">
                    <Paperclip size={14} />
                    <span className="truncate max-w-xs">{attachedFile.name}</span>
                    <button
                        type="button"
                        onClick={clearAttachment}
                        className="ml-auto rounded-full p-1 hover:bg-muted"
                    >
                        <X size={14} />
                    </button>
                </div>
            )}
            
            <div className="flex items-center gap-2">
                 <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    className="hidden"
                    accept=".pdf,application/pdf" 
                />
                <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isLoading || isUploading}
                    className="flex h-10 w-10 items-center justify-center rounded-full text-muted-foreground hover:bg-muted transition-colors"
                >
                    {isUploading ? (
                        <Loader2 size={18} className="animate-spin" />
                    ) : (
                        <Paperclip size={18} />
                    )}
                </button>

                <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={attachedFile ? "Ask about this file..." : "Type your message..."}
                    className="flex-1 bg-transparent px-2 py-3 text-sm outline-none placeholder:text-muted-foreground text-foreground"
                    disabled={isLoading}
                />
                <button
                    type="submit"
                    disabled={(!input.trim() && !attachedFile) || isLoading || isUploading}
                    className={cn(
                        "flex h-10 w-10 items-center justify-center rounded-full transition-all duration-200",
                        (!input.trim() && !attachedFile) || isLoading || isUploading
                            ? "bg-muted text-muted-foreground"
                            : "bg-primary text-primary-foreground hover:bg-primary/90 shadow-md hover:shadow-lg active:scale-95"
                    )}
                >
                    {isLoading ? (
                        <Loader2 size={18} className="animate-spin" />
                    ) : (
                        <Send size={18} className="ml-0.5" />
                    )}
                </button>
            </div>
        </form>
    );
}
