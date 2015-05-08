//The file gets loaded here
//how to do error reporting and such in pure javascript
var oReq = new XMLHttpRequest();
//Method below gets execured onload
oReq.onload = function(){ papaParser(this.responseText); };
oReq.open("GET", "data/datadrop_output_with_weather.csv", true); //loots of columns....actor vs actor_displayname
oReq.send();


var results = {};
var results_user = {}

function papaParser(file){
	Papa.parse(file, {
		complete: function(data) {
			console.log(data);
			results = data;//better to reference a global or keeping on passing around?
			get_Pocket();
			get_ISS();
			getActivies();

			results_user.data = scopeToUser('Colin');
			var weatherScopedResults = scopeToUser('weather')
			drawWeather(weatherScopedResults);
			

			//is it better to scope? or use the access method??
			var saleScopedResults = getSale();
			drawSale(saleScopedResults);

			getAllUserData('colin')
		}
	});
}


//Prints objects scoped with user information grouped by activity type
function getAllUserData(user){
	var colin_data = access('actor',user)
	console.log(colin_data)
	var colin_data_scope = scopeToUser(user)

	var colin_activities = getColOnce(colin_data, 'activity_type')
	console.log(colin_activities)
	//object with all the keys.
	for(activity in colin_activities){
		var colinDataScopedToActivity = accessWithData(colin_data_scope, 'activity_type', activity)

		var timeArray = getCol(colinDataScopedToActivity, 'timestamp');
		var valArray = Array(timeArray.length + 1).join('1250,').split(',');
		valArray.pop()
		//var obj = {'time': timeArray, 'value': valArray, 'activity': activity}
		//console.log(obj)

		var toGraph = [];
		for(i in timeArray){
			console.log("{time:'" + timeArray[i] + "',event:" + valArray[i] + ",activity:'"+activity+"'}");
			toGraph.push({
				'time': timeArray[i],
				'event': valArray[i],
				'activity': activity
			})
		}
		console.log(toGraph);

		/*console.log(timeArray)
		console.log(valArray)
		console.log(activity)*/
	}
}

function getSale(){
	var target_col = 'activity_type';
	var target_item = 'item for sale'
	var r = access(target_col, target_item);

	console.log(r)
	return r;
}

function drawSale(data){
	var time = getCol(data, 'timestamp');
	var value = getCol(data, 'value2');
	var data = [];
	for(i in time){
		var t = isNaN(convertDate(time[i])) ? '' : convertDate(time[i]);
		if(t != ''){
			data.push({'Time':time[i], 'Cost': value[i].replace(/\D/g,'')/100});
			//cost is stipped of non digits and divided by 100 (to get back decimal)
		}
	}

	//how to use datetime for dimple? 
	var w = 1000
	var h = 500;
	var svg = dimple.newSvg("#chartContainerSale", w, h);
  var myChart = new dimple.chart(svg, data);
  myChart.setBounds(60, 30, w-120, h-150)
  var x = myChart.addCategoryAxis("x", "Time");
  x.addOrderRule("Date");
  //fix the date format
  //x.tickFormat = '%d:%H:%M';
  var y = myChart.addMeasureAxis("y", "Cost");
  y.ticks = 20;
  myChart.addSeries("Best Buy Products", dimple.plot.bubble);
  myChart.addLegend(180, 10, 360, 20, "right");
  myChart.draw();
}

function drawWeather(data){
	var time = getCol(data, 'timestamp');
	var value = getCol(data, 'value3');
	var data = [];
	for(i in time){
		var t = isNaN(convertDate(time[i])) ? '' : convertDate(time[i]);
		if(t != ''){
			data.push({'Time':time[i], 'Temperature': parseInt(value[i])});
			//console.log(t + " : " + time[i] + " : " + value[i]);
		}
	}

	//how to use datetime for dimple? 
	var w = 1000
	var h = 500;
	var svg = dimple.newSvg("#chartContainer", w, h);
  var myChart = new dimple.chart(svg, data);
  myChart.setBounds(60, 30, w-120, h-60)
  var x = myChart.addCategoryAxis("x", "Time");
  x.ticks = 100;
  x.addOrderRule("Date");
  var y = myChart.addMeasureAxis("y", "Temperature");
  myChart.addSeries("Temp", dimple.plot.bubble);
  myChart.addLegend(180, 10, 360, 20, "right");
  myChart.draw();
}

function scope(data_array, colName, param){
	console.log("scope - " + colName + " : " + param)
	var header = data_array.data[0];
	var actor_col = 0;
	for(i in header){
		if(header[i].toLowerCase() == colName.toLowerCase()){
			actor_col = i;
			break;
		}
	}
	var scopedInfo = [data_array.data[0]];
	var rows = data_array.data;
	for(i in rows){
		var cell = typeof rows[i][actor_col] != 'undefined' ? rows[i][actor_col].toLowerCase() : rows[i][actor_col];
		if(cell == param.toLowerCase()){
			scopedInfo.push(rows[i])
		}
	}
	return scopedInfo;
}

