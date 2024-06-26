const express = require("express");
const path = require("path");
const http = require("http");
const bodyParser = require("body-parser");
const movieModel = require("./movie-model.js");
const { API_KEYS, URLS } = require("./constants");

const app = express();

// Parse urlencoded bodies
app.use(bodyParser.json());

// Serve static content in directory 'files'
app.use(express.static(path.join(__dirname, "files")));

app.get("/movies", function (req, res) {
  let movies = Object.values(movieModel);
  const queriedGenre = req.query.genre;
  if (queriedGenre) {
    movies = movies.filter((movie) => movie.Genres.indexOf(queriedGenre) >= 0);
  }
  res.send(movies);
});

// Configure a 'get' endpoint for a specific movie
app.get("/movies/:imdbID", function (req, res) {
  const id = req.params.imdbID;
  const exists = id in movieModel;

  if (exists) {
    res.send(movieModel[id]);
  } else {
    res.sendStatus(404);
  }
});

app.put("/movies/:imdbID", function (req, res) {
  const id = req.params.imdbID;
  const exists = id in movieModel;

  movieModel[req.params.imdbID] = req.body;

  if (!exists) {
    res.status(201);
    res.send(req.body);
  } else {
    res.sendStatus(200);
  }
});

app.get("/genres", function (req, res) {
  const genres = [
    ...new Set(Object.values(movieModel).flatMap((movie) => movie.Genres)),
  ];
  genres.sort();
  res.send(genres);
});

const getMovieFromOMDB = imdbID => {
  const url = URLS.OMDB_API + "?apikey=" + API_KEYS.OMDB_API_KEY + "&i=" + imdbID;
  return new Promise((resolve, reject) => {
    http.get(url, (result) => {
        let data = "";

        result.on("data", (chunk) => {
          data += chunk;
        });

        result.on("end", () => {
          const movie = JSON.parse(data);
          resolve(movie);
        });
      })
      .on("error", (err) => {
        reject(err);
      });
  });
};

const cleanMovieData = (movie) => {
  return {
    imdbID: movie.imdbID,
    Title: movie.Title,
    Released: new Date(movie.Released).toISOString().substring(0,10),
    Runtime: movie.Runtime === "N/A" ? null : Number(movie.Runtime.split(" ")[0]),
    Genres: convertProperty(movie.Genre),
    Directors: convertProperty(movie.Director),
    Writers: convertProperty(movie.Writer),
    Actors: convertProperty(movie.Actors),
    Plot: movie.Plot,
    Poster: movie.Poster,
    Metascore: Number(movie.Metascore == "N/A" ? null : movie.Metascore),
    imdbRating: Number(movie.imdbRating),
  };
};

function convertProperty(value) {
  return value ? value.split(",") : [];
}

/* Task 1.1. Add the GET /search endpoint: Query omdbapi.com and return
   a list of the results you obtain. Only include the properties 
   mentioned in the README when sending back the results to the client */
app.get(`/search`, function (req, res) {

  if (!req.query.query) {
    res.sendStatus(400)
  } else {
    const url = `${URLS.OMDB_API}?apikey=${API_KEYS.OMDB_API_KEY}&s=${req.query.query}`;

    http.get(url, (result) => {
        let data = "";
        result.on("data", (chunk) => (data += chunk));
        result.on("end", () => {
          const filteredData = [];

          const results = JSON.parse(data);

          if (results.Search) {
            for (const result of results.Search) {
              filteredData.push({
                Title: result.Title,
                imdbID: result.imdbID,
                Year: Number(result.Year),
              });
            }
          }

          res.send(filteredData);
        });
      })
      .on("error", (err) => {
        res.sendStatus(500);
      });
  }
});

/* Task 2.2 Add a POST /movies endpoint that receives an array of imdbIDs that the
   user selected to be added to the movie collection. Search them on omdbapi.com,
   convert the data to the format we use since exercise 1 and add the data to the
   movie collection. */
app.post("/movies", async function (req, res) {
  for (const imdbID of req.body) {
    movie = await getMovieFromOMDB(imdbID);
    movieModel[imdbID] = cleanMovieData(movie);
  }

  res.send("Movie(s) added");
});

/* Task 3.2. Add the DELETE /movies/:imdbID endpoint which removes the movie
   with the given imdbID from the collection. */
app.delete("/movies/:imdbID", function(req, res) {
  const id = req.params.imdbID;
  const exists = id in movieModel; 
  delete movieModel[id]
  res.sendStatus(exists ? 200 : 204)
})


app.listen(3000);

console.log("Server now listening on http://localhost:3000/");
