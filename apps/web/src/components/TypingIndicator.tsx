import { Bot } from "lucide-react";

export function TypingIndicator() {
    return (
        <div className="flex w-full justify-center py-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="flex w-full max-w-4xl items-start gap-6 px-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border bg-background text-foreground shadow-sm mt-1">
                    <Bot size={18} />
                </div>
                <div className="rounded-2xl rounded-tl-none border border-border bg-background px-6 py-4 shadow-sm">
                    <div className="flex gap-1.5">
                        <div className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.3s]" />
                        <div className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.15s]" />
                        <div className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground" />
                    </div>
                </div>
            </div>
        </div>
    );
}
