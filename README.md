# EyeOfThingsBerkeley.github.io

Wolfram data drop enables any device to send data to our system as long as they can interact with a RESTful API or even just send an email. Any other project creating an activity stream should be able to connect to our visualization platform.

How to send in information to Wolfram Alpha:
-Email - Wolfram Data Drop
-Web API - Wolfram Data Drop RESTful API 

Activity Streams:
All key value pairs:
Activity Type = the verb, type of action or event that happened [Str]
Activity Value - numerics, value of temp, etc [Str] (could be number or string)
EventTime = when the activity took place [dateTime]
Data Source type = standard device name [Str]
Device ID - in case there are multiples of one item (family set of jawbones) [Str]
Target ID = if there is an interaction with another device, that devices id(optional) [Str]
Target Activity Type = the verb, type of action or even that was performed by the target device(optional) [Str]
Target data Source type = standard device name of target device(optional) [Str]
Chart Type = ‘bar’, ‘line’(option) [Str]
URI = (optional) [Str]

We have determined the semitic dictionary, but not the structure yet.

Wolfram API
https://www.wolfram.com/datadrop/quick-reference/web-api/
https://www.wolfram.com/datadrop/quick-reference/email/ 

