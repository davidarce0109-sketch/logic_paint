import { useGame } from '../context/GameContext';
export const useQuestions = () => {
    const { questions, currentQuestionIndex, setCurrentQuestionIndex } = useGame();
    return { questions, currentQuestionIndex, setCurrentQuestionIndex };
};