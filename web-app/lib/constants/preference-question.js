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
      question: "How often do you want guests over?",
      options: ["Never", "Rarely", "Sometimes", "Often", "Always"],
    },
  ],
  [
    "overnight guests",
    {
      question: "How often do you want guests to spend the night?",
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
        "Somewhat messy",
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
        "Somewhat quiet",
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
        "Somewhat uncomfortable",
        "Comfortable",
        "Very comfortable",
      ],
    },
  ],
  [
    "alcohol consumption",
    {
      question: "How often do you drink alcohol?",
      options: ["Never", "Rarely", "Sometimes", "Often", "Daily"],
    },
  ],
  [
    "schoolwork load",
    {
      question: "How much time do you spend on schoolwork?",
      options: [
        "Less than 1 hour",
        "1-2 hours",
        "2-3 hours",
        "3-4 hours",
        "4-5 hours",
      ],
    },
  ],
  [
    "movement frequency",
    {
      question: "How often do you come and go during the day?",
      options: [
        "Less than 1 time",
        "1-2 times",
        "2-3 times",
        "3-4 times",
        "4-5 times",
      ],
    },
  ],
  [
    "sleep hours",
    {
      question: "How many hours of sleep do you get per night?",
      options: [
        "Less than 6 hours",
        "6-7 hours",
        "7-8 hours",
        "8-9 hours",
        "More than 9 hours",
      ],
    },
  ],
  [
    "bedtime",
    {
      question: "How early do you go to bed?",
      options: ["8-10pm", "10-12pm", "12-2am", "2-4am", "After 4am"],
    },
  ],
]);
