## Tourism Blogging App Backend Documentation

This documentation provides an overview of the backend API for the tourism blogging app, detailing the routes, request parameters, and expected responses. This will serve as a reference for integrating the frontend (React Native) with the backend.

---

### **Base URL:**
`http://<your-backend-url>/api`

## **Authentication**

### 1. **Sign Up**
Create a new user.

**Endpoint:** `POST /auth/signup`

**Request Body:**
```json
{
  "username": "yourUsername",
  "password": "yourPassword"
}
```

**Response:**
- **201 Created:** 
  ```json
  {
    "token": "JWT_TOKEN",
    "user": {
      "_id": "USER_ID",
      "username": "yourUsername"
    }
  }
  ```
- **400 Bad Request:** User already exists.
- **500 Internal Server Error:** Server error during user creation.

### 2. **Login**
Authenticate a user and receive a JWT token.

**Endpoint:** `POST /auth/login`

**Request Body:**
```json
{
  "username": "yourUsername",
  "password": "yourPassword"
}
```

**Response:**
- **200 OK:** 
  ```json
  {
    "token": "JWT_TOKEN",
    "user": {
      "_id": "USER_ID",
      "username": "yourUsername"
    }
  }
  ```
- **404 Not Found:** User not found.
- **400 Bad Request:** Invalid credentials.
- **500 Internal Server Error:** Server error during login.

---

## **Blog Posts**

### 1. **Create a Blog Post**
Create a new blog post with image upload and location details.

**Endpoint:** `POST /blog`

**Headers:**
- `Authorization: Bearer JWT_TOKEN`

**Request Body (Multipart Form Data):**
- `image`: Image file (e.g., JPEG, PNG).
- `title`: Blog post title (String).
- `description`: Blog post description (String).
- `location`: Blog location as a stringified JSON object. Example:
  ```json
  { "type": "Point", "coordinates": [longitude, latitude] }
  ```

**Response:**
- **201 Created:** Blog post successfully created.
  ```json
  {
    "_id": "BLOG_ID",
    "title": "Blog Title",
    "description": "Blog description",
    "imageUrl": "https://cloudinary-link-to-image",
    "location": {
      "type": "Point",
      "coordinates": [longitude, latitude]
    },
    "user": "USER_ID"
  }
  ```
- **400 Bad Request:** No file uploaded or missing fields.
- **500 Internal Server Error:** Cloudinary or server issue.

### 2. **Get All Blog Posts**
Retrieve all blog posts with author information.

**Endpoint:** `GET /blog`

**Response:**
- **200 OK:** List of blog posts.
  ```json
  [
    {
      "_id": "BLOG_ID",
      "title": "Blog Title",
      "description": "Blog description",
      "imageUrl": "https://cloudinary-link-to-image",
      "location": {
        "type": "Point",
        "coordinates": [longitude, latitude]
      },
      "user": {
        "_id": "USER_ID",
        "username": "authorUsername"
      }
    }
  ]
  ```
- **500 Internal Server Error:** Error retrieving blog posts.

### 3. **Get Blog Post by ID**
Retrieve a single blog post by its ID.

**Endpoint:** `GET /blog/:id`

**Parameters:**
- `id`: Blog post ID.

**Response:**
- **200 OK:** Single blog post details.
  ```json
  {
    "_id": "BLOG_ID",
    "title": "Blog Title",
    "description": "Blog description",
    "imageUrl": "https://cloudinary-link-to-image",
    "location": {
      "type": "Point",
      "coordinates": [longitude, latitude]
    },
    "user": {
      "_id": "USER_ID",
      "username": "authorUsername"
    }
  }
  ```
- **404 Not Found:** Blog post not found.
- **500 Internal Server Error:** Error retrieving the blog post.

### 4. **Update Blog Post**
Update an existing blog post (including image, title, and description).

**Endpoint:** `PUT /blog/:id`

**Headers:**
- `Authorization: Bearer JWT_TOKEN`

**Request Body (Multipart Form Data):**
- `image`: (Optional) New image file.
- `title`: (Optional) Updated title.
- `description`: (Optional) Updated description.
- `location`: (Optional) Updated location as a JSON string.

**Response:**
- **200 OK:** Blog post successfully updated.
  ```json
  {
    "_id": "BLOG_ID",
    "title": "Updated Blog Title",
    "description": "Updated description",
    "imageUrl": "https://cloudinary-link-to-updated-image",
    "location": {
      "type": "Point",
      "coordinates": [longitude, latitude]
    },
    "user": "USER_ID"
  }
  ```
- **403 Forbidden:** Unauthorized action (user is not the author).
- **404 Not Found:** Blog post not found.
- **500 Internal Server Error:** Error during update.

### 5. **Delete Blog Post**
Delete an existing blog post.

**Endpoint:** `DELETE /blog/:id`

**Headers:**
- `Authorization: Bearer JWT_TOKEN`

**Parameters:**
- `id`: Blog post ID.

**Response:**
- **200 OK:** Blog post deleted.
  ```json
  {
    "message": "Blog post deleted"
  }
  ```
- **403 Forbidden:** Unauthorized action (user is not the author).
- **404 Not Found:** Blog post not found.
- **500 Internal Server Error:** Error during deletion.

### 6. **Get All Blog Posts by User**
Retrieve all blog posts created by the authenticated user.

**Endpoint:** `GET /blog/user/:userId`

**Headers:**
- `Authorization: Bearer JWT_TOKEN`

**Parameters:**
- `userId`: The ID of the user.

**Response:**
- **200 OK:** List of the authenticated user's blog posts.
  ```json
  [
    {
      "_id": "BLOG_ID",
      "title": "Blog Title",
      "description": "Blog description",
      "imageUrl": "https://cloudinary-link-to-image",
      "location": {
        "type": "Point",
        "coordinates": [longitude, latitude]
      },
      "user": {
        "_id": "USER_ID",
        "username": "authorUsername"
      }
    }
  ]
  ```
- **500 Internal Server Error:** Error retrieving blog posts.

---

### **Models**

#### **User Model:**
- `username`: String, required, unique.
- `password`: String, required.

#### **Blog Model:**
- `title`: String, required.
- `description`: String, required.
- `imageUrl`: String, required (Cloudinary image URL).
- `location`: Object, contains `type` and `coordinates`.
- `user`: Reference to the User model (author of the blog post).

---

### **Environment Variables:**

- `JWT_SECRET`: Secret key for JWT.
- `MONGODB_URI`: MongoDB connection string.
- `CLOUDINARY_CLOUD_NAME`: Cloudinary cloud name.
- `CLOUDINARY_API_KEY`: Cloudinary API key.
- `CLOUDINARY_API_SECRET`: Cloudinary API secret.

---

This documentation should provide you with everything you need to successfully build out the React Native frontend, leveraging these backend APIs.