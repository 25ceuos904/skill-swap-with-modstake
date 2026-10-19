# Functional Requirements Specification (FR) - SkillSwap

## FR1: Account & Profile Management
- **Registration**: Register with name, email, password. Passwords are hashed with `bcrypt`.
- **Authentication**: JWT token generation upon login.
- **Profile Setup**: Add/remove skills offered (skills to teach) and skills wanted (skills to learn), bio, education.

## FR2: Discover & Weighted Matching
- **Skill Search**: Search for peers offering specific skills.
- **Mutual Compatibility Score**: Compute mutual score % between current user and candidate based on reciprocal skill matching.

## FR3: Session Management
- **Request Session**: Select date/time, propose meeting link.
- **Status Pipeline**: Transitions from `requested` to `confirmed` or `rejected`, and finally `completed`.
- **Session Protection**: Restrict viewing/editing of session details exclusively to the two involved users.

## FR4: Resource Sharing
- **Post Resource**: Share title, description, external URL link, and tags.
- **Browse Resources**: Filter resources by tag or search keyword.

## FR5: Points System
- **Session Completion**: +50 points awarded to both requester and recipient when session transitions to `completed`.
- **Resource Contribution**: +20 points awarded to user upon posting a new resource.

## FR6: Portfolio Generation
- Read-only, auto-compiled showcase aggregating completed sessions as mentor/learner, total points, and shared resources.
