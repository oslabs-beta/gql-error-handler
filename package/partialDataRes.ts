// partialDataRes.ts
// intercept the data response from the DB and then add the original error message (or some portion of it) to the data object to be finally sent to the client

//input: data response from the DB with refactored query, original error message
//output: combined object of data response from DB from refactored query with original message

function partialDataRes(dataResponse, errorMessage) {
  return { dataResponse, errorMessage };
}

const dataRes = {
  data: {
    characters: [
      {
        name: 'Luke Skywalker',
      },
      {
        name: 'C-3PO',
      },
      {
        name: 'R2-D2',
      },
      {
        name: 'Darth Vader',
      },
      {
        name: 'Leia Organa',
      },
      {
        name: 'Owen Lars',
      },
      {
        name: 'Beru Whitesun lars',
      },
      {
        name: 'R5-D4',
      },
      {
        name: 'Biggs Darklighter',
      },
      {
        name: 'Obi-Wan Kenobi',
      },
      {
        name: 'Anakin Skywalker',
      },
      {
        name: 'Wilhuff Tarkin',
      },
      {
        name: 'Chewbacca',
      },
      {
        name: 'Han Solo',
      },
      {
        name: 'Greedo',
      },
      {
        name: 'Jabba Desilijic Tiure',
      },
      {
        name: 'Wedge Antilles',
      },
      {
        name: 'Jek Tono Porkins',
      },
      {
        name: 'Yoda',
      },
      {
        name: 'Palpatine',
      },
      {
        name: 'Boba Fett',
      },
      {
        name: 'IG-88',
      },
      {
        name: 'Bossk',
      },
      {
        name: 'Lando Calrissian',
      },
      {
        name: 'Lobot',
      },
      {
        name: 'Ackbar',
      },
      {
        name: 'Mon Mothma',
      },
      {
        name: 'Arvel Crynyd',
      },
      {
        name: 'Wicket Systri Warrick',
      },
      {
        name: 'Nien Nunb',
      },
      {
        name: 'Qui-Gon Jinn',
      },
      {
        name: 'Nute Gunray',
      },
      {
        name: 'Finis Valorum',
      },
      {
        name: 'Jar Jar Binks',
      },
      {
        name: 'Roos Tarpals',
      },
      {
        name: 'Rugor Nass',
      },
      {
        name: 'Ric Olié',
      },
      {
        name: 'Watto',
      },
      {
        name: 'Sebulba',
      },
      {
        name: 'Quarsh Panaka',
      },
      {
        name: 'Shmi Skywalker',
      },
      {
        name: 'Darth Maul',
      },
      {
        name: 'Bib Fortuna',
      },
      {
        name: 'Ayla Secura',
      },
      {
        name: 'Dud Bolt',
      },
      {
        name: 'Gasgano',
      },
      {
        name: 'Ben Quadinaros',
      },
      {
        name: 'Mace Windu',
      },
      {
        name: 'Ki-Adi-Mundi',
      },
      {
        name: 'Kit Fisto',
      },
      {
        name: 'Eeth Koth',
      },
      {
        name: 'Adi Gallia',
      },
      {
        name: 'Saesee Tiin',
      },
      {
        name: 'Yarael Poof',
      },
      {
        name: 'Plo Koon',
      },
      {
        name: 'Mas Amedda',
      },
      {
        name: 'Gregar Typho',
      },
      {
        name: 'Cordé',
      },
      {
        name: 'Cliegg Lars',
      },
      {
        name: 'Poggle the Lesser',
      },
      {
        name: 'Luminara Unduli',
      },
      {
        name: 'Barriss Offee',
      },
      {
        name: 'Dormé',
      },
      {
        name: 'Dooku',
      },
      {
        name: 'Bail Prestor Organa',
      },
      {
        name: 'Jango Fett',
      },
      {
        name: 'Zam Wesell',
      },
      {
        name: 'Dexter Jettster',
      },
      {
        name: 'Lama Su',
      },
      {
        name: 'Taun We',
      },
      {
        name: 'Jocasta Nu',
      },
      {
        name: 'Ratts Tyerell',
      },
      {
        name: 'R4-P17',
      },
      {
        name: 'Wat Tambor',
      },
      {
        name: 'San Hill',
      },
      {
        name: 'Shaak Ti',
      },
      {
        name: 'Grievous',
      },
      {
        name: 'Tarfful',
      },
      {
        name: 'Raymus Antilles',
      },
      {
        name: 'Sly Moore',
      },
      {
        name: 'Tion Medon',
      },
      {
        name: 'Finn',
      },
      {
        name: 'Rey',
      },
      {
        name: 'Poe Dameron',
      },
      {
        name: 'BB8',
      },
      {
        name: 'Captain Phasma',
      },
      {
        name: 'Padmé Amidala',
      },
      {
        name: 'Woobae',
      },
      {
        name: 'Luke Skywalker',
      },
      {
        name: 'L',
      },
      {
        name: 'new',
      },
      {
        name: 'newname',
      },
      {
        name: 'new2',
      },
      {
        name: 'abc',
      },
    ],
  },
};
console.log(
  partialDataRes(dataRes, 'Cannot query field "woobae" on type "Character".')
);
