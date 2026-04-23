export type SurveyResultRow = {
  key: string
  questionNo: string
  questionTitle: string
  answer: string
  submitTime: string
}

export type QuestionRow = {
  key: string
  questionNo: string
  questionTitle: string
  questionType: string
  options: string
  sortOrder: number
}

export type OptionRow = {
  key: string
  optionNo: number
  optionId: string
  optionContent: string
}
