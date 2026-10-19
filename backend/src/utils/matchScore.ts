export interface MatchScoreResult {
  mutualScore: number;
  aSatisfaction: number;
  bSatisfaction: number;
  aOffersToB: string[];
  bOffersToA: string[];
}

export function matchScore(
  userA: { skillsOffered: string[]; skillsWanted: string[] },
  userB: { skillsOffered: string[]; skillsWanted: string[] }
): MatchScoreResult {
  const norm = (arr: string[] = []) => arr.map((s) => s.trim().toLowerCase());
  const bWantedNorm = norm(userB.skillsWanted);
  const aWantedNorm = norm(userA.skillsWanted);

  const aOffersToB = (userA.skillsOffered || []).filter((s) =>
    bWantedNorm.includes(s.trim().toLowerCase())
  );
  const bOffersToA = (userB.skillsOffered || []).filter((s) =>
    aWantedNorm.includes(s.trim().toLowerCase())
  );

  const bSatisfaction =
    userB.skillsWanted && userB.skillsWanted.length
      ? (aOffersToB.length / userB.skillsWanted.length) * 100
      : 0;

  const aSatisfaction =
    userA.skillsWanted && userA.skillsWanted.length
      ? (bOffersToA.length / userA.skillsWanted.length) * 100
      : 0;

  const mutualScore = Math.round((aSatisfaction + bSatisfaction) / 2);

  return {
    mutualScore,
    aSatisfaction,
    bSatisfaction,
    aOffersToB,
    bOffersToA,
  };
}

// Alias for compatibility
export const computeMatchScore = matchScore;

