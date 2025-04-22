import { Loader2 } from "lucide-react";

interface LoadingOverlayProps {
  message?: string;
  description?: string;
}

export default function LoadingOverlay({ 
  message = "AI is thinking...", 
  description = "Please wait while our AI evaluates the creativity battle."
}: LoadingOverlayProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-8 max-w-md w-full text-center">
        <div className="animate-bounce-slow mb-4">
          <Loader2 className="h-12 w-12 mx-auto text-primary animate-spin" />
        </div>
        <h3 className="text-xl font-heading font-bold mb-2">{message}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
    </div>
  );
}
