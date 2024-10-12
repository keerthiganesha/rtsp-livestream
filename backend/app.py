from flask import Flask, jsonify, request,send_from_directory
from flask_pymongo import PyMongo
from bson.objectid import ObjectId
from flask_cors import CORS
import subprocess
import os

app = Flask(__name__)
CORS(app)
app.config["MONGO_URI"] = "mongodb+srv://keerthig:keerthig2003@cluster0.k9ouz.mongodb.net/RTPS?retryWrites=true&w=majority"
mongo = PyMongo(app)
# MongoDB Collection
overlay_collection = mongo.db['live_timestamp']


# Directory to save the HLS files
HLS_DIR = 'static/hls'
path = "C:/Users/HP/Downloads/ffmpeg-n7.1-latest-win64-gpl-7.1/ffmpeg-n7.1-latest-win64-gpl-7.1/bin/ffmpeg.exe"
# Function to start FFmpeg and convert RTSP to HLS
def convert_rtsp_to_hls(rtsp_url):
    if not os.path.exists(HLS_DIR):
        os.makedirs(HLS_DIR)

    # FFmpeg command to convert RTSP to HLS
    ffmpeg_command = [
        path,
        '-i', rtsp_url,
        '-c:v', 'libx264',
        '-preset', 'veryfast',
        '-f', 'hls',
        '-hls_time', '10',
        '-hls_list_size', '5',
        '-hls_flags', 'delete_segments',
        os.path.join(HLS_DIR, 'output.m3u8')
    ]

    # Run the command in a subprocess
    subprocess.Popen(ffmpeg_command)

@app.route('/start-stream')
def start_stream():
    rtsp_url = 'rtsp://demo:demo@ipvmdemo.dyndns.org:5541/onvif-media/media.amp?profile=profile_1_h264&sessiontimeout=60&streamtype=unicast'
    convert_rtsp_to_hls(rtsp_url)
    return jsonify({"message": "Stream started, converting RTSP to HLS."})

# Serve HLS files (m3u8 and ts files)
@app.route('/hls/<path:filename>')
def serve_hls(filename):
    return send_from_directory(HLS_DIR, filename)


# Helper function to convert MongoDB document to JSON serializable format
def serialize_overlay(overlay):
    return {
        "id": str(overlay["_id"]),
        "texts": overlay.get("texts", []),
        "logos": overlay.get("logos", [])
    }

# API to Get All Overlays
@app.route('/overlay', methods=['GET'])
def get_all_overlays():
    if overlay_collection is None:
        return jsonify({"error": "Database connection failed"}), 500

    overlays = overlay_collection.find({})
    overlay_list = [serialize_overlay(overlay) for overlay in overlays]
    return jsonify(overlay_list)


# API to Create new Overlay setup
@app.route('/overlay', methods=['POST'])
def create_overlay():
    data = request.json
    overlay_id = overlay_collection.insert_one({
        "texts": data.get("texts", []),
        "logos": data.get("logos", [])
    }).inserted_id
    return jsonify({"message": "Overlay created", "id": str(overlay_id)}), 201

# API to Get an Overlay by ID
@app.route('/overlay/<overlay_id>', methods=['GET'])
def get_overlay(overlay_id):
    overlay = overlay_collection.find_one({"_id": ObjectId(overlay_id)})
    if not overlay:
        return jsonify({"error": "Overlay not found"}), 404
    return jsonify(serialize_overlay(overlay))

# API to Update an existing Overlay setup
@app.route('/overlay/<overlay_id>', methods=['DELETE'])
def delete_overlay(overlay_id):
    result = overlay_collection.delete_one({"_id": ObjectId(overlay_id)})
    if result.deleted_count == 1:
        return jsonify({"message": "Overlay deleted"}), 200
    return jsonify({"error": "Overlay not found"}), 404

if __name__ == '__main__':
    app.run(debug=True)
