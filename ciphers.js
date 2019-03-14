"use strict";
var type;

$(document).ready(function(){
  $("a").click(function(){
    type = $(this).attr("href").substring(1);
    execute();
  });

  $("#radioEncrypt, #radioDecrypt").click(function(){
    execute();
  });

  $("input[type=text], textarea").keyup(function(){
    if (this.id == "pShift" || this.id == "cShift") {
      numOnly(this);
    }
    execute();
  });
});

function regCheck(pattern, str) {
  var regex = new RegExp(pattern);
  var result = regex.test(str);
  return result;
}

function numOnly(element) {
  if (!regCheck("^-?[0-9]*$", element.value)) {
    element.value = element.value.substring(0,element.value.length - 1)
  }
}

function populateX(start) {
  var x = [];
  for(var i = start; i <= start + 25; i++) {
    if(i <= 90) { x.push(i); }
    else { x.push(i-26); }
  }
  return x;
}

function polyalphabeticEncrypt(key, letter) {
  var x = populateX(letter.charCodeAt(0));
  var i = key.charCodeAt(0)-65;
  return String.fromCharCode(x[i]);
}

function polyalphabeticDecrypt(key, letter) {
  var x = populateX(65);
  var i = letter.charCodeAt(0)-key.charCodeAt(0);
  if(i < 0) { i += 26; }
  return String.fromCharCode(x[i]);
}

function caesareanEncrypt(shift, letter) {
  if (shift > 25 || shift < -26) { shift %= 26; }
  var result = letter.charCodeAt(0) + shift;
  if (result > 90) { result -= 26; }
  return String.fromCharCode(result);
}

function caesareanDecrypt(shift, letter) {
  var result = letter.charCodeAt(0) - shift;
  if (result < 65) { result += 26; }
  return String.fromCharCode(result);
}

function execute() {
  var string = $("#string").val().toUpperCase();
  var key = $("#key").val().toUpperCase();
  encDec.innerHTML = "";

  switch (type) {
    case "caesarean":
      var shift = parseInt($("#cShift").val());

      for (var i = 0; i <= string.length; i++){
        if (regCheck('[A-Z]',string.charAt(i))) {
          if ($("#radioEncrypt").is(':checked')) {
            encDec.innerHTML += caesareanEncrypt(shift,string.charAt(i));
          } else {
            encDec.innerHTML += caesareanDecrypt(shift,string.charAt(i));
          }
        } else {
          if(string.charCodeAt(i) == 10) { encDec.innerHTML += '</br>'; }
          else { encDec.innerHTML += string.charAt(i); }
        }
      }
      break;
    case "polyalphabetic":
      var shift = $("#pShift").val();

      for (var i = 0; i <= string.length; i++){
        if (regCheck('[A-Z]',string.charAt(i))) {
          if ($("#radioEncrypt").is(':checked')) {
            encDec.innerHTML += polyalphabeticEncrypt(key.charAt(key.length % shift),string.charAt(i));
          } else {
            encDec.innerHTML += polyalphabeticDecrypt(key.charAt(key.length % shift),string.charAt(i));
          }
          // shift++;
          // if(shift >= key.length) { shift = 0; }
        } else {
          if(string.charCodeAt(i) == 10) { encDec.innerHTML += '</br>'; }
          else { encDec.innerHTML += string.charAt(i); }
        }
      }
      break;
  }
}