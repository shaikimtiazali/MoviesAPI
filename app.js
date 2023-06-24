const express = require('express');
const sqlite3 = require('sqlite3');
const {open} = require('sqlite');
const cors = require('cors');
const path = require('path');
const PORT = 3600;

const app = express();
app.use(express.json());
app.use(cors());

const dbPath = path.join(__dirname, "moviesData.db");
let database = null;

const Movieconverter = (dbObject) => {
    return {
        movieId: dbObject.movie_id,
        directorId: dbObject.director_id,
        movieName: dbObject.movie_name,
        leadActor: dbObject.lead_actor
    }    
}

const Directorconverter = (dbObject) => {
    return {
        directorId: dbObject.director_id,
        directorName: dbObject.director_name
    }
}

const init = async () => {
    try {
         database = await open({
            filename: dbPath,
            driver: sqlite3.Database,
        });
        app.listen(PORT, () => {
            console.log(`Server is running at http://localhost:${PORT}/movies/`);
        })
    } catch (e) {
        console.log(e.message);
        process.exit(1);
    }
}
init();

// API 1
app.get('/movies/', async(req, res) => {
    const movieArray = await database.all(`SELECT movie_name FROM movie ORDER BY movie_id`);
    res.send(movieArray.map((eachMovie) => Movieconverter(eachMovie)));
});

// API 2
app.post('/movies/', async (req, res) => {
    await database.run(`INSERT INTO movie(director_id,movie_name,lead_actor) VALUES (${req.body.directorId},'${req.body.movieName}','${req.body.leadActor}');`);
    res.send("Movies Successfully Added");
});

// API 3
app.get("/movies/:movieId/", async (request, response) => {
    const { movieId } = request.params;
    console.log(movieId);
    const getMovieQuery = `
    SELECT 
      *
    FROM 
      movie 
    WHERE 
      movie_id = ${movieId};`;
    const movie = await database.get(getMovieQuery);
    response.send(movie);
});

// API 4
app.put('/movies/:movieId', async (req, res) => {
    await database.run(`UPDATE movie SET director_id = ${req.body.directorId},movie_name = '${req.body,movieName}',lead_actor = '${req.body.leadActor}', WHERE movie_id = ${req.params.movieId};`);
    res.send("Movie Details Updated");
});

// API 5
app.delete('/movies/:movieId',async (req, res) => {
    await database.run(`DELETE FROM movie WHERE movie_id=${movieId};`);
    res.send("Movie Removed");
});

// API 6
app.get('/directors/', async (req, res) => {
    const directorArray = await database.run(`SELECT * FROM director ORDER BY director_id=${req.params.directorId};`);
    res.send(directorArray.map((eachDirector) =>Directorconverter(eachDirector)));
});

// API 7
// app.get('/directors/:directorId/movies/', async (req, res) => {
//     await database.run(`SELECT movie_name FROM director WHERE `);
//     res.send("Working");
// });
