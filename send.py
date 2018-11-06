def kirimData(volume, level):
	import http.client

	conn = http.client.HTTPConnection("192.168.43.148:3000")

	payload = "{\r\n\t\"device\": \"5bd7f4b15fe222269ce56fee\",\r\n\t\"sensornode\": \"5bd7f5c95fe222269ce56ff2\",\r\n\t\r\n\t\"data\": {\r\n\t\t\"vol\": 100,\r\n\t\t\"lvl\": 3\r\n\t\t\r\n\t}\r\n}"

	headers = {
	    'authorization': "67f96d74a79fb315959d2adde6d88cd3",
	    'content-type': "application/json",
	    'cache-control': "no-cache",
	    'postman-token': "94165271-0104-22e7-4f8a-c9c9bf163862"
	    }

	conn.request("POST", "/api/dataset/create", payload, headers)

	res = conn.getresponse()
	data = res.read()

	print(data.decode("utf-8"))

	return