# 🍃🔍 Hike & Seek

## Overview

Hike & Seek aims to encourage local exploration and responsible hiking, and foster an appreciation for users' local ecosystems by helping users find places for outdoor recreation and educating users about the wildlife they may find there.

### Problem Space

Many individuals, particularly those in urban areas, experience a disconnect from natural spaces and a lack of knowledge about local ecosystems. This gap in understanding diminishes outdoor experiences and makes it hard to find those outdoor experiences to begin with. Unless you already know a good spot to hike or camp, it can be a struggle to find a place to go - and many small local hiking trails and campgrounds don't have an online presence, which makes them nigh-impossible for a beginner to find. Additionally, without knowledge of the kinds of wildlife they may encounter, an aspiring outdoorman misses valuable educational opportunities, and may even inadvertently harm wildlife or their habitats.

### User Profile

- Outdoor enthusiasts:
  - ...looking for a new spot to hike, camp, or unwind in nature close to their location
  - ...looking for spots to hike or camp close to a given location for the future
  - ...that want to keep track of trails, campgrounds, and nature reserves they want to visit
  - with a focus on beginners to these activities, though individuals of all experience levels are welcome.

### Features

- As a user, I want to be able to find trails and campgrounds close to my current location.
- As a user, I want to be able to find trails and campgrounds close to any given location.
- As a user, I want to learn about wildlife I can encounter at a given trail or campground.
- As a user, I want to filter what iconic taxa (broad, well-known groups of wildlife) are displayed for each location.
- As a user, I want to be able to save or print a sightings checklist of wildlife from a location

- As a user, I want to be able to create an account to manage natural spaces I want to visit.
- As a user, I want to be able to login to my account to manage natural spaces I want to visit.

- As a logged in user, I want to be able to see wildlife available at my saved locations.
- As a logged in user, I want to be able to filter what iconic taxa are displayed for my saved locations.

## Implementation

### Tech Stack

- React
- Express
- Client libraries:
  - react
  - react-router
  - react-leaflet
  - axios
- Server libraries:
  - express
  - knex
  - axios
  - bcrypt for password hashing

### APIs

