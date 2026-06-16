import React, { useState, useEffect, useRef } from 'react';
import { Routes, Route, NavLink, useNavigate, useLocation } from 'react-router-dom';
import SobrietyCounter from './components/SobrietyCounter';
import MotivationSection from './components/MotivationSection';
import HelpDirectory from './components/HelpDirectory';
import Achievements from './components/Achievements';
import EducationSection from './components/EducationSection';
import CompanionView from './components/CompanionView';
import NotificationsPanel from './components/NotificationsPanel';
import Settings from './components/Settings';
import SavingsCalculator from './components/SavingsCalculator';
import MoodTracker from './components/MoodTracker';
import WhyIStarted from './components/WhyIStarted';
import Challenges from './components/Challenges';
import RelaxingExercises from './components/RelaxingExercises';
import StatisticsChart from './components/StatisticsChart';
import MedicationTracker from './components/MedicationTracker';
import TherapistSpace from './components/TherapistSpace';
import Community from './components/Community';
import { ShieldCheck, AlertTriangle, Home, BookOpen, Share2, Settings as SettingsIcon, LogIn, LogOut, Save, EyeOff, Users, HeartPulse } from 'lucide-react';
import Swal from 'sweetalert2';
import { auth, db, googleProvider } from './firebase';
import { signInAnonymously, onAuthStateChanged, signInWithPopup, linkWithPopup, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc, collection, addDoc } from 'firebase/firestore';
import { differenceInDays } from 'date-fns';

