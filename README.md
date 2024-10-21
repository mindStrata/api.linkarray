# Download and Run the Express.js Application Locally

## 1. Clone the Repository

```bash
git clone https://github.com/mindStrata/server.linkarray.git
```

## 2. Navigate into the Project Directory

```bash
cd server.linkarray
```

## 3. Install Dependencies

```bash
npm install
```

## 4. Set Up Environment Variables (if applicable)

- Create a `.env` file and add the required environment variables as per the project setup (Check the `/config/config.js` file before creating `.env` file).

Example:

```
PORT=4100
DATABASE_URI=mongodb://localhost:27017/your-database
JWT_SECRET=your-secret-key
.
.
.
```

## 5. Start the Application

```bash
npm start
```

or (if using `nodemon`)

```bash
npm run dev
```

## 6. Access the App

- Open `http://localhost:4100` in your browser (or the specified port in the `.env` file).

---
