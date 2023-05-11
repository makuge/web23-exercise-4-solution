import {
  StyleChecker,
  ValueChecker,
  ConstantChecker,
  GridAreaChecker
} from "./checkers.mjs";
import { checkMovie, checkMovieArticle, toChildTagNames } from "./movieChecks.mjs";

import movies from "../../server/movie-model.js";

const GENRES = [
  "Action",
  "Adventure",
  "Animation",
  "Biography",
  "Comedy",
  "Crime",
  "Documentary",
  "Drama",
  "Family",
  "Fantasy",
  "Film Noir",
  "History",
  "Horror",
  "Music",
  "Musical",
  "Mystery",
  "Romance",
  "Sci-Fi",
  "Short",
  "Sport",
  "Superhero",
  "Thriller",
  "War",
  "Western",
];

describe("Testing Exercise 3", () => {

  /*it("0.1. movie-model.js exports the movies object containing at least 3 movies", () => {
    expect(movies, `Expected movies to be an array, but is of type '${typeof movies}'`).to.be.an("object");
    expect(Object.entries(movies).length).to.be.at.least(3);
    for (const [imdbID, movie] of Object.entries(movies)) {
      expect(imdbID, `Expected the movie id '${imdbID}' to be equal to the one inside the movie object, which is '${movie.imdbID}'`).to.be.eq(movie.imdbID);
      checkMovie(movie);
    }
  });

  it("0.2. GET endpoint /movies returns at least three correctly formatted movies", () => {
    cy.request("/movies").as("movies");
    cy.get("@movies").its("status").should("eq", 200);
    cy.get("@movies").should((response) => {
      expect(response.body, "Response expected to be an array").to.be.a("array");
      expect(response.body.length,"Response array expected to contain at least 3 movies").to.be.at.least(3);

      response.body.forEach((movie) => checkMovie(movie));
    });
  });*/

  /*it("1.1. Page has specified semantic structure", () => {
    cy.visit('/').then(() => {
      cy.get('body').should('exist').then(result => {
        const bodyElement = result[0]
        expect(bodyElement.children.length, "Expected 'body' to have exacly 4 child elements").to.eq(4)
        expect(toChildTagNames(bodyElement), "Expected 'body' to contain four semantic elements").to.deep.eq(["FOOTER", "HEADER", "MAIN", "NAV"])
        cy.get('body>header>h1').should('exist').should('not.be.empty')
        cy.get('body>nav>h2').should('exist').should('have.text', 'Genres')
        cy.get('body>nav>ul').should('exist')
        cy.get('body>main').should('exist')
        cy.get('body>footer>ul').should('exist')

        const checkAnchor = function(element) {
          expect(element.tagName, "Expected element to be an anchor element").to.be.eq("A")
          expect(element.textContent, "Expected anchor element to have a text").to.not.be.empty
          return element
        }

        cy.get('body>footer>ul>li').should('exist').then(listElements => {
          expect(listElements.length, `Expected five list elements in page footer`).to.eq(5)
          const elements = Array.from(listElements)
          expect(elements[0].textContent, `Expected first list element in footer to contain the copyright symbol`).contains('\u00A9')
          expect(elements[1].textContent, `Expected second list element to be non-empty`).to.not.be.empty
          expect(elements[2].children.length, "Expected third list element to have exactly 1 child").to.be.eq(1)
          const mailLink = checkAnchor(elements[2].children[0])
          expect(mailLink, "Expected link to be a 'mailto:' URL").to.have.property('href').and.to.match(/^mailto:)
          expect(elements[3].textContent, `Expected forth list element to be non-empty`).to.not.be.empty
          expect(elements[4].children.length, "Expected third list element to have exactly 1 child").to.be.eq(1)
          const uasLink = checkAnchor(elements[4].children[0])
          expect(uasLink, "Expected link url to be a link to fh-campuswien.ac.at").to.have.property('href').and.to.eq('https://www.fh-campuswien.ac.at/')
          expect(uasLink, "Expected link url to open in a new browsing context").to.have.property('target').and.to.eq("_blank")
        })
      })
    })
  })*/

  /*it("1.2. GET endpoint /genres", () => {

    cy.request("/genres").as("genres");
    cy.get("@genres").its("status").should("eq", 200);
    cy.get("@genres").then(response => {

      const genres = response.body
      expect(genres, "Response expected to be an array").to.be.a("array");
      expect(genres.length,"Response array expected to contain at least 1 genre").to.be.at.least(1);
      for (const genre of genres) {
        expect(genre, `Expected genre to be of type string, but '${genre}' is a ${typeof(genre)}`).to.be.a('string')
        expect(GENRES.indexOf(genre), `Expected genre '${genre}' to be in the supported list of 24 genres`).to.be.at.least(0)
      }

      const sortedGenres = [...genres].sort();

      expect(genres, 'Expected genres returned from the endpoint to be sorted alphabetically').to.deep.eq(sortedGenres)
  
      cy.request("/movies").as("movies");
      cy.get("@movies").its("status").should("eq", 200)
      cy.get("@movies").then(response => {
        expect(response.status).to.be.oneOf([200, 204]);
        const genresInCollection = new Set(response.body.flatMap(m => m.Genres))
        for (const genre of genresInCollection) {
          expect(GENRES.indexOf(genre), `Expected genre '${genre}' found in the movie data to be in the supported list of 24 genres`).to.be.at.least(0)
        }
      });
    });
  });*/

  /*it("1.3. Genres are added to the DOM correctly", () => {

    cy.request("/genres").as("genres");
    cy.get("@genres").its("status").should("eq", 200);
    cy.get("@genres").then(response => {
      const genres = response.body

      cy.visit('/').then(() => {

        cy.get("nav>ul>li>button").then(listElements => {
          expect(listElements.length, `Expected 13 genre buttons, but found only ${listElements.length}`).to.be.eq(genres.length + 1)
          const merged = ['All', ...genres].map((genre, index) => {
            return { genre, element: listElements[index].textContent }
          });

          for (const element of merged) {
            expect(element.element, `Expected list element to contain ${element.genre}`).contains(element.genre)
          }
        })

        cy.request("/movies").as("movies");
        cy.get("@movies").its("status").should("eq", 200);
        cy.get("@movies").then(response => {
          const movies = response.body

          cy.get("main>article").then(movieElements => {
            expect(movieElements.length, `Expected all movies to be present in article elements in 'main' element`).to.be.eq(movies.length)
            for (let i = 0; i< movieElements.length; i++) {
              checkMovieArticle(movieElements[i], movies[i])
            }
          })
        })

        
      });
    });
  });*/

  /*it("2.1. 'body', 'header', 'nav', 'main' and 'footer' are styled with grid template areas", () => {

    cy.visit("/").then(() => {
      const document = cy.state("document")
      expect(document.styleSheets.length, "Expect document to contain one style sheet").to.eq(1)

      const sheet = document.styleSheets[0]

      new StyleChecker("body", sheet)
        .eq("display", "grid")
        .compound('grid-template-rows', new ValueChecker(64, 128), new ConstantChecker("auto"), new ValueChecker(64, 128))
        .compound('grid-template-columns', new ValueChecker(192, 256), new ConstantChecker("auto"))
        .single('grid-template-areas', new GridAreaChecker(2, 3, [["h", "h"], ["n", "m"], ["f", "f"]]))

      new StyleChecker("header", sheet).eq("grid-area", "h / h / h / h")
      new StyleChecker("nav", sheet).eq("grid-area", "n / n / n / n")
      new StyleChecker("main", sheet).eq("grid-area", "m / m / m / m").eq("overflow-y", "auto")
      new StyleChecker("footer", sheet).eq("grid-area", "f / f / f / f")
    })

  })*/

  /*it("2.2. Genre buttons trigger loading and rendering of genre specific movies", () => {
    cy.request("/movies").as("movies");
    cy.get("@movies").its("status").should("eq", 200);
    cy.get("@movies").then(response => {
      const movies = response.body
      const genres = [...new Set(movies.flatMap(m => m.Genres))].sort()
      cy.visit("/").then(() => {
      
        for (let i = 0; i < genres.length; i++) {
          const genreMovies = movies.filter(m => m.Genres.indexOf(genres[i]) >= 0)

          cy.get(`nav>ul>li:nth-of-type(${i+2})>button`).click().then(() => {

              cy.get("main>article").then(movieElements => {
                expect(movieElements.length, `Expected all genre specific movies to be present in article elements in 'main' element`)
                  .to.be.eq(genreMovies.length)
              })
            })
          }
        })
      })
    })

    class Point {
      constructor(x, y) {
        this.x = x;
        this.y = y;
      }

      distance(p) {
        const deltaX = this.x - p.x
        const deltaY = this.y - p.y
        return Math.trunc(Math.sqrt(deltaX * deltaX + deltaY * deltaY))
      }

      near(p, eps) {
        return this.distance(p) < eps
      }
    }

    class Box {
      constructor(element) {
        this.box = element.getBoundingClientRect()
      }

      width() {
        return Math.trunc(this.box.width);
      }

      centerX() {
        return Math.trunc(this.box.x + this.box.width / 2);
      }

      centerY() {
        return Math.trunc(this.box.y + this.box.height / 2)
      }

      center() {
        return new Point(this.centerX(), this.centerY())
      }
    }*/

    /*it("3.1. Center the 'h1' element inside of the 'header' element", () => {

      cy.visit("/").then(() => {
        cy.get("header").then(headerElement => {
          const headerBox = new Box(headerElement[0]);
          const h1Box = new Box(headerElement.find('h1')[0])

          expect(h1Box.width() < headerBox.width(), `Expected 'h1' box width (${h1Box.width()}) to be smaller that that of the 'header' (${headerBox.width()})`).to.be.eq(true)
          const distance = h1Box.center().distance(headerBox.center())
          expect(distance < 24, `Expected distance between 'h1' and 'header' centers to be smaller than 24, but it was ${distance}`).to.be.eq(true)

          console.log(headerBox);
        })
      });
    })*/

    /*it("3.2. Navigation buttons are below each other, have some gap and the same width", () => {

      cy.visit("/").then(() => {
        cy.get("nav>ul>li").then(elements => {
 
          const listElement = elements[0].parentElement
          expect(listElement.tagName, `Expected parent element of first list item in 'nav' to be the unordered list, but tag name was ${listElement.tagName}`).to.be.eq('UL')

          const listBox = new Box(listElement)

          for (let i = 0; i < listElement.children.length; i++) {
            const buttonElement = listElement.children[i].children[0];
            expect(buttonElement.tagName, `Expected list item's children tag to be a button, but tag name was ${buttonElement.tagName}`).to.be.eq('BUTTON')
            const buttonBox = new Box(buttonElement)
            const distanceX = Math.abs(buttonBox.centerX() - listBox.centerX())
            expect(distanceX < 12, `Expected distance between x coordinates of center of 'button' and 'ul' to be smaller than 12, but was ${distanceX}`)

            if (i > 0) {
              const previousButtonElement = listElement.children[i-1].children[0]
              const previousButtonBox = new Box(previousButtonElement)
              const distanceY = buttonBox.centerY() - previousButtonBox.centerY()
              expect(distanceY > 0, `Expected y distance between the button and its previous sibling to be > 0, but it was ${distanceY}`).to.eq(true)
            }
          }

          const document = cy.state("document")
          expect(document.styleSheets.length, "Expect document to contain one style sheet").to.eq(1)
    
          const sheet = document.styleSheets[0]
    
          new StyleChecker("nav > ul", sheet)
            .eq("display", "flex")
            .eq("flex-direction", "column")
            .compound("row-gap", new ValueChecker(4, 8))
  
        })
      })
    })*/

    /*it("3.3. Movie 'article' elements are laid out using Flexbox", () => {
      cy.visit("/").then(() => {
        const document = cy.state("document")
        expect(document.styleSheets.length, "Expect document to contain one style sheet").to.eq(1)
  
        const sheet = document.styleSheets[0]
  
        new StyleChecker("main", sheet)
          .eq("display", "flex")
          .eq("flex-wrap", "wrap")
      })
    })*/

    /*it("3.4. The footer is a Flexbox container, its childs are centered vertically", () => {
      cy.visit("/").then(() => {
        const document = cy.state("document")
        expect(document.styleSheets.length, "Expect document to contain one style sheet").to.eq(1)
  
        const sheet = document.styleSheets[0]
  
        new StyleChecker("footer > ul", sheet)
          .eq("display", "flex")
          .compound("column-gap", new ValueChecker(16, 32))
          .eq("justify-content", "center")

        new StyleChecker("body", sheet).compound("margin", new ValueChecker(0, 0))
      })
    })*/

});
