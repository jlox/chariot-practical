# chariot-practical

To run: 
npm i
node main.js


## Notes
The code in formScript.js is not used. It is exactly the same as what is included within the bottom script tags in form.html, but more readable.

To improve on my work, I would do the following:
- Add more validation for valid inputs (email/phone are correct format, etc)
- Add more edge case handling (better 404 errors, not landing on an ugly page if navigating to an undefined route)
- For some reason, my javascript only works when included directly in the html file within <script> tags. I think this has
  something to do with express and static resources. I would definitely want to separate the code into a separate file.
- Better CORS handling, safety checks, etc
- Add validating middleware