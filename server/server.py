from flask import Flask, abort, jsonify, request, Response, send_from_directory
#from flask import Flask, jsonify, request, send_file, send_from_directory
from importlib import import_module
from logging import warning as debug
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
		"addTopic",
		"getData",
		"getTopics"
	],
	"AddTokens": ["cat", "dog"]
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
	if config["AddTokens"]:
		try:
			if request.args["token"] not in config["AddTokens"]:
				# Invalid token given
				abort(403)
		except:
			# No token given
			abort(403)
	input = request.get_json()
	try:
		DBConnection.addTopic(input["topic"], input["description"], input["fields"], input["units"])
	except KeyError:
		# Field not available in input data
		abort(400)
	return Response(status=200)

@app.route('/add/data/<topic>', methods=["POST"])
def addData(topic):
	if "addData" not in config["AllowedActions"]:
		abort(403)
	if config["AddTokens"] and ("token" not in request.args or request.args["token"] not in config["AddTokens"]):
			abort(403)
	input = request.get_json()
	try:
		DBConnection.addData(topic, input)
	except KeyError:
		# Topic not defined
		abort(404)
	except ValueError:
		# Fields do not match with topic
		abort(400)
	return Response(status=200)

@app.route('/get/topics', methods=["GET"])
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

	app.run(use_reloader=True, host='0.0.0.0', port=args.port, threaded=True, debug=True)
