import { useUser } from "@/hooks/useUser";
import { User, Loader2, LogOut } from "lucide-react";
import { useState, useRef, useEffect } from "react";

export function UserProfile() {
  const { user, isLoading } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (isLoading) {
    return (
      <div className="h-8 w-8 animate-pulse rounded-full bg-muted" />
    );
  }

  if (!user) {
    return null; // Or a Login button if preferred
  }

  const handleLogout = async () => {
    try {
      const res = await fetch('api/auth/logout', {
        method: 'GET',
        credentials: 'include'
      });

      if (res.ok) {
        // Force a hard reload/navigation to clear any client-side state and go to login
        window.location.href = '/'; 
      }
    } catch (error) {
      console.error("Logout failed", error);
    }
  }
 
  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full border border-border bg-muted transition-all hover:ring-2 hover:ring-ring hover:ring-offset-2"
      >
        {user.picture ? (
          <img
            src={user.picture}
            alt={user.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <span className="text-xs font-medium text-muted-foreground">
            {user.name ? user.name.charAt(0).toUpperCase() : <User className="h-4 w-4" />}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-64 rounded-xl border border-border bg-card p-4 shadow-xl animate-in fade-in zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out data-[state=closed]:zoom-out-95 z-50">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-border bg-muted">
                {user.picture ? (
                  <img
                    src={user.picture}
                    alt={user.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="text-sm font-medium">
                    {user.name?.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              <div className="flex flex-col overflow-hidden">
                <span className="truncate text-sm font-medium">{user.name}</span>
                <span className="truncate text-xs text-muted-foreground">
                  {user.email}
                </span>
              </div>
            </div>
            
            <div className="border-t border-border pt-4">
                {/* Logout - Redirects to backend logout to clear cookies */}
             <button
                onClick={() => {
                  handleLogout();
                }}
                className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-red-500 hover:bg-red-500/10 transition-colors"
             >
                <LogOut className="h-4 w-4" />
                Sign out
             </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
