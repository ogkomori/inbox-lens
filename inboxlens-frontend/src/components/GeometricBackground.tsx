const GeometricBackground = ({ topOffset = 0 }: { topOffset?: number }) => {
  return (
    <div
      className="absolute left-0 right-0 bottom-0 overflow-hidden pointer-events-none z-0"
      style={{ top: topOffset }}
    >

      {/* Main blurred shapes */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl"></div>
      <div className="absolute top-40 right-20 w-48 h-48 bg-primary-glow/15 rotate-45 rounded-3xl blur-2xl"></div>
      <div className="absolute bottom-32 left-1/4 w-72 h-72 bg-primary/12 rounded-full blur-3xl"></div>

      {/* Additional blurred shapes */}
      <div className="absolute top-1/4 left-1/4 w-48 h-48 bg-primary-glow/10 rounded-full blur-2xl"></div>
      <div className="absolute top-1/2 right-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl"></div>
    </div>
  );
};

export default GeometricBackground;