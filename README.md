# CoreFocus

## Overview

CoreFocus is a secure web application that connects to a user’s Gmail inbox via OAuth2, fetches emails, and uses AI to generate concise summaries. It provides a simple dashboard to view recent emails with AI-powered insights, designed for efficient email management and improved user experience.

## Features

- **OAuth2 authentication** with Google for secure Gmail access  
- Access and refresh token management with automatic token refresh  
- Fetch and display recent emails from the user’s inbox  
- AI-generated summaries highlighting key points of emails  
- Background sync with Gmail push notifications (planned)  
- Multi-user support with individual token storage (planned)  
- User dashboard with real-time updates and email insights (planned)  

## Tech Stack

- Backend: Spring Boot with Spring Security OAuth2 Client  
- Frontend: TypeScript (React)
- Database: PostgreSQL  
- AI: OpenAI API for email summarization  
- Gmail API for email access and push notifications  

## Getting Started

1. Register your app in Google Cloud Console and configure OAuth2 credentials.  
2. Set `client-id`, `client-secret`, `redirect-uri`, and scopes in `application.yaml`.  
3. Run the Spring Boot application.  
4. Navigate to `/login` to authenticate with your Google account.  
5. Access the dashboard to view email summaries.  

## Future Improvements

- Implement multi-user support with secure token storage  
- Add background sync and push notifications for real-time updates  
- Enhance AI summarization with advanced NLP techniques  
- Improve dashboard UX and user customization options  

## License

MIT License
