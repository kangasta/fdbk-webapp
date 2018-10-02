from flask import Flask, jsonify, request, send_from_directory
from importlib import import_module

import argparse
import os
import requests
import uuid

# TODO: This is for initial demo, please remove later
try:
	mongo_user = os.environ["MONGO_USERNAME"]
	mongo_pass = os.environ["MONGO_PASSWORD"]
except KeyError:
	mongo_user = None
	mongo_pass = None

# TODO: This is for initial demo, please remove later
try:
	mongo_auth_db = os.environ["MONGO_AUTH_DB"]
except KeyError:
	mongo_auth_db = "admin"

# TODO: This is for initial demo, move to JSON file later
config = {
	"DBConnection": "MongoConnection",
	"DBParameters": [
		"database",
		"feedback",
		mongo_user,
		mongo_pass,
		mongo_auth_db
	],
	"AllowedActions": [
		"addData",
		"addTopic",
		"getData",
		"getTopics",
		"getTopic"
	],
	"AddTokens": ["cat", "dog"],
	"ServeCWD": True
}

InvalidTokenJSON = {
	"error": "Token not recognized"
}

ActionNotAllowedJSON = {
	"error": "Action not allowed"
}

DBConnectionMod = import_module(config["DBConnection"])
DBConnection = DBConnectionMod.ConnectionClass(*(config["DBParameters"]))

app = Flask(__name__)

if config["ServeCWD"]:
	@app.route('/')
	def index():
		return send_from_directory('.', 'index.html')

@app.route('/add/topic', methods=["POST"])
def addTopic():
	if "addTopic" not in config["AllowedActions"]:
		return jsonify(ActionNotAllowedJSON), 403
	if config["AddTokens"] and ("token" not in request.args or request.args["token"] not in config["AddTokens"]):
		return jsonify(InvalidTokenJSON), 403
	json_in = request.get_json()

	topic = json_in.pop("topic", None)
	if not topic:
		return jsonify({
			"error": "No 'topic' field in input data"
		}), 404

	try:
		DBConnection.addTopic(topic, **json_in)
	except KeyError as e:
		# Field not available in input data
		return jsonify({
			"error": str(e)
		}), 404
	except TypeError as e:
		return jsonify({
			"error": str(e)
		}), 400
	return jsonify({
		"success": "Data successfully added to DB"
	})

@app.route('/add/data/<topic>', methods=["POST"])
def addData(topic):
	if "addData" not in config["AllowedActions"]:
		return jsonify(ActionNotAllowedJSON), 403
	if config["AddTokens"] and ("token" not in request.args or request.args["token"] not in config["AddTokens"]):
		return jsonify(InvalidTokenJSON), 403
	if not DBConnection.getTopic(topic)["allow_api_submissions"]:
		return jsonify({
			"error": "Data submissions through API not allowed for topic '" + topic + "'"
		}), 403

	input = request.get_json()
	try:
		DBConnection.addData(topic, input)
	except KeyError as e:
		# Topic not defined
		return jsonify({
			"error": str(e)
		}), 404
	except ValueError as e:
		# Fields do not match with topic
		return jsonify({
			"error": str(e)
		}), 400
	return jsonify({
		"success": "Data successfully added to DB"
	})

@app.route('/get/topics', methods=["GET"])
def getTopics():
	if "getTopics" not in config["AllowedActions"]:
		return jsonify(ActionNotAllowedJSON), 403
	return jsonify(DBConnection.getTopics())

@app.route('/get/topic/<topic>', methods=["GET"])
def getTopic(topic):
	if "getTopic" not in config["AllowedActions"]:
		return jsonify(ActionNotAllowedJSON), 403
	try:
		topic_json = DBConnection.getTopic(topic)
		return jsonify(topic_json)
	except KeyError as e:
		return jsonify({
			"error": str(e)
		}), 404

@app.route('/get/data/<topic>', methods=["GET"])
def getData(topic):
	if "getData" not in config["AllowedActions"]:
		return jsonify(ActionNotAllowedJSON), 403
	try:
		data = DBConnection.getData(topic)
		return jsonify(data)
	except KeyError as e:
		return jsonify({
			"error": str(e)
		}), 404

if __name__ =='__main__':
	parser = argparse.ArgumentParser()
	parser.add_argument("-p","--port",
		help="port to serve from",
		default=8080,
		type=int)
	args = parser.parse_args()

	# TODO: This is for initial demo, please remove later
	try:
		DBConnection.addTopic("IPA", "Taste review of this cool IPA!", ["stars","text"], ["stars", None], allow_api_submissions=False)
	except KeyError:
		pass

	app.run(use_reloader=True, host='0.0.0.0', port=args.port, threaded=True)
