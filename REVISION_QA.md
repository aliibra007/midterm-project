# Midterm Project — Revision Q&A

---

## Architecture & General

**Q: Walk me through the overall architecture of your project.**
> You have a React SPA on port 5173 talking to an ASP.NET Core 10 REST API on port 5200, backed by PostgreSQL. The frontend never touches the database directly — everything goes through the API. The three roles (Admin, Teacher, Student) each get a different view of the same data.

**Q: Why did you separate DTOs from your Models?**
> Models are the database representation — they contain things like `PasswordHash` that should never leave the server. DTOs are what actually goes over the wire. For example, `StudentDto` has a list of enrolled classes but no password. If you return your model directly, you risk accidentally exposing sensitive fields or triggering infinite JSON loops from circular navigation properties.

**Q: What is Entity Framework Core and what does it do for you?**
> It's an ORM — it maps your C# classes to database tables and lets you write LINQ queries instead of raw SQL. It also handles migrations (auto-generates the SQL to create/alter tables) and uses parameterized queries under the hood, which blocks SQL injection by default.

---

## Database & Relationships

**Q: Explain the database schema and the relationships between your tables.**
> Four tables: `Students`, `Teachers`, `Classes`, `Enrollments`. A Teacher owns many Classes (one-to-many). A Class can have many Students and a Student can be in many Classes — that's a many-to-many, so there's a junction table `Enrollments` with a composite unique index on `(ClassId, StudentId)` to prevent a student enrolling twice. Deletes cascade — removing a teacher removes their classes, removing a class removes all its enrollment rows.

**Q: What is a migration and why did you run one?**
> A migration is a snapshot of a schema change. When you run `dotnet ef migrations add`, EF Core compares your current C# models to the last migration and generates C# code that translates to `CREATE TABLE`, `ALTER TABLE`, etc. `dotnet ef database update` then executes that SQL against the actual database. It lets you version-control your schema the same way you version-control your code.

**Q: Why is there a unique index on `(ClassId, StudentId)` in Enrollments?**
> Without it, nothing at the database level would stop a student from having two rows for the same class — you'd get duplicate enrollment. The unique composite index makes it a database-enforced constraint, not just an application-level check that could be bypassed.

---

## Security

**Q: How does JWT authentication work in your project?**
> When a user logs in, the server verifies their password and issues a signed JWT token containing their `userId`, `email`, and `role`. The frontend stores this token and attaches it to every request as `Authorization: Bearer <token>`. The server validates the signature on every request before the controller code runs — if the token is missing, expired, or tampered with, ASP.NET returns 401 automatically before your code is even called.

**Q: Why do you use BCrypt for passwords instead of just storing them directly?**
> Storing plain-text passwords means a database breach exposes every user's password instantly. BCrypt is a slow, salted hashing algorithm — even if someone gets your database, they can't reverse a hash back to a password. The "slow" part is intentional: it makes brute-force attacks impractical. `BCrypt.Verify()` on login re-hashes the attempt and compares it to the stored hash.

**Q: What happens if someone sends a malicious SQL injection attack through your API?**
> It won't work because EF Core always uses parameterized queries. When you write `_db.Students.FirstOrDefaultAsync(s => s.Email == dto.Email)`, EF Core generates a prepared statement with a `$1` placeholder — the value of `dto.Email` is never concatenated into the SQL string. The database treats it as a pure data value, not executable SQL.

**Q: How does the one-hour inactivity logout work?**
> It's implemented entirely on the frontend. `App.jsx` listens for `mousemove`, `mousedown`, `keydown`, `scroll`, and `touchstart` events. Every time one fires, it clears and restarts a `setTimeout` set to one hour. If that timer fires (meaning nothing happened for a full hour), it clears `localStorage`, nulls the user state, and redirects to the login page. The JWT itself has a 24-hour expiry so active users don't get randomly kicked.

