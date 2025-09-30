const LoadingSpinner = ({ message = "Loading..." }: { message?: string }) => (
  <div className="min-h-screen flex flex-col items-center justify-center" role="status" aria-live="polite">
    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-primary border-solid mb-4" aria-label={message}></div>
    <div className="text-lg text-muted-foreground poppins-regular">{message}</div>
  </div>
);

export default LoadingSpinner;
