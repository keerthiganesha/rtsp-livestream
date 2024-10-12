<h1>Overview</h1><br>
<p>This application allows users to stream video content using an RTSP URL and overlay customizable elements such as text and images. Users can create, read, update, and delete overlays, enhancing the streaming experience.</p><br>
<h1>Features</h1><br>
<p>Stream video using RTSP URLs.<br>
Create and manage text and image overlays.<br>
Save and load overlay configurations.<br></p>

<h1>API Documentation</h1><br>
<h3>Base URL</h3><br>
http://localhost:5000<br>

<h3>Endpoints</h3><br>
<h5>1. Create Overlay</h5>
<br><br>
POST /overlay<br>
Description: Create a new overlay configuration.<br>
Request Body:<br>
json<br>
<br>
{<br>
  "texts": [<br>
      {<br>
      "id": "unique_id",<br>
      "content": "Text content",<br>
      "position": {<br>
        "x": 100,<br>
        "y": 100<br>
      },<br>
      "fontSize": 18<br>
    }<br>
  ],<br>
  "logos": [<br>
    {<br>
      "id": "unique_id",<br>
      "src": "image_url",<br>
      "position": {<br>
        "x": 200,<br>
        "y": 200<br>
      },<br>
      "size": {<br>
        "width": 50,<br>
        "height": 50<br>
      }<br>
    }<br>
  ]<br>
}<br>

<h5>2. Get All Overlays</h5><br>
GET /overlay<br>
Description: Retrieve all saved overlays.<br>
Response:<br>
json<br>
<br>
[<br>
  {<br>
    "id": "unique_id",<br>
    "texts": [...],<br>
    "logos": [...]<br>
  }<br>
]<br>
<h5>3. Get Overlay by ID</h5>
GET /overlay/{id}<br>
Description: Retrieve a specific overlay configuration.<br>
Response:<br>
json<br>
<br>
{<br>
  "texts": [...],<br>
  "logos": [...]<br>
}<br>
<br>
<h5>6. Delete Overlay</h5><br>
DELETE /overlay/{id}<br>
Description: Delete a specific overlay configuration.<br>

<h1>User Documentation</h1><br>
<h3>Setup</h3><br>
<h5>Clone the Repository:</h5><br>
<br>
<br>
https://github.com/Parth2k3/LiveStream-app.git<br>
<h5>Navigate to the Project Directory:</h5><br>
Install Dependencies: For the backend (Flask):<br>
bash<br>
<br>
cd backend<br>
pip install -r requirements.txt<br>
<h5>For the frontend (React):</h5><br>
bash<br>
<br>
cd livestream-app<br>
npm install<br>
<h5>Start the Backend:</h5><br>
bash<br>
<br>
cd backend<br>
python app.py<br>
<h5>Start the Frontend:</h5><br>
bash<br>
<br>
cd livestream-app<br>
npm start<br>
<h3>Using the Application</h3><br>
1. Open your browser and go to http://localhost:5000/start-stream to start the stream initially.<br>
2. Open your browser and go to http://localhost:3000.<br>
<h3>Managing Overlays</h3><br>
1. Add Text: Click on "Add Text" and input your text. You can drag it to reposition. Double click to edit the text.<br>
2. Add Logo: Upload an image file to add a logo overlay. You can drag it to reposition.<br>
3. Save Overlay: Click on "Save Overlay" to save your current overlays.<br>
4. Load Overlay: Select a saved overlay from the dropdown to apply it.<br>
<br><br><br>
**NOTE*** - The RSTP URL might expire (used in the backend/app.py Line 42) since it can be active for at max 99999 seconds, so at the time of testing we can replace the RSTP URL with new generated URL from RSTP.me<br><br>
<br> - The project's backend uses ffmpeg to convert RSTP to HLS format for live streaming the video to the frontend. So, for this we require the ffmpeg installed on the system and set to PATH variable in Environment Variables.<br><br><br><br>
<h5>Installation for Windows</h5><br>
Download the FFmpeg Executable:<br>

Go to the FFmpeg official website.<br>
Click on the Windows logo to navigate to the Windows builds.<br>
Choose a build (e.g., the gyan.dev builds) and download the latest ffmpeg-release-full.zip file.<br>
Extract the Files:<br>

Right-click the downloaded zip file and select Extract All.<br>
Choose a destination folder (e.g., C:\ffmpeg) to extract the contents.<br>
Add FFmpeg to System PATH:<br>

Press Win + X and select System.<br>
Click on Advanced system settings on the left panel.<br>
Click on the Environment Variables button.<br>
Under System variables, find the Path variable and select it, then click Edit.<br>
Click New and add the path to the bin directory of the extracted FFmpeg (e.g., C:\ffmpeg\bin).<br>
Click OK to close all the dialog boxes.<br>
Verify Installation:<br>
<br>
Open Command Prompt and type:<br>
bash<br>
<br>
ffmpeg -version<br>
You should see the version information if FFmpeg is installed correctly.<br>
