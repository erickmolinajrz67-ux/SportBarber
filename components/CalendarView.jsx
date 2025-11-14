export default function CalendarView({fecha, bookings}){
  const slots = ['09:00','09:40','10:20','11:00','11:40','12:20','13:00','13:40','14:20','15:00','15:40','16:20','17:00','17:40','18:20'];
  return (
    <div className="calendar">
      <h3>Disponibilidad del {fecha||'...'}</h3>
      <div className="grid">
        {slots.map(s=>{
          const ocu = bookings?.some(b=>b.hora===s);
          return <div key={s} className={`slot ${ocu? 'ocupado':'libre'}`}>{s}<br/>{ocu? 'Ocupado':'Libre'}</div>
        })}
      </div>
    </div>
  )
}
