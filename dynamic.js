var counter = 0;

//adding new email
function addEmail(divName){
  console.log(divName);
    var newdiv = document.createElement('div');
    newdiv.innerHTML = "<br><label for='email'> E-mail :</label> <input type='email' name='Email_"+(counter)+"' placeholder='eg. bobbyc@sfu.ca' > ";
    document.getElementById(divName).appendChild(newdiv);
  }


//Duplicating the form


function duplicate() {

  counter++;

  var newdiv = document.createElement('div');
  newdiv.setAttribute('id','wrapper' + (counter));
  newdiv.innerHTML = '<br><br>';
  //name tags
  newdiv.innerHTML += '<label for="fname">First name:</label>  <input type="text" name="Firstname" autofocus placeholder="eg. Bobby" pattern="[A-Za-z]+" required title="Enter alphabets only"><br><br>  <label for="lname">Last name:</label>  <input type="text" name="Lastname" placeholder="eg. Chan" pattern="[A-Za-z]+" title="Enter alphabets only"><br><br>';
  //gender tags
  newdiv.innerHTML += '<div class="gender" id="gender"> <label for="sex">Gender:</label> <select  name="Gender"><option value="male">Male</option><option value="female">Female</option> <option value="other">Other</option> </select><br><br></div>';
  //birthday section
  newdiv.innerHTML += '<label for="bday">Birthdate:</label> <input type="date" name="Birthday"><br><br>';
  //email section
  newdiv.innerHTML += '<div class="emailSection" id = "dynamicEntry'+(counter)+' "><label for="email">E-mail :</label> <input type="email" name="Email_'+(counter)+'" placeholder="eg. bobbyc@sfu.ca" > <input type="button" value="+" onclick="addEmail(parentNode.id)"> </div>';
  //Buttons
  newdiv.innerHTML += '<input type="reset" value="Reset"><br></div>';

  document.getElementById('form1').appendChild(newdiv);

}
