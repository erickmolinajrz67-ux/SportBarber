import AdminPanel from '../components/AdminPanel';

export default function Admin(){
  return (
    <div className="page admin">
      <header className="header">
        <h1>Admin — Sport Barber</h1>
      </header>
      <main>
        <AdminPanel />
      </main>
    </div>
  )
}
