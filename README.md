# NodeJSTask1
Task #1:  

Task objectives:

- Implement a file upload functionality using Node.js and Express.
- Process and validate file uploads.
- Store uploaded files in a local.

Task description:  

Part 1: 
- Set up an Express server and create necessary routes. 
- Create an HTML form with a file input field to allow users to upload files. 

Part 2: 
- Implement a route (POST /api/upload) that handles file uploads. 
- Validate the uploaded file to ensure it meets the required criteria (e.g., file size, file type). 
- If the file passes validation, generate a unique file name and store the uploaded file on the local disk. 
- Return a response to the client with the URL or path to access the uploaded file. 

Part 3: 
- Implement a route (GET /api/files/:filename) that retrieves and serves the uploaded files based on the provided file name. 
- Implement a route (DELETE /api/files/:filename) that allows users to delete uploaded files.  
