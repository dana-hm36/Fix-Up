
const handleErrors = (err) => {
  console.log(err.message, err.code);
  let errors = {description:'',priority:'',image:'' };
  // validation errors
  if (err.message.includes('Ticket validation failed')){
    //console.log(err.errors.priority);
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
      console.log(properties.path);
      console.log(properties.values);
    });
  } 

  return errors;
}
module.exports = {
  handleErrors,
}

