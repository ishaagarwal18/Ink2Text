export default function ThemeTestPage() {
  return (
    <div className="min-h-screen p-8 bg-background text-foreground">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold">Theme Test Page</h1>
        
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Color Palette</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-lg bg-background border-2 border-border">
              <p className="text-sm font-medium text-muted-foreground">Background</p>
            </div>
            
            <div className="p-4 rounded-lg bg-card">
              <p className="text-sm font-medium text-card-foreground">Card</p>
            </div>
            
            <div className="p-4 rounded-lg bg-primary text-primary-foreground">
              <p className="text-sm font-medium">Primary</p>
            </div>
            
            <div className="p-4 rounded-lg bg-secondary text-secondary-foreground">
              <p className="text-sm font-medium">Secondary</p>
            </div>
            
            <div className="p-4 rounded-lg bg-muted text-muted-foreground">
              <p className="text-sm font-medium">Muted</p>
            </div>
            
            <div className="p-4 rounded-lg bg-accent text-accent-foreground">
              <p className="text-sm font-medium">Accent</p>
            </div>
            
            <div className="p-4 rounded-lg bg-border">
              <p className="text-sm font-medium text-foreground">Border</p>
            </div>
            
            <div className="p-4 rounded-lg bg-destructive text-destructive-foreground">
              <p className="text-sm font-medium">Destructive</p>
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Typography</h2>
          <p className="text-sm text-muted-foreground">This text should be readable in both light and dark modes</p>
          <p>Regular paragraph text looks like this.</p>
          <h3 className="text-xl font-semibold">Subheading</h3>
          <p>Check the theme toggle button in the navbar to switch between light and dark modes.</p>
        </div>
      </div>
    </div>
  );
}
