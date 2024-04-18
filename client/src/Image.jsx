import PropTypes from 'prop-types';
export default function Image({src,...rest}) {
    src = src && src.includes('https://')
      ? src
      : 'http://localhost:3000/uploads/'+src;
    return (
      <img {...rest} src={src} alt={''} />
    );
  }
  Image.propTypes = {
    src: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  };