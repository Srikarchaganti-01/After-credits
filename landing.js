const leftcon = document.getElementById("leftcon");
const imgcon = document.getElementById("imgcon");
const mtit = document.getElementById("mtit");
const mdirec = document.getElementById("mdirec"); 
const year = document.getElementById("year");
const imdb = document.getElementById("imdb");
const slides = [
  {
    img: "Lassets/fordvferrari.jpg",
    tit: "Movie : Ford V/s Ferrari",
    direc: "Director : james Mangold",
    year: "Year : 2019",
    imdb:"IMDB : 8.1/10"
  },
  {
    img: "Lassets/truman.jpg",
    tit: "Movie : The Truman Show ",
    direc: "Director : Peter Weir",
    year: "Year : 1998",
    imdb:"IMDB : 8.2/10"
  },
  {
    img: "Lassets/got.jpg",
    tit: "Series : Game of Thrones ",
    direc: "Author : George R.R Martin",
    year: "Year : 2011-2019",
    imdb:"IMDB : 9.2/10"
  },
  {
    img: "Lassets/hangover.jpg",
    tit: "Movie : The Hangover",
    direc: "Director : Todd Phillips",
    year: "Year : 2009",
    imdb:"IMDB : 7.7/10"
  },
  {
    img: "Lassets/seven.jpg",
    tit: "Movie : Seven ",
    direc: "Director : David Fincher",
    year: "Year : 1995",
    imdb:"IMDB : 8.6/10"
  },
  {
    img: "Lassets/brba.jpg",
    tit: "Series : Breaking Bad ",
    direc: "Author : Vince Gilligan",
    year: "Year : 2008-2013",
    imdb:"IMDB : 9.5/10"
  },
  {
    img: "Lassets/interstellar.jpg",
    tit: "Movie : Interstellar",
    direc: "Director : Christopher Nolan",
    year: "Year : 2014",
    imdb:"IMDB : 8.7/10"
  }
];
let i=0;
function setslide(ind){
    const s = slides[ind];

    setTimeout(() => {
        leftcon.style.backgroundImage=`url(${s.img})`;
        imgcon.style.backgroundImage=`url(${s.img})`;
        mtit.textContent=s.tit;
        mdirec.textContent=s.direc;
        year.textContent=s.year;
        imdb.textContent=s.imdb;
    })
}
setslide(i);

setInterval(() =>{
    i = (i + 1)%slides.length;
    setslide(i);
},5000);