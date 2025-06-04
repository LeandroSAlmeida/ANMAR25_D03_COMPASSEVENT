# Event Management API

This is a backend RESTful API for managing events and users, built with **NestJS**. It includes features like user authentication, role-based access, event creation, image upload to AWS S3, and Swagger documentation.

## 🚀 Features

- User management (with roles like `ORGANIZADOR`)
- Event creation and listing
- AWS S3 image upload support
- DynamoDB integration (tables auto-created)
- Swagger API documentation
- Seed script to pre-populate database

---

## 📦 Tech Stack

- **Node.js**
- **NestJS**
- **DynamoDB** (via AWS SDK)
- **AWS S3** (for image uploads)
- **Swagger**
- **JWT Authentication**

---

## 📄 Requirements

- Node.js 18+
- AWS CLI or credentials configured
- DynamoDB (local or AWS cloud)
- S3 bucket (manual setup)

---

## 📁 Manual Setup Required: AWS S3 Bucket

You **must manually create an AWS S3 bucket** before running the application.

After creating your bucket, make sure to add the following **Bucket Policy** to allow public read access to uploaded images:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::YOUR-BUCKET-NAME/*"
    }
  ]
}
```

📚 API Documentation
After starting the project, open your browser and navigate to:
`http://localhost:3000/api`
This will open the Swagger UI where you can test all endpoints and see available routes.

🔐 Endpoints are protected — make sure to click "Authorize" in Swagger and provide a valid Bearer token.

🧪 Seed Script
To pre-populate the database with an ORGANIZADOR user:
`npm run seed`
This command creates a default user with the role ORGANIZADOR.

▶️ Running the Project
To start the application:
`npm run start`
Make sure your environment variables and AWS credentials are correctly configured.

🔧 Environment Variables Setup
To make configuring environment variables easier, there's an env.example file in the project root.

Just copy it to .env and fill in the required values like your AWS credentials, bucket names, URLs, etc.
`env.example .env`
Then edit the .env file with your specific environment settings.
