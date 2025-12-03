import { useEffect } from 'react';

const YeonpickPage = () => {
  useEffect(() => {
    // Optionally request clipboard permissions if needed
    navigator.permissions.query({ name: "clipboard-write" as PermissionName }).then(result => {
      if (result.state === "granted" || result.state === "prompt") {
        console.log("Clipboard access is granted.");
      } else {
        console.error("Clipboard access denied.");
      }
    });

    navigator.permissions.query({ name: "clipboard-read" as PermissionName }).then(result => {
      if (result.state === "granted" || result.state === "prompt") {
        console.log("Clipboard access is granted.");
      } else {
        console.error("Clipboard access denied.");
      }
    });
  }, []);

  return (
    <div style={{ textAlign: 'center'}}>
      <iframe
        src="https://www.yeonpick.kr"
        style={{ width: '100%', height: '100vh', border: 'none'}}
        title="yeonpick"
        allow="clipboard-read clipboard-write"
      />
    </div>
  );
};

export default YeonpickPage;
