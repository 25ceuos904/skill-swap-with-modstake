# Weighted Matching Algorithm Specification - SkillSwap

## Matching Formula
Given User A (current user) and User B (candidate user):

1. **A Offers to B (`aOffersToB`)**:
   Intersection of User A's `skillsOffered` and User B's `skillsWanted`.
2. **B Offers to A (`bOffersToA`)**:
   Intersection of User B's `skillsOffered` and User A's `skillsWanted`.

3. **Directional Scores**:
   - `scoreAtoB = |aOffersToB| / max(|User B.skillsWanted|, 1)`
   - `scoreBtoA = |bOffersToA| / max(|User A.skillsWanted|, 1)`

4. **Mutual Compatibility Score (`mutualScore`)**:
   - `mutualScore = Math.round(((scoreAtoB + scoreBtoA) / 2) * 100)`
   - Ensures symmetrical, 0-100% representation of mutual learning potential.

5. **Sorting**:
   - Peer matches are sorted descending by `mutualScore`.
