
import { cn } from "@/lib/utils";
import { User, Bot } from "lucide-react";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import rehypeSanitize from "rehype-sanitize";

interface ChatBubbleProps {
  message: string;
  isUser: boolean;
}

export function ChatBubble({ message, isUser }: ChatBubbleProps) {
  if (isUser) {
    return (
      <div className="flex w-full justify-end py-2">
        <div className="flex max-w-[80%] flex-row-reverse items-start gap-4 md:max-w-[70%] lg:max-w-[60%]">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm">
            <User size={20} />
          </div>
          <div className="relative rounded-2xl rounded-tr-none bg-primary px-6 py-3 text-sm leading-relaxed text-primary-foreground shadow-sm">
            <div className="prose prose-sm prose-invert max-w-none break-words">
              <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeSanitize]}>{message}</ReactMarkdown>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Regex to extract image markdown: ![Alt Text](URL)
  // Specifically looks for data:image base64 strings, handling potential newlines
  const imageRegex = /!\[.*?\]\((data:image\/[\s\S]*?;base64,[\s\S]*?)\)/g;
  let match;
  let lastIndex = 0;
  const parts = [];

  while ((match = imageRegex.exec(message)) !== null) {
    // Add text before the image
    if (match.index > lastIndex) {
      parts.push({
        type: "text",
        content: message.substring(lastIndex, match.index),
      });
    }

    // Add the image
    parts.push({
      type: "image",
      src: match[1],
    });

    lastIndex = match.index + match[0].length;
  }

  // Add remaining text
  if (lastIndex < message.length) {
    parts.push({
      type: "text",
      content: message.substring(lastIndex),
    });
  }

  return (
    <div className="flex w-full justify-center py-6">
      <div className="flex w-full max-w-4xl items-start gap-6 px-4">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border bg-background text-foreground shadow-sm mt-1">
          <Bot size={18} />
        </div>
        <div className="min-w-0 flex-1 overflow-hidden">
          <div className="prose prose-neutral dark:prose-invert max-w-none break-words leading-7">
            {parts.length === 0 ? (
                // Fallback if no images found (shouldn't happen with logic above, but safe default)
                 <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeHighlight, rehypeSanitize]}
                    components={{
                        pre: ({...props }) => (
                            <div className="not-prose my-6 overflow-hidden rounded-xl border border-border bg-muted">
                                <div className="flex items-center justify-between bg-muted/50 px-4 py-2 text-xs text-muted-foreground border-b border-border">
                                    <span className="font-mono">Code</span>
                                </div>
                                <div className="p-4 overflow-x-auto">
                                    <pre {...props} className="!bg-transparent !p-0 !m-0 font-mono text-sm" />
                                </div>
                            </div>
                        ),
                        code: ({className, children, ...props }) => {
                            const match = /language-(\w+)/.exec(className || '');
                            const isInline = !match && !String(children).includes('\n');
                            return isInline ? (
                                <code className={cn("rounded bg-muted px-1.5 py-0.5 text-sm font-mono text-muted-foreground", className)} {...props}>
                                    {children}
                                </code>
                            ) : (
                                <code className={cn(className, "text-sm")} {...props}>
                                    {children}
                                </code>
                            );
                        }
                    }}
                >
                    {message}
                </ReactMarkdown>
            ) : (
              parts.map((part, index) => {
                if (part.type === "image") {
                  return (
                    <img
                      key={index}
                      src={part.src}
                      alt="Generated Image"
                      className="max-w-full rounded-lg shadow-md my-4"
                      style={{ maxHeight: "512px" }}
                    />
                  );
                } else {
                  return (
                    <ReactMarkdown
                      key={index}
                      remarkPlugins={[remarkGfm]}
                      rehypePlugins={[rehypeHighlight, rehypeSanitize]}
                      components={{
                        pre: ({ ...props }) => (
                          <div className="not-prose my-6 overflow-hidden rounded-xl border border-border bg-muted">
                            <div className="flex items-center justify-between bg-muted/50 px-4 py-2 text-xs text-muted-foreground border-b border-border">
                              <span className="font-mono">Code</span>
                            </div>
                            <div className="p-4 overflow-x-auto">
                              <pre
                                {...props}
                                className="!bg-transparent !p-0 !m-0 font-mono text-sm"
                              />
                            </div>
                          </div>
                        ),
                        code: ({ className, children, ...props }) => {
                          const match = /language-(\w+)/.exec(className || "");
                          const isInline =
                            !match && !String(children).includes("\n");
                          return isInline ? (
                            <code
                              className={cn(
                                "rounded bg-muted px-1.5 py-0.5 text-sm font-mono text-muted-foreground",
                                className
                              )}
                              {...props}
                            >
                              {children}
                            </code>
                          ) : (
                            <code
                              className={cn(className, "text-sm")}
                              {...props}
                            >
                              {children}
                            </code>
                          );
                        },
                      }}
                    >
                      {part.content}
                    </ReactMarkdown>
                  );
                }
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