**Q: Why is the JWT expiry 24 hours if inactivity logout is 1 hour?**
> The inactivity requirement is "logout after 1 hour of no activity" — not "1 hour after login." If the JWT expired in 1 hour, an active user in the middle of a session would get logged out after exactly 60 minutes regardless of what they're doing. The frontend timer handles the inactivity rule; the 24-hour JWT just prevents someone from using a token days later.

**Q: How do you prevent a teacher from modifying another teacher's class?**
> In `ClassController`, after fetching the class, we compare `cls.TeacherId` to `GetUserId()` (which reads the `NameIdentifier` claim from the JWT). If they don't match, the server returns `403 Forbidden` — the controller never proceeds to the update or delete. The check happens server-side, so it can't be bypassed from the frontend.

---

## Frontend & React

**Q: How does the frontend know the user is logged in after a page refresh?**
> On login, the full user object (token, role, name, email) is saved in `localStorage`. `App.jsx` initializes its `user` state with a function: `useState(() => JSON.parse(localStorage.getItem('user')))`. So on refresh, React reads from `localStorage` first and restores the session immediately without a new login.

**Q: What is the purpose of `api.js`?**
> It centralizes every `fetch()` call in one file. Every request that needs authentication attaches the JWT header from the same `authHeaders()` function. If the base URL changes or you need to add a global header, you change one file instead of hunting through 10 components.

**Q: What is role-based routing and how do you handle it?**
> After login, the role from the API response determines which page the user is redirected to — students go to `/student`, teachers to `/teacher`, admins to `/admin`. Every route in `App.jsx` is also guarded by a `protect()` helper that redirects to login if `user` is null. The sidebar renders different navigation links based on `user.role`, so each role only sees their own section.

---

## The Class Entity

**Q: Explain how the Class entity works and what MaxStudents does.**
> A `Class` belongs to one `Teacher` and has a `Schedule` (datetime), `Name`, and `MaxStudents`. `MaxStudents = 0` means unlimited seats. When a student tries to enroll, the backend checks `cls.Enrollments.Count >= cls.MaxStudents` — if the class is full, it returns `400 Bad Request`. The current count is always derived live from the `Enrollments` table, never stored as a separate column (so it can't go stale).

**Q: How can a teacher remove a student from their class?**
> The endpoint is `DELETE /api/class/{classId}/remove/{studentId}`. The controller first verifies the class exists, then checks that `cls.TeacherId == GetUserId()` (only the class owner can remove students). Then it finds and deletes the `Enrollment` row. On the frontend, the teacher clicks "View Students" on a class, which fetches the full `ClassDto` including the student roster, and each row has a "Remove" button.

---

## Admin

**Q: How is the default admin account created?**
> In `Program.cs`, after the app is built, there's a startup block that opens a database scope, checks `db.Admins.Any()`, and if the table is empty, inserts a seeded admin with a BCrypt-hashed password. This runs once on first launch and never again once an admin row exists.

**Q: What can the admin do that teachers and students cannot?**
> The admin is the account provisioner — they create and delete student and teacher accounts. Regular registration endpoints are open to anyone, but in a real deployment you'd close those and force all account creation through the admin. The admin also sees global stats (total students, teachers, classes) from a single dashboard. They cannot create classes — that's intentional, it's the teacher's job.

---

## Things to Have Ready on the Day

- Show the running app: register an account, log in, create a class, enroll a student, remove them
- Point at `AppDbContext.cs` and explain the `OnModelCreating` configuration
- Open Swagger at `http://localhost:5200/swagger` and show the full list of endpoints
- Know the folder structure: where controllers live, where DTOs live, where the frontend pages are

---

## Default Credentials (for the demo)

| Role    | Email                  | Password      |
|---------|------------------------|---------------|
| Admin   | admin@school.com       | admin123456   |
| Teacher | *(create via admin)*   | *(you set it)*|
| Student | *(create via admin)*   | *(you set it)*|
