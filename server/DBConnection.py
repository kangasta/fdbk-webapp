class DBConnection(object):
	def addTopic(self, topic, description="", fields=["number"], units=[None]):
		raise NotImplementedError("Functionality not implemented by selected DB connection")

	def addData(self, topic, values):
		raise NotImplementedError("Functionality not implemented by selected DB connection")

	def getTopics(self):
		raise NotImplementedError("Functionality not implemented by selected DB connection")

	def getData(self, topic):
		raise NotImplementedError("Functionality not implemented by selected DB connection")
