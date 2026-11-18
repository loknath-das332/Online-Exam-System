\# Online Exam System



A Full Stack Online Examination System developed using the MERN Stack. This application allows administrators to manage examinations and students to participate in online exams and view their results.



\## Project Overview



The Online Exam System provides a digital platform for conducting online examinations. It includes separate dashboards for Admin and Student users.



\## Features



\### Admin Module

\- Admin Login

\- Create and Manage Exams

\- Add Questions and MCQ Options

\- Manage Examination Details

\- View Student Results



\### Student Module

\- Student Registration and Login

\- Student Dashboard

\- View Available Exams

\- Attend Online Examinations

\- Countdown Timer

\- Submit Examination

\- View Exam Results



\### Security Features

\- JWT Authentication

\- Password Hashing using bcryptjs

\- Role-Based Access Control

\- Duplicate Submission Prevention



\## Technologies Used



\### Frontend

\- React.js

\- Vite

\- React Router DOM

\- Axios

\- Lucide React



\### Backend

\- Node.js

\- Express.js

\- MongoDB

\- Mongoose

\- JSON Web Token (JWT)

\- bcryptjs

\- dotenv



\## Project Structure



```text

Online-Exam-System/

│

├── backend/

│   ├── controllers/

│   ├── models/

│   ├── routes/

│   ├── middleware/

│   ├── server.js

│   └── package.json

│

├── frontend/

│   ├── src/

│   ├── public/

│   └── package.json

│

├── .gitignore

└── README.md

```



\## Installation and Setup



\### 1. Clone Repository



```bash

git clone https://github.com/loknath-das332/Online-Exam-System.git

cd Online-Exam-System

```



\### 2. Backend Setup



```bash

cd backend

npm install

```



Create a `.env` file inside the backend folder.



Add your configuration:



```env

PORT=5000

MONGO\_URI=your\_mongodb\_connection\_string

JWT\_SECRET=your\_secret\_key

```



Start backend:



```bash

npm run dev

```



\### 3. Frontend Setup



Open another terminal:



```bash

cd frontend

npm install

npm run dev

```



Open the local URL provided by Vite in your browser.



\## Requirements



\- Node.js

\- npm

\- MongoDB

\- Visual Studio Code (recommended)



\## Author



\*\*Loknath Das\*\*



Diploma in Computer Science and Technology



\## GitHub Repository



https://github.com/loknath-das332/Online-Exam-System



