import React, {
  forwardRef,
  useState,
  useEffect,
  useRef,
  createContext,
  useContext,
} from 'react'
import { cva } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import {
  Moon,
  Sun,
  Globe,
  X,
  CheckCircle,
  AlertCircle,
  Info,
  AlertTriangle,
} from 'lucide-react'
import { useTheme } from '@/contexts/ThemeContext' // Assumes this context exists
import { useTranslation } from 'react-i18next'

// --- UTILS ---
// Toast utility to dispatch events from anywhere in the app
export const toast = (options) => {
  window.dispatchEvent(new CustomEvent('show-toast', { detail: options }))
}

// Custom hook for easier access
export const useToast = () => {
  return toast
}

// --- COMPONENTS ---

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export const Button = forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => (
  <button
    className={cn(buttonVariants({ variant, size, className }))}
    ref={ref}
    {...props}
  />
))
Button.displayName = "Button"

export const Input = forwardRef(({ className, type, ...props }, ref) => (
  <input
    type={type}
    className={cn(
      "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
      className
    )}
    ref={ref}
    {...props}
  />
))
Input.displayName = "Input"

export const Card = forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("rounded-lg border bg-card text-card-foreground shadow-sm", className)}
    {...props}
  />
))
Card.displayName = "Card"

export const CardHeader = forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex flex-col space-y-1.5 p-6", className)} {...props} />
))
CardHeader.displayName = "CardHeader"

export const CardTitle = forwardRef(({ className, ...props }, ref) => (
  <h3 ref={ref} className={cn("text-2xl font-semibold leading-none tracking-tight", className)} {...props} />
))
CardTitle.displayName = "CardTitle"

export const CardContent = forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

export const LoadingSpinner = ({ size = 'md', className }) => {
  const sizeClasses = { sm: 'w-4 h-4', md: 'w-6 h-6', lg: 'w-8 h-8', xl: 'w-12 h-12' };
  return <div className={cn('animate-spin rounded-full border-2 border-gray-300 border-t-blue-600', sizeClasses[size], className)} />;
}

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  return (
    <Button variant="outline" size="icon" onClick={toggleTheme} className="relative overflow-hidden">
      <Sun className={cn("h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all duration-300", theme === 'dark' && "-rotate-90 scale-0")} />
      <Moon className={cn("absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all duration-300", theme === 'dark' && "rotate-0 scale-100")} />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}

export const LanguageSelector = () => {
  const { i18n } = useTranslation();
  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'ar', name: 'العربية', flag: '🇲🇦' },
  ];
  return (
    <div className="relative group">
      <Button variant="outline" size="icon" className="relative"><Globe className="h-[1.2rem] w-[1.2rem]" /></Button>
      <div className="absolute right-0 top-full mt-2 w-48 bg-background border rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
        <div className="py-1">
          {languages.map((lang) => (
            <button key={lang.code} onClick={() => i18n.changeLanguage(lang.code)} className={cn("w-full px-3 py-2 text-left text-sm hover:bg-accent hover:text-accent-foreground flex items-center gap-2", i18n.language === lang.code && "bg-accent text-accent-foreground")}>
              <span>{lang.flag}</span>
              <span>{lang.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

const Toast = ({ toast, onRemove }) => {
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    setIsVisible(true);
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onRemove, 300);
    }, toast.duration || 5000);
    return () => clearTimeout(timer);
  }, [onRemove, toast.duration]);
  const icons = { success: CheckCircle, error: AlertCircle, warning: AlertTriangle, info: Info };
  const Icon = icons[toast.type] || Info;
  return (
    <div className={cn("fixed top-4 right-4 max-w-sm w-full bg-background border rounded-lg shadow-lg p-4 transition-all duration-300 z-50", isVisible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0")}>
      <div className="flex items-start gap-3">
        <Icon className={cn("w-5 h-5 mt-0.5 flex-shrink-0", { 'text-green-500': toast.type === 'success', 'text-red-500': toast.type === 'error', 'text-yellow-500': toast.type === 'warning', 'text-blue-500': toast.type === 'info' })} />
        <div className="flex-1 min-w-0">
          {toast.title && <p className="font-medium text-sm">{toast.title}</p>}
          {toast.description && <p className="text-sm text-muted-foreground mt-1">{toast.description}</p>}
        </div>
        <button onClick={() => { setIsVisible(false); setTimeout(onRemove, 300); }} className="text-muted-foreground hover:text-foreground"><X className="w-4 h-4" /></button>
      </div>
    </div>
  );
};

export const Toaster = () => {
  const [toasts, setToasts] = useState([]);
  useEffect(() => {
    const handleToast = (event) => {
      const toast = { ...event.detail, id: Date.now() };
      setToasts(prev => [...prev, toast]);
    };
    window.addEventListener('show-toast', handleToast);
    return () => window.removeEventListener('show-toast', handleToast);
  }, []);
  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };
  return <>{toasts.map(toast => <Toast key={toast.id} toast={toast} onRemove={() => removeToast(toast.id)} />)}</>;
};

export const Dialog = ({ open, onOpenChange, children }) => {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && open) onOpenChange?.(false);
    };
    if (open) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [open, onOpenChange]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => onOpenChange?.(false)} />
      {children}
    </div>
  );
};

