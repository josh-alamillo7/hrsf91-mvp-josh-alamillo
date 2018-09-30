# hrsf91-mvp-josh-alamillo
An app for competitive DDR players that converts data from skillattack.com into a user-friendly interface.

## how to run

The app is live at http://dancer-data-retriever.herokuapp.com/
Song data is scraped and updated about once a week.

To run locally:
1. Run ```npm install``` from the root directory in your terminal
2. Open two new terminal windows and start ```mongo``` and ```mongod```
3. From project directory:  ```npm run seed```, will take about 20 seconds and alert you when it's done.
4. From project directory:  ```npm start```
5. Type localhost:7000 into your browser.
6. Choose a name and get started!

![alt text](https://i.imgur.com/YU9Q453.png)

### to do:
Now that a near-mvp is deployed, more features are on the way!
-User authentication
-Rival adding
-Sort by player score
-PFC/Full Combo tracking
-More?
