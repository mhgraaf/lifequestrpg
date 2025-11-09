
import { useEffect, useState } from 'react';

function UpdateBanner() {
  const [available, setAvailable] = useState(false);

  useEffect(() => {
    function onUpdate() { setAvailable(true); }
    window.addEventListener('sw.updatefound', onUpdate);
    return () => window.removeEventListener('sw.updatefound', onUpdate);
  }, []);

  if (!available) return null;

  return (
    <div style={{
      position: 'fixed', left: 12, right: 12, bottom: 18, padding: 12, background: '#071124', color: 'white',
      borderRadius: 8, boxShadow: '0 6px 18px rgba(0,0,0,0.3)', zIndex: 9999, textAlign: 'center'
    }}>
      <div style={{marginBottom: 6}}>A new version of LifeQuest is available.</div>
      <div style={{display: 'flex', gap: 8, justifyContent: 'center'}}>
        <button onClick={() => location.reload()} style={{padding: '6px 10px'}}>Update now</button>
        <button onClick={() => { setAvailable(false); }} style={{padding: '6px 10px'}}>Not now</button>
      </div>
    </div>
  );
}


export default function App(){
  return (
    <>
      <UpdateBanner />
      <MainApp />
    </>
  )
}

import LifeRPG from './components/LifeRPG.jsx'

function MainApp() {
  return <LifeRPG />
}
