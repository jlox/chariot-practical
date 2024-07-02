const express = require('express')
const path = require('path');
const app = express();
const port = 3000;
const fetch = require('node-fetch');

// for body parsing the post request from frontend
app.use(express.json())

// post request to grants endpoint
app.post('/submit', function(req, res) {
  const { workflowSessionId, amount } = req.body;
  const options = {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
      authorization: 'Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6ImZZVnAtT3BIb2NEYnY4T2FpME4wSiJ9.eyJpc3MiOiJodHRwczovL2NoYXJpb3Qtc2FuZGJveC51cy5hdXRoMC5jb20vIiwic3ViIjoiTmtnc2MwWW1GdTNDWXhLdmoxUG9RSnBiaFlUS1NuT1JAY2xpZW50cyIsImF1ZCI6Imh0dHBzOi8vYXBpLmdpdmVjaGFyaW90LmNvbSIsImlhdCI6MTcxOTg4NzM3NywiZXhwIjoxNzE5OTczNzc3LCJzY29wZSI6InJlYWQ6Z3JhbnRzIGNyZWF0ZTpncmFudHMgY3JlYXRlOmNvbm5lY3RzIHJlYWQ6bm9ucHJvZml0cyBjcmVhdGU6bm9ucHJvZml0cyByZWFkOmNvbm5lY3RzIHVwZGF0ZTpncmFudHMgY3JlYXRlOmV2ZW50X3N1YnNjcmlwdGlvbnMgcmVhZDpldmVudF9zdWJzY3JpcHRpb25zIHJlYWQ6ZXZlbnRzIHVwZGF0ZTpldmVudF9zdWJzY3JpcHRpb25zIiwiZ3R5IjoiY2xpZW50LWNyZWRlbnRpYWxzIiwiYXpwIjoiTmtnc2MwWW1GdTNDWXhLdmoxUG9RSnBiaFlUS1NuT1IiLCJwZXJtaXNzaW9ucyI6WyJyZWFkOmdyYW50cyIsImNyZWF0ZTpncmFudHMiLCJjcmVhdGU6Y29ubmVjdHMiLCJyZWFkOm5vbnByb2ZpdHMiLCJjcmVhdGU6bm9ucHJvZml0cyIsInJlYWQ6Y29ubmVjdHMiLCJ1cGRhdGU6Z3JhbnRzIiwiY3JlYXRlOmV2ZW50X3N1YnNjcmlwdGlvbnMiLCJyZWFkOmV2ZW50X3N1YnNjcmlwdGlvbnMiLCJyZWFkOmV2ZW50cyIsInVwZGF0ZTpldmVudF9zdWJzY3JpcHRpb25zIl19.IXJASgYeNlcKsyylcewqyXnrg_hZug8R02PGv1MgAvpilNDAMNmFYD73iYj9fZYU9W0pfWmp6lcS-nvVovewwra4U-fD09GLMPazG11KkirIveGIzsYN0Pmad4KcAj4Utebf94ieI3GgHsew9utiO99gFk9jC7Zw0DBnyTIkPF6UTxsUqSDRpUNPzbG3D2yaqDf_ThEJLTOfBk5eulWwd6YuZBug68WHAlQ3LLJCfMfDg36WvDl0ik5fjDTGI8ASa_JSkfx71_t8MFUPpypbLto-PWtK4zdj_t7fjg14Lj3jyOHyFyKXG0FyfVj1yCCPy8P6aSJotaNiRhveztZ1dA'
    },
    body: JSON.stringify({ workflowSessionId, amount })
  };
  
  // would add logging, checks, etc to the response .then()
  fetch('https://sandboxapi.givechariot.com/v1/grants', options)
    .then(response => response.json())
    .then(response => console.log(response))
    .catch(err => console.error(err));
});

// serve base html page
app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, '/form.html'));
});

app.listen(port);
console.log('Server started at http://localhost:' + port);