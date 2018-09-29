from flask import Flask, abort, jsonify, send_from_directory
#from flask import Flask, jsonify, request, send_file, send_from_directory
from importlib import import_module
import argparse
import os
import requests
import uuid

config = {
	"DBConnection": "MongoConnection",
	"DBParameters": [
		"database",
		"feedback"
	],
	"AllowedActions": [
		"addData",
		"getData",
		"getTopic"
	],
	"AddTokens": []
}

DBConnectionMod = import_module(config["DBConnection"])
DBConnection = DBConnectionMod.ConnectionClass(*(config["DBParameters"]))

app = Flask(__name__)

#@app.route('/')
#def index():
#	return send_from_directory('.', 'index.html')

@app.route('/add/topic', methods=["POST"])
def addTopic():
	if "addTopic" not in config["AllowedActions"]:
		abort(403)
	pass

@app.route('/add/data', methods=["POST"])
def addData():
	if "addData" not in config["AllowedActions"]:
		abort(403)
	pass

@app.route('/get/topics/', methods=["GET"])
def getTopics():
	if "getTopics" not in config["AllowedActions"]:
		abort(403)
	return jsonify(DBConnection.getTopics())

@app.route('/get/data/<topic>', methods=["GET"])
def getData(topic):
	if "getData" not in config["AllowedActions"]:
		abort(403)
	try:
		data = DBConnection.getData(topic)
		return jsonify(data)
	except KeyError:
		abort(404)

if __name__ =='__main__':
	parser = argparse.ArgumentParser()
	parser.add_argument("-p","--port",
		help="port to serve from",
		default=8080,
		type=int)
	args = parser.parse_args()

	app.run(use_reloader=True, host='0.0.0.0', port=args.port, threaded=True)
