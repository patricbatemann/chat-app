import { Conversation } from "@/types";
import { MessageSquare, Plus, Trash2, Edit2, Check, X, MoreHorizontal, PanelLeft } from "lucide-react";
import { useState, useRef, useEffect } from "react";

interface ConversationSidebarProps {
  conversations: Conversation[];
  currentId: string | null;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onRename: (id: string, newTitle: string) => void;
  onNewChat: () => void;
  updatingId?: string | null;
  deletingId?: string | null;
}

import { Loader2 } from "lucide-react";

export function ConversationSidebar({
  conversations,
  currentId,
  onSelect,
  onDelete,
  onRename,
  onNewChat,
  updatingId,
  deletingId,
}: ConversationSidebarProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [isCollapsed, setIsCollapsed] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingId && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editingId]);

  const startEditing = (e: React.MouseEvent, conv: Conversation) => {
    e.stopPropagation();
    setEditingId(conv.id);
    setEditTitle(conv.title);
  };

  const saveTitle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (editingId && editTitle.trim()) {
      onRename(editingId, editTitle.trim());
      setEditingId(null);
    }
  };

  const cancelEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(null);
  };

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this conversation?")) {
      onDelete(id);
    }
  };

  return (
    <div 
      className={`relative m-4 flex flex-col rounded-2xl border border-border bg-card/95 backdrop-blur shadow-xl transition-all duration-300 ease-in-out z-50 ${
        isCollapsed ? "w-16" : "w-64"
      }`}
    >
          <div className={`p-4 ${isCollapsed ? '' : 'border-b'} border-border flex items-center justify-between`}>
              
           <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                  className={`flex w-full items-center gap-2 rounded-lg p-2 text-sm text-muted-foreground hover:bg-accent hover:text-foreground transition-colors ${isCollapsed ? 'justify-center' : 'justify-end'}`}
                  title={isCollapsed ? 'Expand' : 'Collapse'}
             >
                <PanelLeft className={`h-4 w-4 ${isCollapsed ? 'rotate-180' : ''} transition-transform`} />
             </button>
      </div>

      <div className="flex-1 overflow-y-auto p-2 scrollbar-thin">
        <div className="space-y-1">
          {conversations.length === 0 ? (
             !isCollapsed && (
              <div className="px-4 py-8 text-center text-sm text-muted-foreground">
                No conversations yet
              </div>
             )
          ) : (
            conversations.map((conv) => (
              <div
                key={conv.id}
                onClick={() => onSelect(conv.id)}
                className={`group relative flex items-center gap-2 rounded-lg py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground cursor-pointer ${
                  isCollapsed ? "justify-center px-0" : "px-3"
                } ${
                  currentId === conv.id ? "bg-accent text-accent-foreground font-medium" : "text-muted-foreground"
                }`}
                title={isCollapsed ? conv.title : undefined}
              >
                <MessageSquare className="h-4 w-4 shrink-0" />
                
                {!isCollapsed && (
                    editingId === conv.id ? (
                      <div className="flex flex-1 items-center gap-1" onClick={(e) => e.stopPropagation()}>
                        <input
                          ref={inputRef}
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              if (editingId && editTitle.trim()) {
                                 onRename(editingId, editTitle.trim());
                                 setEditingId(null);
                              }
                            } else if (e.key === "Escape") {
                              setEditingId(null);
                            }
                          }}
                           className="h-6 w-full min-w-0 bg-background px-1 text-xs outline-none ring-1 ring-ring rounded-sm"
                        />
                        <button onClick={saveTitle} className="text-green-500 hover:text-green-600" disabled={!!updatingId}>
                          {updatingId === conv.id ? <Loader2 className="h-3 w-3 animate-spin"/> : <Check className="h-3 w-3" />}
                        </button>
                        <button onClick={cancelEdit} className="text-red-500 hover:text-red-600">
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ) : (
                      <>
                        <span className="flex-1 truncate">{conv.title}</span>
                        
                        {updatingId === conv.id ? (
                           <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />
                        ) : (
                        <div className="invisible flex shrink-0 items-center gap-1 group-hover:visible opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={(e) => startEditing(e, conv)}
                            className="rounded p-1 hover:bg-background hover:text-foreground"
                            title="Rename"
                          >
                            <Edit2 className="h-3 w-3" />
                          </button>
                          {deletingId === conv.id ? (
                             <Loader2 className="h-3 w-3 animate-spin text-destructive" />
                          ) : (
                          <button
                            onClick={(e) => handleDelete(e, conv.id)}
                            className="rounded p-1 hover:bg-background hover:text-destructive"
                            title="Delete"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                          )}
                        </div>
                        )}
                      </>
                    )
                )}
              </div>
            ))
          )}
        </div>
      </div>
      
      {/* Bottom section with New Chat */}
        <div className="p-4 border-t border-border mt-auto">
             {!isCollapsed && (
                <button
                onClick={onNewChat}
                className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors w-full justify-center shadow-lg shadow-primary/20"
                >
                <Plus className="h-4 w-4" />
                New Chat
                </button>
            )}
            {isCollapsed && (
                <button
                onClick={onNewChat}
                className="flex items-center justify-center rounded-lg bg-primary p-2 text-primary-foreground hover:bg-primary/90 transition-colors w-full shadow-lg shadow-primary/20"
                title="New Chat"
                >
                <Plus className="h-4 w-4" />
                </button>
            )}
        </div>
    </div>
  );
}
