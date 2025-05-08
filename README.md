# GraphQL Profile Page

A single-page application that leverages GraphQL to build a personalized profile dashboard with interactive SVG visualizations.

## Overview

This project creates a personal profile page by consuming data from Zone01's GraphQL API endpoint. The application features secure authentication, data visualization with SVG, and presents key profile metrics in an intuitive interface.

## Features

- **Secure Authentication**
  - Support for both username and email login methods
  - JWT-based authorization
  - Clean logout functionality

- **Comprehensive Profile Data**
  - User identification information
  - XP and project progression
  - Audit statistics
  - Performance analytics

- **Interactive SVG Visualizations**
  - XP progression over time
  - Project completion ratio
  - Custom statistics based on user data

- **Responsive Design**
  - Optimized for both desktop and mobile
  - Intuitive navigation

## Technical Implementation

### Authentication

Authentication is handled via POST requests to the signin endpoint:

[text](https://learn.zone01kisumu.ke/api/auth/signin)


The application supports Basic authentication with base64 encoding for credentials.

### Data Consumption

All profile data is retrieved from the GraphQL endpoint:

[text](https://learn.zone01kisumu.ke/api/graphql-engine/v1/graphql)

Primary GraphQL query structure:
```graphql
query getUserProfile {
  user {
    login
    attrs
    auditRatio
    transactions(
      where: { type: { _eq: "xp" } }
      order_by: { createdAt: asc }
    ) {
      amount
      createdAt
      path
      type
    }
    progresses(
      where: { eventId: { _eq: 75 } }
      order_by: { createdAt: desc }
    ) {
      grade
      path
      createdAt
      object {
        id
        name
        type
        attrs
      }
    }
  }
}
```
### Deployment

The application is hosted online for easy access. Visit the hosted version at:

[YourProfile]](https://barsu5489.github.io/Graphql-profile/)

Development Setup

    Clone the repository:

    git clone https://learn.zone01kisumu.ke/git/ebarsula/graphql.git

    cd graphql

   2. Development environment:
- Install VS Code if not already installed
- Install the "Live Server" extension in VS Code
  - Open VS Code Extensions (Ctrl+Shift+X)
  - Search for "Live Server"
  - Click Install on the extension by Ritwick Dey

3. Launch the application:
- Open the project folder in VS Code
- Right-click on `index.html`
- Select "Open with Live Server"
- The application will open in your default browser


## License

This project is licensed under the [MIT License](https://opensource.org/licenses/MIT).  
Feel free to use, modify, and contribute to it.
