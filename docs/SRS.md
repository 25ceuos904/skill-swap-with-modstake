# Software Requirements Specification (SRS) - SkillSwap

## 1. Introduction
SkillSwap is a web-based peer-to-peer skill exchange platform built using the MERN stack with TypeScript. Students can list skills they can teach and skills they want to learn, discover compatible peers through a weighted matching algorithm, request and conduct learning sessions, share learning resources, earn points, and build an auto-generated portfolio.

## 2. System Architecture & Dual Capability Role
- **Architecture Layer**: Route → Middleware → Controller → Service → Model → Database.
- **Single User Role (Student)**: Every user operates under a unified `Student` role capable of acting simultaneously as a **Mentor** (offering skills) and a **Learner** (seeking skills).

## 3. Core Entities
1. **User**: Account credentials, skills offered, skills wanted, bio, education, points.
2. **Session**: Scheduling, status pipeline (`requested` → `confirmed` → `completed` | `rejected`), meeting link.
3. **Resource**: Title, description, link, tags, creator reference.
4. **Portfolio**: Derived aggregate view computed on-the-fly from Sessions + Resources + User data.

## 4. Key Non-Functional Requirements
- **NFR1 Access Control**: Sessions are only accessible by the involved requester or recipient.
- **NFR2 Type Safety**: Strict TypeScript interface usage across frontend and backend.
- **NFR3 Performance**: Efficient MongoDB query filters and lightweight JWT state verification.
