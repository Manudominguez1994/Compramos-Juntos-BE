const app = require("./app");

// ℹ️ Sets the PORT for our app to have access to it. If no env has been set, we hard code it to 5005


app.listen(80, () => {
  console.log(`Server listening on http://localhost:${80}`);
});
