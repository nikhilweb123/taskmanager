'use client';

import { useState } from 'react';
import { Columns, User, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  const sidebarContent = (
    <>
      {/* Logo Section */}
      <div className="h-[57px] border-b flex items-center px-4">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 bg-primary rounded-md flex items-center justify-center">
            <Columns className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-sm font-semibold">Task Manager</span>
        </div>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 px-3 py-4">
        <Button
          variant="secondary"
          className="w-full justify-start text-sm font-normal"
        >
          <Columns className="h-4 w-4 mr-2" />
          Workspace
        </Button>
      </nav>

      {/* User Profile Section */}
      <div className="border-t px-3 py-4">
        <div className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-muted transition-colors cursor-pointer">
          <Avatar className="h-10 w-10">
            <AvatarImage 
              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face&auto=format&q=80" 
              alt="Anna Taylor"
            />
            <AvatarFallback className="text-xs bg-primary text-primary-foreground">
              AT
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">Anna Taylor</p>
            <p className="text-xs text-muted-foreground truncate">anna.t@email.com</p>
          </div>
          <User className="h-4 w-4 text-muted-foreground flex-shrink-0" />
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Sidebar - Sheet */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden fixed top-3 left-3 z-50 h-9 w-9 p-0 bg-background border shadow-sm"
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0 sm:max-w-[280px]">
          <aside className="h-full flex flex-col">
            {sidebarContent}
          </aside>
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <aside className={cn(
        "hidden lg:flex fixed left-0 top-0 h-screen w-64 border-r bg-background flex-col z-30"
      )}>
        {sidebarContent}
      </aside>
    </>
  );
}
