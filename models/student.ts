interface Options {
  optionId: string;
  value: number;
  optionText: string;
}

interface AnswerData {
  questionId: number;
  optionId: number;
}

export interface QuestionAndAnswer {
  questionId: string;
  questionText: string;
  options: Options[];
}

export interface SubmitResult {
  userId: number;
  surveyId: number;
  answers: AnswerData[];
}
