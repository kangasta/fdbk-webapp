from datetime import datetime

from DBConnection import DBConnection

class DictConnection(DBConnection):
	def __init__(self):
		self.__dict = {
			"topics": []
		}

	def addTopic(self, topic, description="", fields=[], units=[]):
		if topic in (topic_d["topic"] for topic_d in self.__dict["topics"]):
			raise KeyError("Topic '" + topic + "' already exists in database")

		self.__dict["topics"].append({
			"topic": topic,
			"description": description,
			"fields": fields,
			"units": units
		})
		self.__dict[topic] = []

	def addData(self, topic, values):
		try:
			topic_d = next(i for i in self.__dict["topics"] if i["topic"] == topic)
		except StopIteration:
			raise KeyError("Topic '" + topic + "' not found from database")
		fields = topic_d["fields"]
		if len(fields) != len(values):
			raise ValueError("The number of given values does not match with the number of fields defined for topic")

		data = {
			"topic": topic,
			"timestamp": datetime.utcnow()
		}
		for field in fields:
			if field not in values.keys():
				raise ValueError("Value for field '" + field + "' not present in input data")
			data[field] = values[field]

		self.__dict[topic].append(data)

	def getTopics(self):
		topics = self.__dict["topics"]

		ret = []
		for topic in topics:
			ret.append({
				"topic": topic["topic"],
				"description": topic["description"],
				"fields": topic["fields"],
				"units": topic["units"]
			})
		return ret

	def getTopic(self, topic):
		try:
			topic_d = next(i for i in self.__dict["topics"] if i["topic"] == topic)
		except StopIteration:
			raise KeyError("Topic '" + topic + "' not found from database")

		return {
			"topic": topic_d["topic"],
			"description": topic_d["description"],
			"fields": topic_d["fields"],
			"units": topic_d["units"]
		}

	def getData(self, topic):
		try:
			topic_d = next(i for i in self.__dict["topics"] if i["topic"] == topic)
		except StopIteration:
			raise KeyError("Topic '" + topic + "' not found from database")
		fields = topic_d["fields"]
		data = self.__dict[topic]

		ret = []
		for d in data:
			ret.append({
				"topic": d["topic"],
				"timestamp": d["timestamp"].isoformat()
			})
			for field in fields:
				ret[-1][field] = d[field]
		return ret

ConnectionClass = DictConnection
