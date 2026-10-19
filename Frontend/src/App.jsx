import { Navigate, Route, Routes } from 'react-router-dom';
import { GameProvider } from './context/GameContext.jsx';
import { ROUTES } from './config/constants.js';
import HomePage from './pages/HomePage.jsx';
import RulesPage from './pages/RulesPage.jsx';
import GamePage from './pages/GamePage.jsx';
import ResultPage from './pages/ResultPage.jsx';

export default function App() {
  return (
    <GameProvider>
      <Routes>
        <Route path={ROUTES.HOME} element={<HomePage />} />
        <Route path={ROUTES.RULES} element={<RulesPage />} />
        <Route path={ROUTES.GAME} element={<GamePage />} />
        <Route path={ROUTES.RESULT} element={<ResultPage />} />
        <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
      </Routes>
    </GameProvider>
  );
}
