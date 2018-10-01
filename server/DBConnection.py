class DBConnection(object):
	'''Base class for DB connections.
	'''

	def addTopic(self, topic, description="", fields=["number"], units=[None]):
		'''Adds new topic to DB.

		Args:
			topic: Name of the topic.
			description: Description of the topic.
			fields: List of data field names included in the topic.
			units: List of units for corresponding field.

		Returns:
			None

		Raises:
			KeyError: Topic already exists in DB
		'''
		raise NotImplementedError("Functionality not implemented by selected DB connection")

	def addData(self, topic, values):
		'''Adds data under given topic in DB

		Args:
			topic: Name of the topic under which to add data.
			values:	Dictionary with field names as keys and field value as value.

		Returns:
			None

		Raises:
			KeyError: Topic does not exist in DB
			ValueError: Values do not match those defined for the topic
		'''
		raise NotImplementedError("Functionality not implemented by selected DB connection")

	def getTopics(self):
		'''Gets list of topic dicts

		Returns:
			List of topic dicts
		'''
		raise NotImplementedError("Functionality not implemented by selected DB connection")

	def getTopic(self, topic):
		'''Get topic dict by name

		Args:
			topic: Name of the topic to find

		Returns:
			Topic dictionary with matching name

		Raises:
			KeyError: Topic does not exist in DB
		'''
		raise NotImplementedError("Functionality not implemented by selected DB connection")

	def getData(self, topic):
		'''Get all data under given topic

		Args:
			topic: Name of the topic to find

		Returns:
			List of all data dicts under topic with matching name

		Raises:
			KeyError: Topic does not exist in DB
		'''
		raise NotImplementedError("Functionality not implemented by selected DB connection")

ConnectionClass = DBConnection
