import Image from "./Image.jsx";
import PropTypes from "prop-types";

export default function PlaceImg({place,index=0,className=null}) {
  if (!place.photo?.length) {
    return '';
  }
  if (!className) {
    className = 'object-cover';
  }
  return (
    <Image className={className} src={place.photo[index]} alt=""/>
  );
}
PlaceImg.propTypes = {
    place: PropTypes.shape({
      photo: PropTypes.arrayOf(PropTypes.string)
    }).isRequired,
    index: PropTypes.number,
    className: PropTypes.string
  };