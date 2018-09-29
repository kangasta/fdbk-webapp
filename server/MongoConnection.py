from datetime import datetime
from pymongo import MongoClient

from DBConnection import DBConnection

class MongoConnection(DBConnection):
	def __init__(self, mongo_url, db="feedback"):
		self.__mongo_url = mongo_url
		self.__db = db

	def addTopic(self, topic, description="", fields=["number"], units=[None]):
		with MongoClient(self.__mongo_url) as client:
			db = client[self.__db]

			if db["topics"].find({"topic": topic}).count() > 0 or topic in db.list_collection_names():
				raise KeyError("Topic '" + topic + "' already exists in database '" + self.__db + "'")

			db["topics"].insert({
				"topic": topic,
				"description": description,
				"fields": fields,
				"units": units
			})

	def addData(self, topic, values):
		with MongoClient(self.__mongo_url) as client:
			db = client[self.__db]
			topics = db["topics"].find({"topic": topic})
			if topics.count() != 1:
				raise KeyError("Topic '" + topic + "' not found from database '" + self.__db + "'")
			fields = topics[0]["fields"]
			if len(fields) != len(values):
				raise ValueError("Given values do not match fields defined for topic")

			# TODO: validate to match topic fields
			data = {
				"topic": topic,
				"timestamp": datetime.utcnow()
			}
			for i, field in enumerate(fields):
				data[field] = values[i]

			db[topic].insert(data)

	def getTopics(self):
		with MongoClient(self.__mongo_url) as client:
			db = client[self.__db]

			topics = db["topics"].find()

			ret = []
			for topic in topics:
				ret.append({
					"topic": topic["topic"],
					"description": topic["description"],
					"fields": topic["fields"],
					"units": topic["units"]
				})
			return ret

	def getData(self, topic):
		with MongoClient(self.__mongo_url) as client:
			db = client[self.__db]

			topics = db["topics"].find({"topic": topic})
			if topics.count() == 0:
				raise KeyError("Topic '" + topic + "' not found from database '" + self.__db + "'")
			fields = topics[0]["fields"]
			data = db[topic].find()

			ret = []
			for d in data:
				ret.append({
					"topic": d["topic"],
					"timestamp": d["timestamp"].isoformat()
				})
				for field in fields:
					ret[-1][field] = d[field]
			return ret

if __name__ == "__main__":
	MG = MongoConnection("172.20.0.3")
	
	print(MG.getTopics())
	try:
		print(MG.getData("IPA"))
	except KeyError as e:
		print(e)

	MG.addTopic("IPA", "Taste review of this cool IPA!", ["stars","text"], ["stars", None])
	
	MG.addData("IPA", [5, "Taste is awesome!"])
	MG.addData("IPA", [3, "Taste is average."])
	MG.addData("IPA", [2, "Taste is meh."])
	
	print(MG.getTopics())
	print(MG.getData("IPA"))
	