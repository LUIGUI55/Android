import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import SobrietyCounter from './components/SobrietyCounter';
import MotivationSection from './components/MotivationSection';
import HelpDirectory from './components/HelpDirectory';
import Achievements from './components/Achievements';
import EducationSection from './components/EducationSection';
import CompanionView from './components/CompanionView';
import { ShieldCheck, AlertTriangle, Home, BookOpen, Share2 } from 'lucide-react';
import { auth, db } from './firebase';
import { signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

function App() {
  const [startDate, setStartDate] = useState(null);
  const [showPanic, setShowPanic] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Authenticate user anonymously
    signInAnonymously(auth).catch((error) => {
      console.error("Error signing in anonymously:", error);
    });

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        // Load data from Firestore
        const docRef = doc(db, "users", currentUser.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setStartDate(new Date(docSnap.data().startDate));
        } else {
          // Fallback to local storage if exists, then sync to cloud
          const storedDate = localStorage.getItem('sobrietyStartDate');
          if (storedDate) {
            const date = new Date(storedDate);
            setStartDate(date);
            await setDoc(docRef, { startDate: date.toISOString() });
          }
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const handleStart = async () => {
    const now = new Date();
    setStartDate(now);
    localStorage.setItem('sobrietyStartDate', now.toISOString());

    if (user) {
      try {
        await setDoc(doc(db, "users", user.uid), {
          startDate: now.toISOString()
        }, { merge: true });
      } catch (e) {
        console.error("Error adding document: ", e);
      }
    }
  };

  const handleReset = () => {
    if (confirm("¿Estás seguro de que deseas reiniciar tu contador? Recuerda que una recaída es parte del proceso, no el fin.")) {
      handleStart();
    }
  };

  const togglePanic = () => {
    setShowPanic(!showPanic);
  };

  const handleShare = () => {
    if (user) {
      const url = `${window.location.origin}/companion/${user.uid}`;
      navigator.clipboard.writeText(url);
      alert("Enlace copiado al portapapeles. Compártelo con alguien de confianza.");
    }
  };

  return (
    <Router>
      <div className="app-container">
        <header className="app-header">
          <div className="logo">
            <ShieldCheck size={32} className="logo-icon" />
            <h1>Sobriamente</h1>
          </div>
          <div className="header-actions" style={{ display: 'flex', gap: '0.5rem' }}>
            {startDate && !showPanic && (
              <button className="panic-toggle" onClick={handleShare} title="Compartir progreso">
                <Share2 size={20} />
              </button>
            )}
            <button
              className={`panic-toggle ${showPanic ? 'active' : ''}`}
              onClick={togglePanic}
            >
              <AlertTriangle size={20} />
              {showPanic ? 'Cerrar' : 'Ayuda'}
            </button>
          </div>
        </header>

        <main className="app-content">
          {showPanic ? (
            <div className="panic-view fade-in">
              <h2>Estamos contigo</h2>
              <p>Si sientes que vas a recaer, respira profundo. No estás solo.</p>
              <HelpDirectory />
              <div className="emergency-actions">
                <button className="emergency-btn" onClick={handleReset}>
                  Tuve una recaída (Reiniciar)
                </button>
              </div>
            </div>
          ) : (
            <Routes>
              <Route path="/" element={
                !startDate ? (
                  <div className="welcome-screen fade-in">
                    <h2>Bienvenido a tu nueva vida</h2>
                    <p>El primer paso es el más importante.</p>
                    <button className="start-btn" onClick={handleStart}>
                      Comenzar mi viaje hoy
                    </button>
                  </div>
                ) : (
                  <div className="dashboard fade-in">
                    <SobrietyCounter startDate={startDate} onReset={handleReset} />
                    <Achievements startDate={startDate} />
                    <MotivationSection />
                  </div>
                )
              } />
              <Route path="/education" element={
                <div className="fade-in">
                  <EducationSection />
                </div>
              } />
              <Route path="/companion/:userId" element={<CompanionView />} />
            </Routes>
          )}
        </main>

        {!showPanic && startDate && (
          <nav className="nav-bar">
            <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <Home size={24} />
              <span>Inicio</span>
            </NavLink>
            <NavLink to="/education" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <BookOpen size={24} />
              <span>Aprender</span>
            </NavLink>
          </nav>
        )}
      </div>
    </Router>
  );
}

export default App;
