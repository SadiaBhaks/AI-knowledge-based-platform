export function calculateSM2(quality, prevRep, prevInt, prevEasy) {
  let repetition = prevRep;
  let interval = prevInt;
  let easiness = prevEasy;

  if (quality >= 3) {
    if (repetition === 0) interval = 1;
    else if (repetition === 1) interval = 6;
    else interval = Math.round(prevInt * prevEasy);
    repetition++;
  } else {
    repetition = 0;
    interval = 1;
  }

  easiness = prevEasy + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  if (easiness < 1.3) easiness = 1.3;

  const nextReview = new Date();
  nextReview.setDate(nextReview.getDate() + interval);

  return { repetition, interval, easiness, nextReview };
}