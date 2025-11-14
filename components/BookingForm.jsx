import { useState, useEffect } from 'react';
import { collection, addDoc, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';

const timeSlots = [
  '09:00','09:40','10:20','11:00','11:40','12:20','13:00','13:40','14:20','15:00','15:40','16:20','17:00','17:40','18:20'
];

export default function BookingForm() {
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [servicio, setServicio] = useState('Corte');
  const [fecha, setFecha] = useState('');
  const [hora, setHora] = useState('');
  const [bookings, setBookings] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(()=>{
    if (fecha) loadBookings(fecha);
  },[fecha]);

  async function loadBookings(fechaStr){
    const q = query(collection(db,'citas'), where('fecha','==',fechaStr), orderBy('hora'));
    const snap = await getDocs(q);
    setBookings(snap.docs.map(d=>d.data()));
  }

  async function horarioOcupado(fechaStr, horaStr){
    return bookings.some(b=>b.hora === horaStr);
  }

  function toMinutes(t){ const [h,m]=t.split(':').map(Number); return h*60+m; }

  function sugerirHorario(fechaStr, horaStr){
    const libres = timeSlots.filter(t=>!bookings.some(b=>b.hora===t));
    if(libres.length===0) return null;
    const target = toMinutes(horaStr);
    let best = libres[0]; let bestDiff = Math.abs(toMinutes(best)-target);
    libres.forEach(slot=>{ const diff=Math.abs(toMinutes(slot)-target); if(diff<bestDiff){best=slot; bestDiff=diff;} });
    return best;
  }

  async function onSubmit(e){
    e.preventDefault();
    if(!fecha||!hora) { setMessage('Selecciona fecha y hora'); return; }
    if(await horarioOcupado(fecha,hora)){
      const sug = sugerirHorario(fecha,hora);
      setMessage(sug?`❌ Ese horario está ocupado. Sugerencia: ${sug}`:`❌ Ese horario está ocupado. No hay alternativos.`);
      return;
    }

    await addDoc(collection(db,'citas'), { nombre, telefono, servicio, fecha, hora, creado: new Date().toISOString() });
    setMessage('✅ Cita agendada! Se abrió WhatsApp para confirmar.');
    const texto = encodeURIComponent(`Hola ${nombre}, tu cita en Sport Barber quedó para ${fecha} a las ${hora}.`);
    window.open(`https://wa.me/?text=${texto}`,'_blank');
    setNombre(''); setTelefono(''); setHora('');
    loadBookings(fecha);
  }

  return (
    <div className="card">
      <h2>Agenda tu cita</h2>
      <form onSubmit={onSubmit} id="bookingForm">
        <label>Nombre</label>
        <input value={nombre} onChange={e=>setNombre(e.target.value)} required />
        <label>Teléfono</label>
        <input value={telefono} onChange={e=>setTelefono(e.target.value)} required />
        <label>Servicio</label>
        <select value={servicio} onChange={e=>setServicio(e.target.value)}>
          <option>Corte</option>
          <option>Barba</option>
          <option>Corte + Barba</option>
        </select>
        <label>Fecha</label>
        <input type="date" value={fecha} onChange={e=>setFecha(e.target.value)} required />
        <label>Hora</label>
        <select value={hora} onChange={e=>setHora(e.target.value)} required>
          <option value="">Seleccionar...</option>
          {timeSlots.map(t=>{
            const busy = bookings.some(b=>b.hora===t);
            return <option key={t} value={t} disabled={busy}>{t}{busy? ' (ocupado)':''}</option>
          })}
        </select>
        <button type="submit">Confirmar</button>
      </form>
      {message && <p className="msg">{message}</p>}
    </div>
  );
}
