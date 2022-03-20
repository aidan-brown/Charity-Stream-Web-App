export const BACKENDURL = (() => {
  switch(process.env.NODE_ENV){
    case 'production':
      return 'https://charitystream-app.cs.house';
    case 'develop':
      return 'https://develop-charitystream-app.cs.house';
    default:
      'http://localhost:8080';
  }
})()
