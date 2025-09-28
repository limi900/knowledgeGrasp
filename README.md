# knowledgeGrasp

## Overview:
This project was created for hackUMBC 2025. It is an interactive game that aims to help students enhance their studying. Students will provide up to 4 subtopics of their desired subject and play through a maze of questions designed off of each topic to test their skills. 

## How It Works:
1. **Sign Up/Login**: Create an account or sign in with Firebase authentication
2. **Create Maze**: Enter a topic or subject you want to study in the prompt
3. **AI Generation**: OpenAI generates 3-5 questions per subtopic with multiple choice answers
4. **Play Game**: Navigate through a Pac-Man style maze, collect pellets, and answer questions
5. **Track Progress**: Earn points for correct answers and save your maze progress
6. **Manage Mazes**: View, load, and delete your saved learning adventures

## Game Mechanics:
* **Maze Navigation**: Use arrow keys or WASD to control Pac-Man through the maze
* **Question Triggers**: Collect pellets to trigger questions from your study topic
* **Scoring System**: Earn points only for correct answers (not just pellet collection)
* **Question Timing**: Answer questions within the time limit with smooth transitions
* **Progress Saving**: Automatically save your progress and return to continue later

## Features:
* **AI-Powered Questions**: Dynamic, relevant questions utilizing OpenAI's API to generate focused questions based on given subtopics
* **User Authentication**: Secure login/signup system with Firebase for personalized experiences
* **Maze Management**: Create, save, load, and delete learning mazes with progress tracking
* **Interactive Gameplay**: Pac-Man style maze navigation with quiz integration
* **Progress Tracking**: Score system, question completion tracking, and maze statistics
* **Responsive Design**: Modern UI that works on desktop and mobile devices
* **Real-time Feedback**: Immediate scoring and question explanations
* This game caters to the following categories: Best AI/ML Hack, Best Educational Hack, Game Jamathon, Investor Education Challenge by T. Rowe Price

## Running the Project:

### Frontend:
1. Navigate to the `frontend` directory
2. Run `npm install` to install dependencies
3. Run `npm run dev` to start the development server
4. Open your browser to the provided local URL

### Backend:
1. Navigate to the `frontend` directory (backend files are located here)
2. Install Python dependencies: `pip install -r requirements.txt`
3. Run the Flask server: `python backend_chat.py`
4. The backend will start on `http://localhost:5001`

### Full Setup:
1. Clone this project locally
2. Start the backend server (see Backend section above)
3. Start the frontend development server (see Frontend section above)
4. Enjoy the game!

## Dependencies:

### Frontend:
* React 18
* Vite
* Firebase (Authentication)
* CSS3 with modern features

### Backend:
* Python 3.x
* Flask
* OpenAI API
* Flask-CORS

### Key Technologies:
* **Authentication**: Firebase Auth
* **AI Integration**: OpenAI GPT-3.5-turbo
* **Frontend Framework**: React with Hooks
* **Styling**: Modern CSS with gradients and animations
* **Data Storage**: LocalStorage for maze persistence

## Contributors:
Hallel Dereb, Chris Dollo, Oritsejolomisan Mebaghanje, and Madeline Rippin
