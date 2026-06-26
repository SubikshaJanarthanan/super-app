import cardStyles from "./MovieCard.module.css";

export function MovieCard({ movie, onClick }) {
  const { Poster, Title, Year } = movie;
  return (
    <button className={cardStyles.card} onClick={onClick} aria-label={`View details for ${Title}`}>
      <div className={cardStyles.imgWrap}>
        <img
          src={Poster !== "N/A" ? Poster : "https://via.placeholder.com/200x300?text=No+Image"}
          alt={Title}
          className={cardStyles.img}
          loading="lazy"
        />
        <div className={cardStyles.overlay}>
          <span>View Details</span>
        </div>
      </div>
      <p className={cardStyles.movieTitle}>{Title}</p>
      <p className={cardStyles.year}>{Year}</p>
    </button>
  );
}

export default MovieCard;
