// components/ui/dialog.js
export const Dialog = ({ children }) => {
    return (
      <div className="dialog-overlay">
        <div className="dialog-content">
          {children}
        </div>
      </div>
    );
  };
  
  export const DialogTrigger = ({ children }) => {
    return <button>{children}</button>;
  };
  
  export const DialogContent = ({ children, className }) => {
    return <div className={`dialog-box ${className}`}>{children}</div>;
  };
  