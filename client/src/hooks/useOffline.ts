import { useEffect, useState } from "react";

export function useOffline() {
  const [status, setStatus] = useState(navigator.onLine);

  useEffect(() => {
    function change() {
      setStatus(navigator.onLine);
    }

    window.addEventListener("online", change);
    window.addEventListener("offline", change);

    return () => {
      window.removeEventListener("online", change);
      window.removeEventListener("offline", change);
    };
  });

  return status;
}