- [OSM's Overpass API](https://wiki.openstreetmap.org/wiki/Overpass_API)
  - For searching for locations that match our search criteria
- [iNaturalist API](https://api.inaturalist.org/v1/docs/)
  - For retrieving information about species and their distribution
- [Wikipedia API](https://en.wikipedia.org/api/rest_v1/)
  - For retrieving excerpts of information about a species

### Sitemap

- Home page
  - Introduce website purpose, Call to action (go to find trails page)
- Find new trails page
  - Form which lets user enter a location and details on the kind of place they're searching for; displays results on a map.
- View & save a trail
  - View more details about a trail/campground/other point of interest
- View an organism
  - View more details about a given species
- Save/print a sightings checklist
  - From a trail/point of interest, get a printable checklist of species you may see there.
- Manage bookmarked trails
  - Logged in users: view and manage a list of saved points of interest
- Contribute
  - Brief information about data sources (iNaturalist, OSM) and call to action to contribute to those projects
- Register
- Login

### Mockups

#### Style Guide
![](./mockups/style-guide.png)

#### Home page
![](./mockups/home.png)

#### Find new trails page
![](./mockups/find-trails.png)

#### View & save a trail
*TODO*
![](./mockups/view-trail.png)

#### View an organism
*TODO*
![](./mockups/view-organism.png)

#### Save/print a sightings checklist
*TODO*
![](./mockups/checklist.png)

#### Contribute
*TODO*
![](./mockups/view-organism.png)

#### Register
*TODO*
![](./mockups/register.png)

#### Login
*TODO*
![](./mockups/login.png)


### Data

![](./mockups/database.png)

**`users`**:
  - `id`: primary key, integer, auto-increment
  - `email`: varchar(60)
  - `password`: char(60)

**`pois`**:
  - `id`: primary key, integer, auto-increment
  - `name`: varchar(128)
  - `osm_id`: integer
  - `osm_type`: integer

**`saved_pois`**:
  - `id`: primary key, integer, auto-increment
  - `user_id`: foreign key on `users.id`
  - `poi_id`: foreign key on `pois.id`

### Endpoints

#### **GET /pois**

- Get *Points of Interest* - trails, campgrounds, nature reserves, etc - close to a certain location. Data pulled from OSM's Overpass API.

Parameters:
- longitude: User-provided location as a number
- latitude: User-provided location as a number
- radius: User-provided distance as a number
- types: User-provided comma-separated list of the types of points of interest to retrieve. Any of options "trails", "campgrounds", "reserves".

Response:
```
{
  "version": 0.6,
  "generator": "Overpass API 0.7.62.1 084b4234",
  "osm3s": {
    "timestamp_osm_base": "2024-10-15T23:24:28Z",
    "copyright": "The data included in this document is from www.openstreetmap.org. The data is made available under ODbL."
  },
  "elements": [
    {
      "type": "way",
      "id": 89197644,
      "tags": {
        "name": "South Balsam Trail",
        "highway": "footway",
        "sac_scale": "hiking",
        "source": "GPS trace",
        "surface": "gravel"
      },
      "bounds": {
        "minlat": 44.1017728,
        "minlon": -79.1348396,
        "maxlat": 44.1065268,
        "maxlon": -79.1282126
      },
      "nodes": [
        ...
      ],
      "geometry": [
        {
          "lat": 44.1065268,
          "lon": -79.1282126
        },
        ...
      ]
    },
    ...
  ]
}
```

#### **GET /pois/:osm_type/:osm_id**

- Get available data for a single Point of Interest. Data pulled from OSM's Overpass API.

Parameters:
- osm_id: PoI OSM identifier as a number
- osm_type: The type that this PoI is represented as in Overpass. One of "node", "way", or "relation".

Response:
```
{
  "version": 0.6,
  "generator": "Overpass API 0.7.62.1 084b4234",
  "osm3s": {
    "timestamp_osm_base": "2024-10-15T23:24:28Z",
    "copyright": "The data included in this document is from www.openstreetmap.org. The data is made available under ODbL."
  },
  "elements": [
    {
      "type": "way",
      "id": 89197644,
      "tags": {
        "name": "South Balsam Trail",
        "highway": "footway",
        "sac_scale": "hiking",
        "source": "GPS trace",
        "surface": "gravel"
      },
      "bounds": {
        "minlat": 44.1017728,
        "minlon": -79.1348396,
        "maxlat": 44.1065268,
        "maxlon": -79.1282126
      },
      "nodes": [
        ...
      ],
      "geometry": [
        {
          "lat": 44.1065268,
          "lon": -79.1282126
        },
        ...
      ]
    }
  ]
}
```

#### **GET /life**

- Get a list of species that have previously been sighted within a radius of a certain location, within the current month of the year. Data pulled from iNaturalist.

Parameters:
- longitude: Location as a number
- latitude: Location as a number
- taxa: User-provided comma-separated list of iconic taxa to include in the results

Response:
```
[
  {
    "id": 39682,
    "common_name": "Common Snapping Turtle",
    "photo": {
      "square_url": "https://inaturalist-open-data.s3.amazonaws.com/photos/72712185/square.jpeg",
      "attribution": "(c) Tommy Farquhar, some rights reserved (CC BY-NC), uploaded by Tommy Farquhar"
    }
  }
  ...
]
```

#### **GET /life/:id**

- Get more information about a specific species. Data pulled from iNaturalist.

Parameters:
- id: Species identifier as a number.

Response:
```
{
  "id": 39682,
  "common_name": "Common Snapping Turtle",
  "scientific_name": "Chelydra serpentina",
  "photo": {
    "square_url": "https://inaturalist-open-data.s3.amazonaws.com/photos/72712185/square.jpeg",
    "medium_url": "https://inaturalist-open-data.s3.amazonaws.com/photos/72712185/medium.jpeg",
    "attribution": "(c) Tommy Farquhar, some rights reserved (CC BY-NC), uploaded by Tommy Farquhar"
  },
  "wikipedia_url": "http://en.wikipedia.org/wiki/Common_snapping_turtle",
  "wikipedia_excerpt": "<p>The <b>common snapping turtle</b> is a species of large freshwater turtle in the family Chelydridae. Its natural range extends from southeastern Canada, southwest to the edge of the Rocky Mountains, as far east as Nova Scotia and Florida. The present-day [...]"
}
```

#### **GET /users/pois**

- Logged in users can view a list of their saved Points of Interest.

Parameters:
- token: JWT used to identify the user removing the location.

Response:
```
[
  {
    "id": 1,
    "osm_id": 89197644,
    "osm_type": "way",
    "name": "South Balsam Trail"
  },
  ...
]
```

#### **POST /users/pois**

- Logged in user can save a Point of Interest to their personal list.

Parameters:
- osm_id: PoI OSM identifier as a number
- osm_type: The type that this PoI is represented as in Overpass. One of "node", "way", or "relation".
- name: The name of this PoI
- token: JWT used to identify the user saving the location.

Response:
- Status code 201 Created, and the database record that was created.
```
{
  "id": 1,
  "osm_id": 89197644,
  "osm_type": "way",
  "name": "South Balsam Trail"
}
```

#### **DELETE /users/pois/:id**

- Logged in users can remove a Point of Interest from their personal list.

Parameters:
- id: PoI internal id as a number
- token: JWT used to identify the user removing the location.

Response:
- Status code 204 No Content

#### **POST /users/register**

- Add a user account.

Parameters:
- email: User's email
- password: User's provided password

Response:
```
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### **POST /users/login**

- Log a user in.

Parameters:
- email: User's email
- password: User's provided password

Response:
```
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9"
}
```

### Auth

- JWT auth
  - Before adding auth functionality, relevant API requests will be made using a fake user with id 1.
  - Auth functionality will be added after core features have been implemented.
  - If user asks the site to remember them on login, JWT will be saved in localStorage; if not, it will be saved to sessionStorage; in either case, it is removed upon logout.
  - Add states for logged in that show different UI in relevant areas.

## Roadmap

- Create client - Day 1
  - React project with routes & boilerplate pages
  - Set up Sass partials & accessibility enhancements

- Create server - Day 1
  - Express project with routing, with placeholder 501 responses
  - Set up general middleware (cors, compression, etc)
  - Set up sanitization and validation for user-inputted data

- Create database migrations - Day 1
- Create seeds for fake user data - Day 1
  - One user account, plus a few saved points of interest

- Deploy client and server projects so all commits will be reflected in production

- Feature: Find Trails - Day 2
  - Create GET /pois
  - Implement find trails page, including form & Leaflet map
  - Save most form contents in sessionStorage; iconic taxa choices in localStorage

- Feature: View Trail Page - Day 3
  - Create GET /pois/:osm_id
  - Create GET /life
  - Implement view trail page, including overview of seasonal animal sightings

- Feature: View Organism Page - Day 4
  - Create GET /life/:id
  - Implement view organism page

- Feature: Home Page - Day 5
  - Implement home page

- Feature: Contribute Page - Day 5
  - Implement contribute page

- Feature: Sighting Checklist Page - Day 6
  - Implement printable checklist page - shows name of PoI, month, and a list of animals randomly chosen from iconic taxa groups of user's choice

- Feature: Manage Bookmarked Trails Page - Day 7
  - Create GET /pois/saved
  - Implement manage bookmarks page, including a delete button for each bookmark and a link to view details.

- Feature: Login - Day 8
  - Create POST /users/login
  - Implement login page and form

- Feature: Create account - Day 8
  - Create POST /users/register
  - Implement registration page and form

- Feature: Implement JWT tokens - Day 9
  - Server: Update expected requests & responses on protected endpoints
  - Client: Local storage of JWT, include JWT with api calls

- Bug fixes

- DEMO DAY

---

## Future Implementations

- User authentication may be a future implementation, depending on time.
- Forgot password & password change functionality.
- Get directions from a specified location to a given point of interest, when possible.
- Unit and Integration tests.
