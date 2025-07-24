const GeometricBackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Large geometric shapes */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
      <div className="absolute top-40 right-20 w-48 h-48 bg-primary-glow/10 rotate-45 rounded-3xl blur-2xl"></div>
      <div className="absolute bottom-32 left-1/4 w-72 h-72 bg-primary/8 rounded-full blur-3xl"></div>

      {/* Additional scattered shapes */}
      <div className="absolute top-10 right-1/3 w-40 h-40 bg-primary/10 rounded-full blur-2xl"></div>
      <div className="absolute bottom-10 left-1/3 w-32 h-32 bg-primary-glow/20 rounded-3xl blur-2xl"></div>
      <div className="absolute top-1/4 left-1/12 w-24 h-24 bg-primary/15 rounded-full blur-xl"></div>
      <div className="absolute bottom-1/5 right-1/6 w-28 h-28 bg-primary-glow/15 rounded-2xl blur-xl"></div>
      <div className="absolute top-1/2 right-10 w-20 h-20 bg-primary/10 rounded-full blur-lg"></div>
      <div className="absolute bottom-1/4 left-10 w-16 h-16 bg-primary-glow/10 rounded-2xl blur-lg"></div>

      {/* Floating geometric elements */}
      <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className="relative">
          {/* Hexagon */}
          <div className="w-32 h-32 bg-primary/10 transform rotate-12 clip-polygon animate-pulse" 
               style={{
                 clipPath: 'polygon(30% 0%, 70% 0%, 100% 50%, 70% 100%, 30% 100%, 0% 50%)',
                 animationDuration: '4s'
               }}>
          </div>
          
          {/* Triangle */}
          <div className="absolute -top-16 -right-16 w-24 h-24 bg-primary-glow/15 transform rotate-45 animate-bounce" 
               style={{
                 clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
                 animationDuration: '6s'
               }}>
          </div>
          
          {/* Diamond */}
          <div className="absolute -bottom-12 -left-12 w-20 h-20 bg-primary/20 transform rotate-12 animate-pulse" 
               style={{
                 clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
                 animationDuration: '8s'
               }}>
          </div>
        </div>
      </div>

      {/* More floating geometric elements in other areas */}
      <div className="absolute top-1/5 right-1/4">
        <div className="relative">
          {/* Hexagon */}
          <div
            className="w-16 h-16 bg-primary/10 transform rotate-6 animate-pulse"
            style={{
              clipPath: "polygon(30% 0%, 70% 0%, 100% 50%, 70% 100%, 30% 100%, 0% 50%)",
              animationDuration: "5s",
            }}
          ></div>
        </div>
      </div>
      <div className="absolute bottom-1/6 left-1/5">
        <div className="relative">
          {/* Triangle */}
          <div
            className="w-12 h-12 bg-primary-glow/20 transform rotate-12 animate-bounce"
            style={{
              clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)",
              animationDuration: "7s",
            }}
          ></div>
        </div>
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 opacity-[0.02]" 
           style={{
             backgroundImage: `linear-gradient(hsl(142 76% 36%) 1px, transparent 1px), 
                              linear-gradient(90deg, hsl(142 76% 36%) 1px, transparent 1px)`,
             backgroundSize: '50px 50px'
           }}>
      </div>
      
      {/* Scattered dots */}
      <div className="absolute top-1/4 left-3/4 w-2 h-2 bg-primary/30 rounded-full animate-ping" style={{ animationDuration: '3s' }}></div>
      <div className="absolute bottom-1/3 left-1/6 w-3 h-3 bg-primary-glow/40 rounded-full animate-ping" style={{ animationDuration: '5s' }}></div>
      <div className="absolute top-2/3 right-1/3 w-1.5 h-1.5 bg-primary/50 rounded-full animate-ping" style={{ animationDuration: '7s' }}></div>
      {/* More scattered dots */}
      <div className="absolute top-1/6 right-1/5 w-2 h-2 bg-primary/20 rounded-full animate-ping" style={{ animationDuration: '4s' }}></div>
      <div className="absolute bottom-1/8 left-1/8 w-2.5 h-2.5 bg-primary-glow/30 rounded-full animate-ping" style={{ animationDuration: '6s' }}></div>
      {/* Even more scattered dots for better spread */}
      <div className="absolute top-8 left-1/2 w-2 h-2 bg-primary/25 rounded-full animate-ping" style={{ animationDuration: '4.5s' }}></div>
      <div className="absolute bottom-12 right-1/4 w-2.5 h-2.5 bg-primary-glow/25 rounded-full animate-ping" style={{ animationDuration: '5.5s' }}></div>
      <div className="absolute top-1/3 left-10 w-1.5 h-1.5 bg-primary/40 rounded-full animate-ping" style={{ animationDuration: '3.5s' }}></div>
      <div className="absolute bottom-1/4 right-1/3 w-2 h-2 bg-primary-glow/35 rounded-full animate-ping" style={{ animationDuration: '6.5s' }}></div>
      <div className="absolute top-2/5 right-12 w-2 h-2 bg-primary/30 rounded-full animate-ping" style={{ animationDuration: '5.2s' }}></div>
    </div>
  );
};

export default GeometricBackground;