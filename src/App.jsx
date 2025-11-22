import { useEffect, useRef, useState } from "react";
import { doc, onSnapshot, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./firebaseConfig";
import bunny from "./assets/bunny.jpg";
import duck_clueless from "./assets/duck_clueless.jpg";
import duck_rain from "./assets/duck_rain.jpg";
import duck_wink from "./assets/duck_wink.jpg";
import mm_hug from "./assets/mm_hug.jpg";
import "./App.css";

function App() {
  const [note, setNote] = useState("");
  const [status, setStatus] = useState("");
  const [widget, setWidget] = useState({});
  const [theme, setTheme] = useState("");

  const [widgetBgImg, setWidgetBgImg] = useState("");

  // HARDCODE YOUR COUPLE CODE HERE (Since this is just for you)
  const MY_CODE = "AGSUUL";
  // Themes
  const THEMES = [
    { id: "duck_wink", color: "#f7cbb0", label: "🐣" },
    { id: "bunny", color: "#F0D0C1", label: "🐰" },
    { id: "duck_rain", color: "#D6DBE1", label: "🦆" },
    { id: "duck_clueless", color: "#FFD6D8", label: "🦢" },
    { id: "mm_hug", color: "#F7E1C9", label: "🐻" },
  ];

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
          theme: data?.theme,
        }));

        // set the theme
        switch (data?.theme) {
          case "bunny":
            setWidgetBgImg(`url(${bunny})`);
            break;
          case "duck_wink":
            setWidgetBgImg(`url(${duck_wink})`);
            break;
          case "duck_rain":
            setWidgetBgImg(`url(${duck_rain})`);
            break;
          case "duck_clueless":
            setWidgetBgImg(`url(${duck_clueless})`);
            break;
          case "mm_hug":
            setWidgetBgImg(`url(${mm_hug})`);
            break;

          default:
            break;
        }
      }
    });

    return () => unsubscribe();
  }, [MY_CODE]); // Re-run if code changes

  const sendNote = async () => {
    if (!note) return;
    setStatus("Sending...");

    try {
      if (theme !== "")
        await setDoc(
          doc(db, "couples", MY_CODE),
          {
            text: note,
            timestamp: serverTimestamp(),
            sender: "— Asutosh",
            theme,
            type: "text",
          },
          { merge: true }
        );
      else
        await setDoc(
          doc(db, "couples", MY_CODE),
          {
            text: note,
            timestamp: serverTimestamp(),
            sender: "— Asutosh",
            type: "text",
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

      <div
        className="widget"
        style={{
          backgroundImage: widgetBgImg,
          backgroundSize: "cover", // Fill container
          backgroundPosition: "center", // Center subject
          backgroundRepeat: "no-repeat",
        }}
      >
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

      <div className="theme_picker">
        {THEMES.map((t) => {
          return (
            <div
              key={t.id}
              id={t.id}
              style={{ background: `${t.color}` }}
              className={`theme_select ${t.id === theme && " selected"}`}
              onClick={() => {
                setTheme((prev) => {
                  console.log("setting theme to", t.id);
                  return t.id;
                });
              }}
            >
              {t.label}
            </div>
          );
        })}
      </div>

      <button onClick={sendNote} className="send-btn">
        SEND NOTE
      </button>

      <p className="status-text">{status}</p>
    </div>
  );
}

export default App;
