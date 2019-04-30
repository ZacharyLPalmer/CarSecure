import paho.mqtt.client as mqtt
import datetime
import time
import json
from influxdb import InfluxDBClient
from flask import Flask, request, json
from flask_restful import Resource, Api

broker_address="192.168.2.215"
wet = "false";
motion = "false";

def on_message(client, userdata, message):
	msg=message.payload
	val=float(msg)
	if val > 0:
		wet = "true"
	else:
		wet = "false"
	print wet

client = mqtt.Client("python client")
client.connect(broker_address)
client.on_message=on_message
client.subscribe("/moisture")



app = Flask(__name__)
api = Api(app)



class ReturnStatus(Resource):
	def get(self):
		return {'waterStatus': wet,
				'motionStatus': motion}

api.add_resource(ReturnStatus, '/wet')


class Motion(Resource):
	def post(self):
		motion="true"
		print "test"
		print motion
		

api.add_resource(Motion, '/move')



client.loop_start()

if __name__ == '__main__':
	app.run(debug=True)
	
client.loop_stop()
