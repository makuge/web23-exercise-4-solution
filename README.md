# Web Technologies - Exercise 4

The fourth and last assignment is about movie management. We are going to include functionality to search for movies using the `https://www.omdbapi.com/`, select some of the movies found and add them to our personal movie collection. We also will be adding a new button to each movie to remove it from our collection. Lastly, we are going to include a [media query](https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Media_queries) to make our layout responsive. 

As usual, you find detailed information about each part in the **Tasks** section below.

To set up your working environment for the project, you will have to perform the same steps you already use since exercise 1. First, you **clone** the project and configure it in an IDE, then you **install** the project's dependencies. To do so, run 

    npm install

in the project's root directory, where this `README.md` file is located. 

Use 

    npm start

or using `nodemon` (the **recommended** option)

    npm run start-nodemon

to start the server. In any case the server will be running on port 3000. You should see the message

    Server now listening on http://localhost:3000/

in your terminal. Navigate to [http://localhost:3000/](http://localhost:3000/) to test the application manually.

## Project structure

Our starting point for exercise 4 is a solution of exercise 3. 

On the server-side, we still have our `movie-model.js`, this time it does not contain any movies. In `server.js` you will find the server startup code defining the endpoint we have so far
* `GET /movies` to get either all or genre-specific movides, and `GET /movies/:imdbID` to get a specific movie
* `PUT /movies/:imdbID` to update a movie and
* `GET /genres` to get all genres of the collection sorted alphabetically.

On the client-side, we now have **three** HTML documents, each of which comes with its own `.css` and `.js` file:
* `index.html`. The overview page with genre filter and a new navigation area that leads us to `search.html`
* `edit.html`. Containing the edit functionality, nothing new there.
* `search.html`. This is where we are going to include the search for movies which we want to add to our personal collection..

Two of the CSS files, `index.css` and `search.css` are based on `grid-base.css`, because both of them use the same basic layout, our grid. The third one, `edit.css` is based on `base.css`, which contains basics styles that are also used in `grid-base.css`.

In `builders.js` all element builders reside, which are used in `index.js` and `search.js`. If you want to read more about the builder pattern, you can start with its [wikipedia page](https://en.wikipedia.org/wiki/Builder_pattern). 

## Tasks

Here's a first overview of the three tasks, details follow below:

1. Add the **search** capability. In a first step, we will add a new server-side endpoint, which in turn will use the `omdbapi.com` to search movies and return it to our client. On the client side, we add the movies found on `omdbapi.com` to the DOM dynamically and provide the user with the possibility to select those movies.

2. In a second step, we will add functionality to send the selected movies to yet another new endpoint, which will query `omdbapi.com` again to get the movie data for the selected movies. Then, we permanentely add the chosen movies to our model.

3. The third task is in part movie collection management and in part a styling task. First, we add a third new endpoint and a new button to our movies to be able to remove them from our movie collection. Then, we add a [breakpoint](https://www.w3schools.com/css/css_rwd_mediaqueries.asp) to configure the grid layout from exercise 3 for bigger screens. 

### Checking your implementation
As usual, to check whether your implementation is working as expected you **run** Cypress end-to-end tests. These tests are the exact same tests used to assess your implementation once you commit it to the GitHub repository, only this time there are ? of them.

To start the tests, run

    npm run cypress

As in exercise 2, there are subtasks for the three tasks. Here is the scheme we will use to award the points:

+ 1.1. Query sent to the `\search` endpoint: **0.25 points**
+ 1.2. `\search` return the correct data from `omdbapi.com`: **0.5 points**
+ 1.3. Search results are rendered correctly: **0.25 points**

+ 2.1. Send ids of the selected movies to endpoint `POST \movies` : **0.5 points**
+ 2.2. Added movies are available in the `GET \movies` endpoint: **0.5 points**

+ 3.1. Implement the removal of movies from our collection: **0.5 points**
+ 3.2. Grid layout is used for screens larger than 768px: **0.5 points**

As always, use the configured test specification file `cypress/e2e/assessment.cy.js` to run the tests.

### Task 1: Query `ombdbapi.com` and display the movies found to the user

**1.1 In `search.js`.** Almost all the search functionality is already there. You just need to correctly initialize the `searchForm` and complete the configuration of the XMLHttpRequest `xhr` to target the `/search` endpoint passing the **query** entered by the user to the endpoint using a *query parameter* named *query*

**1.2 In `server.js`.** Add and implement the `GET /search` endpoint.

The new endpoint internally queries `omdbapi.com`. You will have to register and obtain an API key. Using that key, you can then query the API as described on their (main page)[https://www.omdbapi.com/]. 

**Use the `s` parameter of the API to search for movie titles.**

The endpoint returns an array with the results obtained from `omdbapi.com`, but only includes the properties `Title`, `imdbID`, and `Year`. Make sure to convert the the `Year` property to a number before passing it on.

**1.3. In `search.js`.** Back in `search.js`, build a `form` that includes the following structure for every result (using *The Lord of the Rings: The Two Towers* as example movie):

```html
<article>
    <input type="checkbox" value="tt0167261" id="tt0167261">
    <label for="tt0167261">The Lord of the Rings: The Two Towers (2002)</label>
</article>
```

In addition to the result, add a button with the text `Add selected to collection` to the bottom of the form. We are going to configure its click event listener in 2.1.

### Task 2: Applying Grid Template Areas to lay out our overview page, make the genre buttons work

**2.1. In `search.js`**. Add a click event listener to the button you added in 1.3 and send the movie ids that were selected by the user to the `POST /movies`

1. We specify an element to be a Grid container and specify the areas the container will use. In project, the `body` element is the Grid container.

    Specify the `display` property and the rows, columns and areas to correspond to the following layout:

    ![Columns and rows](images/grid-columns-and-rows.svg "Columns and rows")

2. Now, assign the areas defined in the container in step 1 to the child elements of our container. These are `header`, `nav`, `main`, and `footer`.

    When you finished this task, the look of the page will have already changed:

    ![Laid out with grid](images/with-grid-layout.jpg "Laid out with grid")

3. We want the footer to be visible always, for this to work we have to control how the `main` element behaves once its contents get to big to fit on the viewport. Set the `main` element's `overflow-y` property to `auto` to see the difference. 

Most probably you now see two scrollbars at the right, one for the `main` element, one for the `body`. We will take care of that later.

**2.2. In `index.js` and `server.js`.**
Review the implementation of `loadMovies(...)` in `index.js` and pass on the genre given by the button click handler to the movie request. 
* On the client-side, you need set the parameter to the request. See [URLSearchParams:set()](https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams/set). **Important: Use 'genre' as the name of your parameter!**
* On the server-side, in the `GET /movies` endpoint, you use the query parameter sent by the client to filter the movies of the collection. Like the path parameters we used in exercise 2, the query parameters also are available on the request object of the endpoint hit, e.g., a query parameter named **genre** will be available through `req.query.genre`. 

    Make sure that the endpoint returnes *all* movies when no query parameters is present and the genre specific movies when is is present.

After this task, all the page content will be laid out vertically, like this:

<img src="images/without-layout.jpg" alt="Page without layouts" width="256">

### Task 3: Using Flexbox to lay out elements

**3.1. In index.css.** Center the `h1` in the header.
One of the use cases of the Flexbox is to center a single child element in its parent's box.

Make the `header` a Flexbox container (`display` is `flex`) and specify the `justify-content` as well as the `align-items` to center the `h1` horizontally and vertically.

**3.2. In index.css.** Now, make the `ul` element in `nav` a Flexbox container, use the `nav>ul` child combinator selector.

Flexbox's default direction is `row`, set it to `column` for this container, in addition use a row gap of 4 to 8 pixels.

**3.3. In index.css.** Next is the `main` container, which houses the movie `article` elements.

We want it to be a Flexbox container as well, in this container we want the children to be wrapped, use `flex-wrap` to do so.

Make the main element a flex container that wraps its children and
   that has row direction. Add some background image that covers the whole area.
   Put your background image in the files/images folder.

**3.4. In index.css.** Last, but not least. The footer's `ul` element.

As a selector, again use a child combinator, `footer>ul`. Make sure to center the footer's elements horizontally and add a `column-gap` of 16 to 32 pixels.

Now it's finally time to get rid of the unnecessary scrollbar of the body. Set the body's `margin` to **0**, that should do it.

![The final result](images/final.jpg "A screenshot of the final result")

**Done, congratulations!** Don't forget to push and check on GitHub!