# Media Photo Album
An interactive photo album website with a RESTful API.

## Table of Contents
- [Introduction](#introduction)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)

## Introduction
This project is an interactive photo album website that allows users to upload, view, and manage photos. It also includes a RESTful API for backend operations.

## Features
- Upload and display photos.
- Create and manage photo albums.
- RESTful API for handling photo and album operations.
- Responsive design for various devices.

## Technologies Used
- **Frontend:** HTML, CSS, JavaScript
- **Backend:** Node.js, Express.js
- **Database:** SQLite

## Installation
To set up the project locally, follow these steps:

1. Clone the repository:
   ```bash
   git clone https://github.com/marwandr/photo_album_website.git
   cd photo_album_website
2. Install the dependencies:
   ```bash
   npm install
3. Start the server
   ```bash
   node server.js

## Usage
Once the server is running, you can access the website at `http://localhost:3000`. Use the interface to upload and manage your photo albums.

## API Endpoints
Here are some of the key API endpoints available:
- `GET /api/photos` - Retrieve all photos.
- `POST /api/photos` - Upload a new photo.
- `GET /api/photos/:id` - Retrieve a specific photo by ID.
- `PUT /api/photos/:id` - Update a photo by ID.
- `DELETE /api/photos/:id` - Delete a photo by ID.  
For a more detailed explanation, check out the documentation file.
