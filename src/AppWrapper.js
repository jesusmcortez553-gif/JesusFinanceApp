import React from 'react';
import { useAuth } from './hooks/useAuth';
import { useData } from './hooks/useData';
import Login from './Login';
import App from './App';

export default function AppWrapper() {
  const { user, loading: authLoading, login, logout } = useAuth();
  const data = useData(user?.uid);

  if (authLoading) {
    return (
      <div style={{
        minHeight:'100vh',
        background:'linear-gradient(135deg,#5b21b6,#4f46e5)',
        display:'flex', alignItems:'center', justifyContent:'center',
      }}>
        <div style={{textAlign:'center'}}>
          <div style={{width:48,height:48,borderRadius:16,background:'rgba(255,255,255,0.2)',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 16px'}}>
            <div style={{width:24,height:24,border:'3px solid rgba(255,255,255,0.8)',borderTopColor:'transparent',borderRadius:'50%',animation:'spin 0.8s linear infinite'}}/>
          </div>
          <div style={{color:'rgba(255,255,255,0.7)',fontSize:14,fontFamily:'sans-serif'}}>Cargando...</div>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Login onLogin={login} />;
  }

  return <App user={user} data={data} onLogout={logout} />;
}
