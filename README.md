# Todo Project With User Management

This demo application shows you how to implement [Backand](https://www.backand.com) user management and social 
sign-up, all in a basic ToDo application written in AngularJS. This demonstrates the security features that Backand's API has to offer, and allows you to see how actions by a user are restricted based upon their assigned role.

##Example

You can review the example @ [codepen](http://codepen.io/backand/pen/meNgME)

##Overview
The Todo project has the following user roles enabled:
* An *Admin* role, with which the user can perform all available CRUD actions on all items
* A *User* role, which allows the user to read all items, but to only Create, Update, or Delete items that have been created by the user.
* A *ReadOnly* role, which restricts the user to only reading items in the application.

Furthermore, there are two ways to access the application:
* Users with the *Admin* or *User* roles must sign in with their username and password
* Users that browse the app without signing in are assigned the *ReadOnly* role (In the code, those users are referred to as *anonymous users*).

## Getting Started
To get the application running, perform the following steps:

Install **node.js**. Then **gulp** and **bower** if you haven't yet.

```bash
    $ npm -g install gulp bower
```    

After that, let's clone the repository project:

```bash
    $ git clone https://github.com/backand/todos-with-users.git
    $ cd todos-with-users
```    
    
Install bower and npm dependencies, and run the application in development mode.

```bash
    $ npm install
    $ bower install
    $ grunt serve
```    

Navigate to [localhost:9000](http://localhost:9000) to see the basic app in action!

You can sign into the app using your Back& dashboard credentials along with the name you chose for your app (The app name should later be configured in app/config/consts.js.) You are now able to create, update, view, and delete tasks!

## Build

To build the project run the follow grunt command:

```bash
    $ grunt build
```

The build process creates a `dist` folder with minified JS and CSS files. For production or hosting this is the only 
folder you need.

## Host

You can host the project on Backand's cloud.

To leverage Backand's hosting you need to create a new app first and install Backand's cli tool.

After the app was created, go to Hosting menu and follow the easy steps of installation. Make sure the sync
 command use the `dist` folder (--folder parameter).
 
##Create the Demo Step By Step

Follow these steps to create the app from scratch using your account:

1. Create a new application in [Backand](https://www.backand.com/apps).
2. After creation, open the Model under Objects menu, click on 'Model JSON' tab and paste the following JSON. This JSON represents two objects that will be created in your database: the tasks list, named 'todo', and the users list. The two objects are related via the 'created_by' field in the 'todo' object and the collection 'todo' in the object 'users'.

  ```json
  [
    {
      "name": "todo",
      "fields": {
        "created_by": {
          "object": "users"
        },
        "description": {
          "type": "string"
        },
        "completed": {
          "type": "boolean"
        }
      }
    },
    {
      "name": "users",
      "fields": {
        "todo": {
          "collection": "todo",
          "via": "created_by"
        },
        "email": {
          "type": "string"
        },
        "firstName": {
          "type": "string"
        },
        "lastName": {
          "type": "string"
        }
      }
    }
  ] 
  ```
3. Press "Validate & Update" to commit the changes.
4. Open the code in folder `todos-with-users` and start configure the application

  
## Configuring the Application
Open your application in [Backand](https://www.backand.com/apps).

#### Configure Security Settings
 Go to the *Security & Auth --> Configuration* page

#### Configure Security Settings - User settings
1. **Change Anonymous Access to Read-Only**
  By default all users have full access to read and update data. Let's change it to read only: 
  1. In the drop-down that appeared beneath *Anonymous Access*, select *ReadOnly*.
  2. Copy the Anonymous Token and paste it in app/config/consts.js as the value of 'anonymousToken'.
  3. Refresh the browser window presenting your app and click on 'Sign Out'. You will be able to see the todo list by clicking on the 'view the todo list as a guest (read only)' link in the sign in page. You will not be able to add or modify tasks.

2. **Enable Sign Up from the client code**  
	1. From Social & Keys menu copy the API Sign-up Token and paste it in app/config/consts.js as the value of 
	signUpToken.
	
3. **Custom Reset Password Page** (optional)
	3. In Configuration menu set **Custom Reset Password Page** to `http://localhost:9000/#/resetPassword`. This is the
	 link that will be sent by email to users who forgot their password. (This page is also used for signed-in users to change their password.)

At this point, users are able to register to your app. They can register organically using their own email and a password, or via social media provider integration, such as Google, GitHub, or Facebook. New users simply need to select the "New User" checkbox before signing in. All registered users can add or modify tasks.

#### Forgot Password
Once you've updated the **Custom Reset Password** page, you can test the app's 'reset password' functionality. This is accessible from the login page, so you may need to sign out of the application first. On the ensuing reset password page, simply enter the email address of a valid existing user, and that email address will receive a message with a link to your configured "change password" page.

The file `app/views/auth/reset-password.js` shows that this process is based on two methods from the Backand SDK: `requestResetPassword` and `resetPassword`. The resetPassword method is used after the user clicks on the link received in the email message sent in the prior step. The content of this message can be edited in the Backand dashboard on the page *Security & Auth --> Configuration* page, in the `requestResetPassword` on-demand action. 

#### Change Password
Only users that are signed in may change their password. You can test this functionality by clicking on 'Change Password'.
The file `app/views/auth/change-password.js` reveals that this code simply uses the Backand SDK's `changePassword` method.

#### Social sign up & sign in
Backand's built-in social sign-in functionality is very easy to use - simply call the Backand SDK with the appropriate provider (Google, Github, or Facebook). You can see how this is done in the file `app/views/auth/login.js`, which shows that the code uses the Backand SDK's `socialSignUp` and `socialSignIn` methods.


#### Managing Signed-Up Users
Back& provides an internal *users* object for your app users. You can see the users table in **Secturity & Auth --> Registered Users**. However, it is highly recommended to keep the 'users' object of the app to hold custom information.  Backand provides three predefined actions that synchronize the internal *users* object with your custom one. You can customize these actions according to your needs. These actions are defined in the bottom of the **Configuration** page: **Create**, **Update** and **Delete My App User**. Some additional actions are predefined here, for instance, **requestResetPassword** sends email to users who forgot their password.
**NOTE:** If you give a different name for your 'users' object, or have different fields you wish to synchronize, you should modify these actions accordingly. 
**NOTE:** You can configure your own actions to perform on the *users* object in the **Configuration** page, or on any of the app database object, by selecting the object's name under **Objects** and clicking on the **Actions** tab. The actions can be triggered by database actions (hooks) or on demand, by calling the action's *Request Url* (presented when you test the action). Actions can send emails, execute transactional SQL scripts, and execute server-side JavaScript Code.

#### Saving Additional Parameters in the Sign up
In many cases we would like to collect more information from the user during sign up. The additional information 
should be added to the *users* object of the app. This option can be done by sending *parameters* in the client and 
update the server side action in order to save it in the object. In our example we will collect the company name of 
the user:

1. Update the Model and add company field to *users* object:
    1. Go to *Objects --> Model*
    2. Add this element to the *users* object: *"company": {"type": "string"}*
    3. Click on *Validate & Update*

2. In the code when calling to Backand.signup() send parameters object as the last input parameter. The code looks 
like this:
  ```javascript
    Backand.signup(firstName, lastName, username, password, password, {company: self.company}).then(...);
  ```
3. In the server side there is no need to do anything, new parameters are handled by the Action `Create My App 
User` under the *Security Actions* menu.

4. In the UI make sure you collect the `company` value
    
Upon sign up completed you can see the company name in the *users* object Data tab.
  
## Invite Users to the Application

Once you have completed the above, you are ready to begin inviting users to your application! To invite new users:

1. Navigate to *Security & Auth --> Registered Users* 
2. Enter an email in the *invite user(s)* input box. Please use a valid email address that is able to receive messages sent by Backand. 
3. Click on *Invite User(s)* button. A new user will be added to the users list, and assigned the *User*. This will also trigger an invitation email that is sent to the entered email address.
4. Open the email message.
5. Click on the invitation link. This will navigate to the sign in/sign up page you set in the configuration page, to complete the sign in process.
6. Check the new user checkbox and enter the sign up details. 

## Set Current User Validation
At this point, when new users sign in they will have full access to the application, and will be able to create, update and delete all the tasks. In order to restrict the users to update only tasks they created we will configure a few actions on the 'todo' object.

#### Modifying the Create Action for Todo Objects

1. Go to *Objects --> todo* 
2. Click on the *Actions* tab
3. Click on the *New Action* button
4. Name the action *Validate current user on create*
5. In the *Event Trigger...* drop-down, select *Create - Before adding data*
6. Leave the *Input Parameters* empty
7. In the *Type* drop-down, select *Server side JavaScript code*. A text area containing a JavaScript function will be displayed. 
8. Paste the following code into the body of the provided function:

  ```javascript
    // if the current user has an *Admin* role then she is allowed to create a todo for another user
    if (userProfile.role == "Admin")
      return {};

    // get the current user information from the app users table by filter with the email
    var currentUserId = null;
    try{
        var currentUser = $http({
            method: "GET",
            url:CONSTS.apiUrl + "/1/objects/users",
            params: {filter:[{"fieldName":"email", "operator":"equals", "value": userProfile.username }]},
            headers: {"Authorization": userProfile.token}
        });
        // get the current user id
        if (currentUser && currentUser.data && currentUser.data.length == 1){
            currentUserId = currentUser.data[0].id;
        }
    }
    catch (err){
        throw new Error('Failed to get the current user. ' + err.message);
    }

    //set the current user id to be the creator
    userInput.created_by = currentUserId;
    
    return {};
  ```  
9. Save the action.  

#### Modifying the Update Action for Todo Objects

A similar modification needs to be made for when a *todo* item is updated. 
The only difference here is that we also need to validate that users with *User* role cannot change the creator of the *todo* item.
To make the modifications for the Update action, perform the following steps: 

1. Click on the *New Action* button
2. Name the action *Validate current user on update*.    
3. In the *Select Trigger...* drop-down, select *Update - During data saved before it committed*
4. Leave the *Input Parameters* empty
5. In the *Type* drop-down, select *Server side JavaScript code*. A text area containing a JavaScript function will be displayed.
6. Enter the following code as the body of the provided JavaScript function:

  ```javascript
    // if the current user has an *Admin* role then he is allowed to update a todo for other users
    if (userProfile.role == "Admin")
      return {};

    if (!dbRow.created_by)
        throw new Error('Todo with no creator can\'t be updated.');

    // do not allow users to change the created by field 
    if (dbRow.created_by !=  userInput.created_by)
        throw new Error('You can\'t change the creator of the todo.');
        
    // get the current user information from the users object by filter with the email
    var currentUserId = null;
    try {
        var currentUser = $http({
            method: "GET",
            url:CONSTS.apiUrl + "/1/objects/users",
            params: {filter:[{"fieldName":"email", "operator":"equals", "value": userProfile.username }]},
            headers: {"Authorization": userProfile.token}
        });
        
        // get the current user id
        if (currentUser && currentUser.data && currentUser.data.length == 1){
            currentUserId = currentUser.data[0].id;
        }
    }
    catch (err){
        throw new Error('Failed to get the current user. ' + err.message);
    }
        
    // do not allow non *Admin* users to change the creator of the todo 
    if (dbRow.created_by != currentUserId)
        throw new Error('You can only update your own todo.');
    return {};
  ```
7. Save the action.

#### Modifying the Delete Action for Todo Objects

There is no user input for delete requests, so you only need to verify that the item you about to delete was created by the current user.
To make the modifications for the Update action, perform the following steps: 

1. Click on the *New Action* button
2. Name the action *Validate current user on delete*. 
3. In the *Select Trigger...* drop-down, select *Delete - During record deleted but before it committed*.
4. Leave the *Input Parameters* empty 
5. In the *Type* drop-down, select *Server side JavaScript code*.  A text area containing a JavaScript function will be displayed.
6. Enter the following code as the body of the provided JavaScript function:
  
  ```javascript
    // if the current user has an *Admin* role then he is allowed to delete a todo that was created by other users
    if (userProfile.role == "Admin")
	    return {};
    var createdByFromRow = dbRow.created_by;
    if (!createdByFromRow)
        throw new Error('The creator of the todo is unknown.');
    var currentUsername = userProfile.username;
    if (!currentUsername)
        throw new Error('The current user is unknown.');
    
    var currentUser = null;
    // get the current user information from the app users table by filter with the email
    try{
        currentUser = $http({method:"GET",url:CONSTS.apiUrl + '/1/objects/users?filter=[{ fieldName: "email", operator: "equals", value: "' + encodeURIComponent(currentUsername) + '" }]', headers: {"Authorization":userProfile.token, "AppName": userProfile.app}});
    }
    catch (err){
        throw new Error('Failed to get the current user. ' + err.message);
    }
    var currentUserId = null;
    if (currentUser && currentUser.data && currentUser.data.length == 1){
        currentUserId = currentUser.data[0].id;
    }
    else {
         throw new Error('Could not find the current user in the app.');
    }
    // do not allow non *Admin* users to delete a todo created by other users 
    if (createdByFromRow !=  currentUserId)
        throw new Error('You can only delete your own todo.');
    return {};
  ```
7. Save the action

## Finished!
At this point, your application is ready to use! You can test the security roles by signing in with a User role and see that you can only delete and update the todo items you create. If you then log out and log back in as a user with the *Admin* role, you will see that you can now perform all CRUD actions on every object in the database! You can also add a new user and see that they are assigned the *User* role by default, and not able to update records that are not their own.

## Testing

As a part of the installation process, NPM installed Karma for unit testing. Run `grunt test` to execute all of the unit tests in the system.

## Building your own application

Now that you've implemented a Todo application, you can build your own. Simply sign-up at [Backand's website](https://wwww.backand.com) and create a new app to get started!

