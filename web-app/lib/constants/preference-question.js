/** @typedef {{ question: string, options: string[] }} PreferenceQuestion */

/** @type {Map<string, PreferenceQuestion>} */
export const preferenceQuestion = new Map([
  [
    "smoker",
    {
      question: "Are you comfortable with smokers?",
      options: ["Yes", "No"],
    },
  ],
  [
    "pets",
    {
      question: "Are you comfortable with pets?",
      options: ["Yes", "No"],
    },
  ],
  [
    "guests",
    {
      question: "How often do you have your own guests over?",
      options: ["Never", "Rarely", "Sometimes", "Often", "Always"],
    },
  ],
  [
    "overnight guests",
    {
      question: "How often are you comfortable with others bringing guests?",
      options: ["Never", "Rarely", "Sometimes", "Often", "Always"],
    },
  ],
  [
    "tidiness",
    {
      question: "How tidy are you?",
      options: [
        "Very messy",
        "Messy",
        "Somewhat tidy",
        "Tidy",
        "Very tidy",
      ],
    },
  ],
  [
    "noisiness",
    {
      question: "How noisy are you?",
      options: [
        "Very quiet",
        "Quiet",
        "Somewhat noisy",
        "Noisy",
        "Very noisy",
      ],
    },
  ],
  [
    "sharing items",
    {
      question: "How comfortable are you with sharing items?",
      options: [
        "Very uncomfortable",
        "Uncomfortable",
        "Somewhat comfortable",
        "Comfortable",
        "Very comfortable",
      ],
    },
  ],
  [
    "alcohol consumption",
    {
      question: "How often do you drink alcohol?",
      options: ["Less than once a week", "Once or twice a week", "Several days a week", "Every weekend", "Every day"],
    },
  ],
  [
    "schoolwork load",
    {
      question: "How much time do you spend on schoolwork?",
      options: [
        "~1 hour",
        "1~2 hours",
        "2~3 hours",
        "3~4 hours",
        "4+ hours",
      ],
    },
  ],
  [
    "movement frequency",
    {
      question: "How often do you come and go during the day?",
      options: [
        "~1 time",
        "1~2 times",
        "2~3 times",
        "3~4 times",
        "4+ times",
      ],
    },
  ],
  [
    "sleep hours",
    {
      question: "How many hours of sleep do you get per night?",
      options: [
        "< 6 hours",
        "6~7 hours",
        "7~8 hours",
        "8~9 hours",
        "9+ hours",
      ],
    },
  ],
  [
    "bedtime",
    {
      question: "How early do you go to bed?",
      options: ["8~10pm", "10~12pm", "12~2am", "2~4am", "After 4am"],
    },
  ],
]);
