
# WEB SHOP

A smooth and efficient online marketplace for daily necessities.

## Student Information:
* Name: Usama Riaz
* Email: 

## Requirements

Before you begin, make sure you have the following installed:
* **Python 3.x** for the backend.
* **Node.js v20.x** for the frontend.

## Setup Instructions

First, clone the repository:

```bash
git clone https://your-repository-url.git
cd your-project-folder
```

### Backend Configuration
To set up the backend, execute the following commands:

```bash
cd backend
pip install -r requirements.txt
python manage.py makemigrations
python manage.py migrate
python manage.py runserver
```

* The backend server will run at http://localhost:8000.

### Frontend Configuration
For the frontend, follow these steps:

```bash
cd frontend
npm install
npm start
```

* The frontend development server will start and open http://localhost:3000 in your default web browser.

## Core Features Implemented

* The backend utilizes Django with REST APIs and SQLite Database.
* The frontend is built with React.
* A button for automatic database population is available on the landing page.
* All users can browse items.
* All users can search for items by their title.
* Users can register an account on the site.
* Registered users can log in using their username and password.
* An authenticated user can list a new item for sale by providing:
  ```bash
  a. Title
  b. Description
  c. Price
  ```
* The backend server automatically saves the creation date of each item.
* Authenticated users can add items to their cart for purchase, excluding their own listings. The item then becomes available for others for viewing and adding to their cart.

## Additional Features Implemented

* Users can search for items by their title.
* Buyers can remove items from their cart.
* Registered users can log in using their username and password.
* Buyers can view the list of items they intend to purchase. Sellers can update the price of an item as long as it is still in the cart.
* The application is built as a single-page application (SPA) with navigable links:
  ```bash
  a. Shop “/”
  b. Sign Up “/signup”
  c. Login “/login”
  d. Edit Account “/account”
  e. My Items: “/myitems”
  ```
* Authenticated users can view their items: for sale, sold, and purchased.
