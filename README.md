# AI Quizzer API Documentation

## Overview

This documentation describes the REST API endpoints available in the AI Quizzer application. The endpoints are designed for user registration, login, quiz generation, submission, and retrieval.

## Postman Collection

- Download the Postman Collection: [ai-quizzer.postman_collection.json](./docs/ai-quizzer.postman_collection.json)
- Import it into Postman to explore and test the APIs interactively.

### Using the Collection:

1. Open Postman.
2. Click **Import** and upload the `ai-quizzer.postman_collection.json` file.
3. Adjust the `Authorization` header (JWT token) and API URLs if needed.
4. Execute requests directly.

## API Endpoints

Here’s an overview of the key endpoints included in the Postman collection:

### 1. **User Registration**

- **POST** `/auth/register`
- **Description**: Registers a new user.
- **Request Body**:
  ```json
  {
    "username": "Sujal",
    "password": "sp123"
  }
  ```

### 2. **User Login**

- **POST** `/auth/login`
- **Description**: Logs in a user and provides a JWT token.
- **Request Body**:
  ```json
  {
    "username": "Sujal",
    "password": "sp123"
  }
  ```

### 3. **Generate Quiz**

- **POST** `/api/quiz/generate`
- **Description**: Generates a new quiz with parameters.
- **Request Body**:
  ```json
  {
    "grade": 10,
    "subject": "english",
    "totalQuestions": 2,
    "maxScore": 10,
    "difficulty": "EASY"
  }
  ```
- **Authorization**: Requires Bearer token.

### 4. **Submit Quiz**

- **POST** `/api/quiz/submit`
- **Description**: Submits a quiz response.
- **Request Body**:
  ```json
  {
    "quizId": "6740af991a21a2b264075d7e",
    "responses": [
      {
        "questionId": "6740af991a21a2b264075d7f",
        "userResponse": "Small"
      }
    ],
    "email": "example@example.com"
  }
  ```
- **Authorization**: Requires Bearer token.

### 5. **Retrieve Old Quiz**

- **GET** `/api/quiz/oldquiz/:quizId`
- **Description**: Fetches data for a specific quiz by its ID.
- **Authorization**: Requires Bearer token.

### 6. **Retrieve Submitted Quiz History**

- **GET** `/api/quiz/submitted-quiz?score=<score>`
- **Description**: Retrieves submitted quiz history based on score.
- **Authorization**: Requires Bearer token.

### 7. **Get Hint**

- **GET** `/api/quiz/hint`
- **Description**: Fetches a hint for a question using AI.
- **Request Body**:
  ```json
  {
    "question": "What is the opposite of the word big?"
  }
  ```
- **Authorization**: Requires Bearer token.

---

For a full guide to running and testing the API, refer to the Postman collection.