function App() {
  const [startDate, setStartDate] = useState(() => {
    const stored = localStorage.getItem('sobrietyStartDate');
    return stored ? new Date(stored) : null;
  });
  const [showPanic, setShowPanic] = useState(false);
  const [user, setUser] = useState(null);

  const isExplicitLogout = useRef(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect to home if on a protected route and not logged in
  useEffect(() => {
    if (!user && !startDate && (location.pathname === '/settings' || location.pathname === '/education')) {
      navigate('/');
    }
  }, [user, startDate, location, navigate]);

  useEffect(() => {
    // Determine if we should auto-sign in anonymously
    // We only do this if there's no user logic handled yet (auth state is null initially, but onAuthStateChanged fires)
    // Actually, onAuthStateChanged will handle restoration.
    // We only force anonymous if we are sure user isn't trying to login.
    // For simplicity, we keep the existing logic but handle errors if already logged in.

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Reset logout flag on successful login
        isExplicitLogout.current = false;

        // Load data from Firestore
        const docRef = doc(db, "users", currentUser.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists() && docSnap.data().startDate) {
          const cloudDate = new Date(docSnap.data().startDate);
          setStartDate(cloudDate);
          localStorage.setItem('sobrietyStartDate', cloudDate.toISOString());
        } else {
          // Fallback to local storage if exists, then sync to cloud
          const storedDate = localStorage.getItem('sobrietyStartDate');
          if (storedDate) {
            const date = new Date(storedDate);
            setStartDate(date);
            await setDoc(docRef, { startDate: date.toISOString() }, { merge: true });
          }
        }
      } else {
        // Only sign in anonymously if explicitly needed or first load?
        // don't auto-sign in if user explicitly logged out
        if (!isExplicitLogout.current) {
          signInAnonymously(auth).catch((error) => {
            // Ignore error if multiple tabs etc, or handle gracefully
            console.log("Anonymous auth fallback");
          });
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const handleStart = async () => {
    const now = new Date();

    // Save history if there was a previous streak
    if (user && startDate) {
      try {
        const days = differenceInDays(now, new Date(startDate));
        if (days > 0) {
          await addDoc(collection(db, "users", user.uid, "history"), {
            startDate: startDate.toISOString(),
            endDate: now.toISOString(),
            daysAchieved: days,
            recordedAt: now.toISOString()
          });
        }
      } catch (e) {
        console.error("Error saving history: ", e);
      }
    }

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
    Swal.fire({
      title: '¿Tuve una recaída?',
      text: '¿Estás seguro de que deseas reiniciar tu contador? Recuerda que una recaída es parte del proceso, no el fin. ¡Vuelve a levantarte!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, reiniciar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#f43f5e',
      background: '#1e293b',
      color: '#f1f5f9'
    }).then((result) => {
      if (result.isConfirmed) {
        handleStart();
      }
    });
  };

  const togglePanic = () => {
    setShowPanic(!showPanic);
  };

  const handleShare = () => {
    if (user) {
      const url = `${window.location.origin}/companion/${user.uid}`;
      navigator.clipboard.writeText(url);
      Swal.fire({
        title: '¡Enlace Copiado!',
        text: 'Compártelo con alguien de confianza.',
        icon: 'success',
        background: '#1e293b',
        color: '#f1f5f9',
        confirmButtonColor: '#38bdf8'
      });
    }
  };

  const handleGoogleLogin = async () => {
    try {
      if (user && user.isAnonymous) {
        // Link account
        await linkWithPopup(user, googleProvider);
        Swal.fire({
          title: 'Conectado',
          text: 'Cuenta vinculada con éxito. Tu progreso ahora está seguro.',
          icon: 'success',
          background: '#1e293b',
          color: '#f1f5f9'
        });
      } else {
        // Normal login
        await signInWithPopup(auth, googleProvider);
      }
    } catch (error) {
      console.error("Auth error:", error);
      if (error.code === 'auth/credential-already-in-use') {
        Swal.fire({
          title: 'Error de Cuenta',
          text: 'Esta cuenta de Google ya está en uso. Por favor cierra sesión e inicia con ella.',
          icon: 'error',
          background: '#1e293b',
          color: '#f1f5f9'
        });
      } else {
        Swal.fire({
          title: 'Error',
          text: 'Error al conectar con Google: ' + error.message,
          icon: 'error',
          background: '#1e293b',
          color: '#f1f5f9'
        });
      }
    }
  };

  const handleLogout = async () => {
    Swal.fire({
      title: '¿Cerrar sesión?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Salir',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#f43f5e',
      background: '#1e293b',
      color: '#f1f5f9'
    }).then(async (result) => {
      if (result.isConfirmed) {
        isExplicitLogout.current = true;
        await signOut(auth);
        setStartDate(null);
        navigate('/');
      }
    });
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="logo">
          <ShieldCheck size={32} className="logo-icon" />
          <h1>Sobriamente</h1>
        </div>
        <div className="header-actions" style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          {user ? (
            <>
              {user.isAnonymous && (
                <button
                  className="auth-btn"
                  onClick={handleGoogleLogin}
                  title="Guardar Progreso"
                  style={{ background: '#fde047', color: '#0f172a', border: 'none', padding: '0.4rem 0.8rem', borderRadius: '12px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.3rem', fontWeight: 'bold' }}
                >
                  <Save size={16} />
                  <span className="btn-text">Guardar</span>
                </button>
              )}
              <button
                className="auth-btn"
                onClick={handleLogout}
                title="Cerrar Sesión"
                style={{ background: 'rgba(255, 255, 255, 0.1)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', padding: '0.4rem', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <LogOut size={18} />
              </button>
            </>
          ) : (
            <button
              className="auth-btn"
              onClick={handleGoogleLogin}
              title="Iniciar Sesión"
              style={{ background: 'var(--primary-color)', color: 'white', border: 'none', padding: '0.4rem 0.8rem', borderRadius: '12px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.3rem', fontWeight: '500' }}
            >
              <LogIn size={16} />
              <span>Entrar</span>
            </button>
          )}
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
          
          <button 
            className="auth-btn" 
            title="Salir rápido"
            onClick={() => window.location.replace("https://google.com")}
            style={{ background: '#000', color: '#fff', border: 'none', padding: '0.5rem', borderRadius: '50%', display: 'flex' }}
          >
            <EyeOff size={20} />
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
                  {user && user.isAnonymous && (
                    <p style={{ marginTop: '1rem', fontSize: '0.9rem', color: 'var(--text-secondary)', cursor: 'pointer', textDecoration: 'underline' }} onClick={handleGoogleLogin}>
                      Ya tengo cuenta / Recuperar progreso
                    </p>
                  )}
                </div>
              ) : (
                <div className="dashboard fade-in">
                  <SobrietyCounter startDate={startDate} onReset={handleReset} />
                  {user && (
                    <>
                      {user.isAnonymous && (
                        <div className="auth-banner" style={{ background: 'rgba(234, 179, 8, 0.1)', border: '1px solid rgba(234, 179, 8, 0.3)', padding: '0.75rem', borderRadius: '12px', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '0.85rem', color: '#fde047' }}>Tu progreso no está guardado.</span>
                          <button onClick={handleGoogleLogin} style={{ background: '#fde047', color: '#0f172a', padding: '0.25rem 0.75rem', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 'bold' }}>Conectar Google</button>
                        </div>
                      )}
                      <NotificationsPanel userId={user.uid} />
                    </>
                  )}
                  <Achievements startDate={startDate} />
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem', marginTop: '1.5rem' }}>
                      <SavingsCalculator startDate={startDate} user={user} />
                      <MoodTracker user={user} />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem', marginTop: '1.5rem' }}>
                      <WhyIStarted user={user} />
                      <Challenges user={user} />
                  </div>
                  <div style={{ marginTop: '1.5rem' }}>
                      <StatisticsChart startDate={startDate} user={user} />
                  </div>
                  <div style={{ marginTop: '1.5rem' }}>
                      <MedicationTracker user={user} />
                  </div>
                  <div style={{ marginTop: '1.5rem' }}>
                      <RelaxingExercises />
                  </div>
                  <MotivationSection />
                </div>
              )
            } />
            <Route path="/education" element={
              <div className="fade-in">
                <EducationSection />
              </div>
            } />
            <Route path="/community" element={<Community />} />
            <Route path="/therapist" element={<TherapistSpace user={user} startDate={startDate} />} />
            <Route path="/settings" element={
              user ? <Settings user={user} startDate={startDate} onUpdateDate={setStartDate} /> : <div className="loading">Inicia sesión para ver ajustes</div>
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
          <NavLink to="/therapist" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <HeartPulse size={24} />
            <span>Terapia</span>
          </NavLink>
          <NavLink to="/community" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <Users size={24} />
            <span>Comunidad</span>
          </NavLink>
          <NavLink to="/settings" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <SettingsIcon size={24} />
            <span>Ajustes</span>
          </NavLink>
        </nav>
      )}
    </div>
  );
}

export default App;
