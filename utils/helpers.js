exports.isEmail = (usernameEmail) => {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(usernameEmail).toLowerCase());
}; 

exports.parser = (usernameEmail, password) => {
  if (!usernameEmail || !password) {
    return false; 
  }
  return true; 
}

exports.nameConcat = (firstname, lastname) => {
  return (firstname + " " + lastname);
}

exports.isItOnlyOne = (snapshot) => {
  if (snapshot.size !== 1) {
    return false; 
  }
  return true; 
}
