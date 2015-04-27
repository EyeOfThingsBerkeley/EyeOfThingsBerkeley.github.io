//The file gets loaded here
//how to do error reporting and such in pure javascript
var oReq = new XMLHttpRequest();
//Method below gets execured onload
oReq.onload = function(){ papaParser(this.responseText); };
oReq.open("GET", "data/datadrop_output.csv", true);
oReq.send();


var results = []
//What to do about the pipes?
function papaParser(file){
	Papa.parse(file, {
		complete: function(data) {
			console.log(data);
			results = data;//better to reference a global or keeping on passing around?
			visualize_Pocket();
			visualize_ISS();
			getActivies();
		}
	});
}
//adjust for specific user
function access(target_col, target_item, target_data){
	//iff target_data is null, the first row is the headers

	//var actor = 'actor';
	//var actor_col = 0; //col where the actor is in
	var header = results.data[0]; //header is the 0th row
	var col = 0;
	var target_data_col = []
	for(i in header){
		if(header[i] == target_col){
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
	var rows = results.data;
	var information = [];
	for(i in rows){
		if(rows[i][col] == target_item){//at the target row
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

function getCol(target_col){
	var header = results.data[0];
	var col = 0;
	for(i in header){
		if(header[i] == target_col){
			col = i;
			break;
		}
	}
	var rows = results.data;
	var activies = [];
	for(var i = 1; i < rows.length; i++){
		var cell = rows[i][col];
		if(cell != '' && typeof(cell) != 'undefined' && activies.indexOf(cell) == -1){
			activies.push(cell)
		}
	}
	console.log(activies);
}
function getActivies(){
	return getCol('activity_type');
}

function visualize_Pocket(){
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

function visualize_ISS(){
	console.log('access_all')
	var target_col = 'activity_type';
	var target_item = 'iss'
	var r = access(target_col, target_item);
	console.log(target_item);
	console.log(r);
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