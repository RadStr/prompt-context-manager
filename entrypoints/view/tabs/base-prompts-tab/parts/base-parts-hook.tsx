export function useDifferentPromptTypes() {
  const [selectedRolePromptId, setSelectedRolePromptId] = useState<string | null>(null);
  const [selectedLengthPrompt, setSelectedLengthPrompt] = useState<string | null>(null);
  const [selectedCorrectnessPromptId, setSelectedCorrectnessPromptId] = useState<string | null>(null);
  const [selectedFormatPromptId, setSelectedFormatPromptId] = useState<string | null>(null);
  const [selectedTonePromptId, setSelectedTonePromptId] = useState<string | null>(null);
  const [selectedAnswerRolePromptId, setSelectedAnswerRolePromptId] = useState<string | null>(null);
  const [selectedAnswerPersonaPromptId, setSelectedAnswerPersonaPromptId] = useState<string | null>(null);


  return {
    length: {
      value: selectedLengthPrompt, setValue: setSelectedLengthPrompt
    },
    role: {
      value: selectedRolePromptId, setValue: setSelectedRolePromptId
    },
    correctness: {
      value: selectedCorrectnessPromptId, setValue: setSelectedCorrectnessPromptId
    },
    format: {
      value: selectedFormatPromptId, setValue: setSelectedFormatPromptId
    },
    tone: {
      value: selectedTonePromptId, setValue: setSelectedTonePromptId
    },
    answerRole: {
      value: selectedAnswerRolePromptId, setValue: setSelectedAnswerRolePromptId
    },
    answerPersona: {
      value: selectedAnswerPersonaPromptId, setValue: setSelectedAnswerPersonaPromptId
    }
  };
}
