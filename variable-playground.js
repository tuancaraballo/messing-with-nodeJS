var person = {
	name: 'Andrew',
	age: 21
};

function updatePerson(obj){
	// --> Notice this doesn't change the age
	// of person, when it prints it outside the function
	// and this is because you are creating a local object
	// that doesn't exit outside this function
	// obj = {
	// 	name: 'Andrew',
	// 	age: 25
	// };

	// --> if you want to update the age, then do the following:
	obj.age = 24;
};

updatePerson(person);
console.log(person);


// Array Example:

var array = [4, 5];

function updateArray(array){
	// --> like the above example, this wouldn't work either
	//     array = [4,5,7];
	
	debugger;
	// --> a better approach is to push the number into the array
	array.push(7);
};

// --> Another approach is to return the array:

function updateArray2(array){
	var array = [1,2,3];

	return array;
}
// --> this approach is not recommended, very inneficient, it's better to push the value

var array2 = updateArray2(array); 

updateArray(array);
console.log(array);