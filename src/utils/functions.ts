const pointsToGamePoints = {
  0: "0",
  1: "15",
  2: "30",
  3: "40",
  4: "Ad",
};

type ObjectKey = keyof typeof pointsToGamePoints;

export function convertToGamePoints(points: number): string {
  if (points > 4 || points < 0) {
    points = 4;
  }
  const pointsKey = points as ObjectKey;

  return pointsToGamePoints[pointsKey];
}
