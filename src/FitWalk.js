import React, { useState, useEffect } from "react";
import "./index.css";

export default function FitWalk() {
  const [distance, setDistance] = useState(0);
  const [coins, setCoins] = useState(0);
  const [motivation, setMotivation] = useState("Let's get moving!");
  const [isWalking, setIsWalking] = useState(false);
  const [lastPosition, setLastPosition] = useState(null);

  useEffect(() => {
    if (isWalking && navigator.geolocation) {
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          if (lastPosition) {
            const dist = calculateDistance(
              lastPosition.latitude,
              lastPosition.longitude,
              latitude,
              longitude
            );
            setDistance((prev) => {
              const newDistance = prev + dist;
              if (Math.floor(newDistance / 500) > Math.floor(prev / 500)) {
                setCoins((c) => c + 10);
                setMotivation("Awesome! Keep going!");
              } else if (Math.floor(newDistance / 250) > Math.floor(prev / 250)) {
                setMotivation("Halfway to a reward! 🏃‍♂️");
              }
              return newDistance;
            });
          }
          setLastPosition({ latitude, longitude });
        },
        (error) => console.error("Geolocation error:", error),
        { enableHighAccuracy: true, maximumAge: 10000, timeout: 10000 }
      );
      return () => navigator.geolocation.clearWatch(watchId);
    }
  }, [isWalking, lastPosition]);

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371000;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const foodTips = [
    "💧 Stay hydrated! Drink plenty of water.",
    "🍌 Try a banana or nuts for energy.",
    "⛔ Avoid heavy meals before long walks.",
    "🍓 Eat colorful fruits post-walk."
  ];

  return (
    <div className="container">
      <h1 className="title">💪 Fit Walk - Track & Transform</h1>

      <div className="card">
        <h2>📍 Live Location</h2>
        {lastPosition ? (
          <iframe
            title="live-location"
            width="100%"
            height="300"
            style={{ borderRadius: '1rem' }}
            loading="lazy"
            allowFullScreen
            src={`https://maps.google.com/maps?q=${lastPosition.latitude},${lastPosition.longitude}&z=16&output=embed`}
          ></iframe>
        ) : (
          <p>Start walking to view your location on the map.</p>
        )}
      </div>

      <div className="card">
        <h2>🔯 Progress</h2>
        <progress value={(distance % 500) / 5} max="100" />
        <p>Distance: <strong>{distance.toFixed(2)} meters</strong></p>
      </div>

      <div className="card">
        <h2>🏰 Your Rewards</h2>
        <p className="coins">
          ✨ {coins.toFixed(0)} Coins
        </p>
      </div>

      <div className="card">
        <h2>🍽 Food Advice</h2>
        <ul>
          {foodTips.map((tip, idx) => (
            <li key={idx}>{tip}</li>
          ))}
        </ul>
      </div>

      <div className="card">
        <h2>💬 Motivation Boost</h2>
        <p className="motivation">{motivation}</p>
      </div>

      <div className="button-group">
        <button className="start" onClick={() => {
          setIsWalking((w) => !w);
          if (!isWalking) setLastPosition(null);
        }}>
          {isWalking ? "⏸ Pause Walk" : "▶️ Start Walk"}
        </button>

        <button className="reset" onClick={() => {
          setDistance(0);
          setCoins(0);
          setMotivation("Let's get moving!");
          setIsWalking(false);
          setLastPosition(null);
        }}>
          🔁 Restart
        </button>
      </div>

      <footer style={{ marginTop: "3rem", padding: "1rem 0", borderTop: "1px solid #555", color: "#aaa", textAlign: "center", fontSize: "0.9rem" }}>
        © {new Date().getFullYear()} Fit Walk. Stay healthy. Stay inspired. 🚶‍♂️✨
      </footer>
    </div>
  );
}
