import { Movie, Genre, WatchProviderResults } from '../types';

export const POPULAR_GENRES: Genre[] = [
  { id: 28, name: 'Action' },
  { id: 12, name: 'Adventure' },
  { id: 16, name: 'Animation' },
  { id: 35, name: 'Comedy' },
  { id: 80, name: 'Crime' },
  { id: 99, name: 'Documentary' },
  { id: 18, name: 'Drama' },
  { id: 10751, name: 'Family' },
  { id: 14, name: 'Fantasy' },
  { id: 27, name: 'Horror' },
  { id: 9648, name: 'Mystery' },
  { id: 10749, name: 'Romance' },
  { id: 878, name: 'Sci-Fi' },
  { id: 53, name: 'Thriller' }
];

export const POPULAR_PROVIDERS = [
  { provider_id: 8, provider_name: 'Netflix', logo_path: 'https://image.tmdb.org/t/p/w92/9A1JSVmSxsS3LIL4E89kiA8R3bd.jpg' },
  { provider_id: 119, provider_name: 'Amazon Prime Video', logo_path: 'https://image.tmdb.org/t/p/w92/p5162P333L2M3p8d4474M686d87.jpg' },
  { provider_id: 337, provider_name: 'Disney+', logo_path: 'https://image.tmdb.org/t/p/w92/97829283738.jpg' },
  { provider_id: 15, provider_name: 'Hulu', logo_path: 'https://image.tmdb.org/t/p/w92/giwM893f63k3.jpg' },
  { provider_id: 1899, provider_name: 'Max', logo_path: 'https://image.tmdb.org/t/p/w92/3k284.jpg' },
  { provider_id: 2, provider_name: 'Apple TV+', logo_path: 'https://image.tmdb.org/t/p/w92/pe2838382.jpg' },
  { provider_id: 386, provider_name: 'Peacock', logo_path: 'https://image.tmdb.org/t/p/w92/38293.jpg' },
  { provider_id: 531, provider_name: 'Paramount+', logo_path: 'https://image.tmdb.org/t/p/w92/p182.jpg' }
];

