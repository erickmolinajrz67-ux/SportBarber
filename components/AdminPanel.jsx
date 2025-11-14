import { useState } from 'react';
import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../lib/firebase';

export default function AdminPanel(){
  const [fecha, setFecha] = useState('');
  const [list, setList] = useState([]);

  async function ver(){
    const q = query(collection(db,'citas'), where('fecha','==',fecha));
    const snap = await getDocs(q);
    setList(snap.docs.map(d=>({id:d.id, ...d.data()})));
  }

  async function eliminar(id){
    await deleteDoc(doc(db,'citas',id));
    ver();
  }

  return (
    <div className="admin-card">
      <h2>Panel Admin</h2>
      <input type="date" value={fecha} onChange={e=>setFecha(e.target.value)} />
      <button onClick={ver}>Ver</button>
      <div className="list">
        {list.map(item=> (
          <div key={item.id} className="item">
            <b>{item.hora}</b> - {item.nombre} ({item.telefono}) - {item.servicio}
            <button onClick={()=>eliminar(item.id)}>Eliminar</button>
          </div>
        ))}
      </div>
    </div>
  )
}
