# Wolt 2025 Frontend Engineering Internship Preliminary Assignment
Hi, I'm Arto! Below is my implementation of the Delivery Order Price Calculator assignment. I hope you find the code clear, well-structured, and easy to review. Thank you for taking the time to evaluate my work! :)

## Prerequisites 
Ensure Node.js is installed on your machine.

Verify your node and npm versions with these commands:
```
node -v
npm -v
```
Recommended versions:
```
node >= v18.18 (this project was tested with v22.1.0)
npm (comes bundled with Node.js)
```
You can download Node.js at https://nodejs.org/en/download. 


## Installing and running the project
Clone the repository and navigate to it's directory. When you are there, navigate to the "dopc" folder.
```
cd dopc
```
Then run the following command to install the required packages.
```
npm i
```
After installing the packages, you can either run the project in development mode or production mode.

### Development mode (preferred)
You can run the project in development mode with the following command:
```
npm run dev
```
This opens a development server at http://localhost:3000.

### Production mode (optimized)
If you'd like to build the project, then run the following command:
```
npm run build
```
After building, you can run the project in production mode:
```
npm start
```
This opens a production server at http://localhost:3000.

## Using the project
If your development or production server is running then you are able to visit http://localhost:3000 to see the project. Everything should be pretty straightforward.

### Project structure explanation
All of the code is contained in the folder "dopc". Inside of it the 2 most important folders are "app" and "styles".

#### App folder
The app folder contains the code for the application. 

Layout.tsx file defines the layout of all the pages, in this case the one page, and also provides the optimized fonts for the application.

page.tsx is the home page and so-called entry point, everything ends up in that file through components. The rest is pretty self-explanatory: calculator.tsx contains the other components and so on. 

There are also 3 folders: tests (self-explanatory), hooks and utils. 

##### Hooks
The hooks folder contains different reusable functions that serve a certain purpose and can be easily called anywhere. 

Note: While getUserLocation doesn't follow the typical hook naming convention, its functionality aligns better with this folder's purpose.

##### Utils
The utils folder also contains different reusable functions, but these are more focused on calculations, not certain "actions". 

#### Styles folder
The styles folder includes 3 CSS files. globals and calculator files are more interesting because they contain the most CSS. 

The global CSS file includes global rules, styles and variables. I tried to follow Wolt's style so most of the colors and inspiration are taken from Wolt's webpage. 

The calculator CSS file includes all of the CSS related to the calculator and it's components.

## Testing the project
This project uses Jest and React Testing Library to implement tests. To run the tests, you need to navigate to the "dopc" folder and run the following command:
```
npm run test
```
You will see the info related to the tests in the terminal.

The test files are located in ```wolt-internship-2025/dopc/app/__tests__```.

## Final words
Thank you for reviewing my submission! I welcome any feedback and would be happy to address further questions.