export const MOCK_MOVIES: Movie[] = [
  {
    id: 157336,
    title: 'Interstellar',
    overview: 'The adventures of a group of explorers who make use of a newly discovered wormhole to surpass the limitations on human space travel and conquer the vast distances involved in an interstellar voyage.',
    poster_path: 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
    backdrop_path: 'https://image.tmdb.org/t/p/w1280/xJHokMbljvjADYdit5fK1R3O2y3.jpg',
    release_date: '2014-11-05',
    vote_average: 8.4,
    vote_count: 34500,
    genre_ids: [12, 18, 878],
    genres: ['Adventure', 'Drama', 'Science Fiction'],
    runtime: 169,
    cast: ['Matthew McConaughey', 'Anne Hathaway', 'Jessica Chastain', 'Michael Caine']
  },
  {
    id: 27205,
    title: 'Inception',
    overview: 'Cobb, a skilled thief who commits corporate espionage by infiltrating the subconscious of his targets is offered a chance to have his criminal history erased as payment for the implantation of another person\'s idea into a target\'s subconscious.',
    poster_path: 'https://image.tmdb.org/t/p/w500/oYuLE1311oA8h3A181P3A18.jpg',
    backdrop_path: 'https://image.tmdb.org/t/p/w1280/8ZTV21C1vR2.jpg',
    release_date: '2010-07-15',
    vote_average: 8.4,
    vote_count: 36000,
    genre_ids: [28, 12, 878],
    genres: ['Action', 'Adventure', 'Sci-Fi'],
    runtime: 148,
    cast: ['Leonardo DiCaprio', 'Joseph Gordon-Levitt', 'Elliot Page', 'Tom Hardy']
  },
  {
    id: 299536,
    title: 'Avengers: Infinity War',
    overview: 'As the Avengers and their allies have continued to protect the world from threats too large for any one hero to handle, a new danger has emerged from the cosmic shadows: Thanos.',
    poster_path: 'https://image.tmdb.org/t/p/w500/7WsyChLLEz33B3.jpg',
    backdrop_path: 'https://image.tmdb.org/t/p/w1280/bOG2349.jpg',
    release_date: '2018-04-25',
    vote_average: 8.3,
    vote_count: 29000,
    genre_ids: [28, 12, 878],
    genres: ['Action', 'Adventure', 'Sci-Fi'],
    runtime: 149,
    cast: ['Robert Downey Jr.', 'Chris Hemsworth', 'Mark Ruffalo', 'Chris Evans']
  },
  {
    id: 550,
    title: 'Fight Club',
    overview: 'A ticking-time-bomb insomniac and a slippery soap salesman channel primal male aggression into a shocking new form of therapy. Their concept catches on, with underground "fight clubs" forming in every town.',
    poster_path: 'https://image.tmdb.org/t/p/w500/pB8BMmvJ2.jpg',
    backdrop_path: 'https://image.tmdb.org/t/p/w1280/hZk3238.jpg',
    release_date: '1999-10-15',
    vote_average: 8.4,
    vote_count: 28000,
    genre_ids: [18, 53],
    genres: ['Drama', 'Thriller'],
    runtime: 139,
    cast: ['Brad Pitt', 'Edward Norton', 'Helena Bonham Carter', 'Meat Loaf']
  },
  {
    id: 129,
    title: 'Spirited Away',
    overview: 'A young girl, Chihiro, becomes trapped in a strange new world of spirits. When her parents undergo a mysterious transformation, she must call upon the courage she never knew she had to free her family.',
    poster_path: 'https://image.tmdb.org/t/p/w500/393189283.jpg',
    backdrop_path: 'https://image.tmdb.org/t/p/w1280/Ab82384.jpg',
    release_date: '2001-07-20',
    vote_average: 8.5,
    vote_count: 16500,
    genre_ids: [16, 10751, 14],
    genres: ['Animation', 'Family', 'Fantasy'],
    runtime: 125,
    cast: ['Rumi Hiiragi', 'Miyu Irino', 'Mari Natsuki', 'Takeshi Naito']
  },
  {
    id: 693134,
    title: 'Dune: Part Two',
    overview: 'Follow the mythic journey of Paul Atreides as he unites with Chani and the Fremen while on a path of revenge against the conspirators who destroyed his family.',
    poster_path: 'https://image.tmdb.org/t/p/w500/1pdfL3328.jpg',
    backdrop_path: 'https://image.tmdb.org/t/p/w1280/xOM29384.jpg',
    release_date: '2024-02-27',
    vote_average: 8.2,
    vote_count: 5400,
    genre_ids: [878, 12, 18],
    genres: ['Sci-Fi', 'Adventure', 'Drama'],
    runtime: 166,
    cast: ['Timothée Chalamet', 'Zendaya', 'Rebecca Ferguson', 'Javier Bardem']
  },
  {
    id: 872585,
    title: 'Oppenheimer',
    overview: 'The story of J. Robert Oppenheimer\'s role in the development of the atomic bomb during World War II.',
    poster_path: 'https://image.tmdb.org/t/p/w500/8Gxv838.jpg',
    backdrop_path: 'https://image.tmdb.org/t/p/w1280/fm62849.jpg',
    release_date: '2023-07-19',
    vote_average: 8.1,
    vote_count: 8800,
    genre_ids: [18, 36],
    genres: ['Drama', 'History'],
    runtime: 180,
    cast: ['Cillian Murphy', 'Emily Blunt', 'Matt Damon', 'Robert Downey Jr.']
  },
  {
    id: 508883,
    title: 'The Boy and the Heron',
    overview: 'While the Second World War rages, the teenage Mahito, haunted by his mother\'s tragic death, is relocated from Tokyo to the serene rural countryside house of his family.',
    poster_path: 'https://image.tmdb.org/t/p/w500/f239842.jpg',
    backdrop_path: 'https://image.tmdb.org/t/p/w1280/f328492.jpg',
    release_date: '2023-07-14',
    vote_average: 7.7,
    vote_count: 2100,
    genre_ids: [16, 14, 12],
    genres: ['Animation', 'Fantasy', 'Adventure'],
    runtime: 124,
    cast: ['Soma Santoki', 'Masaki Suda', 'Aimyon', 'Yoshino Kimura']
  },
  {
    id: 569094,
    title: 'Spider-Man: Across the Spider-Verse',
    overview: 'Miles Morales catapults across the Multiverse, where he encounters a team of Spider-People charged with protecting its very existence.',
    poster_path: 'https://image.tmdb.org/t/p/w500/8Vt6m2.jpg',
    backdrop_path: 'https://image.tmdb.org/t/p/w1280/48384.jpg',
    release_date: '2023-05-31',
    vote_average: 8.4,
    vote_count: 6700,
    genre_ids: [16, 28, 12, 878],
    genres: ['Animation', 'Action', 'Adventure', 'Sci-Fi'],
    runtime: 140,
    cast: ['Shameik Moore', 'Hailee Steinfeld', 'Oscar Isaac', 'Jake Johnson']
  },
  {
    id: 493529,
    title: 'Paddington 2',
    overview: 'Paddington, now happily settled with the Brown family and a popular member of the local community, picks up a series of odd jobs to buy the perfect present for his Aunt Lucy\'s 100th birthday.',
    poster_path: 'https://image.tmdb.org/t/p/w500/3819483.jpg',
    backdrop_path: 'https://image.tmdb.org/t/p/w1280/f839284.jpg',
    release_date: '2017-11-10',
    vote_average: 7.5,
    vote_count: 2200,
    genre_ids: [35, 10751, 12],
    genres: ['Comedy', 'Family', 'Adventure'],
    runtime: 103,
    cast: ['Ben Whishaw', 'Hugh Grant', 'Sally Hawkins', 'Hugh Bonneville']
  },
  {
    id: 38700,
    title: 'Bad Boys for Life',
    overview: 'Marcus and Mike are on top of the world until Mike is targeted by a ruthless mercenary whose mother holds a deadly grudge against Mike.',
    poster_path: 'https://image.tmdb.org/t/p/w500/y9537482.jpg',
    backdrop_path: 'https://image.tmdb.org/t/p/w1280/up38482.jpg',
    release_date: '2020-01-15',
    vote_average: 7.2,
    vote_count: 7600,
    genre_ids: [28, 80, 35],
    genres: ['Action', 'Crime', 'Comedy'],
    runtime: 124,
    cast: ['Will Smith', 'Martin Lawrence', 'Paola Nuñez', 'Vanessa Hudgens']
  },
  {
    id: 414906,
    title: 'The Batman',
    overview: 'In his second year of fighting crime, Batman uncovers corruption in Gotham City that connects to his own family while facing a serial killer known as the Riddler.',
    poster_path: 'https://image.tmdb.org/t/p/w500/74428.jpg',
    backdrop_path: 'https://image.tmdb.org/t/p/w1280/828234.jpg',
    release_date: '2022-03-01',
    vote_average: 7.7,
    vote_count: 9800,
    genre_ids: [80, 9648, 53],
    genres: ['Crime', 'Mystery', 'Thriller'],
    runtime: 176,
    cast: ['Robert Pattinson', 'Zoë Kravitz', 'Paul Dano', 'Colin Farrell']
  }
];

