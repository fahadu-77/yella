---
description: how to run the yella application
---

To run the Yella application on your local machine, follow these steps:

1. **Open the project in VS Code**:
   Open the `/Users/fahadu77/Desktop/yella` folder.

2. **Open the Integrated Terminal**:
   Press ``Ctrl + ` `` (backtick) or go to `Terminal > New Terminal`.

3. **Install Dependencies (if not already done)**:
   ```bash
   npm install
   ```

4. **Initialize the Database (First time only)**:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Start the Development Server**:
   ```bash
   npm run dev
   ```

6. **View the App**:
   Open your browser and navigate to `http://localhost:3000`.

7. **View the Database (Optional)**:
   To see and edit users/products directly in a spreadsheet-like view, run:
   ```bash
   npx prisma studio
   ```
