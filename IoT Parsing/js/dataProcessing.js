//The file gets loaded here
//how to do error reporting and such in pure javascript
var oReq = new XMLHttpRequest();
//Method below gets execured onload
oReq.onload = function(){ papaParser(this.responseText); };
oReq.open("GET", "data/DataDrop_Output_2.csv", true);
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
		}
	});
}

function access(target_col, target_item, target_data){
	var header = results.data[0];
	console.log(header)
	var col = 0;
	var target_data_col = []
	for(i in header){
		if(header[i] == target_col){
			console.log(i + " : " + header[i])
			col = i;//get the target column of interest
		}
		//get the columns # of target_data
		//more efficient to create a dict -> reference the dict? Instead of checking everytime the method is called?
		if(target_data.indexOf(header[i]) > -1)
			target_data_col.push(i);
	}
	console.log(target_data_col)

	//going through the individual rows to extract necessary data
	var rows = results.data;
	var information = [];
	for(i in rows){
		if(rows[i][col] == target_item){//at the target row
			var information_row = [target_item]
			for(c in rows[i]){
				if(target_data_col.indexOf(c) > -1){
					//order of info is the same as the target_data
					//better to make a dictionary?
					information_row.push(rows[i][c].split("|")[1]);
					//pipes are removed
				}
			}
			information.push(information_row);
			information_row = [];
		}
	}
	return information;
}

function access_all(target_col, target_item){
	//this method is similar to access, but gets all data that's not empty
}

function visualize_Pocket(){
	var target_col = '|activity_type |';
	var target_item = '|pocket|'
	var target_data = ['|change value1 |', '|excerpttagsurl|', '|target_displayname|', '|titleexcerpttagsurl|'];
	var r = access(target_col, target_item, target_data);
	console.log(target_item);
	console.log(r);
	for(i in r){
		var date = r[i][1];
		console.log(convertDate(date))
	}
}

function visualize_ISS(){
	var target_col = '|activity_type |';
	var target_item = '|iss|'
	var target_data = ['|title|'];
	var r = access(target_col, target_item, target_data);
	console.log(target_item);
	console.log(r);
	for(i in r){
		var date = r[i][1];
		console.log(convertDate(date))
	}
}

//why is datetime not in ISO8601 compatable format??
function convertDate(date){
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
}