

// This component now acts as a pure structural wrapper if needed, 
// but for this specific request, I will integrate the logic in Dashboard.tsx 
// to avoid prop drilling complex state for the split view.
// Here we just provide a container.

const Layout: React.FC<{children: React.ReactNode}> = ({ children }) => {
  return (
    <div className="h-screen w-full bg-background flex overflow-hidden">
      {children}
    </div>
  );
};

export default Layout;