export const MOCK_WATCH_PROVIDERS: Record<number, WatchProviderResults> = {
  157336: {
    flatrate: [
      { provider_id: 8, provider_name: 'Netflix', logo_path: 'https://image.tmdb.org/t/p/w92/9A1JSVmSxsS3LIL4E89kiA8R3bd.jpg' },
      { provider_id: 119, provider_name: 'Amazon Prime Video', logo_path: 'https://image.tmdb.org/t/p/w92/p5162P333L2M3p8d4474M686d87.jpg' }
    ],
    rent: [
      { provider_id: 2, provider_name: 'Apple TV', logo_path: 'https://image.tmdb.org/t/p/w92/pe2838382.jpg' },
      { provider_id: 3, provider_name: 'Google Play Movies', logo_path: 'https://image.tmdb.org/t/p/w92/83818.jpg' }
    ],
    buy: [
      { provider_id: 2, provider_name: 'Apple TV', logo_path: 'https://image.tmdb.org/t/p/w92/pe2838382.jpg' }
    ]
  },
  27205: {
    flatrate: [
      { provider_id: 1899, provider_name: 'Max', logo_path: 'https://image.tmdb.org/t/p/w92/3k284.jpg' },
      { provider_id: 119, provider_name: 'Amazon Prime Video', logo_path: 'https://image.tmdb.org/t/p/w92/p5162P333L2M3p8d4474M686d87.jpg' }
    ],
    rent: [
      { provider_id: 2, provider_name: 'Apple TV', logo_path: 'https://image.tmdb.org/t/p/w92/pe2838382.jpg' }
    ],
    buy: [
      { provider_id: 2, provider_name: 'Apple TV', logo_path: 'https://image.tmdb.org/t/p/w92/pe2838382.jpg' }
    ]
  },
  299536: {
    flatrate: [
      { provider_id: 337, provider_name: 'Disney+', logo_path: 'https://image.tmdb.org/t/p/w92/97829283738.jpg' }
    ],
    rent: [
      { provider_id: 2, provider_name: 'Apple TV', logo_path: 'https://image.tmdb.org/t/p/w92/pe2838382.jpg' }
    ]
  },
  693134: {
    flatrate: [
      { provider_id: 1899, provider_name: 'Max', logo_path: 'https://image.tmdb.org/t/p/w92/3k284.jpg' }
    ],
    rent: [
      { provider_id: 119, provider_name: 'Amazon Prime Video', logo_path: 'https://image.tmdb.org/t/p/w92/p5162P333L2M3p8d4474M686d87.jpg' },
      { provider_id: 2, provider_name: 'Apple TV', logo_path: 'https://image.tmdb.org/t/p/w92/pe2838382.jpg' }
    ]
  }
};
