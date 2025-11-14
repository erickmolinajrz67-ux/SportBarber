import BookingForm from '../components/BookingForm';

export default function Home(){
  return (
    <div className="page">
      <header className="header">
        <h1>Sport Barber</h1>
        <p>Plaza Porvenir — Agenda tu corte</p>
      </header>
      <main>
        <BookingForm />
      </main>
    </div>
  )
}