function scopeToUser(user){
	return scope(results, 'actor', user);
	//might want to return -> then can override results with one that is scoped
}

//adjust for specific user
function access(target_col, target_item, target_data){
	return accessWithData(results.data ,target_col, target_item, target_data)
}
function accessWithData(results, target_col, target_item, target_data){
	//iff target_data is null, the first row is the headers

	//var actor = 'actor';
	//var actor_col = 0; //col where the actor is in
	var header = results[0]; //header is the 0th row
	var col = 0;
	var target_data_col = []
	for(i in header){
		if(header[i].toLowerCase() == target_col.toLowerCase()){
			col = i;
			if(typeof target_data == 'undefined'){
				break;
				//otherwise will search of the target columns
			}
		}
		//get the columns # of target_data
		//more efficient to create a dict -> reference the dict? Instead of checking everytime the method is called?
		if(typeof target_data == 'object' && target_data.indexOf(header[i]) > -1){
			//if the header value is in the target_data
			target_data_col.push(i);
		}
	}
	//going through the individual rows to extract necessary data
	var rows = results;
	var information = [];
	for(i in rows){
		var cell = typeof rows[i][col] != 'undefined' ? rows[i][col].toLowerCase() : rows[i][col];
		if(cell == target_item.toLowerCase()){//at the target row
			var information_row = [target_item]
			var headers = [target_col];
			for(c in rows[i]){
				// should impliment a dictionary instead?
				if(typeof target_data == 'object' && target_data_col.indexOf(c) > -1){
					information_row.push(rows[i][c]);//pipes are removed
				}
				if(typeof target_data == 'undefined' && rows[i][c] != ''){
					if(information.length == 0){// creating the headers
						headers.push(rows[0][c])
					}
					information_row.push(rows[i][c]);//pipes are removed
				}
			}
			if(information.length == 0 && typeof target_data == 'undefined')// adding headers
				information.push(headers);
			information.push(information_row);
			information_row = [];
		}
	}
	return information;
}

//takes in an 2d array of data + the target column
function getCol(results, target_col){
	//extracts the items that are in the column
	var header = results[0];
	var col = 0;
	for(i in header){
		if(header[i].toLowerCase() == target_col.toLowerCase()){
			col = i;
			break;
		}
	}
	var rows = results;
	var activies = [];
	for(var i = 1; i < rows.length; i++){
		var cell = rows[i][col];
		//why have no repeats 'if' below
		//if(cell != '' && typeof(cell) != 'undefined' && activies.indexOf(cell) == -1){
			activies.push(cell)
		//}
	}
	return activies;
}
function getColOnce(results, target_col){
	//extracts the items that are in the column
	var header = results[0];
	var col = 0;
	for(i in header){
		if(header[i].toLowerCase() == target_col.toLowerCase()){
			col = i;
			console.log(col)
			break;
		}
	}
	var rows = results;
	var activies = {}
	for(var i = 1; i < rows.length; i++){
		var cell = rows[i][col];
		if(cell in activies){
			activies[cell] += 1; 
		}
		else{
			activies[cell] = 1;
		}
	}
	return activies;
}
function getActivies(){
	return getCol(results.data,'activity_type');
}

function get_Pocket(){
	var target_col = 'activity_type';
	var target_item = 'pocket';
	var target_data = ['excerpt', 'tags', 'tagsurl', 'title', 'timestamp'];
	var r = access(target_col, target_item, target_data);
	console.log(target_item);
	console.log(r);
	for(i in r){
		var date = r[i][4];
		//console.log(convertDate(date));
	}

	console.log('access_all')
	var target_col = 'activity_type';
	var target_item = 'pocket'
	var r = access(target_col, target_item);
	console.log(target_item);
	console.log(r);
}

function get_ISS(){
	console.log('access_all')
	var target_col = 'activity_type';
	var target_item = 'iss'
	var r = access(target_col, target_item);
	console.log(target_item);
	console.log(r);

	//using the getCol to access all the data in a specific column
	var times = getCol(r, 'timestamp');
	for(x in times){
		//console.log( convertDate(times[x]) );
	}
}

//why is datetime not in ISO8601 compatable format??
function convertDate(date){
	try{
		if(isNaN(Date.parse(date)) == false){
			return Date.parse(date);
		}
		//console.log(date)
		date = date.replace('at', '');
		var time = date.split(' ').pop();
		date = date.replace(date.slice(-8), '');//eliminating the hr:min
		if(time == time.replace('PM', '')){//if AM
			date = date.concat(time.replace('AM', ''));
		}
		if(time == time.replace('AM', '')){//if PM
			time = time.replace('PM', '');
			var adj = parseInt(time) + 12 + ":" + time.split(':')[1];

			//to adjust for PM > 12:xx cases
			if(adj.split(':')[0] == 24 && adj.split(':')[1] > 0)
				adj = 00 + ":" + time.split(':')[1];
			date = date.concat(adj);
		}
		//console.log(date);
		return Date.parse(date);
	}catch(error){
		console.log(error)
	}
}