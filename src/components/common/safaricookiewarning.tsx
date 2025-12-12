import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

interface SafariCookieWarningProps {
  showWarning: boolean;
  onRefresh: () => void;
  onCancel: () => void;
}

// Safari Cookie Warning Component
// Shows modal when login fails on Safari due to cross-site tracking
export const SafariCookieWarning: React.FC<SafariCookieWarningProps> = ({
  showWarning,
  onRefresh,
  onCancel,
}) => {
  const [isSafari, setIsSafari] = useState(false);

  useEffect(() => {
    const isSafariBrowser = /^((?!chrome|android).)*safari/i.test(
      navigator.userAgent
    );
    setIsSafari(isSafariBrowser);
  }, []);

  if (!showWarning || !isSafari) {
    return null;
  }

  return (
    <Dialog open={showWarning} onOpenChange={(open) => !open && onCancel()}>
      <DialogContent className="sm:max-w-md">
        <DialogTitle className="text-xl font-semibold">
          Safari is blocking cookies. To use this app:
        </DialogTitle>
        <DialogDescription className="space-y-3 pt-4">
          <ol className="list-decimal list-inside space-y-2 text-left">
            <li>Go to Safari → Settings → Privacy</li>
            <li>Uncheck &apos;Prevent Cross-Site Tracking&apos;</li>
            <li>Refresh this page</li>
          </ol>
          <p className="text-sm text-gray-600 pt-2">
            Click OK to refresh now, or Cancel to try again.
          </p>
        </DialogDescription>
        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={onRefresh}>OK</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
