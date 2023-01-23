//<---------Savita Khadse(SID-27565948)--------->

const express = require('express');
// const res = require('express/lib/response');
const app = express();
app.use(express.json());

const fs = require('fs');
// let rawdata = fs.readFileSync('Movie.json')

// let movie = JSON.parse(rawdata);
const movie1 = fs.readFileSync('Movie.json');
let movie = JSON.parse(movie1);

const uuid = () => Math.floor(Math.random()*100000+1);

const movies = movie.map(mv =>{
    return {
        id: uuid(),
        title: mv.title,
        year: mv.year,
        genres: mv.genres,
        rating: mv.rating
    }
});

const APIDetails = `Welcome to Movie API
The Movie API has 5 columns as below;
1. id
2. title,
3. year,
4. rating,
5. generes

How to use API details are as below;
To see all movie: /api/movies/

To search movie by title: /api/movies/search?movieTitle

To get movie by id: /api/movies/:id

To post data use /api/movies and provide body in {}

To update data use /api/movies/:id and provide changes in DATA in {}

To delete any record use /api/movies/:id

`
//Success-GET: /: welcome screen that shows the user how to use the APIs

app.get('/', (req, res) => {
    res.send(APIDetails);
});

//Query- http://localhost:3000/

// app.get('/api/movies/', (req, res) => {
//     res.send(movies);
// });

//Success- GET: /api/movies: return the full list of the movies (no sorting specified). this API can accept sorting queryStrings:
//sort=title|year|rating
//order=asc|desc exmple: /api/movies?sort=title&order=asc default order is asc

app.get('/api/movies', (req, res) => {
    
  let input = req.query
    console.log(input)
    sortByparameter = input['sort'] || 'title'
    sortByorder = input['order'] || 'asc'
    console.log(sortByparameter, sortByorder)

    function sortBy(movies, key) {
        return movies.sort((a,b) => {
            if (a[key] < b[key]) return -1;
            else if (a[key] > b[key]) return 1;
            else return 0;
        })
    }

    function reverseSortBy(movies, key){
        return movies.sort((a,b) =>{
            if (a[key] > b[key]) return -1;
            else if (a[key] < b[key]) return 1;
            else return 0;
        })
    }
        
          if(sortByorder == 'desc'){
            let outputDESC =reverseSortBy(movies, sortByparameter)
            res.send(outputDESC)
            console.log('DESC')
          }
          else if(sortByorder == 'asc'){
            let outputASC = sortBy(movies, sortByparameter)
            res.send(outputASC)
            console.log('ASC')
          }
        
});

//Query- http://localhost:3000/api/movies
//Query- http://localhost:3000/api/movies?sort=year
//Query- http://localhost:3000/api/movies?sort=rating
//Query- http://localhost:3000/api/movies?order=desc
//Query- http://localhost:3000/api/movies?sort=title&order=asc

//search by title
//Success-/api/movies/search?q=movieTitle: search for movies matches or partially matches the title
app.get('/api/movies/search', (req, res) =>{
    let mTitle = req.query['q']
    console.log("Movie Title:", mTitle['q'])

    const receivedTitle = movies.find(movies => movies.title == mTitle);
    if (!receivedTitle) res.status(404).send('The movie with the given title is not found');
    res.send(receivedTitle);
    console.log(receivedTitle);
});

//Query- http://localhost:3000/api/movies/search?q=Calcium Kid, The

//search by ID
//Success-/api/movies/:id: returns a movie by id
app.get('/api/movies/:id', (req, res) => {
    const movieID = movies.find(c => c.id === parseInt(req.params.id));
    if (!movieID) return res.status(404).send('The movie with the given ID was not found.');
    res.send(movieID);
  });

  //Differences. Number() converts the type whereas parseInt parses the value of input.
  // As you see, parseInt will parse up to the first non-digit character. 
  //On the other hand, Number will try to convert the entire string.

//Query- http://localhost:3000/api/movies/82285

// POST
//Success- /api/movies: insert a new movie submitted in the request body
app.post('/api/movies', (req, res) => {
    
    const movie = {
      id: uuid(),
      title: req.body.title,
      year: req.body.year,
      rating: req.body.rating,
      genres: req.body.genres
    };
    movies.push(movie);
    res.send(movie);
  });
  
  // Query- http://localhost:3000/api/movies
//   {
//     "title": "In Secret city",
//     "year": 1998,
//     "rating": 1.4,
//     "genres": "Crime|Drama"
// }

  //PUT
  //Success:PUT: /api/movies/:id: updates an existing movie id with the submitted data in the request body
  app.put('/api/movies/:id', (req, res) => {
    const id = movies.find(movies => movies.id === parseInt(req.params.id));
    if (!id) res.status(404).send('The ID was not found.');
      id.title= req.body.title;
      id.year = req.body.year;
      id.rating = req.body.rating;
      id.genres = req.body.genres
  
    res.send(id);
  });
  
  //Query- http://localhost:3000/api/movies/83459

//   {
//     "title": "In Secret city",
//     "year": 1998,
//     "rating": 1.4,
//     "genres": "Crime|Drama"
// }

  //DELETE
  //Success: /api/movies/:id: deletes the movie by id
  app.delete('/api/movies/:id', (req, res) => {
    const removeid = movies.find(movies => movies.id === parseInt(req.params.id));
    if (!removeid) res.status(404).send('The movie with the given ID was not found.');
  
    console.log(removeid)
    const index = movies.indexOf(removeid);
    movies.splice(index, 1);
  
    res.send(removeid);
  });

  //Query- http://localhost:3000/api/movies/12366

  //run PUT http://localhost:3000/api/movies/57

//body- {
//     "title": "Look at Me (Comme une image)",
//     "year": 1996,
//     "rating": 2.2
// }

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));


