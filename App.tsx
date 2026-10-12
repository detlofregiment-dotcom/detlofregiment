import { useState } from 'react';
import { SchoolProvider } from './store';
import Landing from './pages/Landing';
import Portal from './pages/Portal';
import Admin from './pages/Admin';

type Route = 'landing' | 'portal' | 'admin';

export default function App() {
  const [route, setRoute] = useState<Route>('landing');

  return (
    <SchoolProvider>
      {route === 'landing' && <Landing go={(r) => setRoute(r)} />}
      {route === 'portal' && <Portal go={() => setRoute('landing')} />}
      {route === 'admin' && <Admin go={() => setRoute('landing')} />}
    </SchoolProvider>
  );
}
