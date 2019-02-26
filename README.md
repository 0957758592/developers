# Developers Social

MERN Stack (MongoDB, ExpressJS, ReactJS, NodeJS);

[Demo App](https://sleepy-shelf-19954.herokuapp.com/)


## Installation

1) Download [ZIP](https://github.com/0957758592/developers/archive/master.zip) or Clone [Project](https://github.com/0957758592/developers.git)

2) Install all dependencies at the project's root and `/client` folders
use `yarn install` or `npm install`

3) [Create new](https://mlab.com/create/wizard#PlanType-Provider) your own DataBase at free MongoDB hosting [mlab](https://mlab.com/) following the instruction, and DataBase user;

4) Add to `/config` file `folder keys_dev.js`  with your MongoDB properties **e.g.**:

```
module.exports = {
    mongoURI:
      "mongodb://<dbuser>:<dbpassword>@ds<randomSubDomen>.mlab.com:<randomPort>/<dbname>",
    secretOrKey: "secret"
  };
```

You can find this properties `"mongodb://<dbuser>:<dbpassword>@ds<randomSubDomen>.mlab.com:<randomPort>/<dbname>",` at your Database -> Users (properties)



## Run

###### Run Server

1) goto project's root folder, 
2) open terminal there 
3) run command `node server`

you will see Next Success Messages:
```
Server runnin on port 5000
MongoBD Connected
```

###### Run Client

1) goto `/client` folder, 
2) open terminal there 
3) run command `yarn start` or `npm start`

the project will open at `localhost:3000`



## Deploy

1) goto [heroku DevCenter](https://devcenter.heroku.com/articles/heroku-cli) install heroku app choosing you mashine platform.

2) goto project's root folder, and run `heroku login` to login under heroku account

3) run `heroku create` to create app

4) goto [heroku dashboard](https://dashboard.heroku.com/apps) and choose created app

5) goto Settings -> Config Vars -> Reveal Config Vars and put next **keys and values**:


_first row_:

- **KEY** is `MONGO_URI`  from   `/config/keys_prod.js` 

- **VALUE** is `mongodb://<dbuser>:<dbpassword>@ds<randomSubDomen>.mlab.com:<randomPort>/<dbname>` 
	from `/config/keys_dev.js`
 

_second row_:

- **KEY** is `SECRET_OR_KEY`  from   `/config/keys_prod.js` 

- **VALUE** is `secret` from `/config/keys_dev.js`


6) goto Deploy at [heroku dashboard](https://dashboard.heroku.com/apps) 

- scroll down to copy Existing Git repository **e.g.**: `heroku git:remote -a morning-taiga-29320`

7) run copied command at project root folder, and then run `git push heroku master`

8) goto `/client` folder and run `yarn build` of `npm build` to build project

9) than return to projects root folder and run next command:

-  `git add .` to add changes and `git commit -m "deploy"` to commit changes

10) `git push heroku master` to push changes and `heroku open` open you live project



#### Have a Qestion?

- [mailMe](mailto:zzzdlbzzz@gmail.com)