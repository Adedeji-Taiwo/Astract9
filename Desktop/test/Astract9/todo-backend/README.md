# Blog List Unit & Integration Tests, USer authentication and Authorization

In the exercises for this part we will be building a blog list application, that allows users to save information about interesting blogs they have stumbled across on the internet. For each listed blog we will save the author, title, url, and amount of up votes from users of the application.

## Steps

### Blog list unit tests
- Step 1: Turn the application into a functioning npm project. In order to keep your development productive, configure the application to be executed with nodemon. You can create a new database for your application with MongoDB Atlas, or use the same database from the previous part's exercises.
- Step 2: Refactor the application into separate modules.
- Step 3: First define a dummy function that receives an array of blog posts as a parameter and always returns the value 1. 
- Step 4: Define a new totalLikes function that receives a list of blog posts as a parameter. The function returns the total sum of likes in all of the blog posts. Write appropriate tests for the function.
- Step 5: Define a new favoriteBlog function that receives a list of blogs as a parameter. The function finds out which blog has most likes. If there are many top favorites, it is enough to return one of them.
- Step 6: Define a function called mostBlogs that receives an array of blogs as a parameter. The function returns the author who has the largest amount of blogs. The return value also contains the number of blogs the top author has.
- Step 7: Define a function called mostLikes that receives an array of blogs as its parameter. The function returns the author, whose blog posts have the largest amount of likes. The return value also contains the total number of likes that the author has received.
- Step 8: Use the supertest package for writing a test that makes an HTTP GET request to the /api/blogs url. Verify that the blog list application returns the correct amount of blog posts in the JSON format.
- Step 9: Write a test that verifies that the unique identifier property of the blog posts is named id.
- Step 10: Write a test that verifies that making an HTTP POST request to the /api/blogs url successfully creates a new blog post.
- Step 11: Write a test that verifies that if the likes property is missing from the request, it will default to the value 0.
- Step 12: Write a test related to creating new blogs via the /api/blogs endpoint, that verifies that if the title and url properties are missing from the request data.
- Step 13: Implement functionality for deleting a single blog post resource. Implement tests for the functionality.
- Step 14: Implement functionality for updating the information of an individual blog post. Implement tests for the functionality.


### User Authorization
- Step 15: Implement a way to create new users by doing a HTTP POST-request to address api/users. Users have username, password and name.
- Step 16: Add a feature which adds the following restrictions to creating new users: Both username and password must be given. Both username and password must be at least 3 characters long. The username must be unique.
- Step 17: Expand blogs so that each blog contains information on the creator of the blog.

### USer Authentication
- Step 18: Implement token-based authentication according to part 4 chapter Token authentication.
- Step 19: Modify adding new blogs so that it is only possible if a valid token is sent with the HTTP POST request. The user identified by the token is designated as the creator of the blog.
- Step 20: refactor taking the token to a middleware. The middleware should take the token from the Authorization header and place it to the token field of the request object.
- Step 21: Change the delete blog operation so that a blog can be deleted only by the user who added the blog. 
- Step 22: Now create a new middleware userExtractor, that finds out the user and sets it to the request object.
- Step 23: After adding token based authentication the tests for adding a new blog broke down. Fix the tests. Also write a new test to ensure adding a blog fails with the proper status code 401 Unauthorized if a token is not provided.



## Start the Application

To start an application, do the following :

```
# Install dependencies
$ npm install
# Start the application
$ npm start
```
Application can be accessed on [http://localhost:3003/](localhost)
