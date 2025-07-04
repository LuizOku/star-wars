export interface PersonDetails {
  uid: string;
  properties: {
    name: string;
    height: string;
    mass: string;
    hair_color: string;
    skin_color: string;
    eye_color: string;
    birth_year: string;
    gender: string;
    homeworld: string;
    films: string[];
  };
  description: string;
}

export interface PersonFilm {
  uid: string;
  name: string;
}

export interface PersonResponse {
  message: string;
  result: PersonDetails;
  films: PersonFilm[];
}