export const DialogContent = forwardRef(({ className, children, ...props }, ref) => (
  <div ref={ref} className={cn("relative bg-background border rounded-lg shadow-lg max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto", className)} {...props}>{children}</div>
));
DialogContent.displayName = "DialogContent";

export const DialogHeader = ({ className, ...props }) => <div className={cn("flex flex-col space-y-1.5 p-6 pb-4", className)} {...props} />;
export const DialogTitle = forwardRef(({ className, ...props }, ref) => <h2 ref={ref} className={cn("text-lg font-semibold leading-none tracking-tight", className)} {...props} />);
DialogTitle.displayName = "DialogTitle";
export const DialogClose = ({ onClick, ...props }) => <Button variant="ghost" size="icon" className="absolute right-4 top-4" onClick={onClick} {...props}><X className="h-4 w-4" /></Button>;
export const Label = forwardRef(({ className, ...props }, ref) => <label ref={ref} className={cn("text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70", className)} {...props} />);
Label.displayName = "Label";
export const DialogFooter = ({ className, ...props }) => <div className={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 p-6 pt-0", className)} {...props} />;
DialogFooter.displayName = "DialogFooter";

export const Table = forwardRef(({ className, ...props }, ref) => <div className="relative w-full overflow-auto"><table ref={ref} className={cn("w-full caption-bottom text-sm", className)} {...props} /></div>);
Table.displayName = "Table";
export const TableHeader = forwardRef(({ className, ...props }, ref) => <thead ref={ref} className={cn("[&_tr]:border-b", className)} {...props} />);
TableHeader.displayName = "TableHeader";
export const TableBody = forwardRef(({ className, ...props }, ref) => <tbody ref={ref} className={cn("[&_tr:last-child]:border-0", className)} {...props} />);
TableBody.displayName = "TableBody";
export const TableRow = forwardRef(({ className, ...props }, ref) => <tr ref={ref} className={cn("border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted", className)} {...props} />);
TableRow.displayName = "TableRow";
export const TableHead = forwardRef(({ className, ...props }, ref) => <th ref={ref} className={cn("h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0", className)} {...props} />);
TableHead.displayName = "TableHead";
export const TableCell = forwardRef(({ className, ...props }, ref) => <td ref={ref} className={cn("p-4 align-middle [&:has([role=checkbox])]:pr-0", className)} {...props} />);
TableCell.displayName = "TableCell";

const DropdownMenuContext = createContext({ isOpen: false, setIsOpen: () => { } });
export const DropdownMenu = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  return <DropdownMenuContext.Provider value={{ isOpen, setIsOpen }}><div className="relative inline-block text-left">{children}</div></DropdownMenuContext.Provider>;
};
export const DropdownMenuTrigger = ({ children, asChild = false }) => {
  const { setIsOpen } = useContext(DropdownMenuContext);
  const child = React.Children.only(children);
  if (asChild) return React.cloneElement(child, { ...child.props, onClick: (e) => { setIsOpen(prev => !prev); if (child.props.onClick) child.props.onClick(e); } });
  return <div onClick={() => setIsOpen(prev => !prev)}>{children}</div>;
};
export const DropdownMenuContent = ({ children, className, align = 'end' }) => {
  const { isOpen, setIsOpen } = useContext(DropdownMenuContext);
  const menuRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) setIsOpen(false);
    };
    if (isOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, setIsOpen]);
  if (!isOpen) return null;
  return <div ref={menuRef} className={cn("absolute z-50 mt-2 w-56 rounded-md shadow-lg bg-background border ring-1 ring-black ring-opacity-5 focus:outline-none", align === 'end' ? 'right-0 origin-top-right' : 'left-0 origin-top-left', className)}><div className="py-1" role="menu" aria-orientation="vertical">{children}</div></div>;
};
export const DropdownMenuItem = ({ children, className, onClick, ...props }) => {
  const { setIsOpen } = useContext(DropdownMenuContext);
  return <button className={cn("block w-full text-left px-4 py-2 text-sm text-foreground hover:bg-accent", className)} onClick={(e) => { if (onClick) onClick(e); setIsOpen(false); }} {...props}>{children}</button>;
};
export const DropdownMenuLabel = ({ children, className, ...props }) => <div className={cn("px-4 py-2 text-sm font-semibold text-muted-foreground", className)} {...props}>{children}</div>;
export const DropdownMenuSeparator = ({ className, ...props }) => <div className={cn("h-px my-1 bg-border", className)} {...props} />;