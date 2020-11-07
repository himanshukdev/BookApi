# BookApi

# Steps to run the api 
clone repository with the url.
https://github.com/himanshukdev/BookApi.git

check out to dev branch.

run npm install

Install Mongodb on your local machine

Insert a file as .env inside the root of this project directory.
paste this  MONGODB_URL=mongodb://127.0.0.1:27017/bookdatabase into the file.

make sure you have installed mongoDb locally and set its path [on Windows "C:\Program Files\MongoDB\Server\4.2\bin"] in environment variable of your local machine.Then in your C drive make a folder named data.
And inside this make another folder named as db.

you can check mongoDb installation by invoking the command mongo --version in the terminal.

you should run your mongodb Instance by invoking the command mongod.Please make sure you start your mongodb instance before you invoke npm start.

# urls with you can play at postman

Book Endpoints

http://localhost:8000/api/book

all post request payload should be json format 
Method
Get  ===> Book List Data
Get  ===> http://localhost:8000/api/book/Id  ===> book detail data  ===> It contains author data serialized along with the book data.
Post ===> create Book  [name,isbn,author] , author should be an id of an author. 
Put  ===> Update Book  [name,isbn,author]
post ===> http://localhost:8000/api/book/search [searchParam] 

Author Endpoints

http://localhost:8000/api/author

Method
Get  ===> http://localhost:8000/api/authorId  ===> author detail data
Get  ===> Author List Data
Post ===> create Author  [firstName,firstName] , 
Put  ===> Update Author  [firstName,firstName]