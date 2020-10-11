const envVars = process.env;

const configurations = Object.freeze({
  url: envVars.NODE_ENV === 'production' ? window.location.origin : envVars.REACT_APP_SERVICE_URL
})

export default configurations;