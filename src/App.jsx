import { useEffect, useState } from "react";
import {
  doc,
  onSnapshot,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./firebaseConfig";
import "./App.css";

function App() {
  const [note, setNote] = useState("");
  const [status, setStatus] = useState("");
  const [widget, setWidget] = useState({});

  // HARDCODE YOUR COUPLE CODE HERE (Since this is just for you)
  const MY_CODE = "LFEDCD";

  useEffect(() => {
    if (!MY_CODE) return;

    const noteRef = doc(db, "couples", MY_CODE);

    const unsubscribe = onSnapshot(noteRef, (documentSnapshot) => {
      if (documentSnapshot.exists()) {
        const data = documentSnapshot.data();

        // 3. Format the Time
        let timeString = "Just now";
        if (data?.timestamp) {
          const date = data.timestamp.toDate();
          timeString = date.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          });
        }

        setWidget((prev) => ({
          ...prev,
          text: data?.text || "Welcome!",
          sender: data?.sender || "",
          timeString,
        }));
      }
    });

    return () => unsubscribe();
  }, [MY_CODE]); // Re-run if code changes

  const sendNote = async () => {
    if (!note) return;
    setStatus("Sending...");

    try {
      await setDoc(
        doc(db, "couples", MY_CODE),
        {
          text: note,
          timestamp: serverTimestamp(),
          sender: "— Asutosh",
        },
        { merge: true }
      );

      setNote("");
      setStatus("Sent! 💖");
      setTimeout(() => setStatus(""), 2000);
    } catch (e) {
      setStatus("Error ❌");
    }
  };

  return (
    <div className="container">
      <h1>PostHeart Web 💌</h1>
      <p>Sending to Gul (Code: {MY_CODE})</p>

      <div className="widget">
        <div className="widget_header">💖 Post Heart</div>
        <hr />
        <div className="widget_body">"{widget?.text}"</div>
        <div className="widget_footer">
          <span className="footer_sender">{widget?.sender}</span>
          <span className="footer_time">{widget?.timeString}</span>
        </div>
      </div>

      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Type a note..."
        className="note-field"
      />

      <button onClick={sendNote} className="send-btn">
        SEND NOTE
      </button>

      <p className="status-text">{status}</p>
    </div>
  );
}

export default App;
